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