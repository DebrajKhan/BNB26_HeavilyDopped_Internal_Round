def calculate_active_focus(subjects: list) -> dict:
    total_coverage_subtopics = 0
    completed_coverage_subtopics = 0
    
    for subject in subjects:
        for topic in subject.get("topics", []):
            subtopics = topic.get("subtopics", [])
            if not subtopics:
                continue
                
            total_topic = len(subtopics)
            completed_topic = 0
            
            for st in subtopics:
                total_coverage_subtopics += 1
                if st.get("completed", False):
                    completed_topic += 1
                    completed_coverage_subtopics += 1
                    
            if completed_topic < total_topic:
                coverage = round((completed_coverage_subtopics / total_coverage_subtopics) * 100, 2) if total_coverage_subtopics > 0 else 0.0
                return {
                    "topic": topic.get("title", "Unknown"),
                    "retention": round((completed_topic / total_topic) * 100, 2),
                    "coverage": coverage
                }
                
    coverage = round((completed_coverage_subtopics / total_coverage_subtopics) * 100, 2) if total_coverage_subtopics > 0 else 0.0
    return {"topic": "All Caught Up", "retention": 100.0, "coverage": coverage}