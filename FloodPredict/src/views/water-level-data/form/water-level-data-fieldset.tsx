import { Autocomplete, CircularProgress, Grid, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { getData } from 'src/api/axios';

interface WaterLevelDataProps {
    data?: WaterLevelDataState; // Thêm prop data để truyền dữ liệu từ ngoài vào
    onChange: (data: WaterLevelDataState) => void;
}

interface WaterLevelDataState {
    id: number;
    station_id: number;
    date: Dayjs | null;
    water_level: number;
    amount_rain: number;
}

const WaterLevelDataFieldset: React.FC<WaterLevelDataProps> = ({ data, onChange }) => {
    const [WaterLevelData, setWaterLevelData] = useState<WaterLevelDataState>({
        id: data?.id || 0,
        station_id: data?.station_id || 0,
        date: dayjs(data?.date) || null,
        water_level: data?.water_level || 0,
        amount_rain: data?.amount_rain || 0,
    });

    const [fetching, setFetching] = useState(false);
    const [station, setStation] = useState([]);

    // Sử dụng useEffect để cập nhật dữ liệu khi prop data thay đổi
    useEffect(() => {
        if (data) {
            setWaterLevelData(data);
        }
    }, [data]);

    const handleChange = (prop: keyof WaterLevelDataState) => (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setWaterLevelData({ ...WaterLevelData, [prop]: value });
        onChange({ ...WaterLevelData, [prop]: value });
    };

    useEffect(() => {
        const getDataStation = async () => {
            try {
                setFetching(true);
                const data = await getData('Station/list');
                setStation(data);
            } catch (error) {
                setStation([]);
            } finally {
                setFetching(false);
            }
        };
        getDataStation();
    }, []);

    return (
        <Grid container spacing={4} rowSpacing={1}>
            <Grid item xs={6} md={6} sm={6} sx={{ my: 2 }}>
                {fetching ? (
                    <CircularProgress size={20} />
                ) : (
                    <Autocomplete
                        onChange={(st: any) => setWaterLevelData({ ...WaterLevelData, station_id: st.id })}
                        size="small"
                        options={station}
                        getOptionLabel={(option: any) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label="Chọn trạm"
                            />
                        )}
                    />
                )}
            </Grid>
            <Grid item xs={6} md={6} sm={6} sx={{ my: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={dayjs(WaterLevelData.date)}
                        onChange={(newdate: any) => handleChange('date')(newdate.toDate())}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        label='Ngày'
                        format="DD/MM/YYYY" />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={6} md={6} sm={6} sx={{ my: 2 }}>
                <TextField size='small' type='text' label='Mực nước(cm)' fullWidth required placeholder='' defaultValue={WaterLevelData?.water_level} onChange={handleChange('water_level')} />
            </Grid>
            <Grid item xs={6} md={6} sm={6} sx={{ my: 2 }}>
                <TextField size='small' type='text' label='Lượng mưa(mm)' fullWidth required placeholder='' defaultValue={WaterLevelData?.amount_rain} onChange={handleChange('amount_rain')} />
            </Grid>
        </Grid>

    );
};

export default WaterLevelDataFieldset;
