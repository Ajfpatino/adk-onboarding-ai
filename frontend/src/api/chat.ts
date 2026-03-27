export async function ensureSession(sessionId: string) {
  const response = await fetch(
    `/api/adk/apps/agent/users/khen/sessions/${sessionId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  const text = await response.text();

  // If it already exists, ADK may return an error like "Session already exists".
  // We can safely ignore that.
  if (!response.ok) {
    // If it's a 400 because it exists, that's fine, just return
    if (text.includes("Session already exists")) {
      console.log("Session active:", sessionId);
      return; 
    }
    // Otherwise, it's a real error
    throw new Error(text || `Failed to create session: ${response.status}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendMessageToAgent(message: string, sessionId: string, onChunk: (data: any) => void) {
    await ensureSession(sessionId)

    const params = new URLSearchParams({
    appName: "agent",
    userId: "khen",
    sessionId,
    newMessage: encodeURIComponent(JSON.stringify({ role: "user", parts: [{ text: message }] })),
  });

  const eventSource = new EventSource(`/api/adk/run_sse?${params.toString()}`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onChunk(data);
    } catch (err) {
      console.error("Failed to parse chunk:", event.data, err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE error:", err);
    eventSource.close();
  };

  return eventSource;
}