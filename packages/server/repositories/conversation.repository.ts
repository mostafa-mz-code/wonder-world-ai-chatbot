// Store history in a Map keyed by a unique session ID
const chatHistories = new Map<string, { role: string; content: string }[]>();

export const conversationRepository = {
  getOrCreate,
  addMessage,
};

function getOrCreate(sessionId: string) {
  // 1. Get or create history for this user session
  if (!chatHistories.has(sessionId)) {
    chatHistories.set(sessionId, [
      { role: "system", content: "You are a helpful AI assistant." },
    ]);
  }
  const history = chatHistories.get(sessionId)!;
  return history;
}

function addMessage(
  history: { role: string; content: string }[],
  prompt: string
) {
  // 2. Add the NEW user message to the history
  history.push({ role: "user", content: prompt });
}
