import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import { TableColumn } from '../table';
import React from 'react';

const exportToExcel = (resData: any[], columnsTable: TableColumn[]) => {
    const columns: TableColumn[] = getFlattenedColumns(columnsTable);
    const exportData = resData.map(row => mapRowToColumns(row, columns));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
};

// Hàm để lấy danh sách các cột phẳng từ columnsTable
const getFlattenedColumns = (columnsTable: TableColumn[]): TableColumn[] => {
    return columnsTable.flatMap(column => {
        if (column.children) {
            return [
                { ...column, children: undefined }, // Clone the parent column without children
                ...column.children.map(child => ({ ...child, id: `${column.id}-${child.id}` })),
            ];
        }

        return [column];
    });
};


// Hàm để ánh xạ một dòng dữ liệu thành một đối tượng chứa giá trị theo columns
const mapRowToColumns = (row: any, columns: TableColumn[]): any => {
    const rowData: any = {};
    columns.forEach(column => {
        if (column.elm && typeof column.elm === 'function') {
            rowData[column.id] = getColumnValue(row, column.id); // Directly use column.id here
        } else {
            rowData[column.id] = getColumnValue(row, column.id);
        }
    });

    return rowData;
};

// Hàm để lấy giá trị của một cột trong một dòng dữ liệu
const getColumnValue = (row: any, columnId: string) => {
    const columnParts = columnId.split('-');
    let value = row;

    for (const part of columnParts) {
        if (value && value.hasOwnProperty(part)) {
            value = value[part];
            if (Array.isArray(value)) {
                value = value[(value.length - 1)]
            }
        } else {
            value = null;
            break;
        }
    }

    return value;
};

const ExportToExcel = ({ resData, columnsTable }: { resData: any[], columnsTable: TableColumn[] }) => {

    const handleExport = () => {
        exportToExcel(resData, columnsTable);
    };

    return (
        <Button onClick={handleExport} variant="outlined" size='small' fullWidth sx={{ borderRadius: 0 }} color="primary">
            Xuất file Excel
        </Button>
    );
};

export default ExportToExcel;
