import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Redirect off the canonical site URL rather than request.url. Behind Render's
  // proxy the incoming request origin is the internal http://localhost:10000,
  // which would otherwise send users to a dead localhost address after logout.
  return NextResponse.redirect(new URL("/", env.siteUrl), { status: 303 });
}
