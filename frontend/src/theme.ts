// frontend/src/theme.ts
import "styled-components";
import type { DefaultTheme } from "styled-components";

// Extend styled-components’ DefaultTheme interface for TypeScript
declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryHover: string;
  }
}

// ✅ Light Theme
export const lightTheme: DefaultTheme = {
  background: "#f9fafb",
  backgroundSecondary: "#ffffff",
  text: "#111827",
  textSecondary: "#4b5563",
  border: "#e5e7eb",
  primary: "#2563eb",
  primaryHover: "#1e40af",
};

// ✅ Dark Theme
export const darkTheme: DefaultTheme = {
  background: "#111827",
  backgroundSecondary: "#1f2937",
  text: "#f9fafb",
  textSecondary: "#9ca3af",
  border: "#374151",
  primary: "#3b82f6",
  primaryHover: "#2563eb",
};
