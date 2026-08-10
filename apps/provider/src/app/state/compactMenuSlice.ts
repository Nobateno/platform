import type { RootState } from "./store";

export { DEFAULT_COMPACT_MENU } from "./store";
export const selectCompactMenu = (state: RootState) =>
  state.compactMenu.value;
