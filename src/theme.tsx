import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#fdf7eb",
    100: "#fbe9c8",
    200: "#f9dca6",
    300: "#f7ce83",
    400: "#f5c160",
    500: "#f3b53d",
    600: "#d89d34",
    700: "#b4852b",
    800: "#8d6d22",
    900: "#65551a",
  },
  darkBrand: {
    500: "#300d38",
  },
  accent: {
    500: "#fba919",
    600: "#e59417",
    700: "#cc7f15",
  },
};

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

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
        solid: (props: any) => ({
          bg: props.colorScheme === "brand" ? "accent.500" : undefined,
          color: props.colorScheme === "brand" ? "white" : undefined,
          _hover: {
            bg: props.colorScheme === "brand" ? "accent.600" : undefined,
          },
        }),
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "accent.500",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "accent.500",
      },
    },
  },
});

export default theme;