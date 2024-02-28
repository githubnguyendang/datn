import { Autocomplete, CircularProgress, Grid, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { getData } from 'src/api/axios';
import { useRouter } from 'next/router';

interface WaterLevelDataProps {
    data?: WaterLevelDataState; // Thêm prop data để truyền dữ liệu từ ngoài vào
    station?: any;
    onChange: (data: WaterLevelDataState) => void;
}

interface WaterLevelDataState {
    id: number;
    station_id: number;
    date: Dayjs | null;
    water_level: number;
    amount_rain: number;
}

const WaterLevelDataFieldset: React.FC<WaterLevelDataProps> = ({ data, station, onChange }) => {

    const [WaterLevelData, setWaterLevelData] = useState<WaterLevelDataState>({
        id: data?.id || 0,
        station_id: data?.station_id || station?.id || 0,
        date: dayjs(data?.date) || null,
        water_level: data?.water_level || 0,
        amount_rain: data?.amount_rain || 0,
    });

    const [fetching, setFetching] = useState(false);
    const [stations, setStation] = useState([]);

    const router = useRouter();

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
                        disabled={router.pathname === '/station'}
                        onChange={(st: any) => setWaterLevelData({ ...WaterLevelData, station_id: st.id })}
                        size="small"
                        options={stations}
                        getOptionLabel={(option: any) => option.name}
                        value={stations.find((option: any) => option.id === WaterLevelData.station_id) || null}
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
