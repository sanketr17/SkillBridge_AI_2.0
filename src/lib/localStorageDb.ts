// Local Storage Database Engine
// Simulates fully functional relational/document storage for SkillBridge AI
// Seeded with realistic industry-readiness data on first load.

const SEED_PROFILE = {
  id: "user-123",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: "user-123",
  name: "Sanket R",
  email: "sanketr980@gmail.com",
  role_target: "Full-Stack Software Engineer",
  institution: "State Tech University",
  graduation_year: "2026",
  bio: "Aspiring software engineer focusing on scalable web platforms and AI-driven automation.",
  readiness_score: 68
};

const SEED_SKILLS = [
  { id: "s-1", user_id: "user-123", name: "React & Hooks", level: "Advanced", progress: 85, category: "Frontend", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "s-2", user_id: "user-123", name: "TypeScript Type-Safety", level: "Intermediate", progress: 60, category: "Frontend", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "s-3", user_id: "user-123", name: "Node.js & Express", level: "Intermediate", progress: 55, category: "Backend", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "s-4", user_id: "user-123", name: "PostgreSQL Database Design", level: "Beginner", progress: 30, category: "Database", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "s-5", user_id: "user-123", name: "CI/CD & Docker", level: "Beginner", progress: 15, category: "DevOps", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

const SEED_PROJECTS = [
  {
    id: "p-1",
    user_id: "user-123",
    title: "EcoSmart Logistics Engine",
    description: "An automated inventory allocation system utilizing clustering vectors for optimal dispatch routing, reducing carbon emissions by 18%. Built to satisfy real-world logistics standards.",
    github_link: "https://github.com/example/ecosmart-logistics",
    live_link: "https://ecosmart-logistics.vercel.app",
    status: "Completed",
    technologies: ["React", "Express", "Node.js", "D3.js"],
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p-2",
    user_id: "user-123",
    title: "SecureAuth Multi-Tenant IAM",
    description: "Multi-tenant Identity and Access Management proxy demonstrating clean security architecture, token rotation protocols, and full auditing dashboards.",
    github_link: "https://github.com/example/secureauth",
    live_link: "",
    status: "In Progress",
    technologies: ["TypeScript", "PostgreSQL", "Docker", "TailwindCSS"],
    images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_GOALS = [
  { id: "g-1", user_id: "user-123", name: "Attain 80% Readiness Score", completed: false, created_at: new Date().toISOString() },
  { id: "g-2", user_id: "user-123", name: "Complete AI Roadmap (React Native Developer)", completed: true, created_at: new Date().toISOString() },
  { id: "g-3", user_id: "user-123", name: "Submit 2 Industry-Grade Projects", completed: false, created_at: new Date().toISOString() },
  { id: "g-4", user_id: "user-123", name: "Complete a Live Interview Simulation", completed: false, created_at: new Date().toISOString() }
];

const SEED_ROADMAPS = [
  {
    id: "r-1",
    user_id: "user-123",
    title: "React Native Mobile Developer",
    tagline: "Transitioning your web React skills into mobile app architecture.",
    estimatedDuration: "4 Weeks",
    weeks: [
      {
        weekNumber: 1,
        focus: "React Native Bridging & Core Elements",
        topics: ["View, Text, Image", "Flexbox constraints", "Safe Area Viewports"],
        practicalTask: "Build a single-view, responsive dashboard showing live stocks with native elements.",
        resources: ["React Native Docs", "Expo Setup Guide"]
      },
      {
        weekNumber: 2,
        focus: "Navigation Paradigms",
        topics: ["React Navigation", "Tab bars", "Stack nesting", "Drawer patterns"],
        practicalTask: "Implement nested tabs with custom animated headers using Framer Motion.",
        resources: ["React Navigation Tutorial", "Framer Mobile Reference"]
      }
    ],
    recommendedProjects: [
      { name: "FitTrack Pro", description: "A fitness tracker with local sqlite caching.", technologies: ["React Native", "Expo", "SQLite"] }
    ],
    progress: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_INTERVIEWS = [
  {
    id: "int-1",
    user_id: "user-123",
    role: "Full-Stack Software Engineer",
    difficulty: "Intermediate",
    created_at: new Date().toISOString(),
    score: 85,
    answers: {
      "q-0": "My experience stems from solid computer science algorithms paired with practical projects...",
      "m-0": "1"
    },
    feedback: "Exceptional system design awareness. Recommend strengthening container-level orchestrations."
  }
];

const SEED_RESUME_ANALYSIS = [
  {
    id: "res-1",
    user_id: "user-123",
    extractedName: "Your  Resume",
    detectedCategory: "Resume",
    summary: "Clear layout with high academic performance, but missing modern backend framework experience.",
    skills: ["Java", "SQL", "C++", "HTML/CSS", "Git"],
    gaps: ["Docker", "Kubernetes", "CI/CD Actions", "Type-safe Frontends"],
    atsScore: 71,
    atsRecommendations: [
      "Quantify bullet points: Change 'Worked on an e-commerce project' to 'Engineered transactional database routing with 100% test coverage'.",
      "List concrete dev utilities instead of abstract methodologies."
    ],
    careerSuggestions: [
      "Junior Software Developer",
      "Solutions Engineer Trainee"
    ],
    created_at: new Date().toISOString()
  }
];

const SEED_NOTIFICATIONS = [
  { id: "n-1", user_id: "user-123", text: "Welcome to SkillBridge! Let's bridge your academic background to industry-level expertise.", read: false, created_at: new Date().toISOString() },
  { id: "n-2", user_id: "user-123", text: "Weekly analytics compiled: Your Readiness Score increased by 4%!", read: false, created_at: new Date().toISOString() }
];

export class LocalDb {
  private static initKey = "sb_initialized";

  static init() {
    if (localStorage.getItem(this.initKey)) return;

    localStorage.setItem("sb_profile", JSON.stringify(SEED_PROFILE));
    localStorage.setItem("sb_skills", JSON.stringify(SEED_SKILLS));
    localStorage.setItem("sb_projects", JSON.stringify(SEED_PROJECTS));
    localStorage.setItem("sb_goals", JSON.stringify(SEED_GOALS));
    localStorage.setItem("sb_roadmaps", JSON.stringify(SEED_ROADMAPS));
    localStorage.setItem("sb_interviews", JSON.stringify(SEED_INTERVIEWS));
    localStorage.setItem("sb_resume_analysis", JSON.stringify(SEED_RESUME_ANALYSIS));
    localStorage.setItem("sb_notifications", JSON.stringify(SEED_NOTIFICATIONS));
    
    // Seed learning progress, certificates, analytics
    localStorage.setItem("sb_learning_progress", JSON.stringify([]));
    localStorage.setItem("sb_certificates", JSON.stringify([]));
    localStorage.setItem("sb_analytics", JSON.stringify([
      { date: "June 1", value: 45 },
      { date: "June 8", value: 50 },
      { date: "June 15", value: 55 },
      { date: "June 22", value: 62 },
      { date: "June 29", value: 65 },
      { date: "July 5", value: 68 }
    ]));

    localStorage.setItem(this.initKey, "true");
  }

  static getTable<T>(table: string): T[] {
    this.init();
    const data = localStorage.getItem(`sb_${table}`);
    return data ? JSON.parse(data) : [];
  }

  static saveTable<T>(table: string, data: T[]) {
    localStorage.setItem(`sb_${table}`, JSON.stringify(data));
  }

  static getOne<T>(table: string, id: string): T | null {
    const list = this.getTable<any>(table);
    return list.find(item => item.id === id) || null;
  }

  static getProfile(): typeof SEED_PROFILE {
    this.init();
    const data = localStorage.getItem("sb_profile");
    return data ? JSON.parse(data) : SEED_PROFILE;
  }

  static saveProfile(profile: any) {
    localStorage.setItem("sb_profile", JSON.stringify({ ...this.getProfile(), ...profile, updated_at: new Date().toISOString() }));
  }

  static insert<T>(table: string, item: any): T {
    const list = this.getTable<any>(table);
    const newItem = {
      ...item,
      id: item.id || `local-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "user-123"
    };
    list.unshift(newItem);
    this.saveTable(table, list);
    return newItem as T;
  }

  static update<T>(table: string, id: string, updates: any): T | null {
    const list = this.getTable<any>(table);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    list[index] = {
      ...list[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveTable(table, list);
    return list[index] as T;
  }

  static delete(table: string, id: string): boolean {
    const list = this.getTable<any>(table);
    const filtered = list.filter(item => item.id !== id);
    if (filtered.length === list.length) return false;
    this.saveTable(table, filtered);
    return true;
  }
}
