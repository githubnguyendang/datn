import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Toolbar } from '@mui/material';
import FormWaterLevelDatas from './form';
import DeleteData from 'src/@core/components/delete-data';
import { getData } from 'src/api/axios';
import TableComponent, { TableColumn } from 'src/@core/components/table';
import dayjs from 'dayjs';

const WaterLevelData = () => {
    const [resData, setResData] = useState([]);
    const [postSuccess, setPostSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePostSuccess = () => {
        setPostSuccess(prevState => !prevState);
    };

    //Init columnTable
    const columnsTable: TableColumn[] = [
        { id: 'stt', align: 'center', label: 'STT', minWidth: 90, rowspan: 2 },
        { id: 'station_name', align: 'center', label: 'Trạm', minWidth: 150, rowspan: 2 },
        { id: 'date', align: 'center', label: 'Ngày', minWidth: 150, rowspan: 2, elm: (e: any) => (dayjs(e.date).format("DD/MM/YYYY")) },
        {
            id: '#', align: 'center', label: 'Dữ liệu thực đo', minWidth: 150, children: [
                { id: 'water_level', align: 'center', label: 'Mực nước' },
                { id: 'amount_rain', align: 'center', label: 'Lượng mưa' }
            ]
        },

        //Action
        {
            id: 'actions', align: 'center', label: 'Thao tác', minWidth: 120, rowspan: 2
        },
    ];

    useEffect(() => {
        const getDataWaterLevelData = async () => {
            try {
                setLoading(true);
                const data = await getData(`WaterLevelData/1/${dayjs(new Date("2020-1-1")).format("YYYY-MM-DD")}/${dayjs(new Date()).format("YYYY-MM-DD")}`);
                setResData(data);
            } catch (error) {
                setResData([]);
            } finally {
                setLoading(false);
            }
        };
        getDataWaterLevelData();
    }, [postSuccess]);

    return (
        <Paper elevation={3} sx={{ py: 5, px: 15 }}>
            <Toolbar variant="dense">
                <Grid container justifyContent={'end'} >
                    <Grid item>
                        <FormWaterLevelDatas setPostSuccess={handlePostSuccess} isEdit={false} />
                    </Grid>
                </Grid>
            </Toolbar>
            <TableComponent columns={columnsTable} rows={resData} loading={loading} rowperpage={25} pagination actions={(e: any) => (
                <Box>
                    <FormWaterLevelDatas isEdit={true} data={e} setPostSuccess={handlePostSuccess} />
                    <DeleteData url={'WaterLevelData'} data={e} setPostSuccess={handlePostSuccess} />
                </Box>
            )} />
        </Paper>
    );
};

export default WaterLevelData;
