import os
import re
import time
import streamlit as st
import streamlit.components.v1 as components
from google import genai
from openai import OpenAI

# ----------------- STREAMLIT PAGE CONFIG -----------------
st.set_page_config(
    page_title="Re:Learn - Adaptive Multimodal Tutor",
    page_icon="🎓",
    layout="wide"
)

# ----------------- SIDEBAR CONFIGURATION -----------------
st.sidebar.title("⚙ API Configuration")
gemini_key = st.sidebar.text_input("Gemini API Key", type="password", value=os.getenv("GEMINI_API_KEY", ""))
alt_api_key = st.sidebar.text_input("Optional Alt Key (Groq / OpenAI)", type="password", value=os.getenv("OPENAI_API_KEY", ""))
alt_base_url = st.sidebar.text_input("Alt API Base URL (optional)", value="", placeholder="e.g. https://api.groq.com/openai/v1")

st.sidebar.markdown("---")
st.sidebar.markdown(
    """
    **Architecture:**
    - **Topic-Agnostic:** Code, circuits, math, physics, logic.
    - **Phase 1:** Root Misconception Diagnosis & Mechanistic Breakdown.
    - **Phase 2:** Dynamic Multimodal Interactive Mermaid.js Schematic.
    """
)

# ----------------- SESSION STATE -----------------
if "phase" not in st.session_state:
    st.session_state.phase = 0
if "diagnosis_data" not in st.session_state:
    st.session_state.diagnosis_data = {}
if "visual_data" not in st.session_state:
    st.session_state.visual_data = None


# ----------------- MERMAID SANITIZER & RENDERER -----------------
def sanitize_mermaid(code: str) -> str:
    """Cleans up illegal Mermaid characters (parentheses, quotes, slashes) inside node labels."""
    lines = code.split("\n")
    cleaned_lines = []
    for line in lines:
        def clean_bracket(match):
            content = match.group(1)
            sanitized = re.sub(r'[\(\)\"\'\/]', ' ', content)
            sanitized = re.sub(r'\s+', ' ', sanitized).strip()
            return f"[{sanitized}]"
        
        line = re.sub(r'\[(.*?)\]', clean_bracket, line)
        cleaned_lines.append(line)
    return "\n".join(cleaned_lines)


def render_mermaid(code: str, height: int = 400):
    """Renders Mermaid.js safely via CDN with an in-browser fallback boundary."""
    clean_code = sanitize_mermaid(code.replace("`", "").strip())
    js_safe_code = clean_code.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")

    html_code = f"""
    <div id="mermaid-container" style="background-color: #0f172a; padding: 18px; border-radius: 12px; display: flex; justify-content: center; align-items: center; border: 1px solid #334155; min-height: 260px;">
        <div id="graphDiv" style="width: 100%; text-align: center; color: #94a3b8; font-family: sans-serif;">Rendering architectural diagram...</div>
    </div>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        
        mermaid.initialize({{ 
            startOnLoad: false, 
            theme: 'dark',
            securityLevel: 'loose',
            flowchart: {{ htmlLabels: true, curve: 'basis' }},
            themeVariables: {{
                primaryColor: '#4f46e5',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#818cf8',
                lineColor: '#38bdf8',
                secondaryColor: '#1e1b4b',
                tertiaryColor: '#0f172a'
            }}
        }});

        const graphDefinition = '{js_safe_code}';
        const container = document.getElementById('graphDiv');

        async function drawDiagram() {{
            try {{
                const {{ svg }} = await mermaid.render('mermaid-svg-element', graphDefinition);
                container.innerHTML = svg;
            }} catch (error) {{
                console.warn("Mermaid fallback activated:", error);
                container.innerHTML = '<div style="text-align: left; background: #1e293b; padding: 14px; border-radius: 8px; border-left: 4px solid #f43f5e;"><p style="margin: 0 0 8px 0; color: #fda4af; font-size: 13px; font-weight: bold;">Structural Architectural Layout:</p><pre style="color: #cbd5e1; font-family: monospace; font-size: 13px; margin: 0; overflow-x: auto;">' + graphDefinition.replace(/\\\\n/g, '\\n') + '</pre></div>';
            }}
        }}

        drawDiagram();
    </script>
    """
    components.html(html_code, height=height, scrolling=True)


# ----------------- CLIENT INITIALIZER -----------------
def get_gemini_client(api_key: str):
    if not api_key:
        return None
    return genai.Client(api_key=api_key)


# ----------------- PHASE 1: DIAGNOSIS ENGINE -----------------
def run_consolidated_phase_1(question: str, student_answer: str, gem_key: str, alt_key: str = "", base_url: str = ""):
    """Diagnoses root misconceptions across any academic or technical discipline."""
    prompt = f"""
    You are an expert diagnostic tutor adhering to the Re:Learn pedagogical framework.
    Analyze the student's submission below across whatever domain it belongs to (programming, circuits, math, physics, logic).

    Question / Problem: {question}
    Student's Answer / Working: {student_answer}

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

    if alt_key.strip():
        try:
            kwargs = {"api_key": alt_key}
            if base_url.strip():
                kwargs["base_url"] = base_url.strip()
            client = OpenAI(**kwargs)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile" if base_url else "gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )
            text = completion.choices[0].message.content
            is_correct = "STATUS: CORRECT" in text.upper()
            return {"is_correct": is_correct, "full_text": text}
        except Exception as e:
            return {"is_correct": False, "full_text": f"Alternative Model Error: {e}"}

    client = get_gemini_client(gem_key)
    if not client:
        return {"is_correct": False, "full_text": "Error: Missing Gemini API Key. Provide it in the sidebar."}

    candidate_models = [
        "gemini-2.5-flash",
        "gemini-2.0-flash-lite",
        "gemini-2.0-pro",
        "gemini-3.8-flash"
    ]
    last_err = None

    for m in candidate_models:
        for _ in range(2):
            try:
                response = client.models.generate_content(
                    model=m,
                    contents=prompt,
                    config={"tools": []}
                )
                text = response.text
                is_correct = "STATUS: CORRECT" in text.upper()
                return {"is_correct": is_correct, "full_text": text}
            except Exception as e:
                last_err = e
                if "503" in str(e) or "UNAVAILABLE" in str(e):
                    time.sleep(1.0)
                continue

    return {"is_correct": False, "full_text": f"Service Error: {last_err}. Please retry in a moment."}


# ----------------- PHASE 2: MULTIMODAL VISUAL ENGINE -----------------
def run_phase_2_visualizer(question: str, student_answer: str, misconception: str, api_key: str, alt_key: str = "", base_url: str = ""):
    """Dynamically generates a Mermaid.js structural schematic contrasting mental model vs system reality."""
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

    Problem: {question}
    Student's Flawed Thinking: {student_answer}
    Diagnosed Misconception: {misconception}

    Output format:
    ```mermaid
    [Valid Mermaid code here]
    ```

    ### 🔍 Visual Breakdown
    - **Physical / Architectural Reality:** [What the runtime/hardware/math actually constructed]
    - **The Visual Memory Rule:** [One punchy visual memory rule to anchor the concept]
    """

    raw_output = ""

    if alt_key.strip():
        try:
            kwargs = {"api_key": alt_key}
            if base_url.strip():
                kwargs["base_url"] = base_url.strip()
            client = OpenAI(**kwargs)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile" if base_url else "gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            )
            raw_output = completion.choices[0].message.content
        except Exception:
            pass

    if not raw_output:
        client = get_gemini_client(api_key)
        if client:
            candidate_models = [
                "gemini-2.5-flash",
                "gemini-2.0-flash-lite",
                "gemini-2.0-pro",
                "gemini-3.8-flash"
            ]
            for model_name in candidate_models:
                for _ in range(2):
                    try:
                        res = client.models.generate_content(
                            model=model_name,
                            contents=prompt,
                            config={"tools": []}
                        )
                        if res.text:
                            raw_output = res.text
                            break
                    except Exception as e:
                        if "503" in str(e) or "UNAVAILABLE" in str(e):
                            time.sleep(1.0)
                        continue
                if raw_output:
                    break

    # Safe deterministic fallback without problematic multiline quotes
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

    return True, raw_output


# ----------------- MAIN UI -----------------
st.title("Re:Learn 🧠 Adaptive Multimodal Learning System")
st.caption("Universal Misconception Diagnosis & Multimodal Remediation")

col1, col2 = st.columns([1, 1], gap="medium")

with col1:
    st.subheader("📝 Query & Student Submission")
    question_input = st.text_area(
        "Question / Problem Statement:",
        placeholder="Type any question here (e.g., programming, circuits, algebra, data structures)...",
        height=110
    )
    student_answer_input = st.text_area(
        "Student's Answer / Reasoning:",
        placeholder="Type the student's answer or working to evaluate...",
        height=110
    )

    if st.button("Evaluate Student Answer", type="primary", use_container_width=True):
        if not question_input.strip() or not student_answer_input.strip():
            st.warning("Please enter both a question and a student answer.")
        elif not gemini_key and not alt_api_key:
            st.error("Please enter an API key in the sidebar.")
        else:
            with st.spinner("Analyzing submission and diagnosing root misconception..."):
                diag = run_consolidated_phase_1(question_input, student_answer_input, gemini_key, alt_api_key, alt_base_url)
                st.session_state.diagnosis_data = diag
                st.session_state.phase = 1
                st.session_state.visual_data = None

with col2:
    st.subheader("🎯 Adaptive Interventions")

    # PHASE 1
    if st.session_state.phase >= 1:
        diag = st.session_state.diagnosis_data
        if diag.get("is_correct"):
            st.success("✅ **Correct!** The student's reasoning aligns with foundational concepts.")
            st.markdown(diag.get("full_text"))
        else:
            st.error("❌ **Misconception Detected!**")
            st.markdown("### Phase 1: Comprehensive Diagnosis & Analogy")
            st.info(diag.get("full_text"))

            if st.session_state.phase == 1:
                st.markdown("---")
                st.write("**Did this explanation resolve the student's doubt?**")
                p1_col1, p1_col2 = st.columns(2)
                with p1_col1:
                    if st.button("👍 Yes, Understood", key="p1_yes", use_container_width=True):
                        st.success("Concept reinforced! Learning loop completed successfully.")
                with p1_col2:
                    if st.button("🎥 No, Show Visual Breakdown (Phase 2)", key="p1_no", use_container_width=True):
                        st.session_state.phase = 2
                        st.rerun()

    # PHASE 2
    if st.session_state.phase == 2:
        st.markdown("---")
        st.markdown("### Phase 2: Dynamic Multimodal Conceptual Visualizer")
        
        if not st.session_state.visual_data:
            with st.spinner("Synthesizing interactive Mermaid architecture diagram..."):
                _, v_narrative = run_phase_2_visualizer(
                    question=question_input,
                    student_answer=student_answer_input,
                    misconception=st.session_state.diagnosis_data.get("full_text", ""),
                    api_key=gemini_key,
                    alt_key=alt_api_key,
                    base_url=alt_base_url
                )
                st.session_state.visual_data = v_narrative

        if st.session_state.visual_data:
            content = st.session_state.visual_data
            
            match = re.search(r"```mermaid\s*(.*?)\s*```", content, re.DOTALL)
            if match:
                mermaid_code = match.group(1).strip()
                breakdown_text = re.sub(r"```mermaid.*?```", "", content, flags=re.DOTALL).strip()

                st.markdown("#### 🎨 Conceptual Architecture Diagram")
                render_mermaid(mermaid_code, height=380)
                st.markdown(breakdown_text)
            else:
                st.markdown(content)