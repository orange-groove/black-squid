import "server-only";

import { env } from "@/lib/env";
import type { ProductId } from "@/lib/products";

type Platform = "macos" | "windows";

type GitHubAsset = {
  id: number;
  name: string;
  browser_download_url: string;
  url: string;
  size: number;
};

type GitHubRelease = {
  tag_name: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  assets: GitHubAsset[];
};

function authHeaders(token: string | undefined): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "black-squid",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// Fetch the most recent published, non-draft release for a given product's
// release repo. Cached for 5 minutes via `next: { revalidate }` so we don't
// hammer the GitHub API on every render. Returns null (rather than throwing)
// when the product simply has no repo configured yet — that surfaces as a
// graceful "no builds published" state on the download page.
export async function getLatestRelease(product: ProductId): Promise<GitHubRelease | null> {
  const repo = env.productGithubRepo(product);
  if (!repo) {
    console.warn(`[github] no release repo configured for ${product}`);
    return null;
  }
  const token = env.productGithubToken(product);

  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: authHeaders(token),
    next: { revalidate: 300 },
  });

  if (res.status === 404) {
    if (!token) {
      throw new Error(
        `No release found for ${repo}. If the repo is private, set a GitHub token ` +
          `(fine-grained PAT with Contents: read) for ${product}. Also verify the repo is correct.`,
      );
    }
    return null;
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error(
      `GitHub denied access to ${repo} (${res.status}). Check the token scopes for ${product}.`,
    );
  }
  if (!res.ok) {
    throw new Error(`GitHub releases lookup failed for ${repo}: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as GitHubRelease;
}

function pickAssetForPlatform(release: GitHubRelease, platform: Platform): GitHubAsset | null {
  const matchers: Record<Platform, RegExp> = {
    // macOS DMG.
    macos: /\.dmg$/i,
    // NSIS installer named <App>-<version>-Setup.exe.
    windows: /-Setup\.exe$/i,
  };
  return release.assets.find((a) => matchers[platform].test(a.name)) ?? null;
}

// Returns a URL that, when visited, downloads the asset for the requested
// platform. We hit the GitHub asset API with `Accept: application/octet-stream`
// and follow no redirects — the resulting Location is a short-lived signed
// objects URL, which we 302 back to the caller. This pattern works whether
// the underlying repo is public OR private (so long as the token has access).
export async function resolveAssetDownloadUrl(
  product: ProductId,
  assetId: number,
): Promise<string> {
  const repo = env.productGithubRepo(product);
  if (!repo) {
    throw new Error(`No release repo configured for ${product}.`);
  }
  const token = env.productGithubToken(product);

  const res = await fetch(
    `https://api.github.com/repos/${repo}/releases/assets/${assetId}`,
    {
      headers: { ...authHeaders(token), Accept: "application/octet-stream" },
      redirect: "manual",
    },
  );

  if (res.status !== 302) {
    throw new Error(
      `Expected 302 from GitHub asset endpoint, got ${res.status} ${res.statusText}`,
    );
  }
  const location = res.headers.get("location");
  if (!location) {
    throw new Error("GitHub asset endpoint responded without Location header");
  }
  return location;
}

export type LatestReleaseInfo = {
  tagName: string;
  publishedAt: string | null;
  macos: { assetId: number; name: string; size: number } | null;
  windows: { assetId: number; name: string; size: number } | null;
};

export async function getLatestReleaseInfo(
  product: ProductId,
): Promise<LatestReleaseInfo | null> {
  const release = await getLatestRelease(product);
  if (!release) return null;

  const mac = pickAssetForPlatform(release, "macos");
  const win = pickAssetForPlatform(release, "windows");

  return {
    tagName: release.tag_name,
    publishedAt: release.published_at,
    macos: mac ? { assetId: mac.id, name: mac.name, size: mac.size } : null,
    windows: win ? { assetId: win.id, name: win.name, size: win.size } : null,
  };
}

export type { Platform };
