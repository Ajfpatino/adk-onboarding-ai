import type { GoogleUser } from "../types/types";
import type { Message } from "../types/types";
import MarkdownRenderer from "../components/MarkdownRenderer";


type ChatScreenProps = {
  user: GoogleUser;
  input: string;
  messages: Message[];
  loading: boolean;
  setInput: (value: string) => void;
  onSend: () => void;
  onLogout: () => void;
  onWorkspaceConnect: () => void;
};

export default function ChatScreen({
  user,
  input,
  messages,
  loading,
  setInput,
  onSend,
  onLogout,
  onWorkspaceConnect,
}: ChatScreenProps) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white py-4">
      <div className="mx-auto flex h-[calc(100vh-2rem)] flex-col">
        <div className="mb-4 flex items-center justify-between gap-4 px-32">
          <div>
            <h1 className="text-2xl font-bold text-orange-400">
              Onboarding Assistant
            </h1>
            <p className="text-sm text-gray-400">Signed in as {user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="h-10 w-10 rounded-full border border-orange-500/30"
              />
            )}

            <button
              onClick={onLogout}
              className="rounded-lg border border-orange-500/20 bg-[#1a1a1a] px-4 py-2 text-sm hover:bg-[#2a2a2a]"
            >
              Logout
            </button>

            <button
              onClick={onWorkspaceConnect}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-black hover:bg-orange-400"
            >
              Connect Workspace
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 px-96 pb-4">
            {messages.length === 0 && !loading && (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Ask about a Google Doc, Sheet, or folder...
              </div>
            )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={` rounded-2xl px-4 py-3 ${
                  msg.sender === "user"
                    ? "bg-orange-500 text-black text-right"
                    : " text-white text-left"
                }`}
              >
                <MarkdownRenderer content={msg.text} />
              </div>
            </div>
          ))}

            {loading && (
              <div className="max-w-[80%] rounded-2xl bg-[#1f1f1f] px-4 py-3 text-gray-300">
                Thinking...
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-[#0f0f0f] pt-3 mb-10 px-96">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-orange-500/20 bg-[#1a1a1a] px-4 py-3 text-white outline-none focus:border-orange-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a Google Doc, Sheet, or folder..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    onSend();
                  }
                }}
              />
              <button
                className="rounded-lg bg-orange-500 px-4 py-3 text-black hover:bg-orange-400 disabled:opacity-50"
                onClick={onSend}
                disabled={loading}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}