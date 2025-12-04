export type ResumePayloadType = {
  query: string;
  isEdited: boolean;
  isRegenerated: boolean;
};

export type ResumeResponseType = {
  promptId: number;
  userId: number;
  promptResponse: string;
  promptSource: string;
  isVisualize: boolean;
  relevantQuestions: Array<string> | [];
  regeneratedId: number;
};


export interface MatchBreakdown {
  // skills_score: number;
  // experience_score: number;
  // education_score: number;
  // semantic_score: number;
  education : number;
  experience: number;
  soft_skills: number;
  technical_skills: number;
}

export interface MatchScoreResponse {
  // overall_match_percentage: number;
  overall_match: number;
  breakdown: MatchBreakdown;
  message: string;
}