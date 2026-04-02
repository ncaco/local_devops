import { frontendEnv, hasSupabaseConfig } from "@/lib/env";
import type {
  AuthUser,
  IntegrationSummary,
  ScheduledPostInput,
  ScheduledPostListItem
} from "@/lib/contracts";
import { getBrowserSupabaseClient } from "@/lib/supabase";

type RequestInitWithJson = RequestInit & {
  json?: unknown;
};

async function buildHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (hasSupabaseConfig) {
    const client = getBrowserSupabaseClient();
    const session = client ? await client.auth.getSession() : null;
    const token = session?.data.session?.access_token;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } else {
    headers["x-dev-user-id"] = frontendEnv.devUserId;
    headers["x-dev-user-email"] = frontendEnv.devUserEmail;
  }

  return headers;
}

async function request<T>(path: string, init?: RequestInitWithJson): Promise<T> {
  const headers = await buildHeaders();
  const response = await fetch(`${frontendEnv.backendUrl}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {})
    },
    body: init?.json ? JSON.stringify(init.json) : init?.body
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const body =
      contentType.includes("application/json")
        ? JSON.stringify(await response.json())
        : await response.text();
    throw new Error(body || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function verifySession() {
  return request<AuthUser>("/auth/session/verify", { method: "POST" });
}

export function listIntegrations() {
  return request<IntegrationSummary[]>("/integrations");
}

export function createInstagramConnectUrl() {
  return request<{ authorize_url: string }>("/integrations/instagram/connect/start", {
    method: "POST"
  });
}

export function listPosts() {
  return request<ScheduledPostListItem[]>("/posts");
}

export function createPost(input: ScheduledPostInput) {
  return request<ScheduledPostListItem>("/posts", {
    method: "POST",
    json: input
  });
}

export function cancelPost(postId: string) {
  return request<ScheduledPostListItem>(`/posts/${postId}/cancel`, {
    method: "POST"
  });
}
