/// <reference path="./provider-contracts.d.ts" />

// The source component remains owned by the provider app. This bridge is
// intentionally a re-export so customer consumers share the same primitive
// without changing the provider UI kit.
export { default } from "../../../apps/provider/src/shared/ui/components/Base/Button";
