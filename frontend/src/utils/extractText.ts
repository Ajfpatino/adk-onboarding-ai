/* eslint-disable @typescript-eslint/no-explicit-any */
export function extractAgentText(events: any[]): string {
  const texts: string[] = [];

  for (const event of events) {
    const parts = event?.content?.parts ?? [];

    for (const part of parts) {
      if (typeof part?.text === "string") {
        texts.push(part.text);
      }
    }
  }

  return texts.join("\n").trim();
}

export function extractQuestionnaire(text: string) {
  try {
    const match = text.match(/\{\s*"questionnaire"\s*:\s*\{[\s\S]*?\}\s*\}/);

    if (!match) return null;

    const parsed = JSON.parse(match[0]);
    return parsed?.questionnaire ?? null;
  } catch (error) {
    console.log("Failed to parse questionnaire:", error);
    return null;
  }
}

export function removeQuestionnaireFromText(text: string) {
  return text
    .replace(/\{\s*"questionnaire"\s*:\s*\{[\s\S]*?\}\s*\}/, "")
    .trim();
}

export function extractAnswerAccepted(text: string): boolean | null {
  const match = text.match(/"answerAccepted"\s*:\s*(true|false)/i);

  if (!match) return null;

  return match[1].toLowerCase() === "true";
}