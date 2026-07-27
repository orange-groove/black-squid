"use client";

import { Alert, Button, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { createClient } from "@/lib/supabase/client";

// "Continue with Google" OAuth button. Uses the PKCE flow: Supabase redirects
// back to /auth/confirm?code=... (reusing the existing confirm route handler,
// which exchanges the code for a session).
//
// The callback URL is built from window.location.origin — NOT the build-time
// NEXT_PUBLIC_SITE_URL — on purpose. The PKCE code-verifier cookie is written
// for the origin the user is currently on; the code exchange must happen on
// that SAME origin or the verifier is missing ("code verifier not found in
// storage"). Deriving the callback from the live origin guarantees they match,
// even if NEXT_PUBLIC_SITE_URL is stale or the app is served from more than one
// host. It's also query-free so the `code` Supabase appends can't be mangled.
export function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const callback = `${window.location.origin}/auth/confirm`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback },
    });

    // On success the browser is navigated to Google, so we only handle errors.
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  return (
    <Stack gap={3}>
      {error && (
        <Alert.Root status="error" variant="subtle">
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}
      <Button onClick={onClick} loading={loading} variant="outline" size="lg" width="full">
        <FcGoogle /> Continue with Google
      </Button>
    </Stack>
  );
}
