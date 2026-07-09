"use client";

import { Box, chakra, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

import { PRODUCT_LIST } from "@/lib/products";

// "Products" nav item with a hover/focus/click dropdown listing each product.
// The trigger only opens the menu — it does not navigate anywhere itself.
export function ProductsMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // Small delay so moving the cursor from trigger to menu doesn't close it.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <Box
      position="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onFocus={openNow}
      onBlur={scheduleClose}
    >
      <chakra.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        display="inline-flex"
        alignItems="center"
        gap={1}
        color={open ? "fg" : "fg.muted"}
        _hover={{ color: "fg" }}
        fontSize="sm"
        fontWeight="medium"
        transition="color 0.15s"
        cursor="pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Products
        <Box
          as="span"
          display="inline-flex"
          transition="transform 0.15s"
          transform={open ? "rotate(180deg)" : undefined}
          fontSize="xs"
        >
          <LuChevronDown />
        </Box>
      </chakra.button>

      {open && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          pt={2}
          zIndex={20}
          role="menu"
        >
          <Stack
            gap={1}
            minW="260px"
            p={2}
            bg="bg.subtle"
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="xl"
            boxShadow="0 16px 48px rgba(0,0,0,0.6)"
          >
            {PRODUCT_LIST.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                style={{ color: "inherit" }}
                role="menuitem"
              >
                <Box
                  p={3}
                  borderRadius="lg"
                  _hover={{ bg: "bg.muted" }}
                  transition="background 0.12s"
                >
                  <Text fontWeight="semibold" fontSize="sm" color="fg">
                    {product.name}
                  </Text>
                  <Text fontSize="xs" color="fg.muted" lineClamp={2}>
                    {product.tagline}
                  </Text>
                </Box>
              </Link>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
