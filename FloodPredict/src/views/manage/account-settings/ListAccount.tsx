import { useEffect, useState } from 'react';
import { IconButton, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';
import SetRole from './AssignRole';
import FormAccount from './FormAccount';
import TableComponent from 'src/@core/components/table';
import { getData } from 'src/api/axios';
import SetPassword from '../set-password';


const ListAccount = () => {

  const [postSuccess, setPostSuccess] = useState(false);
  const [resData, setResData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePostSuccess = () => {
    setPostSuccess(prevState => !prevState);
  };

  const columnsTable = [
    { id: 'userName', label: 'Tài khoản(User name)', },
    { id: 'roles', label: 'Quyền hạn(Roles)', elm: (row: any) => (row.role) },
    { id: 'fullName', label: 'Họ tên(Full Name)', },
    { id: 'email', label: 'Email', },
    { id: 'phoneNumber', label: 'Số điện thoại(Phone Number)', },
    { id: 'actions', label: '#', elm: (row: any) => (<># <FormAccount data={row} setPostSuccess={handlePostSuccess} isEdit={false} /></>) }
  ]

  useEffect(() => {
    const getDataUser = async () => {
      try {
        setLoading(true)
        const data = await getData('User/list');
        setResData(data);
      } catch (error) {
        setResData([]);
      }
      setLoading(false)
    };

    getDataUser();
  }, [postSuccess]);

  return (
    <div>
      <TableComponent columns={columnsTable} rows={resData} loading={loading}
        actions={(row: any) => (
          <Box>
            <IconButton aria-label="setRole">
              <SetRole data={row} setPostSuccess={handlePostSuccess} />
            </IconButton>
            <IconButton aria-label="setPassword">
              <SetPassword user={row} setPostSuccess={handlePostSuccess} />
            </IconButton>
            <IconButton aria-label="edit">
              <FormAccount data={row} setPostSuccess={handlePostSuccess} isEdit={true} />
            </IconButton>
            <IconButton aria-label="delete">
              <Delete className='tableActionBtn deleteBtn' />
            </IconButton>
          </Box>
        )

        } />
    </div>
  );

}

export default ListAccount;
