export { proxy } from "@/src/shared/auth/proxy-handler";

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
