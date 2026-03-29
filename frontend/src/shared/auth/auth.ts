import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

function toAvatarUrl(avatarUpdatedAt?: string | null): string | null {
  if (!avatarUpdatedAt) return null;
  return `/api/users/me/avatar?v=${encodeURIComponent(avatarUpdatedAt)}`;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const backendApiUrl = process.env.BACKEND_API_URL;
        if (!backendApiUrl) {
          return null;
        }

        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const response = await fetch(`${backendApiUrl}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          return null;
        }

        const user = await response.json();

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          image: toAvatarUrl(user.avatar_updated_at),
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image ?? null;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      if (trigger === "update" && session?.user) {
        if (typeof session.user.name !== "undefined") {
          token.name = session.user.name;
        }
        if (typeof session.user.email !== "undefined") {
          token.email = session.user.email;
        }
        if (typeof session.user.image !== "undefined") {
          token.image = session.user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = (token.name as string | null | undefined) ?? session.user.name;
        session.user.email = (token.email as string | null | undefined) ?? session.user.email;
        session.user.image = (token.image as string | null | undefined) ?? session.user.image;
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export function auth() {
  return getServerSession(authOptions);
}
