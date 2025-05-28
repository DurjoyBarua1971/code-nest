export interface Problem {
  id: string;
  title: string;
  description: string;
  resourceLink: string;
  practiceLink: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: string;
}