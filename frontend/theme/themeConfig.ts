import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    // Seed Tokens - Colors
    colorPrimary: "#799EFF",
    colorError: "#fc6f03",
    colorWarning: "#d6ac20",
    colorSuccess: "#16C47F",

    // Shape
    borderRadius: 16,

    // Typography - Font Family
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

    // Typography - Font Sizes
    fontSizeSM: 12,
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 24,
    fontSizeHeading1: 48,
    fontSizeHeading2: 36,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Flat Design - Remove all shadows
    boxShadow: "none",
    boxShadowSecondary: "none",
    boxShadowTertiary: "none",
  },
};

export default themeConfig;

// Custom font weight constants (not part of Ant Design tokens)
export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
};

// Named colors (Ant Design color palettes)
export const colors = {
  blue: "#1677ff",
  purple: "#722ed1",
  cyan: "#13c2c2",
  green: "#52c41a",
  magenta: "#eb2f96",
  pink: "#eb2f96",
  red: "#f5222d",
  orange: "#fa8c16",
  yellow: "#fadb14",
  lime: "#a0d911",
  gold: "#faad14",
};
