import { DataGridProvider } from "./_context";
import { InternalDataGrid } from "./_DataGrid";
import type { DataGridProps } from "./_DataGrid";
export type { DataGridColumn } from "./_DataGrid";

export default function DataGrid<T extends { id: string }>(
  props: DataGridProps<T>
) {
  return (
    <DataGridProvider>
      <InternalDataGrid {...props} />
    </DataGridProvider>
  );
}
