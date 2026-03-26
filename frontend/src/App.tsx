/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { sendMessageToAgent } from "./api/chat";
import { getSessionId } from "./utils/session";
import { extractAgentText } from "./utils/extractText";

import { useGoogleAuth } from "./hooks/useGoogleAuth";
import LoginCard from "./components/LoginCard";
import ChatScreen from "./components/ChatScreen";
import type { Message } from "./types/types";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const { user, logout, handleGoogleSignInSuccess,  connectWorkspace, hasClientId } = useGoogleAuth();

  async function handleSend() {
    if (!input.trim()) return;

    const userText = input.trim();
    const sessionId = getSessionId();

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const events = await sendMessageToAgent(userText, sessionId);
      const agentText = extractAgentText(events);

      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: agentText || "No response returned.",
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: error.message || "Failed to reach the agent server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    setMessages([]);
    setInput("");
  }

    function handleWorkspace() {
    connectWorkspace();
  }


  if (!user) {
    return (
     <LoginCard
        hasClientId={hasClientId}
        onGoogleSuccess={handleGoogleSignInSuccess}
        onGoogleError={() => console.error("Login failed")}
      />
    );
  }

  return (
    <ChatScreen
      user={user}
      input={input}
      messages={messages}
      loading={loading}
      setInput={setInput}
      onSend={handleSend}
      onLogout={handleLogout}
      onWorkspaceConnect={handleWorkspace}
    />
  );
}