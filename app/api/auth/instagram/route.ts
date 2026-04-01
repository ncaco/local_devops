import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  buildInstagramAuthorizeUrl,
  createInstagramState,
  getInstagramDebugSnapshot
} from "@/lib/instagram";

const INSTAGRAM_STATE_COOKIE = "instagram_oauth_state";

export async function GET() {
  try {
    const state = createInstagramState();
    const authorizeUrl = buildInstagramAuthorizeUrl(state);
    const debug = getInstagramDebugSnapshot(state);
    console.log("[instagram-auth:start]", {
      appId: debug.appId,
      redirectUri: debug.redirectUri,
      scopes: debug.scopes,
      authorizeUrl: debug.authorizeUrl
    });
    const response = NextResponse.redirect(authorizeUrl);

    response.cookies.set({
      name: INSTAGRAM_STATE_COOKIE,
      value: state,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function PUT() {
  try {
    const debug = getInstagramDebugSnapshot();
    return NextResponse.json(debug);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: INSTAGRAM_STATE_COOKIE,
    value: "",
    path: "/",
    maxAge: 0
  });

  return response;
}

export async function POST() {
  const cookieStore = await cookies();
  const response = NextResponse.json({
    state: cookieStore.get(INSTAGRAM_STATE_COOKIE)?.value ?? null
  });

  return response;
}
