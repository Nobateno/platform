import { useUiStore, type RootState } from "./store";

export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useUiStore(selector);
