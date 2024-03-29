import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import { Paper } from "@mui/material";
import TableComponent, { TableColumn } from "src/@core/components/table";
import ViewData from "./view-data";

interface PropsState {
  data: any
  loading: boolean
}

const ListData = (props: PropsState) => {

  const { data, loading } = props;

  const tableColumns: TableColumn[] = [
    { id: 'stt', label: "STT", align: "center" },
    { id: 'name', label: "Tên trạm" },
    { id: 'actions', label: "#", align: "center" },
  ]

  return (
    <Paper elevation={3}>
      <Paper elevation={3} sx={{ py: 0.5, mb: 2, BorderRadius: 0, textAlign: 'center' }}>
        <Typography variant='overline' sx={{ fontWeight: 'bold' }}>Danh sách trạm đo dữ liệu</Typography>
      </Paper>
      <Box px={5} pb={5}>
        <TableComponent columns={tableColumns} loading={loading} rows={data} pagination actions={(e: any) => (
          <Box>
            <ViewData data={e} />
          </Box>
        )} />
      </Box>
    </Paper>
  );
};

export default ListData;
