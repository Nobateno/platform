import { createContext, useContext, type ReactNode } from "react";

interface ThemeContextValue {
  darkMode: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({ darkMode: false });

export function ThemeProvider({
  children,
  darkMode,
}: {
  children: ReactNode;
  darkMode: boolean;
}) {
  return (
    <ThemeContext.Provider value={{ darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
