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
