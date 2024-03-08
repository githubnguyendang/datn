import React, { useState } from 'react';
import { Add, EditNote, Save } from '@mui/icons-material';
import { Button, CircularProgress, DialogActions, Grid, IconButton } from '@mui/material';
import DialogsControl from 'src/@core/components/dialog-control';
import { saveData } from 'src/api/axios';
import WaterLevelDataFieldset from './water-level-data-fieldset';

interface FormProps {
    data: any;
    station: any;
    closeDialogs: () => void;
    setPostSuccess?: (value: boolean) => void;
}

const Form: React.FC<FormProps> = ({ data, station, closeDialogs, setPostSuccess }) => {

    //WaterLevelData
    const [WaterLevelDataData, setWaterLevelDataData] = useState<any>(data);
    const [saving, setSaving] = useState(false);

    const handleWaterLevelDataChange = (data: any) => {
        setWaterLevelDataData(data);
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const handleApiCall = async () => {
            try {
                setSaving(true)
                const res = await saveData('WaterLevelData/save', WaterLevelDataData);
                if (res) {
                    // Reset form fields
                    setWaterLevelDataData({});
                    typeof (setPostSuccess) === 'function' ? setPostSuccess(true) : '';
                }
            } catch (error) {
            } finally {
                setSaving(false)
                closeDialogs();
            }
        };

        // Call the function
        handleApiCall();
    };

    const handleClose = () => {
        closeDialogs();
    };

    return (
        <form>
            <Grid container gap={3}>
                <Grid item xs={12}>
                    <WaterLevelDataFieldset data={data} station={station} onChange={handleWaterLevelDataChange} />
                </Grid>
            </Grid>

            <DialogActions sx={{ p: 0, mt: 5 }}>
                <Button size='small' onClick={handleClose} className='btn cancleBtn'> Hủy </Button>
                <Button onClick={handleSubmit} disabled={saving} className='btn saveBtn'> {saving ? <CircularProgress color='inherit' size={20} /> : <Save />} &nbsp; Lưu </Button>
            </DialogActions>
        </form>
    );
};

interface FormWaterLevelDataProps {
    isEdit: boolean;
    data?: any;
    station?: any;
    setPostSuccess?: (value: boolean) => void;
}

const FormWaterLevelData: React.FC<FormWaterLevelDataProps> = ({ isEdit, data, station, setPostSuccess }) => {
    const formTitle = isEdit ? 'Sửa thông tin dữ liệu thực đo' : 'Thêm mới thông tin dữ liệu thực đo';

    return (
        <DialogsControl>
            {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void, closeDialogs: () => void) => (
                <>
                    {isEdit ? (
                        <IconButton onClick={
                            () =>
                                openDialogs(<Form data={data} station={station} closeDialogs={closeDialogs} setPostSuccess={setPostSuccess} />, formTitle)
                        }>
                            < EditNote
                                className='tableActionBtn'

                            />
                        </IconButton>
                    ) : (
                        <Button
                            sx={{ width: '-webkit-fill-available' }}
                            size="small"
                            startIcon={<Add />}
                            onClick={() =>
                                openDialogs(<Form data={data} station={station} closeDialogs={closeDialogs} setPostSuccess={setPostSuccess} />, formTitle)
                            }
                        >
                            Thêm mới
                        </Button>
                    )}
                </>
            )
            }
        </DialogsControl >
    );
};

export default FormWaterLevelData;
