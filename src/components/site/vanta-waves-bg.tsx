"use client";

import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

/** Full-bleed Vanta Waves canvas for the homepage hero. Client-only (needs WebGL). */
export function VantaWavesBg() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let effect: { destroy: () => void } | undefined;
    let cancelled = false;

    void (async () => {
      const THREE = await import("three");
      const { default: WAVES } = await import("vanta/dist/vanta.waves.min");
      if (cancelled || !elRef.current) return;

      effect = WAVES({
        el: elRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0xa4a4a4,
      });
    })();

    return () => {
      cancelled = true;
      effect?.destroy();
    };
  }, []);

  return (
    <Box
      ref={elRef}
      position="absolute"
      inset={0}
      zIndex={0}
      aria-hidden
    />
  );
}
