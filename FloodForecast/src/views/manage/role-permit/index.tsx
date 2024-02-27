import { useEffect, useState } from 'react';
import { IconButton, Box } from '@mui/material';
import TableComponent from 'src/@core/components/table';
import AssignPermit from './assign-permit';
import AssignFunction from './assign-function';
import { getData } from 'src/api/axios';

const RolePermit = () => {

  const [resData, setResData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columnsTable = [
    { id: 'name', label: 'Tên nhóm người dùng', elm: (row: any) => (<AssignFunction data={row} />) },
    { id: 'description', label: 'Mô tả', },
    { id: 'actions', label: '#', }
  ]

  useEffect(() => {
    const getDataRole = async () => {
      try {
        setLoading(true)
        const data = await getData('Role/list');
        setResData(data);
      } catch (error) {
        setResData([]);
      }
      setLoading(false)
    };

    getDataRole();
  }, []);

  return (
    <div>
      <TableComponent columns={columnsTable} rows={resData} loading={loading}
        actions={(row: any) => (
          <Box>
            <IconButton>
              <AssignPermit data={row} />
            </IconButton>
          </Box>
        )

        } />
    </div>
  );

}

export default RolePermit;
