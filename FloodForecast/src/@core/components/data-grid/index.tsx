import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridProps } from "./data-grid-props";

interface DataGridComponentProps {
  rows: any;
  columns: any;
  columnGroupingModel?: any;
  columnVisibility?: string[]; // Define columnVisibility as an array of strings
  loading?: boolean;
  actions?: any;
}

const DataGridComponent = (props: DataGridComponentProps) => {
  const { rows, columns, columnGroupingModel, columnVisibility, loading } = props;
  const [rowDatas, setRowDatas] = React.useState<any>(rows);
  const columnUpdated = columns;
  const [displayedColumns, setDisplayedColumns] = React.useState<any>(columnUpdated);

  React.useEffect(() => {
    setRowDatas(rows);

    // Check if columnVisibility is an array before using includes
    if (Array.isArray(columnVisibility)) {
      const newDisplayedColumns: GridColDef[] = [];

      columnUpdated.forEach((column: any) => {
        const field: string = column?.field; // Corrected variable name to 'field'
        if (!columnVisibility.includes(field)) {
          newDisplayedColumns.push(column);
        }
      });
      setDisplayedColumns(newDisplayedColumns);
    }
  }, [rows, columns, columnVisibility, columnUpdated]);

  return (
    <div style={{ height: 610, width: '100%' }}>
      <DataGrid
        rows={rowDatas}
        columns={displayedColumns}
        columnGroupingModel={columnGroupingModel}
        loading={loading}
        {...dataGridProps}
      />
    </div>
  );
}

export default DataGridComponent;
