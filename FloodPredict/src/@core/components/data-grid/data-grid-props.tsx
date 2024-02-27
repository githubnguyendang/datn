export const dataGridProps = {
  disableColumnMenu: true,
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
  rowHeight: 55,
  columnHeaderHeight: 55,
  experimentalFeatures: {
    'columnGrouping': true
  },
  initialState: {
    columns: {
      columnVisibilityModel: {
        id: false,
      }
    },
    pagination: { paginationModel: { pageSize: 10 } },
  },
  pageSizeOptions: [10, 25, 50],
};