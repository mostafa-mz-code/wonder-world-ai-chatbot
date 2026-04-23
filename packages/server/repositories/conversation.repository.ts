const chatHistories = new Map<string, ChatMessage[]>();
type Role = "user" | "assistant";

export type ChatMessage = {
  role: Role;
  content: string;
};

export const conversationRepository = {
  getHistory,
  addMessage,
  clearHistory,
};

function getHistory(userId: string): ChatMessage[] {
  if (!chatHistories.has(userId)) {
    chatHistories.set(userId, []);
  }

  return chatHistories.get(userId)!;
}

function addMessage(userId: string, message: ChatMessage) {
  const history = getHistory(userId);
  history.push(message);

  return history;
}

function clearHistory(userId: string) {
  chatHistories.delete(userId);
}
