import { GoogleLogin } from "@react-oauth/google";

type LoginCardProps = {
  hasClientId: boolean;
  onGoogleSuccess: (credentialResponse: { credential?: string }) => void;
  onGoogleError?: () => void;
};

export default function LoginCard({
  hasClientId,
  onGoogleSuccess,
  onGoogleError,
}: LoginCardProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Onboarding Assistant</h1>
          <p className="mt-2 text-sm text-gray-300">
            Sign in with Google to access the assistant and connect your
            documents securely.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-6 flex flex-col items-center justify-center gap-4">
          {hasClientId ? (
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => {
                console.error("Google Login Failed");
                onGoogleError?.();
              }}
              useOneTap={false}
            />
          ) : (
            <p className="text-sm text-red-400 text-center">
              Missing <code>VITE_GOOGLE_CLIENT_ID</code> in your frontend env.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}