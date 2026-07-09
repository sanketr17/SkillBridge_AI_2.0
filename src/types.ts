export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  email: string;
  role_target: string;
  institution: string;
  graduation_year: string;
  bio: string;
  readiness_score: number;
}

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  level: SkillLevel;
  progress: number; // 0 - 100
  category: string;
}

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string;
  github_link: string;
  live_link: string;
  status: "Idea" | "In Progress" | "Completed" | "Archived";
  technologies: string[];
  images: string[];
}

export interface RecommendedProject {
  name: string;
  description: string;
  technologies: string[];
}

export interface RoadmapWeek {
  weekNumber: number;
  focus: string;
  topics: string[];
  practicalTask: string;
  resources: string[];
}

export interface Roadmap {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  tagline: string;
  estimatedDuration: string;
  weeks: RoadmapWeek[];
  recommendedProjects: RecommendedProject[];
  progress: number;
}

export interface TechnicalQuestion {
  id: string;
  question: string;
  bestAnswer: string;
  topics: string[];
}

export interface BehavioralQuestion {
  id: string;
  question: string;
  intent: string;
  bestApproach: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  starterCode: string;
  solutionCode: string;
}

export interface InterviewPrep {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  role: string;
  difficulty: string;
  technicalQuestions: TechnicalQuestion[];
  behavioralQuestions: BehavioralQuestion[];
  mcqs: MCQ[];
  codingChallenges: CodingChallenge[];
  score?: number;
  answers?: Record<string, string>;
  feedback?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  completed: boolean;
  created_at: string;
}

export interface ResumeAnalysis {
  id: string;
  created_at: string;
  user_id: string;
  extractedName: string;
  detectedCategory: string;
  summary: string;
  skills: string[];
  gaps: string[];
  atsScore: number;
  atsRecommendations: string[];
  careerSuggestions: string[];
}

export interface Notification {
  id: string;
  user_id: string;
  text: string;
  read: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url?: string;
}
