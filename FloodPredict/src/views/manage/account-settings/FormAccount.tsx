import { useState, ChangeEvent, MouseEvent } from 'react';
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { EditNote, PersonAddAlt, Save } from "@mui/icons-material";
import { Grid, Button, DialogActions, IconButton, Typography, FormControl, InputAdornment, TextField, CircularProgress } from "@mui/material";
import DialogsControl from 'src/@core/components/dialog-control';
import { saveData } from 'src/api/axios';


interface State {
  id?: string,
  userName?: string,
  password?: string,
  confirmPassword?: string,
  fullName: string,
  email: string,
  phoneNumber: string,
}

const Form = ({ data, setPostSuccess, isEdit, closeDialogs }: any) => {

  const [values, setValues] = useState<State>({
    id: data?.id || '',
    userName: data?.userName || '',
    password: data?.password || '',
    confirmPassword: data?.confirmPassword || '',
    fullName: data?.fullName || '',
    email: data?.email || '',
    phoneNumber: data?.phoneNumber || '',
  });

  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false);

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues({ ...values, [prop]: value });
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const handleApiCall = async () => {
      setSaving(true)
      try {
        const res = await saveData('User/save', values);
        if (res) {
          // Reset form fields
          setValues({
            id: '',
            userName: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            email: '',
            phoneNumber: '',
          });

          typeof (setPostSuccess) === 'function' ? setPostSuccess(true) : '';
          closeDialogs();
        }
      } catch (error) {
        console.log(error)
      } finally {
        6
        setSaving(false)
      }
    };

    // Call the function
    handleApiCall();
  };

  const handleClose = () => {
    setValues({
      id: '',
      userName: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: '',
      phoneNumber: '',
    });

    closeDialogs();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        {isEdit ?
          '' :
          <Grid item xs={12} md={12}>
            <TextField size='small' type='text' fullWidth sx={{ my: 3 }} label='Tài khoản' placeholder='' value={values?.userName} onChange={handleChange('userName')} />
            <FormControl fullWidth sx={{ my: 3 }}>
              <TextField
                label='Mật khẩu'
                size='small'
                value={values.password}
                onChange={handleChange('password')}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            <FormControl fullWidth sx={{ my: 3 }}>
              <TextField
                label='Nhập lại mật khẩu'
                size='small'
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                type={showPassword ? 'text' : 'confirmPassword'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </Grid>
        }
        <Grid item xs={12} md={12} sx={{ my: 3 }}>
          <TextField size='small' type='text' fullWidth label='Họ tên' placeholder='' value={values?.fullName} onChange={handleChange('fullName')} />
        </Grid>
        <Grid item xs={12} md={12} sx={{ my: 3 }}>
          <TextField size='small' type='email' fullWidth label='Email' placeholder='' value={values?.email} onChange={handleChange('email')} />
        </Grid>
        <Grid item xs={12} md={12} sx={{ my: 3 }}>
          <TextField size='small' type='text' fullWidth label='Số điện thoại' placeholder='' value={values?.phoneNumber} onChange={handleChange('phoneNumber')} />
        </Grid>
      </Grid>
      <DialogActions sx={{ p: 0 }}>
        <Button onClick={() => handleClose()} className='btn cancleBtn'>Hủy</Button>
        <Button type="submit" disabled={saving} className='btn saveBtn'> {saving ? <CircularProgress color='inherit' size={20} /> : <Save />} &nbsp; Lưu </Button>
      </DialogActions>
    </form>
  );
};

const FormAccount = ({ data, setPostSuccess, isEdit }: any) => {
  const formTitle = isEdit ? 'Thay đổi thông tin tài khoản' : 'Thêm tài khoản mới';

  return (
    <DialogsControl>
      {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => (
        <>
          {
            isEdit ?
              <EditNote className='tableActionBtn' onClick={() => openDialogs(<Form data={data} setPostSuccess={setPostSuccess} isEdit={isEdit} closeDialogs={closeDialogs} />, formTitle)} />
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

export default FormAccount;
