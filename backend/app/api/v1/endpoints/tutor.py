import asyncio
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from app.core.config import settings

router = APIRouter()

class DiagnoseRequest(BaseModel):
    question: str
    student_answer: str

class VisualizeRequest(BaseModel):
    question: str
    student_answer: str
    misconception: str

def get_gemini_client():
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured")
    return genai.Client(api_key=settings.GEMINI_API_KEY)

@router.post("/diagnose")
async def diagnose(request: DiagnoseRequest):
    client = get_gemini_client()
    prompt = f"""
    You are an expert diagnostic tutor adhering to the Re:Learn pedagogical framework.
    Analyze the student's submission below across whatever domain it belongs to (programming, circuits, math, physics, logic).

    Question / Problem: {request.question}
    Student's Answer / Working: {request.student_answer}

    Provide your response using this exact structured format:
    STATUS: [CORRECT or INCORRECT]

    ### 1. Root Misconception Diagnosis
    [Pinpoint the exact flawed premise, intuitive trap, or rule misapplication]

    ### 2. Step-by-Step Mechanical Breakdown
    [Explain step-by-step why the system/math/logic operates the way it does]

    ### 3. Real-World Analogy
    [Explain using an intuitive, real-world physical analogy]

    ### 4. Core Takeaway
    [One actionable rule for the student to remember]
    """

    candidate_models = [
        "gemini-3.5-pro",       
        "gemini-3.8-flash",     
        "gemini-3.5-flash-lite"
    ]
    last_err = None

    for m in candidate_models:
        for attempt in range(2):
            try:
                response = await client.aio.models.generate_content(
                    model=m,
                    contents=prompt,
                )
                text = response.text
                is_correct = "STATUS: CORRECT" in text.upper()
                return {"is_correct": is_correct, "full_text": text}
            except Exception as e:
                last_err = e
                print(f"[DEBUG DIAGNOSE ERROR] Model: {m}, Attempt: {attempt + 1}, Error: {e}")
                if "503" in str(e) or "UNAVAILABLE" in str(e):
                    await asyncio.sleep(1.0)
                continue

    raise HTTPException(status_code=500, detail=f"Service Error: {last_err}")


@router.post("/visualize")
async def visualize(request: VisualizeRequest):
    client = get_gemini_client()
    prompt = f"""
    You are an expert technical illustrator and system architect.
    The student has a persistent conceptual misconception. Do NOT generate a procedural flowchart, algorithm steps, or decision trees.
    Create a clean MERMAID.JS structural diagram contrasting their flawed intuition against the actual system architecture.

    Rules for Mermaid syntax:
    - Start with 'flowchart TD' on line 1.
    - Contrast two distinct subgraphs:
        subgraph Student_Mental_Model [Student Intuition]
        subgraph Actual_Architecture [System Reality]
    - Node labels must use ONLY plain text inside square brackets [like this]. Never use parentheses, quotes, or slashes inside node brackets.
    - Close every subgraph with 'end'.
    - Output the Mermaid code strictly enclosed inside a ```mermaid code block.

    Problem: {request.question}
    Student's Flawed Thinking: {request.student_answer}
    Diagnosed Misconception: {request.misconception}

    Output format:
    ```mermaid
    [Valid Mermaid code here]
    ```

    ### 🔍 Visual Breakdown
    - **Physical / Architectural Reality:** [What the runtime/hardware/math actually constructed]
    - **The Visual Memory Rule:** [One punchy visual memory rule to anchor the concept]
    """

    raw_output = ""
    candidate_models = [
        "gemini-3.5-pro",       
        "gemini-3.8-flash",     
        "gemini-3.5-flash-lite"
    ]
    
    for m in candidate_models:
        for attempt in range(2):
            try:
                res = await client.aio.models.generate_content(
                    model=m,
                    contents=prompt,
                )
                if res.text:
                    raw_output = res.text
                    break
            except Exception as e:
                print(f"[DEBUG VISUALIZE ERROR] Model: {m}, Attempt: {attempt + 1}, Error: {e}")
                if "503" in str(e) or "UNAVAILABLE" in str(e):
                    await asyncio.sleep(1.0)
                continue
        if raw_output:
            break

    if not raw_output:
        raw_output = (
            "```mermaid\n"
            "flowchart TD\n"
            "    subgraph Student_Mental_Model [Student Intuition]\n"
            "        M1[Surface Expectation] --> M2[Assumes Local Duplication]\n"
            "    end\n"
            "    subgraph Actual_Architecture [System Reality]\n"
            "        A1[Caller Action] --> A2[Shared System State]\n"
            "        A2 --> A3[In-Place Mutation or Direct Transfer]\n"
            "    end\n"
            "    style Student_Mental_Model fill:#3b111e,stroke:#f43f5e,stroke-width:2px\n"
            "    style Actual_Architecture fill:#064e3b,stroke:#10b981,stroke-width:2px\n"
            "```\n\n"
            "### 🔍 Visual Breakdown\n"
            "- **Physical / Architectural Reality:** The system binds operations directly to persistent structures rather than creating isolated local duplicates.\n"
            "- **The Visual Memory Rule:** Follow low-level bindings and references, not surface syntactic assumptions."
        )

    return {"full_text": raw_output}