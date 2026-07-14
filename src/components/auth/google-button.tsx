"use client";

import { Alert, Button, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { getAuthConfirmUrl } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/client";

// "Continue with Google" OAuth button. Uses the PKCE flow: Supabase redirects
// back to /auth/confirm?code=... (reusing the existing confirm route handler,
// which exchanges the code for a session).
//
// The callback URL is kept query-free on purpose: a query string on the OAuth
// redirect target can mangle the `code` Supabase appends (and complicates the
// dashboard allow-list), so we let /auth/confirm fall back to its default
// destination (/account) rather than passing ?redirectTo= here.
export function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const callback = getAuthConfirmUrl();
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
