// ** React Imports
import { FC, useState, ChangeEvent } from 'react'

// ** MUI Imports
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination } from '@mui/material';
import BoxLoading from '../box-loading';

export interface TableColumn {
  id: string;
  label?: string | React.ReactNode;
  colspan?: number;
  rowspan?: number;
  minWidth?: number;
  align?: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  children?: TableColumn[];
  format?: (value: any) => string | React.ReactNode;
  elm?: React.ReactNode;
  pinned?: "left" | "right" | undefined;
}

interface Data {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  rows: Data[];
  columnVisibility?: string[];
  pagination?: boolean;
  rowperpage?: number;
  loading?: boolean;
  actions?: ((row: Data) => React.ReactNode) | null;
}

const TableComponent: FC<TableProps> = (props: TableProps) => {

  const { columns, rows, columnVisibility, pagination, loading, rowperpage, actions } = props;

  const tableColumns: TableColumn[] = [];
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    // Check if the column is in the columnVisibility array, and hide it if needed
    if (!columnVisibility || (columnVisibility && !columnVisibility.includes(column.id))) {
      const updatedColumn: TableColumn = { ...column };
      if (column.children) {
        const updatedChildrenColumns: TableColumn[] = [];
        for (let j = 0; j < column.children.length; j++) {
          const childColumn = column.children[j];

          // Check visibility for child columns
          if (!columnVisibility || (columnVisibility && !columnVisibility.includes(childColumn.id))) {
            updatedChildrenColumns.push({ ...childColumn });
          }
        }
        updatedColumn.children = updatedChildrenColumns;
        updatedColumn.colspan = updatedChildrenColumns.length;
      } else {
        updatedColumn.colspan = 1;
      }
      tableColumns.push(updatedColumn);
    }
  }

  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(typeof rowperpage === 'number' ? rowperpage : 10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (

    loading ? (
      <BoxLoading />
    ) : (
      <Paper>
        <TableContainer style={{ borderRadius: 4 }}>
          <Table className='mainTable'>
            <TableHead className='tableHead'>
              <TableRow>
                {tableColumns.map((column, index) => (
                  <TableCell className={` ${column.pinned ? "sticky-col" : ""} ${column.pinned === "left" ? "start-col" : ""} ${column.pinned === "right" ? "end-col" : ""} `} size='small' align='center' key={index} rowSpan={column.rowspan} colSpan={column.colspan} sx={{ minWidth: column.minWidth, maxWidth: column.minWidth, width: column.minWidth }}>
                    {column.id === 'actions' ? (typeof column.elm === 'function' ? column.elm() : column.label) : column.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {tableColumns.map((column) =>
                  column.children ? (
                    column.children.map((childColumn, index) => (
                      childColumn.label ?
                        <TableCell size='small' align='center' key={index} rowSpan={childColumn.rowspan} colSpan={childColumn.colspan}>
                          {childColumn.label}
                        </TableCell>
                        : null
                    ))
                  ) : null
                )}
              </TableRow>
              <TableRow>
                {tableColumns.map((column) =>
                  column.children ? (
                    column.children.map((childColumn) => (
                      childColumn?.children ? (
                        childColumn?.children.map((childColumn, index) => (
                          <TableCell size='small' align='center' key={index} rowSpan={childColumn.rowspan} colSpan={childColumn.colspan}>
                            {childColumn.label}
                          </TableCell>
                        ))
                      ) : null
                    ))
                  ) : null
                )}
              </TableRow>
              <TableRow>
                {tableColumns.map((column) =>
                  column.children ? (
                    column.children.map((childColumn) => (
                      childColumn?.children ? (
                        childColumn?.children.map((childColumn) => (
                          childColumn?.children ? (
                            childColumn?.children.map((childColumn, index) => (
                              <TableCell size='small' align='center' key={index}>
                                {childColumn.label}
                              </TableCell>
                            ))
                          ) : null
                        ))
                      ) : null
                    ))
                  ) : null
                )}
              </TableRow>
            </TableHead>
            <TableBody className='tableBody'>
              {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  {tableColumns.map((column, columnIndex) => {
                    if (column.children) {
                      return column.children.map((childColumn, childIndex) => {
                        const parentId = column.id;
                        const rowValue = row[parentId];

                        if (parentId === "#") {
                          return (
                            <TableCell className={` ${column.pinned ? "sticky-col" : ""} ${column.pinned === "left" ? "start-col" : ""} ${column.pinned === "right" ? "end-col" : ""} `} sx={{ py: 0, minWidth: childColumn.minWidth }} key={`${columnIndex}-${childIndex}`} align={childColumn.align} size='small'>
                              {childColumn.id === "actions" ? actions && actions(row)
                                : (
                                  typeof childColumn.elm === 'function'
                                    ? childColumn.elm(row)
                                    : (childColumn.format
                                      ? childColumn.format(row[childColumn.id])
                                      : row[childColumn.id])
                                )}
                            </TableCell>
                          )
                        } else {
                          return (
                            <TableCell className={` ${column.pinned ? "sticky-col" : ""} ${column.pinned === "left" ? "start-col" : ""} ${column.pinned === "right" ? "end-col" : ""} `} sx={{ py: 0, minWidth: childColumn.minWidth }} key={`${columnIndex}-${childIndex}`} align={childColumn.align} size='small'>
                              {Array.isArray(rowValue) ? (
                                <div>
                                  {typeof rowValue === 'object' && rowValue !== null && Object.keys(rowValue).length > 0 ? (
                                    rowValue.map((e, k) => (
                                      <div key={k}>
                                        {Object.keys(rowValue).length > 1 ? (
                                          <p>
                                            {typeof childColumn.elm === 'function' ? childColumn.elm(e)
                                              : (childColumn.format ? childColumn.format(e[childColumn.id])
                                                : e[childColumn.id])
                                            }
                                          </p>
                                        ) : (
                                          typeof childColumn.elm === 'function'
                                            ? childColumn.elm(e)
                                            : (childColumn.format
                                              ? childColumn.format(e[childColumn.id])
                                              : e[childColumn.id])
                                        )}
                                      </div>
                                    ))
                                  ) : (rowValue)
                                  }
                                </div>
                              ) : (
                                typeof rowValue === 'object' && rowValue !== null && Object.keys(rowValue).length > 0 ? (
                                  typeof childColumn.elm === 'function'
                                    ? childColumn.elm(rowValue)
                                    : childColumn.format
                                      ? childColumn.format(rowValue[childColumn.id])
                                      : rowValue[childColumn.id]
                                ) : (rowValue)
                              )}
                            </TableCell>
                          )
                        }
                      });
                    } else {
                      return (
                        <TableCell className={` ${column.pinned ? "sticky-col" : ""} ${column.pinned === "left" ? "start-col" : ""} ${column.pinned === "right" ? "end-col" : ""} `} sx={{ py: 0, minWidth: column.minWidth }} {...(column.id === "actions" ? { width: 120 } : {})} key={`${columnIndex}`} align={column.align} size='small'>
                          {column.id === "actions" ? actions && actions(row)
                            : column.id === "stt"
                              ? (index + 1)
                              : (
                                typeof column.elm === 'function'
                                  ? column.elm(row)
                                  : (column.format
                                    ? column.format(row[column.id])
                                    : (Array.isArray(row[column.id])
                                      ? row[column.id].join(", ")
                                      : row[column.id]))
                              )}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination ?
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component='div'
            count={rows?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          : ''
        }
      </Paper>
    ))
};

export default TableComponent;
