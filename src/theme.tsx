import { extendTheme, ThemeConfig } from "@chakra-ui/react";

/**
 * Custom color palette for the application.
 */
const colors = {
  brand: {
    300: "#f5c160",
    400: "#f3b53d",
    500: "#fba919",
    600: "#e59417",
    700: "#cc7f15",
  },
  darkBrand: {
    500: "#300d38",
  },
};

/**
 * Theme configuration for Chakra UI.
 * - Sets initial color mode to light.
 * - Disables system color mode.
 */
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

/**
 * Custom Chakra UI theme for PawFetch.F
 * - Sets color palette, fonts, and global styles.
 * - Customizes Button, Input, and Select components.
 */
const theme = extendTheme({
  config,
  colors,
  fonts: {
    heading: "'Segoe UI', sans-serif",
    body: "'Segoe UI', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: (props: any) =>
          props.colorScheme === "brand"
            ? {
                bg: "brand.500",
                color: "white",
                _hover: { bg: "brand.600" },
              }
            : {},
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
    },
  },
});

export default theme;
