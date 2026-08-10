import { useContext } from "react";

import { DataGridDispatchContext, DataGridStateContext } from ".";

function useDataGridState() {
  const context = useContext(DataGridStateContext);
  if (context === undefined)
    throw new Error("DataGridState was used outside of DataGridProvider");
  return context;
}

function useDataGridDispatch() {
  const context = useContext(DataGridDispatchContext);
  if (context === undefined)
    throw new Error("DataGridDispatch was used outside of DataGridProvider");
  return context;
}

export { useDataGridState, useDataGridDispatch };
