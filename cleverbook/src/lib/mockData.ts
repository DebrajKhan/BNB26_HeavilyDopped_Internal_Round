import { DashboardMetrics, SyllabusNode } from "@/types/models";

export const MOCK_METRICS: DashboardMetrics = {
  userId: "user-123",
  activeSubject: "Linear Algebra",
  retentionScore: 92,
  syllabusCoverage: 68,
  assessments: [
    { id: "a1", date: "2023-10-01", title: "Mock Interview", statusOrScore: "Cleared" },
    { id: "a2", date: "2023-09-24", title: "Mock Interview", statusOrScore: "Failed" },
  ]
};

export const MOCK_SYLLABUS: SyllabusNode[] = [
  {
    id: "math",
    title: "Mathematics",
    type: "subject",
    children: [
      {
        id: "math-la",
        title: "Linear Algebra",
        type: "topic",
        children: [
          {
            id: "math-la-1",
            title: "Matrix Transformations",
            type: "subtopic",
            videoId: "dQw4w9WgXcQ" // sample youtube ID
          },
          {
            id: "math-la-2",
            title: "Eigenvalues and Eigenvectors",
            type: "subtopic",
            videoId: "PFDu9oVAE-g"
          }
        ]
      },
      {
        id: "math-calc",
        title: "Calculus",
        type: "topic",
        children: [
          {
            id: "math-calc-1",
            title: "Derivatives",
            type: "subtopic",
            videoId: "rAof9Ld5sOg"
          }
        ]
      }
    ]
  },
  {
    id: "cs",
    title: "Computer Science",
    type: "subject",
    children: [
      {
        id: "cs-algo",
        title: "Algorithms",
        type: "topic",
        children: [
          {
            id: "cs-algo-1",
            title: "Dynamic Programming",
            type: "subtopic",
            videoId: "oBt53YbR9Kk"
          }
        ]
      }
    ]
  }
];
