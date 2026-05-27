export type MessageFeedback = "like" | "dislike";

export type Message = {
  id?: string;
  messageId?: number | null;
  role: "bot" | "user";
  text: string;
  createdAt?: string | null;
  feedback?: MessageFeedback | null;
};

export type AskResponse = {
  answer?: string;
  error?: string;
  message_id?: number | null;
  created_at?: string | null;
};
