import { useState, ChangeEvent } from 'react';
import { EditNote, PersonAddAlt, Save } from "@mui/icons-material";
import { Grid, Button, DialogActions, FormControlLabel, Checkbox, IconButton, Typography, TextField, CircularProgress } from "@mui/material";
import DialogsControl from 'src/@core/components/dialog-control';
import { saveData } from 'src/api/axios';

interface State {
  id?: string,
  name?: string,
  isDefault?: boolean,
}

const Form = ({ data, setPostSuccess, closeDialogs }: any) => {

  const [values, setValues] = useState<State>({
    id: data?.id || '',
    name: data?.name || '',
    isDefault: data?.isDefault || false,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues({ ...values, [prop]: value });
  };



  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const handleApiCall = async () => {

      setSaving(true)
      try {
        const res = await saveData('Role/save', values);
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
      id: '',
      name: '',
      isDefault: false,
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
          <FormControlLabel control={<Checkbox name='isDefault' checked={!!values?.isDefault} onChange={handleChange('isDefault')} />} label="Đặt là mặc định" />
        </Grid>
      </Grid>
      <DialogActions sx={{ p: 0 }}>
        <Button onClick={() => handleClose()} className='btn cancleBtn'>Hủy</Button>
        <Button type="submit" disabled={saving} className='btn saveBtn'> {saving ? <CircularProgress color='inherit' size={20} /> : <Save />} &nbsp; Lưu </Button>
      </DialogActions>
    </form>
  );
};

const FormRoles = ({ data, isEdit, setPostSuccess }: any) => {
  const formTitle = isEdit ? 'Thay đổi thông tin roles' : 'Thêm roles mới';

  return (
    <DialogsControl>
      {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => (
        <>
          {
            isEdit ?
              <EditNote className='tableActionBtn' onClick={() => openDialogs(<Form data={data} setPostSuccess={setPostSuccess} closeDialogs={closeDialogs} />, formTitle)} />
              :
              <IconButton className='addNewBtn' aria-label="add user" onClick={() => openDialogs(<Form setPostSuccess={setPostSuccess} closeDialogs={closeDialogs} />, formTitle)}>
                <PersonAddAlt sx={{ mr: 2 }} />
                <Typography>Thêm mới</Typography>
              </IconButton>
          }
        </>
      )}
    </DialogsControl>
  );
};

export default FormRoles;
