import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";

type BrandMarkProps = {
  /** Square edge length. */
  size?: number | string;
  /** Optional corner radius token (logo is masked to it). */
  radius?: string;
};

// Black Squid logo mark. Renders the real logo (public/logo.svg) inside a
// square box; callers keep passing the same `size` they always have.
export function BrandMark({ size = 40, radius }: BrandMarkProps) {
  return (
    <Box
      position="relative"
      w={size}
      h={size}
      flexShrink={0}
      borderRadius={radius}
      overflow="hidden"
    >
      <Image
        src="/logo.png"
        alt="Black Squid"
        fill
        sizes="256px"
        unoptimized
        style={{ objectFit: "contain" }}
      />
    </Box>
  );
}

// Header wordmark. The logo mark is intentionally omitted here — the nav shows
// just the "Black Squid" wordmark.
export function BrandLockup() {
  return (
    <Text
      as="span"
      fontWeight="bold"
      fontSize="lg"
      letterSpacing="-0.02em"
      color="white"
    >
      Black Squid
    </Text>
  );
}
