import type { NextRequest } from "next/server";

import { env } from "@/lib/env";

// Public origin for server redirects. Prefer the proxy-forwarded host (what the
// user typed) over NEXT_PUBLIC_SITE_URL — that env is build-time and is easy to
// leave as localhost on Render. request.url alone is wrong behind Render
// (internal http://localhost:10000).
export function publicOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwardedHost) {
    const proto = forwardedProto === "http" ? "http" : "https";
    return `${proto}://${forwardedHost}`;
  }
  try {
    return env.siteUrl;
  } catch {
    return new URL(request.url).origin;
  }
}
