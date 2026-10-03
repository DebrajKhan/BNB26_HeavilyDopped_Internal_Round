// --- 1. PROFILE SCHEMAS ---
export type ProfileType = "college" | "school";

export interface BaseProfile {
  id: string;
  name: string;
  email: string;
  type: ProfileType;
}

export interface CollegeProfile extends BaseProfile {
  type: "college";
  institutionName: string;
  stream: string;
  year: number;
  cgpa: number;
}

export interface SchoolProfile extends BaseProfile {
  type: "school";
  schoolName: string;
  standard: string;
  stream: string;
  percentage: number;
}

export type UserProfile = CollegeProfile | SchoolProfile;

// --- 2. METRICS SCHEMAS ---
export interface Assessment {
  id: string;
  date: string;
  title: string; 
  statusOrScore: string; 
}

export interface DashboardMetrics {
  userId: string;
  activeSubject: string;
  retentionScore: number;
  syllabusCoverage: number;
  assessments: Assessment[];
}

// --- 3. SYLLABUS TREE SCHEMAS ---
export type NodeType = "subject" | "topic" | "subtopic";

export interface SyllabusNode {
  id: string;
  title: string;
  type: NodeType;
  videoId?: string;
  children?: SyllabusNode[];
}
