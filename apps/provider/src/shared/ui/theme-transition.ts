const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function startThemeViewTransition(
  updateTheme: () => void,
): ViewTransition | undefined {
  if (
    typeof document.startViewTransition !== "function" ||
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  ) {
    updateTheme();
    return undefined;
  }

  return document.startViewTransition(updateTheme);
}
