"use client";

import { ChakraProvider, extendTheme, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function ForceLightMode() {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode("light");
  }, [setColorMode]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <ForceLightMode />
      {children}
    </ChakraProvider>
  );
}
