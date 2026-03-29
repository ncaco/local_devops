import { auth } from "@/src/shared/auth/auth";

export async function getValidatedSession() {
  const backendApiUrl = process.env.BACKEND_API_URL;
  if (!backendApiUrl) {
    return null;
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const response = await fetch(`${backendApiUrl}/api/v1/auth/session-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return session;
}
