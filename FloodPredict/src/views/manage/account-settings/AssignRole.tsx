import React, { useState, useEffect, ChangeEvent } from 'react';
import { Grid, DialogActions, Typography, TextField, Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Button, CircularProgress } from '@mui/material';
import { Save, ShieldTwoTone } from '@mui/icons-material';
import DialogsControlFullScreen from 'src/@core/components/dialog-control-full-screen';
import BoxLoading from 'src/@core/components/box-loading';
import { getData, saveData } from 'src/api/axios';

interface State {
  userId: string
  roleName: string
}

const Form = ({ data, setPostSuccess, closeDialogs }: any) => {

  const [roleData, setRoleData] = useState([]);
  const [fecthing, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);

  const [values, setValues] = useState<State>({
    userId: data?.id,
    roleName: data?.role,
  });

  useEffect(() => {
    const getDataRole = async () => {
      try {
        setFetching(true)
        const data = await getData('Role/list');
        setRoleData(data);
      } catch (error) {
        setRoleData([]);
      }
      setFetching(false)
    };

    getDataRole();
  }, []);

  const handleChange = (prop: keyof State, roleName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const newValue = checked ? roleName : '';
    setValues((prevValues) => ({
      ...prevValues,
      [prop]: newValue,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const handleApiCall = async () => {
      setSaving(true)
      try {
        const res = await saveData('Auth/assign-role', values);
        if (res) {
          // Reset form fields
          setValues({
            userId: '',
            roleName: '',
          });

          if (typeof setPostSuccess === 'function') {
            setPostSuccess(true);
          }
          closeDialogs();
        }
      } catch (error) {
        console.log(error)
      } finally {
        setSaving(false)
      }
    };

    // Call the function
    handleApiCall();
  };

  const handleClose = () => {
    setValues({
      userId: '',
      roleName: '',
    });

    closeDialogs();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={7} sx={{ px: 10, pt: 10 }}>
          <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
            <Typography variant='h6'>THÔNG TIN TÀI KHOẢN</Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ my: 2 }}>
            <TextField size='small' type='text' fullWidth disabled label='Tên đăng nhập' placeholder=' ' value={data.userName || ''} />
          </Grid>
          <Grid item xs={12} md={3} sx={{ my: 2 }}>
            <TextField size='small' type='text' fullWidth disabled label='Họ tên' placeholder=' ' value={data.fullName || ''} />
          </Grid>
          <Grid item xs={12} md={3} sx={{ my: 2 }}>
            <TextField size='small' type='email' fullWidth disabled label='Email' placeholder=' ' value={data.email || ''} />
          </Grid>
          <Grid item xs={12} md={3} sx={{ my: 2 }}>
            <TextField size='small' type='phone' fullWidth disabled label='Số điện thoại' placeholder=' ' value={data.phoneNumber || ''} />
          </Grid>
          <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
            <Typography variant='h6'>PHÂN QUYỀN TRUY CẬP</Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            {fecthing ? (<BoxLoading />) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell size='small'>ROLES</TableCell>
                    <TableCell size='small'>PERMIT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roleData.map((row: any, key) => (
                    <TableRow key={key}>
                      <TableCell size='small'>
                        {row?.name}
                      </TableCell>
                      <TableCell size='small'>
                        <Checkbox
                          name='isDefault'
                          checked={values.roleName === row.name}
                          onChange={handleChange('roleName', row.name)}
                        />

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

          </Grid>
        </Grid>
        <DialogActions>
          <Button className='btn cancleBtn' onClick={handleClose}>HỦY</Button>
          <Button type="submit" disabled={saving} className='btn saveBtn'> {saving ? <CircularProgress color='inherit' size={20} /> : <Save />} &nbsp; Lưu </Button>
        </DialogActions>
      </form>
    </div>
  );
};

const AssignRole = ({ data, setPostSuccess }: any) => {

  const formTitle = 'Phân quyền truy cập';

  return (
    <>
      <DialogsControlFullScreen>
        {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => (
          <>
            <ShieldTwoTone className='tableActionBtn' onClick={() => openDialogs(<Form data={data} setPostSuccess={setPostSuccess} closeDialogs={closeDialogs} />, formTitle)} />
          </>
        )}
      </DialogsControlFullScreen>
    </>
  );
}
export default AssignRole;