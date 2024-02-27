import DialogsControl from 'src/@core/components/dialog-control';
import { EditNote, PersonAddAlt, Save } from "@mui/icons-material";
import { Grid, Button, TextField, DialogActions, IconButton, Typography, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
import { ChangeEvent, useState } from 'react';
import { saveData } from 'src/api/axios';

interface State {
  id?: number,
  name?: string | null,
  path?: string | null,
  description?: string | null,
  permitAccess?: boolean,
}


const Form = ({ data, setPostSuccess, closeDialogs }: any) => {

  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<State>({
    id: data?.id || 0,
    name: data?.name || null,
    path: data?.path || null,
    description: data?.description || null,
    permitAccess: data?.permitAccess || false,
  });

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues({ ...values, [prop]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const handleApiCall = async () => {

      setSaving(true)
      try {
        const res = await saveData('Dashboard/save', values);
        if (res) {
          // Reset form fields
          setValues({});

          typeof (setPostSuccess) === 'function' ? setPostSuccess(true) : '';
          closeDialogs();
        }
      } catch (error) {
        console.log(error)
      } finally {
        setSaving(false)
      }
    }

    // Call the function
    handleApiCall();
  };

  const handleClose = () => {
    setValues({
      id: 0,
      name: null,
      path: null,
      description: null,
      permitAccess: false,
    });

    closeDialogs();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12} md={12} sx={{ my: 2 }}>
          <TextField size='small' type='text' fullWidth label='Tên' placeholder='' value={values?.name} onChange={handleChange('name')} />
        </Grid>
        <Grid item xs={12} md={12} sx={{ my: 2 }}>
          <TextField size='small' type='text' fullWidth label='Đường dẫn' placeholder='' value={values?.path} onChange={handleChange('path')} />
        </Grid>
        <Grid item xs={12} md={12} sx={{ my: 2 }}>
          <TextField size='small' type='text' fullWidth label='Mô tả' placeholder='' value={values?.description} onChange={handleChange('description')} />
        </Grid>
        <Grid item xs={12} md={12} sx={{ my: 2 }}>
          <FormControlLabel control={<Checkbox name='permitAccess' checked={!!values?.permitAccess} onChange={handleChange('permitAccess')} />} label="Cho phép truy cập" />
        </Grid>
      </Grid>
      <DialogActions sx={{ p: 0 }}>
        <Button onClick={() => handleClose()} className='btn cancleBtn'>Hủy</Button>
        <Button type="submit" disabled={saving} className='btn saveBtn'> {saving ? <CircularProgress color='inherit' size={20} /> : <Save />} &nbsp; Lưu </Button>
      </DialogActions>
    </form>
  );
};

const FormPages = ({ data, isEdit, setPostSuccess }: any) => {
  const formTitle = isEdit ? 'Thay đổi thông tin trang truy cập' : 'Thêm trang truy cập';

  return (
    <DialogsControl>
      {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => (
        <>
          {
            isEdit ?
              <EditNote className='tableActionBtn' onClick={() => openDialogs(<Form data={data} setPostSuccess={setPostSuccess} isEdit={isEdit} closeDialogs={closeDialogs} />, formTitle)} />
              :
              <IconButton className='addNewBtn' aria-label="add user" onClick={() => openDialogs(<Form data={data} setPostSuccess={setPostSuccess} isEdit={isEdit} closeDialogs={closeDialogs} />, formTitle)}>
                <PersonAddAlt sx={{ mr: 2 }} />
                <Typography>Thêm mới</Typography>
              </IconButton>

          }
        </>
      )}
    </DialogsControl>
  );
};

export default FormPages;
