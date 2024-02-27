import React, { ChangeEvent, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { getData, saveData } from 'src/api/axios';
import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import ChangePassword from '../account-settings/ChangePassword';

interface DecodedToken {
    [key: string]: any;
}

interface State {
    id?: string,
    userName?: string,
    fullName: string,
    email: string,
    phoneNumber: string,
}

const UserInfo = () => {
    const [user, setUser] = useState<State>({
        id: '',
        userName: '',
        fullName: '',
        email: '',
        phoneNumber: ''
    })

    const [saving, setSaving] = useState(false);

    const getUser = async () => {
        if (typeof sessionStorage !== 'undefined') {

            const token = sessionStorage.getItem('authToken') || '';

            if (token) {
                const decodedToken = jwt_decode(token) as DecodedToken;

                const user = await getData(`User/${decodedToken.id}`)
                setUser(user);
            }
        }
    }

    useEffect(() => {
        getUser()
    }, []);

    const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setUser({ ...user, [prop]: value });
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const handleApiCall = async () => {
            setSaving(true)
            try {
                const res = await saveData('User/save', user);
                if (res) {
                    // Reset form fields
                    getUser();
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


    return (
        <Box width={'100%'} height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Box style={{ width: '50%' }}>
                <Typography variant={'h5'} textTransform={'uppercase'} textAlign={'center'}>
                    Thông tin tài khoản
                </Typography>

                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Grid item xs={12} md={12} sx={{ my: 3 }}>
                            <TextField size='medium' type='text' fullWidth sx={{ my: 3 }} label='Tài khoản' placeholder='' value={user?.userName || ''} onChange={handleChange('userName')} />
                        </Grid>
                        <Grid item xs={12} md={12} sx={{ my: 3 }}>
                            <TextField size='medium' type='text' fullWidth label='Họ tên' placeholder='' value={user?.fullName || ''} onChange={handleChange('fullName')} />
                        </Grid>
                        <Grid item xs={12} md={12} sx={{ my: 3 }}>
                            <TextField size='medium' type='email' fullWidth label='Email' placeholder='' value={user?.email || ''} onChange={handleChange('email')} />
                        </Grid>
                        <Grid item xs={12} md={12} sx={{ my: 3 }}>
                            <TextField size='medium' type='text' fullWidth label='Số điện thoại' placeholder='' value={user?.phoneNumber || ''} onChange={handleChange('phoneNumber')} />
                        </Grid>
                    </Grid >
                    <Grid item xs={12} md={12} display={'flex'} justifyContent={'end'} >
                        <ChangePassword />
                        &nbsp;
                        <Button onClick={handleSubmit} disabled={saving} className='btn saveBtn'> {saving ? <CircularProgress color='inherit' size={20} /> : <Save />} &nbsp; Lưu </Button>
                    </Grid>
                </Grid >
            </Box >
        </Box>
    );
};

export default UserInfo;
