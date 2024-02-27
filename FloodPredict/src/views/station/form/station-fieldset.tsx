import { Grid, TextField } from '@mui/material';
import React, { useState, ChangeEvent, useEffect } from 'react';

interface StationProps {
    data?: StationState; // Thêm prop data để truyền dữ liệu từ ngoài vào
    onChange: (data: StationState) => void;
}

interface StationState {
    id: number;
    name: string;
    x: number;
    y: number;
    alarm_level1: number;
    alarm_level2: number;
    alarm_level3: number;
}

const StationFieldset: React.FC<StationProps> = ({ data, onChange }) => {
    const [StationData, setStationData] = useState<StationState>({
        id: data?.id || 0,
        name: data?.name || '',
        x: data?.x || 0,
        y: data?.y || 0,
        alarm_level1: data?.alarm_level1 || 0,
        alarm_level2: data?.alarm_level2 || 0,
        alarm_level3: data?.alarm_level3 || 0,
    });

    // Sử dụng useEffect để cập nhật dữ liệu khi prop data thay đổi
    useEffect(() => {
        if (data) {
            setStationData(data);
        }
    }, [data]);

    const handleChange = (prop: keyof StationState) => (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setStationData({ ...StationData, [prop]: value });
        onChange({ ...StationData, [prop]: value });
    };

    return (
        <Grid container spacing={4} rowSpacing={1}>
            <Grid item xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField size='small' type='text' label='Tên trạm' fullWidth required placeholder='' defaultValue={StationData?.name} onChange={handleChange('name')} />
            </Grid>
            <Grid item xs={6} md={6} sm={6} sx={{ my: 2 }}>
                <TextField size='small' type='num' label='Tọa độ X(VN2000)' fullWidth required placeholder='' defaultValue={StationData?.x} onChange={handleChange('x')} />
            </Grid>
            <Grid item xs={6} md={6} sm={6} sx={{ my: 2 }}>
                <TextField size='small' type='text' label='Tọa độ Y(VN2000)' fullWidth required placeholder='' defaultValue={StationData?.y} onChange={handleChange('y')} />
            </Grid>
            <Grid item xs={4} md={4} sm={4} sx={{ my: 2 }}>
                <TextField size='small' type='text' label='Mực nước báo động mức I' fullWidth required placeholder='' defaultValue={StationData?.alarm_level1} onChange={handleChange('alarm_level1')} />
            </Grid>
            <Grid item xs={4} md={4} sm={4} sx={{ my: 2 }}>
                <TextField size='small' type='text' label='Mực nước báo động mức II' fullWidth required placeholder='' defaultValue={StationData?.alarm_level2} onChange={handleChange('alarm_level2')} />
            </Grid>
            <Grid item xs={4} md={4} sm={4} sx={{ my: 2 }}>
                <TextField size='small' type='text' label='Mực nước báo động mức III' fullWidth required placeholder='' defaultValue={StationData?.alarm_level3} onChange={handleChange('alarm_level3')} />
            </Grid>
        </Grid>

    );
};

export default StationFieldset;
