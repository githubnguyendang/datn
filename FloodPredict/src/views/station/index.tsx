import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Toolbar } from '@mui/material';
import FormStations from './form';
import DeleteData from 'src/@core/components/delete-data';
import { getData } from 'src/api/axios';
import TableComponent, { TableColumn } from 'src/@core/components/table';

const Station = () => {
    const [resData, setResData] = useState([]);
    const [postSuccess, setPostSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePostSuccess = () => {
        setPostSuccess(prevState => !prevState);
    };

    //Init columnTable
    const columnsTable: TableColumn[] = [
        { id: 'id', align: 'center', label: 'ID', minWidth: 90, rowspan: 2 },
        { id: 'name', align: 'center', label: 'Tên lưu vực', minWidth: 150, rowspan: 2 },
        {
            id: '#', align: 'center', label: 'Tọa độ', minWidth: 150, children: [
                { id: 'x', align: 'center', label: 'X' },
                { id: 'y', align: 'center', label: 'Y' }
            ]
        },
        {
            id: '#', align: 'center', label: 'Mực nước báo động', minWidth: 150, children: [
                { id: 'alarm_level1', align: 'center', label: 'Mức 1' },
                { id: 'alarm_level2', align: 'center', label: 'Mức 2' },
                { id: 'alarm_level3', align: 'center', label: 'Mức 3' }
            ]
        },

        //Action
        {
            id: 'actions', align: 'center', label: 'Thao tác', minWidth: 120, rowspan: 2
        },
    ];

    useEffect(() => {
        const getDataStation = async () => {
            try {
                setLoading(true);
                const data = await getData('Station/list');
                setResData(data);
            } catch (error) {
                setResData([]);
            } finally {
                setLoading(false);
            }
        };
        getDataStation();
    }, [postSuccess]);

    return (
        <Paper elevation={3} sx={{ py: 5, px: 15 }}>
            <Toolbar variant="dense">
                <Grid container justifyContent={'end'} >
                    <Grid item>
                        <FormStations setPostSuccess={handlePostSuccess} isEdit={false} />
                    </Grid>
                </Grid>
            </Toolbar>
            <TableComponent columns={columnsTable} rows={resData} loading={loading} actions={(e: any) => (
                <Box>
                    <FormStations isEdit={true} data={e} setPostSuccess={handlePostSuccess} />
                    <DeleteData url={'LuuVucSong'} data={e} setPostSuccess={handlePostSuccess} />
                </Box>
            )} />
        </Paper>
    );
};

export default Station;
