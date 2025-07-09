import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#673AB7",
        onPrimary: "#ffffff",
        primaryContainer: "#EDE7F6",
        onPrimaryContainer: "#5E35B1",
        secondary: "#2196F3",
        onSecondary: "#ffffff",
        secondaryContainer: "#E3F2FD",
        onSecondaryContainer: "#1E88E5",
        // tertiary: "#3c6472",
        // onTertiary: "#ffffff",
        // tertiaryContainer: "#c0e9fa",
        // onTertiaryContainer: "#001f28",
        error: "#ba1a1a",
        onError: "#ffffff",
        errorContainer: "#ffdad6",
        onErrorContainer: "#410002",

        background: "#fefeff",
        onBackground: "#191c1a", //remaining
        surface: "#eef2f6",
        onSurface: "#191c1a", //remaining

        textColor: "#11181c",

        // surfaceVariant: "#dce5dd",
        // onSurfaceVariant: "#404943",
        outline: "#707972",
        // outlineVariant: "#c0c9c1",
        // shadow: "#000000",
        // scrim: "#000000",
        // inverseSurface: "#2e312f",
        // inverseOnSurface: "#eff1ed",
        // inversePrimary: "#67dca5",
        // elevation: {
        //   level0: "#EEF6EF00",
        //   level1: "#eef6ef",
        //   level2: "#e7f1ea",
        //   level3: "#dfe7e5",
        //   level4: "#dde6e3",
        //   level5: "#d8e9df",
        // },
        // surfaceDisabled: "#191c1a1f",
        // onSurfaceDisabled: "#191c1a61",
        // backdrop: "#2a322d66",
        // lightPrimaryContainer: "#85f9c025",
      },
      boxShadow: {
        fullShadow: "#64646f33 0px 7px 29px 0px",
        lightShadow: "#959da533 0px 1px 6px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    plugin(function ({ addComponents }) {
      addComponents({
        ".heading1": {
          fontSize: "34px",
          fontWeight: "700",
          lineHeight: "42px",
        },
        ".heading2": {
          fontSize: "24px",
          fontWeight: "700",
          lineHeight: "28px",
        },
        ".heading3": {
          fontSize: "20px",
          fontWeight: "700",
          lineHeight: "28px",
        },
        ".heading4": {
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "18px",
        },
        ".heading5": {
          fontSize: "14px",
          fontWeight: "700",
          lineHeight: "16px",
        },
        ".heading6": {
          fontSize: "12px",
          fontWeight: "600",
          lineHeight: "16px",
        },
        ".title": {
          fontSize: "24px",
          fontWeight: "500",
          lineHeight: "28px",
        },
        ".subTitle": {
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "28px",
        },
      });
    }),
  ],
};
export default config;
