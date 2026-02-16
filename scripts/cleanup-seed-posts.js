"use strict";

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value;
  }

  return env;
}

function getEnvValue(envFile, keyList) {
  for (const key of keyList) {
    if (process.env[key]) return process.env[key];
    if (envFile[key]) return envFile[key];
  }
  return null;
}

async function main() {
  const root = path.resolve(__dirname, "..");
  const envFile = loadEnvFile(path.join(root, ".env.local"));

  const supabaseUrl = getEnvValue(envFile, [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL",
  ]);
  const supabaseAnonKey = getEnvValue(envFile, [
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
  ]);
  const seedUserEmail = getEnvValue(envFile, ["SEED_USER_EMAIL"]);
  const seedUserPassword = getEnvValue(envFile, ["SEED_USER_PASSWORD"]);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or ANON KEY.");
    process.exit(1);
  }

  if (!seedUserEmail || !seedUserPassword) {
    console.error("Missing SEED_USER_EMAIL or SEED_USER_PASSWORD.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log("Signing in seed user...");
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: seedUserEmail,
      password: seedUserPassword,
    });

  if (signInError || !signInData?.user) {
    console.error("Failed to sign in seed user:", signInError?.message);
    process.exit(1);
  }

  const seedUserId = signInData.user.id;
  console.log("Deleting seed posts...");

  const { error: deleteError, count } = await supabase
    .from("questions")
    .delete({ count: "exact" })
    .eq("user_id", seedUserId)
    .ilike("content", "This is a seed post created for demo purposes.%");

  if (deleteError) {
    console.error("Failed to delete seed posts:", deleteError.message);
    process.exit(1);
  }

  console.log(`Deleted ${count || 0} seed posts.`);
}

main().catch((error) => {
  console.error("Cleanup failed:", error);
  process.exit(1);
});
