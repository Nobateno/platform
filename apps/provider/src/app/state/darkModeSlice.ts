import type { RootState } from "./store";

export { DEFAULT_DARK_MODE } from "./store";
export const selectDarkMode = (state: RootState) => state.darkMode.value;
