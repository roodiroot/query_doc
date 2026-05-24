import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "../types/general";

const initialMessages: Message[] = [
  {
    role: "bot",
    text: "Здравствуйте! Я помощник. Задайте вопрос.",
  },
];

type ChatStore = {
  messages: Message[];
  setMessages: (updater: Message[] | ((messages: Message[]) => Message[])) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: initialMessages,

      setMessages: (updater) =>
        set((state) => ({
          messages: typeof updater === "function" ? updater(state.messages) : updater,
        })),

      clearMessages: () => set({ messages: initialMessages }),
    }),
    {
      name: "chat-messages",
    },
  ),
);
