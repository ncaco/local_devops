"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { frontendEnv, hasSupabaseConfig } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

export function getBrowserSupabaseClient() {
  if (!hasSupabaseConfig) {
    return null;
  }

  if (browserClient) {
    return browserClient;
  }

  browserClient = createClient(frontendEnv.supabaseUrl, frontendEnv.supabaseAnonKey);
  return browserClient;
}
