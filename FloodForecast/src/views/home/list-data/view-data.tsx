import React, { useEffect, useRef, useState } from 'react'
import { Assessment } from '@mui/icons-material'
import { Grid, IconButton, Paper, Tooltip } from '@mui/material'
import DialogsControlFullScreen from 'src/@core/components/dialog-control-full-screen'
import TableComponent, { TableColumn } from 'src/@core/components/table'
import ReactApexcharts from 'src/@core/components/react-apexcharts';
import { ApexOptions } from "apexcharts";
import { getData } from 'src/api/axios'
import dayjs from 'dayjs'
import apiUrl from 'src/api/config'

interface FormDataProps {
    data: any
}

const FormData: React.FC<FormDataProps> = (props: FormDataProps) => {

    const { data } = props;

    const [wl_data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [predictData, setPredictData] = useState<any>({ water_level: [], water_level_predict: [], date: [] });

    const isMounted = useRef(true);

    const getDataStations = async () => {
        try {
            setLoading(true);
            const fetch_data = await getData(`WaterLevelData/${data.id}/${dayjs(new Date("2020-1-1")).format("YYYY-MM-DD")}/${dayjs(new Date("2022-12-31")).format("YYYY-MM-DD")}`);
            if (isMounted.current) {
                setData(fetch_data);
            }

            getWaterLevelPrediction()
                .then(data => {

                    // Make a copy of the water_level array
                    const modifiedWaterLevel = [...data.water_level];

                    // Check if the array has at least two elements
                    if (modifiedWaterLevel.length >= 3) {
                        // Set the last two elements to null
                        modifiedWaterLevel[modifiedWaterLevel.length - 1] = null;
                        modifiedWaterLevel[modifiedWaterLevel.length - 2] = null;
                        modifiedWaterLevel[modifiedWaterLevel.length - 3] = null;
                    }
                    setPredictData({
                        water_level: modifiedWaterLevel.slice(-180),
                        water_level_predict: data.water_level_predict.slice(-180),
                        date: data.dates.slice(-180).map((entry: { date: any }) => dayjs(entry.date).format('DD-MM-YYYY'))
                    })
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    async function getWaterLevelPrediction() {
        const response = await fetch(`${apiUrl}/FloodForecast/predict/${data.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Dữ liệu bạn muốn gửi, nếu có
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        return response.json(); // or await response.json() if you want to wait for the data
    }

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
            categories: predictData.date,
            title: {
                text: 'Ngày'
            }
        },
        yaxis: {
            title: {
                text: 'Mực nước(cm)'
            },
            labels: {
                formatter: (value) => { return value.toFixed(2) }
            }
        },
        colors: ['#0077df', '#f00'],

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
            data: predictData.water_level
        },
        {
            name: "Mực nước dự báo",
            data: predictData.water_level_predict
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
