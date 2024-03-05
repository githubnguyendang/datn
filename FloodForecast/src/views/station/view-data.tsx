import React, { useEffect, useRef, useState } from 'react'
import { Assessment } from '@mui/icons-material'
import { Box, Grid, IconButton, Paper, Tooltip } from '@mui/material'
import DialogsControlFullScreen from 'src/@core/components/dialog-control-full-screen'
import TableComponent, { TableColumn } from 'src/@core/components/table'
import { getData } from 'src/api/axios'
import DeleteData from 'src/@core/components/delete-data'
import FormWaterLevelData from '../water-level-data/form'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { checkAccessPermission } from 'src/@core/layouts/checkAccessPermission'

interface FormDataProps {
    data: any
}

const FormData: React.FC<FormDataProps> = (props: FormDataProps) => {

    const { data } = props;

    const [paramFilter, setParamFilter] = useState({ s_d: new Date("1970-1-1"), e_d: new Date() })
    const [wl_data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(true);
    const [postSuccess, setPostSuccess] = useState(false);
    const handlePostSuccess = () => {
        setPostSuccess(prevState => !prevState);
    };

    const [accessCreate, setAccessCreate] = useState(false);
    const [accessUpdate, setAccessUpdate] = useState(false)
    const [accessDelete, setAccessDelete] = useState(false)

    async function getAccess() {

        setAccessCreate(await checkAccessPermission('water-level-data', 'CREATE'));
        setAccessUpdate(await checkAccessPermission('water-level-data', 'EDIT'));
        setAccessDelete(await checkAccessPermission('water-level-data', 'DELETE'));
    }
    useEffect(() => {
        getAccess()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getDataStations = async () => {
        try {
            setLoading(true);
            const fetch_data = await getData(`WaterLevelData/${data.id}/${dayjs(paramFilter.s_d).format("YYYY-MM-DD")}/${dayjs(paramFilter.e_d).format("YYYY-MM-DD")}`);
            if (isMounted.current) {
                setData(fetch_data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        getDataStations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postSuccess, paramFilter]);

    const tableColumn: TableColumn[] = [
        { id: 'stt', label: "STT", align: "center" },
        { id: 'date', label: "Ngày", elm: (e: any) => (dayjs(e.date).format("DD/MM/YYYY")) },
        { id: 'water_level', label: "Mực nước(cm)", align: "center" },
        { id: 'amount_rain', label: "Lượng mưa(mm)", align: "center" },

        //Action
        { id: 'actions', align: 'center', label: 'Thao tác', minWidth: 120, rowspan: 2 },
    ]

    return (
        <Grid container spacing={4}>
            <Grid item md={12}>
                <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
                    Mực nước tại {data.name} - Tỉnh Quảng Ngãi

                    <Box display={'flex'}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dayjs(paramFilter.s_d)}
                                onChange={(s_d: any) => setParamFilter({ ...paramFilter, s_d: s_d })}
                                slotProps={{ textField: { size: 'small', fullWidth: true, sx: { px: 2 } } }}
                                label='Ngày'
                                format="DD/MM/YYYY" />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dayjs(paramFilter.e_d)}
                                onChange={(e_d: any) => setParamFilter({ ...paramFilter, e_d: e_d })}
                                slotProps={{ textField: { size: 'small', fullWidth: true, sx: { px: 2 } } }}
                                label='Ngày'
                                format="DD/MM/YYYY" />
                        </LocalizationProvider>
                        {accessCreate ? <FormWaterLevelData setPostSuccess={handlePostSuccess} station={data} isEdit={false} /> : null}
                    </Box>
                </Paper>
            </Grid>
            <Grid item md={12}>
                <TableComponent columns={tableColumn} rows={wl_data} loading={loading} pagination rowperpage={25}
                    actions={(e: any) => (
                        <Box>
                            {accessUpdate ? <FormWaterLevelData isEdit={true} data={e} station={data} setPostSuccess={handlePostSuccess} /> : null}
                            {accessDelete ? <DeleteData url={'WaterLevelData'} data={e} setPostSuccess={handlePostSuccess} /> : null}
                        </Box>
                    )} />
            </Grid>
        </Grid>
    )
}

interface ViewDataProps {
    data?: any
}

const ViewData: React.FC<ViewDataProps> = ({ data }) => {
    const formTitle = 'Thông tin số liệu thực đo'

    return (
        <DialogsControlFullScreen>
            {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void) => (
                <>
                    {<Tooltip title='Số liệu thực đo'>
                        <IconButton
                            onClick={() =>
                                openDialogs(
                                    <FormData data={data} />,
                                    formTitle
                                )
                            }
                        >
                            <Assessment className='tableActionBtn' />
                        </IconButton>
                    </Tooltip>
                    }
                </>
            )}
        </DialogsControlFullScreen>
    )
}

export default ViewData
