export type Message = {
  id?: string;
  role: "bot" | "user";
  text: string;
};

export type AskResponse = {
  answer?: string;
  error?: string;
};
