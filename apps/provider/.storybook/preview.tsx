import { useEffect, type ReactNode } from "react";
import type { Preview } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { DirectionProvider } from "../src/shared/lib/utils/direction-context";
import { ThemeProvider } from "../src/shared/ui/theme-context";
import i18n, {
  getLanguageOption,
  languageOptions,
  normalizeLanguage,
  type AppLanguage,
} from "../src/shared/i18n";
import "../src/index.css";

function StoryEnvironment({
  children,
  locale,
  darkMode,
}: {
  children: ReactNode;
  locale: AppLanguage;
  darkMode: boolean;
}) {
  const language = getLanguageOption(locale);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale]);

  useEffect(() => {
    const root = document.documentElement;
    const previousDarkMode = root.classList.contains("dark");
    const previousDirection = root.dir;
    const previousLanguage = root.lang;

    root.classList.toggle("dark", darkMode);
    root.dir = language.direction;
    root.lang = language.documentLanguage;

    return () => {
      root.classList.toggle("dark", previousDarkMode);
      root.dir = previousDirection;
      root.lang = previousLanguage;
    };
  }, [darkMode, language.direction, language.documentLanguage]);

  return (
    <MemoryRouter initialEntries={["/"]}>
      <DirectionProvider initialDirection={language.direction}>
        <ThemeProvider darkMode={darkMode}>
          <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-surface p-6 text-on-surface transition-colors">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </DirectionProvider>
    </MemoryRouter>
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Component color mode",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: "Interface language and direction",
      toolbar: {
        title: "Locale",
        icon: "globe",
        items: languageOptions.map(({ code, nativeName }) => ({
          value: code,
          title: nativeName,
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", locale: "fa" },
  decorators: [
    (Story, context) => (
      <StoryEnvironment
        locale={normalizeLanguage(context.globals.locale)}
        darkMode={context.globals.theme === "dark"}
      >
        <Story />
      </StoryEnvironment>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          "Material 3",
          "Components",
          "Shared",
          "Domains",
          "Patterns",
        ],
      },
    },
    a11y: {
      config: {
        rules: [{ id: "page-has-heading-one", enabled: false }],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
