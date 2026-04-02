export const frontendEnv = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  devUserId:
    process.env.NEXT_PUBLIC_DEV_USER_ID ?? "00000000-0000-0000-0000-000000000001",
  devUserEmail: process.env.NEXT_PUBLIC_DEV_USER_EMAIL ?? "dev@local.test"
};

export const hasSupabaseConfig =
  frontendEnv.supabaseUrl.length > 0 && frontendEnv.supabaseAnonKey.length > 0;
