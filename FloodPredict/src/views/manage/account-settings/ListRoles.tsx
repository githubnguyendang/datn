import { useEffect, useState } from 'react';
import { Delete } from '@mui/icons-material';
import { IconButton, Box, Checkbox } from '@mui/material';
import TableComponent from 'src/@core/components/table';
import FormRoles from './FormRoles';
import { getData } from 'src/api/axios';


const ListRoles = () => {

  const [postSuccess, setPostSuccess] = useState(false);
  const [resData, setResData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePostSuccess = () => {
    setPostSuccess(prevState => !prevState);
  };

  const columnsTable = [
    { id: 'name', label: 'Tên', },
    { id: 'isDefault', label: 'Mặc định', elm: (row: any) => (<Checkbox name='isDefault' checked={row?.isDefault} />) },
    { id: 'actions', label: '#', elm: (row: any) => (<># <FormRoles data={row} isEdit={false} setPostSuccess={handlePostSuccess} /> </>) }
  ]

  useEffect(() => {
    const getDataRole = async () => {
      try {
        setLoading(true)
        const data = await getData('Role/list');
        setResData(data);
      } catch (error) {
        setResData([]);
      } finally {
        setLoading(false)
      }
    };

    getDataRole();
  }, [postSuccess]);

  return (
    <>
      <TableComponent columns={columnsTable} rows={resData} loading={loading}
        actions={(row: any) => (
          <Box display="flex" justifyContent="center">
            <IconButton aria-label="edit">
              <FormRoles data={row} isEdit={true} setPostSuccess={handlePostSuccess} />
            </IconButton>
            <IconButton aria-label="delete">
              <Delete className='tableActionBtn deleteBtn' />
            </IconButton>
          </Box>
        )

        } />
    </>
  );
}

export default ListRoles;
