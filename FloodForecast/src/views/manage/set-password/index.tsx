import DialogsControl from 'src/@core/components/dialog-control';
import { LockOpen } from "@mui/icons-material";
import { Grid, Button, TextField, DialogActions } from "@mui/material";
import { useState } from 'react';
import { saveData } from 'src/api/axios';

const Form = ({ user, setPostSuccess, closeDialogs }: any) => {

    const [newPassword, setNewPassword] = useState<any>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const res = await saveData('Auth/set-password', {
                user: user,
                newPassword: newPassword,
            });

            if (res) {
                typeof (setPostSuccess) === 'function' ? setPostSuccess(true) : '';
                closeDialogs();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        closeDialogs();
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={12} md={12} sx={{ my: 3 }}>
                    <TextField size='small' type='text' disabled fullWidth label='Họ Tên' placeholder='' value={user.fullName} />
                </Grid>
                <Grid item xs={12} md={12} sx={{ my: 3 }}>
                    <TextField size='small' type='text' disabled fullWidth label='Tài khoản' placeholder='' value={user.userName} />
                </Grid>
                <Grid item xs={12} md={12} sx={{ my: 3 }}>
                    <TextField size='small' type='password' fullWidth label='Mật khẩu mới' placeholder='' defaultValue='' onChange={(e) => setNewPassword(e.target.value)} />
                </Grid>
            </Grid>
            <DialogActions sx={{ p: 0 }}>
                <Button onClick={() => handleClose()} className='btn cancleBtn'>Hủy</Button>
                <Button type="submit" className='btn saveBtn'>Lưu</Button>
            </DialogActions>
        </form>
    );
};

const ChangePassword = ({ user, setPostSuccess }: any) => {
    const formTitle = 'Đặt lại mật khẩu';

    return (
        <DialogsControl>
            {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => (
                <>
                    <LockOpen className='tableActionBtn' sx={{ marginRight: 2 }} onClick={() => openDialogs(<Form user={user} setPostSuccess={setPostSuccess} closeDialogs={closeDialogs} />, formTitle)} />
                </>
            )}
        </DialogsControl>
    );
};

export default ChangePassword;
