"use client";

import { Alert, Button, Stack } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { getAuthConfirmUrl } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/client";

// "Continue with Google" OAuth button. Uses the PKCE flow: Supabase redirects
// back to /auth/confirm?code=... (reusing the existing confirm route handler,
// which exchanges the code for a session). The post-login destination rides
// along as ?redirectTo=.
export function GoogleButton() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/account";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const callback = `${getAuthConfirmUrl()}?redirectTo=${encodeURIComponent(redirectTo)}`;
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
