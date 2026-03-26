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

export async function sendMessageToAgent(message: string, sessionId: string) {
  await ensureSession(sessionId);

  const response = await fetch("/api/adk/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appName: "agent",
      userId: "khen",
      sessionId,
     newMessage :{
        role: "user",
        parts: [{text: message}],
     },
    }),
  });

  const rawText = await response.text();
  console.log("Raw response from server:", rawText);

  if (!response.ok) {
    console.error("Server Error Response:", rawText);
    throw new Error(`Request failed: ${response.status} - ${rawText}`);  }

  return JSON.parse(rawText);
}