import React, { useEffect, useRef, useState } from 'react'
import { Assessment } from '@mui/icons-material'
import { Grid, IconButton, Paper, Tooltip } from '@mui/material'
import DialogsControlFullScreen from 'src/@core/components/dialog-control-full-screen'
import TableComponent, { TableColumn } from 'src/@core/components/table'
import ReactApexcharts from 'src/@core/components/react-apexcharts';
import { ApexOptions } from "apexcharts";
import { getData } from 'src/api/axios'
import dayjs from 'dayjs'

interface FormDataProps {
    data: any
}

const FormData: React.FC<FormDataProps> = (props: FormDataProps) => {

    const { data } = props;

    const [wl_data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wlData, setWlData] = useState({ water_level: [], date: [] });
    const isMounted = useRef(true);

    const getDataStations = async () => {
        try {
            setLoading(true);
            const fetch_data = await getData(`WaterLevelData/${data.id}/${dayjs(new Date("2020-1-1")).format("YYYY-MM-DD")}/${dayjs(new Date("2022-12-31")).format("YYYY-MM-DD")}`);
            if (isMounted.current) {
                setData(fetch_data);

                setWlData({
                    water_level: fetch_data.slice(0, 60).map((entry: { water_level: any }) => entry.water_level).reverse(),
                    date: fetch_data.slice(0, 60).map((entry: { date: any }) => dayjs(entry.date).format('DD-MM-YYYY')).reverse()
                });
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
    }, []);

    const tableColumn: TableColumn[] = [
        { id: 'stt', label: "STT", align: "center" },
        { id: 'date', label: "Ngày", elm: (e: any) => (dayjs(e.date).format("DD/MM/YYYY")) },
        { id: 'water_level', label: "Mực nước(cm)", align: "center" },
        { id: 'amount_rain', label: "Lượng mưa(mm)", align: "center" },
    ]

    //For chart


    const options: ApexOptions = {
        chart: {
            height: 450,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: [3]
        },
        legend: {
            show: true,
            position: "right",
            tooltipHoverFormatter: function (val: any, opts: any) {
                return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
            },
        },
        xaxis: {
            categories: wlData.date,
            title: {
                text: 'Ngày'
            }
        },
        yaxis: {
            title: {
                text: 'Mực nước(cm)'
            }
        },


        annotations: {
            yaxis: [
                {
                    y: data.alarm_level1,
                    strokeDashArray: 0,
                    borderColor: '#FEB019',
                    label: {
                        borderColor: '#FEB019',
                        style: {
                            color: '#fff',
                            background: '#FEB019',
                        },
                        text: 'MỨC BÁO ĐỘNG I)'
                    }
                },
                {
                    y: data.alarm_level2,
                    strokeDashArray: 0,
                    borderColor: '#F00FFF',
                    label: {
                        borderColor: '#F00FFF',
                        style: {
                            color: '#fff',
                            background: '#F00FFF'
                        },
                        text: 'MỨC BÁO ĐỘNG II'
                    }
                },
                {
                    y: data.alarm_level3,
                    strokeDashArray: 0,
                    borderColor: '#F00',
                    label: {
                        borderColor: '#F00',
                        style: {
                            color: '#fff',
                            background: '#F00'
                        },
                        text: 'MỨC BÁO ĐỘNG III'
                    }
                }
            ]
        },
        markers: {
            size: 0,
            hover: {
                sizeOffset: 6
            }
        },
        forecastDataPoints: {
            count: 3,
            strokeWidth: 5
        },

        colors: ['#008FFB'],
        tooltip: {
            enabled: true,
            onDatasetHover: {
                highlightDataSeries: true,
            },
            y: [
                {
                    title: {
                        formatter: function (val: any) {
                            return val;
                        }
                    }
                },
            ]
        },
    };

    const series = [
        {
            name: "Mực nước",
            data: wlData.water_level
        },
    ];


    return (
        <Grid container spacing={4}>
            <Grid item md={12}>
                <Paper sx={{ p: 3 }}>
                    Mực nước tại {data.name}
                </Paper>
            </Grid>
            <Grid item md={4}>
                <TableComponent columns={tableColumn} rows={wl_data} loading={loading} pagination rowperpage={25} />
            </Grid>
            <Grid item md={8}>
                <Paper>
                    <ReactApexcharts options={options} series={series} type="line" />
                </Paper>
            </Grid>
        </Grid>
    )
}

interface MonitoringSystemProps {
    data?: any
}

const ViewData: React.FC<MonitoringSystemProps> = ({ data }) => {
    const formTitle = 'Thông tin số liệu giám sát vận hành'

    return (
        <DialogsControlFullScreen>
            {(openDialogs: (content: React.ReactNode, title: React.ReactNode) => void) => (
                <>
                    {<Tooltip title='Xem chi tiết'>
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
