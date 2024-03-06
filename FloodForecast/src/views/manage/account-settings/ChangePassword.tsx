import DialogsControl from 'src/@core/components/dialog-control';
import { LockOpen, Save } from "@mui/icons-material";
import { Grid, Button, TextField, DialogActions, CircularProgress, Box, Alert } from "@mui/material";
import { useState } from 'react';
import { saveData } from 'src/api/axios';

const Form = ({ closeDialogs }: any) => {

  const [currPassword, setCurrPassword] = useState<any>(null);
  const [newPassword, setNewPassword] = useState<any>(null);
  const [confirmPassword, setConfirmPassword] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleChangePassWord = async (e: any) => {
    e.preventDefault();

    setSaving(true)
    if (newPassword === confirmPassword) {
      try {
        const res = await saveData('Auth/change-password', {
          currentPassword: currPassword,
          newPassword: newPassword,
          newConfirmPassword: confirmPassword
        });

        if (res.succeeded) {
          closeDialogs();
        }
        setError(error.response.data);
      } catch (error) {
        console.error(error);
      }
      setSaving(false)
    } else {
      console.log("Mật khẩu xác nhận phải giống mật khẩu mới");
    }
  };

  const handleClose = () => {
    closeDialogs();
  }

  return (
    <form onSubmit={handleChangePassWord}>
      <Grid container>
        <Grid item xs={12} md={12} sx={{ my: 3 }}>
          <TextField size='small' type='password' fullWidth label='Mật khẩu cũ' placeholder='' defaultValue='' onChange={(e) => setCurrPassword(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={12} sx={{ my: 3 }}>
          <TextField size='small' type='password' fullWidth label='Mật khẩu mới' placeholder='' defaultValue='' onChange={(e) => setNewPassword(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={12} sx={{ my: 3 }}>
          <TextField size='small' type='password' fullWidth label='Xác nhận mật khẩu' placeholder='' defaultValue='' onChange={(e) => setConfirmPassword(e.target.value)} />
        </Grid>
        {newPassword !== confirmPassword ? (<Box sx={{ mb: 3 }}> <Alert sx={{ py: 0.5 }} severity="error">Mật khẩu xác nhận không chính xác!</Alert></Box>) : ""}
      </Grid>
      <DialogActions sx={{ p: 0 }}>
        <Button onClick={() => handleClose()} className='btn cancleBtn'>Hủy</Button>
        <Button type="submit" disabled={saving || newPassword !== confirmPassword} className='btn saveBtn'> {saving ? <CircularProgress color='inherit' size={20} /> : <Save />} &nbsp; Lưu </Button>
      </DialogActions>
    </form>
  );
};

const ChangePassword = () => {
  const formTitle = 'Thay đổi mật khẩu';

  return (
    <DialogsControl>
      {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => (
        <Button variant='outlined' className='btn' style={{ display: 'flex', alignItems: 'center' }} onClick={() => openDialogs(<Form closeDialogs={closeDialogs} />, formTitle)}>
          <LockOpen sx={{ marginRight: 2 }} />
          Đổi mật khẩu
        </ Button>
      )}
    </DialogsControl>
  );
};

export default ChangePassword;
