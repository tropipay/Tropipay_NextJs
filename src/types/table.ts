import { Column, ColumnDef } from "@tanstack/react-table";

interface ColumnConfig {
  filterLabel?: string;
  filterPlaceholder?: string;
}

export type CustomColumn<TData, TValue> = Column<TData, TValue> & {
  columnDef: ColumnDef<TData, TValue> & {
    meta: ColumnConfig;
  };
};
