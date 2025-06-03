import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          900: {value: "#1a365d"},
          800: {value: "#153e75"},
          700: {value: "#2a69ac"},
        },
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
    },
  },
});
