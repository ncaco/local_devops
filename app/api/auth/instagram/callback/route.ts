import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, fetchInstagramProfile } from "@/lib/instagram";

const INSTAGRAM_STATE_COOKIE = "instagram_oauth_state";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");
  const errorReason = request.nextUrl.searchParams.get("error_reason");
  const errorDescription = request.nextUrl.searchParams.get("error_description");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(INSTAGRAM_STATE_COOKIE)?.value;

  console.log("[instagram-auth:callback]", {
    url: request.url,
    codePresent: Boolean(code),
    state,
    expectedState,
    error,
    errorReason,
    errorDescription
  });

  if (error) {
    return redirectWithPayload({
      ok: false,
      stage: "instagram_authorize",
      error,
      errorReason,
      errorDescription
    });
  }

  if (!code) {
    return redirectWithPayload({
      ok: false,
      stage: "callback",
      error: "missing_code"
    });
  }

  if (!state || !expectedState || state !== expectedState) {
    return redirectWithPayload({
      ok: false,
      stage: "state_validation",
      error: "invalid_state",
      expectedState: expectedState ?? null,
      receivedState: state
    });
  }

  try {
    const token = await exchangeCodeForToken(code);
    const profile = await fetchInstagramProfile(token.access_token);
    console.log("[instagram-auth:success]", {
      userId: token.user_id ?? null,
      username: profile.username ?? null,
      accountType: profile.account_type ?? null
    });
    const response = redirectWithPayload({
      ok: true,
      token: {
        access_token: token.access_token,
        token_type: token.token_type ?? null,
        user_id: token.user_id ?? null,
        permissions: token.permissions ?? null
      },
      profile
    });

    response.cookies.set({
      name: INSTAGRAM_STATE_COOKIE,
      value: "",
      path: "/",
      maxAge: 0
    });

    return response;
  } catch (caughtError) {
    console.error("[instagram-auth:token-or-profile:error]", caughtError);
    return redirectWithPayload({
      ok: false,
      stage: "token_or_profile",
      error: caughtError instanceof Error ? caughtError.message : "Unknown error"
    });
  }
}

function redirectWithPayload(payload: Record<string, unknown>) {
  const nextUrl = new URL("/result", process.env.INSTAGRAM_REDIRECT_URI);
  nextUrl.searchParams.set("data", JSON.stringify(payload));

  return NextResponse.redirect(nextUrl);
}
