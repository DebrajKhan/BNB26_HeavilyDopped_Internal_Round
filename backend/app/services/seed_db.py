import uuid

async def seed_user_syllabus(user_id: str, tier: str, stream: str, year_standard: str, db_client):
    def gen_id():
        return str(uuid.uuid4())
        
    dummy_video = "https://www.youtube.com/embed/dQw4w9WgXcQ"
    subjects = []
    
    if tier == "College":
        stream_lower = stream.lower() if stream else ""
        if "com" in stream_lower or "commerce" in stream_lower:
            subjects = [
                {
                    "id": gen_id(),
                    "title": "Accounting & Finance",
                    "topics": [
                        {
                            "id": gen_id(),
                            "title": "Financial Accounting",
                            "subtopics": [
                                {"id": gen_id(), "title": "Journal Entries", "completed": False, "video_url": dummy_video},
                                {"id": gen_id(), "title": "Balance Sheet Analysis", "completed": False, "video_url": dummy_video}
                            ]
                        },
                        {
                            "id": gen_id(),
                            "title": "Corporate Laws",
                            "subtopics": [
                                {"id": gen_id(), "title": "Company Formation", "completed": False, "video_url": dummy_video},
                                {"id": gen_id(), "title": "Share Capital", "completed": False, "video_url": dummy_video}
                            ]
                        }
                    ]
                },
                {
                    "id": gen_id(),
                    "title": "Economics",
                    "topics": [
                        {
                            "id": gen_id(),
                            "title": "Microeconomics",
                            "subtopics": [
                                {"id": gen_id(), "title": "Demand & Supply", "completed": False, "video_url": dummy_video},
                                {"id": gen_id(), "title": "Market Structures", "completed": False, "video_url": dummy_video}
                            ]
                        }
                    ]
                }
            ]
        elif "ba" in stream_lower or "arts" in stream_lower:
            subjects = [
                {
                    "id": gen_id(),
                    "title": "Humanities & Social Sciences",
                    "topics": [
                        {
                            "id": gen_id(),
                            "title": "Political Science",
                            "subtopics": [
                                {"id": gen_id(), "title": "Constitution", "completed": False, "video_url": dummy_video},
                                {"id": gen_id(), "title": "International Relations", "completed": False, "video_url": dummy_video}
                            ]
                        },
                        {
                            "id": gen_id(),
                            "title": "Sociology",
                            "subtopics": [
                                {"id": gen_id(), "title": "Social Structures", "completed": False, "video_url": dummy_video},
                                {"id": gen_id(), "title": "Cultural Norms", "completed": False, "video_url": dummy_video}
                            ]
                        }
                    ]
                }
            ]
        else:
            # Default to Science / B.Tech CSE
            subjects = [
                {
                    "id": gen_id(),
                    "title": "Professional Core",
                    "topics": [
                        {
                            "id": gen_id(),
                            "title": "Data Structures & Algorithms",
                            "subtopics": [
                                {"id": gen_id(), "title": "Arrays & Linked Lists", "completed": False, "video_url": dummy_video},
                                {"id": gen_id(), "title": "Dynamic Programming", "completed": False, "video_url": dummy_video}
                            ]
                        },
                        {
                            "id": gen_id(),
                            "title": "Operating Systems",
                            "subtopics": [
                                {"id": gen_id(), "title": "Process Scheduling", "completed": False, "video_url": dummy_video},
                                {"id": gen_id(), "title": "Memory Management", "completed": False, "video_url": dummy_video}
                            ]
                        }
                    ]
                },
                {
                    "id": gen_id(),
                    "title": "Engineering Mathematics",
                    "topics": [
                        {
                            "id": gen_id(),
                            "title": "Discrete Math",
                            "subtopics": [
                                {"id": gen_id(), "title": "Graph Theory", "completed": False, "video_url": dummy_video},
                                {"id": gen_id(), "title": "Combinatorics", "completed": False, "video_url": dummy_video}
                            ]
                        }
                    ]
                }
            ]
    else:
        # School
        subjects = [
            {
                "id": gen_id(),
                "title": "Group I (Compulsory)",
                "topics": [
                    {
                        "id": gen_id(),
                        "title": "English Literature",
                        "subtopics": [
                            {"id": gen_id(), "title": "Poetry", "completed": False, "video_url": dummy_video},
                            {"id": gen_id(), "title": "Prose", "completed": False, "video_url": dummy_video}
                        ]
                    }
                ]
            },
            {
                "id": gen_id(),
                "title": "Group II (Electives)",
                "topics": [
                    {
                        "id": gen_id(),
                        "title": "Science",
                        "subtopics": [
                            {"id": gen_id(), "title": "Physics - Motion", "completed": False, "video_url": dummy_video},
                            {"id": gen_id(), "title": "Chemistry - Reactions", "completed": False, "video_url": dummy_video}
                        ]
                    },
                    {
                        "id": gen_id(),
                        "title": "Mathematics",
                        "subtopics": [
                            {"id": gen_id(), "title": "Algebra", "completed": False, "video_url": dummy_video},
                            {"id": gen_id(), "title": "Geometry", "completed": False, "video_url": dummy_video}
                        ]
                    }
                ]
            }
        ]

    await db_client.db.syllabuses.update_one(
        {"user_id": user_id},
        {"$set": {
            "tier": tier,
            "subjects": subjects
        }},
        upsert=True
    )

    assessments = []
    
    if tier == "College":
        stream_lower = stream.lower() if stream else ""
        if "com" in stream_lower or "commerce" in stream_lower:
            assessments.extend([
                {
                    "user_id": user_id,
                    "title": "Mock Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Calculate the EBITDA given a Net Income of ₹5,00,000, Taxes of ₹50,000, and Interest of ₹20,000.",
                        "Pass the journal entry for depreciation on machinery of ₹10,000."
                    ]
                },
                {
                    "user_id": user_id,
                    "title": "Mock Interview",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Explain the matching principle in accounting.",
                        "What are the key components of working capital?"
                    ]
                }
            ])
        elif "ba" in stream_lower or "arts" in stream_lower:
            assessments.extend([
                {
                    "user_id": user_id,
                    "title": "Mock Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Write a short essay analyzing the core tenets of realism in international relations.",
                        "Discuss the sociological perspective of the education system."
                    ]
                },
                {
                    "user_id": user_id,
                    "title": "Mock Interview",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "How does globalization impact local cultural norms?",
                        "Explain the separation of powers in a democratic constitution."
                    ]
                }
            ])
        else:
            # Default to Science / B.Tech CSE
            assessments.extend([
                {
                    "user_id": user_id,
                    "title": "Mock Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Write a C++ function to invert a binary tree.",
                        "Calculate the time complexity of QuickSort in the worst case: $O(n^2)$."
                    ]
                },
                {
                    "user_id": user_id,
                    "title": "Mock Interview",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Explain the difference between a mutex and a semaphore.",
                        "How does a Hash Map handle collisions?"
                    ]
                }
            ])
    else:
        # School
        stream_lower = stream.lower() if stream else ""
        standard_str = str(year_standard).lower()
        is_high_school = "11" in standard_str or "12" in standard_str
        
        if is_high_school and ("com" in stream_lower or "commerce" in stream_lower):
            assessments.extend([
                {
                    "user_id": user_id,
                    "title": "Accountancy Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "A and B are partners sharing profits in the ratio of 3:2. They admit C for a 1/4th share in profits. Calculate the new profit sharing ratio.",
                        "Pass the necessary journal entry: Machinery purchased for ₹50,000 and ₹5,000 spent on its installation.",
                        "What is a Revaluation Account, and when is it prepared?"
                    ]
                },
                {
                    "user_id": user_id,
                    "title": "Economics Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Calculate the Price Elasticity of Demand if a 20% fall in price leads to a 40% increase in quantity demanded.",
                        "Distinguish between Microeconomics and Macroeconomics.",
                        "Explain the concept of Marginal Utility with the help of a schedule and diagram."
                    ]
                },
                {
                    "user_id": user_id,
                    "title": "Business Studies Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Enumerate any four principles of management given by Henri Fayol.",
                        "What is meant by 'Capital Structure'? State any two financial factors affecting it.",
                        "Explain the difference between primary and secondary markets."
                    ]
                }
            ])
        elif is_high_school and ("ba" in stream_lower or "arts" in stream_lower):
            assessments.extend([
                {
                    "user_id": user_id,
                    "title": "History Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Describe the town planning system and drainage architecture of the Harappan civilization.",
                        "Analyze the primary political and economic causes that led to the Revolt of 1857.",
                        "Discuss the impact of the Non-Cooperation Movement on the Indian freedom struggle."
                    ]
                },
                {
                    "user_id": user_id,
                    "title": "Political Science Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "What are the Fundamental Rights guaranteed by Part III of the Indian Constitution?",
                        "Explain the discretionary powers of the President of India.",
                        "Discuss the immediate global consequences of the disintegration of the Soviet Union."
                    ]
                },
                {
                    "user_id": user_id,
                    "title": "Sociology Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Define the term 'Demographic Dividend' and discuss its significance for India's current economy.",
                        "What is meant by social stratification? Explain its features with reference to the Indian caste system.",
                        "Differentiate between rural and urban societies in terms of social interaction and division of labour."
                    ]
                }
            ])
        else:
            # Default School (9th/10th or generic Science)
            assessments.extend([
                {
                    "user_id": user_id,
                    "title": "Physics Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "A body travels a distance of $15\\text{ m}$ from $A$ to $B$ and then moves a distance of $20\\text{ m}$ at right angles to $AB$. What is the total distance traveled and the magnitude of displacement?",
                        "Define upthrust. State the factors on which the upthrust experienced by a body immersed in a liquid depends.",
                        "A force of $10\\text{ N}$ acts on a body of mass $2\\text{ kg}$ initially at rest. Find the acceleration produced and the velocity acquired by the body after $5\\text{ seconds}$."
                    ]
                },
                {
                    "user_id": user_id,
                    "title": "Math Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Factorize completely: $x^3 - 3x^2 - x + 3$",
                        "In a $\\triangle ABC$, if $\\angle A = 50^\\circ$ and the external angle formed by producing side $BC$ to $D$ is $110^\\circ$, find the measure of $\\angle B$.",
                        "Find the compound interest on ₹8,000 for $1\\frac{1}{2}$ years at $10\\%$ per annum, compounded half-yearly.",
                        "If $x + \\frac{1}{x} = 5$, find the value of $x^2 + \\frac{1}{x^2}$ and $x^3 + \\frac{1}{x^3}$."
                    ]
                },
                {
                    "user_id": user_id,
                    "title": "Chemistry Test",
                    "status": "Available",
                    "date": "Today",
                    "questions": [
                        "Write the chemical formula of: (a) Aluminium sulfate (b) Calcium bicarbonate",
                        "Calculate the relative molecular mass of $\\text{H}_2\\text{SO}_4$ (Given atomic masses: $\\text{H} = 1$, $\\text{S} = 32$, $\\text{O} = 16$).",
                        "State Gay-Lussac’s Law of Combining Volume."
                    ]
                }
            ])

    await db_client.db.assessments.insert_many(assessments)
