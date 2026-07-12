"use client";

import { Button, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { ProductId } from "@/lib/products";

type Props = {
  hasLicense: boolean;
  isLoggedIn: boolean;
  /** Which product this button buys. Defaults to EZStemz. */
  product?: ProductId;
  /** Display name for button labels. */
  productName?: string;
  /** Display price, e.g. "$20" or "Free". Omitted from the label when free. */
  price?: string;
  /** Where to return after auth so the user can click buy again. */
  returnTo?: string;
};

// Product CTA. Three states:
//  - Already owns it → sends them to that product's download page.
//  - Logged in, no license → POST /api/checkout for the product, redirect to Stripe.
//  - Logged out → bounce to /login|/signup with a return path so they land back
//    where they were post-auth. We anchor every purchase to a Supabase user_id.
export function BuyButton({
  hasLicense,
  isLoggedIn,
  product = "ezstemz",
  productName = "EZStemz",
  price,
  returnTo = "/pricing",
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isFree = !price || price.toLowerCase() === "free";
  const buyLabel = isFree ? `Get ${productName}` : `Buy ${productName} — ${price}`;

  if (hasLicense) {
    return (
      <Button asChild size="lg" colorPalette="brand">
        <Link href={`/download/${product}`}>Download {productName}</Link>
      </Button>
    );
  }

  if (!isLoggedIn) {
    return (
      <HStack gap={3} flexWrap="wrap">
        <Button asChild size="lg" colorPalette="brand">
          <Link href={`/signup?redirectTo=${encodeURIComponent(returnTo)}`}>
            {isFree ? "Create account" : "Create account & buy"}
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={`/login?redirectTo=${encodeURIComponent(returnTo)}`}>Log in</Link>
        </Button>
      </HStack>
    );
  }

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Checkout failed (${res.status})`);
        }
        const { url } = (await res.json()) as { url: string };
        router.push(url);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not start checkout.";
        setError(message);
      }
    });
  };

  return (
    <HStack gap={3} align="flex-start" flexWrap="wrap">
      <Button onClick={onClick} size="lg" colorPalette="brand" loading={isPending}>
        {buyLabel}
      </Button>
      {error && (
        <Text color="red.400" fontSize="sm" maxW="md">
          {error}
        </Text>
      )}
    </HStack>
  );
}
