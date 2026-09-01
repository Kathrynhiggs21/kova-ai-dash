import { useAuth } from "@/_core/hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

/**
 * Prevents private pages from rendering until the existing Manus session has
 * been verified. Unauthenticated visitors are sent through the normal login
 * flow by useAuth; the placeholder contains no private workspace data.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth({
    redirectOnUnauthenticated: true,
  });

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#080810] px-6 text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center shadow-xl">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-300" />
          <p className="font-display text-sm font-semibold">
            Securing your workspace
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Checking your Kova OS session…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
