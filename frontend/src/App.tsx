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

async function handleSend(messageOverride?: string) {
  const textToSend = (messageOverride ?? input).trim();
  if (!textToSend) return;

  const sessionId = getSessionId();

  // Add user message
  setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
  setInput("");
  setLoading(true);

  let currentText = "";
  let agentMessageIndex = -1;

  // Add empty agent message placeholder
  setMessages((prev) => {
    agentMessageIndex = prev.length;
    return [...prev, { sender: "agent", text: "" }];
  });

  try {
    // Call your streaming sendMessageToAgent function from the other file
    await sendMessageToAgent(textToSend, sessionId, (chunk) => {
      if (chunk.type === "message") {
        currentText += chunk.content || "";
        setMessages((prev) => {
          const updated = [...prev];
          updated[agentMessageIndex] = { sender: "agent", text: currentText };
          return updated;
        });
      }

      if (chunk.type === "tool_call") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[agentMessageIndex] = { sender: "agent", text: "🔧 Reading Google Drive..." };
          return updated;
        });
      }
    });
  } catch (err) {
    console.error("Error streaming agent response:", err);
    setMessages((prev) => {
      const updated = [...prev];
      updated[agentMessageIndex] = { sender: "agent", text: "⚠️ Error retrieving response." };
      return updated;
    });
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