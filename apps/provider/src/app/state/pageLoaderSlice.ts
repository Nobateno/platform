import type { RootState } from "./store";

export const selectPageLoader = (state: RootState) => state.pageLoader.value;
