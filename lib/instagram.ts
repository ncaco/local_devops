import { randomBytes } from "node:crypto";

type InstagramTokenResponse = {
  access_token: string;
  user_id?: number | string;
  token_type?: string;
  permissions?: string[];
};

type InstagramProfile = {
  id: string;
  username?: string;
  account_type?: string;
  media_count?: number;
};

export type InstagramConfig = {
  appId: string;
  appSecret: string;
  redirectUri: string;
  scopes: string;
};

const INSTAGRAM_AUTH_BASE_URL = "https://www.instagram.com/oauth/authorize";
const INSTAGRAM_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const INSTAGRAM_GRAPH_ME_URL = "https://graph.instagram.com/me";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getInstagramConfig(): InstagramConfig {
  return {
    appId: requireEnv("INSTAGRAM_APP_ID"),
    appSecret: requireEnv("INSTAGRAM_APP_SECRET"),
    redirectUri: requireEnv("INSTAGRAM_REDIRECT_URI"),
    scopes: process.env.INSTAGRAM_SCOPES ?? "instagram_business_basic"
  };
}

export function createInstagramState(): string {
  return randomBytes(24).toString("hex");
}

export function buildInstagramAuthorizeUrl(state: string) {
  const { appId, redirectUri, scopes } = getInstagramConfig();
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes,
    state
  });

  return `${INSTAGRAM_AUTH_BASE_URL}?${params.toString()}`;
}

export function getInstagramDebugSnapshot(state = "debug-state") {
  const config = getInstagramConfig();

  return {
    appId: config.appId,
    redirectUri: config.redirectUri,
    scopes: config.scopes,
    authorizeUrl: buildInstagramAuthorizeUrl(state)
  };
}

export async function exchangeCodeForToken(code: string) {
  const { appId, appSecret, redirectUri } = getInstagramConfig();
  const body = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code
  });

  const response = await fetch(INSTAGRAM_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as InstagramTokenResponse;
}

export async function fetchInstagramProfile(accessToken: string) {
  const url = new URL(INSTAGRAM_GRAPH_ME_URL);
  url.searchParams.set("fields", "id,username,account_type,media_count");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Profile fetch failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as InstagramProfile;
}
