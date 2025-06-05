import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#300d38",
    500: "#fba919",
    300: "#fbc94f",
  },
};

const components = {
  Button: {
    variants: {
      solid: (props: any) => ({
        bg: props.colorScheme === "brand" ? "brand.500" : undefined,
        color: "white",
        _hover: {
          bg: "brand.300",
        },
      }),
      outline: (props: any) => ({
        borderColor: props.colorScheme === "brand" ? "brand.500" : undefined,
        color: props.colorScheme === "brand" ? "brand.500" : undefined,
        _hover: {
          bg: "brand.50020",
        },
      }),
    },
  },
};

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ colors, components, config });
export default theme;