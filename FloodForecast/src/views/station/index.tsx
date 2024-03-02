import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, TextField, Toolbar } from '@mui/material';
import FormStations from './form';
import DeleteData from 'src/@core/components/delete-data';
import { getData } from 'src/api/axios';
import TableComponent, { TableColumn } from 'src/@core/components/table';
import ViewData from './view-data';
import { useRouter } from 'next/router';
import { checkAccessPermission } from 'src/@core/layouts/checkAccessPermission';

const Station = () => {
    const [resData, setResData] = useState([]);
    const [postSuccess, setPostSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const routePath = router.pathname;
    const routeSegment = routePath.split('/')[1];

    const [accessCreate, setAccessCreate] = useState(false);
    const [accessUpdate, setAccessUpdate] = useState(false)
    const [accessDelete, setAccessDelete] = useState(false)
    const [accessViewData, setAccessViewData] = useState(false)

    async function getAccess() {
        setAccessCreate(await checkAccessPermission(routeSegment, 'CREATE'));
        setAccessUpdate(await checkAccessPermission(routeSegment, 'EDIT'));
        setAccessDelete(await checkAccessPermission(routeSegment, 'DELETE'));
        setAccessViewData(await checkAccessPermission('water-level-data', 'VIEW'));
    }

    useEffect(() => {
        getAccess()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePostSuccess = () => {
        setPostSuccess(prevState => !prevState);
    };

    //Init columnTable
    const columnsTable: TableColumn[] = [
        { id: 'id', align: 'center', label: 'ID', minWidth: 90, rowspan: 2 },
        { id: 'name', align: 'center', label: 'Tên trạm', minWidth: 150, rowspan: 2 },
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
        { id: 'actions', align: 'center', label: 'Thao tác', minWidth: 120, rowspan: 2 },
    ];

    const [paramFilter, setParamFilter] = useState({
        station_name: ''
    });

    useEffect(() => {
        const getDataStation = async () => {
            try {
                setLoading(true);
                const data = await getData('Station/list', paramFilter);
                setResData(data);
            } catch (error) {
                setResData([]);
            } finally {
                setLoading(false);
            }
        };
        getDataStation();
    }, [paramFilter, postSuccess]);

    return (
        <Paper elevation={3} sx={{ py: 5, px: 15 }}>
            <Toolbar variant="dense">
                <Grid container justifyContent={'end'} >
                    <Grid item>
                        <TextField
                            sx={{ p: 0 }}
                            size="small"
                            fullWidth
                            variant="outlined"
                            placeholder="Tên trạm..."
                            onChange={(e: any) => setParamFilter({ ...paramFilter, station_name: e.target.value })}
                        />
                    </Grid>
                    <Grid item>
                        {accessCreate ? <FormStations setPostSuccess={handlePostSuccess} isEdit={false} /> : null}

                    </Grid>
                </Grid>
            </Toolbar>
            <TableComponent columns={columnsTable} rows={resData} loading={loading} actions={(e: any) => (
                <Box display={'flex'}>
                    {accessViewData ? <ViewData data={e} /> : null}
                    {accessUpdate ? <FormStations isEdit={true} data={e} setPostSuccess={handlePostSuccess} /> : null}
                    {accessDelete ? <DeleteData url={'Station'} data={e} setPostSuccess={handlePostSuccess} /> : null}
                </Box>
            )} />
        </Paper>
    );
};

export default Station;
