export interface Problem {
  id: string;
  title: string;
  description: string;
  resourceLink: string;
  practiceLink: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: string;
}

export type ProblemQueryParams = {
  _page: number;
  _limit: number;
  title_like?: string;
  difficulty?: string;
  createdAt_gte?: string;
  createdAt_lte?: string;
};

export interface ActivityLogEntry {
  id: string;
  user: string;
  problemName: string;
  action: "created" | "edited" | "deleted";
  date: string;
}
