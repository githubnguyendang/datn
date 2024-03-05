import React, { useEffect, useState } from 'react'
import { Assessment, BatchPrediction } from '@mui/icons-material'
import { Button, Grid, IconButton, Paper, TextField, Tooltip } from '@mui/material'
import DialogsControlFullScreen from 'src/@core/components/dialog-control-full-screen'
import TableComponent, { TableColumn } from 'src/@core/components/table'
import ReactApexcharts from 'src/@core/components/react-apexcharts';
import { ApexOptions } from "apexcharts";
import { getWaterLevelPrediction } from 'src/api/axios'
import dayjs from 'dayjs'
import ForecastNewsletter from '../forecast-newsletter'

interface ForceastAndReportProps {
    data: any
}

const ForceastAndReport: React.FC<ForceastAndReportProps> = (props: ForceastAndReportProps) => {

    const { data } = props;

    const [predictData, setPredictData] = useState<any>({ water_level: [], water_level_predict: [], date: [], data: [] });
    const [amount_rain, setAmountRain] = useState<any>(0);
    const [resetData, setResetData] = useState(false);
    const [dataUri, setDataUri] = useState('');

    const getDataAndPredict = async () => {
        try {
            getWaterLevelPrediction(data.id, amount_rain)
                .then(data => {
                    setPredictData({
                        water_level: data.water_level,
                        water_level_predict: data.water_level_predict,
                        date: data.dates.map((date: any) => dayjs(date).format("DD/MM/YYYY")),
                        data: data.data
                    })
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } catch (error) {
            console.error(error);
        } finally {
        }
    };

    useEffect(() => {
        getDataAndPredict();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetData]);

    const tableColumn: TableColumn[] = [
        { id: 'stt', label: "STT", align: "center" },
        { id: 'date', label: "Ngày", elm: (e: any) => (dayjs(e.date).format("DD/MM/YYYY")) },
        { id: 'water_level', label: "Mực nước(cm)", align: "center" },
        { id: 'amount_rain', label: "Lượng mưa(mm)", align: "center" },
    ]

    const GetChartURI = () => {
        setTimeout(() => {
            // Dynamically import ApexCharts
            import("apexcharts").then(({ default: ApexCharts }) => {
                if (ApexCharts && typeof ApexCharts.exec === 'function') {
                    ApexCharts.exec("#water_level_chart", "dataURI")?.then(({ imgURI }: any) => {
                        setDataUri(imgURI);
                    }).catch((error: any) => {
                        console.error("Error generating chart image:", error);
                    });
                }
            });
        }, 2000);
    }

    //For chart

    const options: ApexOptions = {
        chart: {
            height: 450,
            id: "#water_level_chart",
            type: 'line',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: -15,
            formatter: function (val: any, opt: any) {
                const data = opt.w.config.series[0].data
                if (opt.dataPointIndex === data.length - 1 && val !== null) {
                    return val;
                }

                return ''
            }
        },
        stroke: {
            curve: 'smooth',
            width: [3]
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
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
                formatter: (value) => { return value?.toFixed(2) }
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
            count: 1,
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

    console.log(resetData)

    return (
        <Grid container spacing={4}>
            <Grid item md={12}>
                <Paper sx={{ p: 3 }}>
                    Mực nước tại {data.name} - Tỉnh Quảng Ngãi
                </Paper>
            </Grid>
            <Grid item md={4}>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField size='small' label='Lượng mưa' type='number' value={amount_rain} onChange={(e) => {
                            const regex = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;
                            if (e.target.value === "" || regex.test(e.target.value)) {
                                setAmountRain(e.target.value);
                            }
                        }} />
                    </Grid>
                    <Grid item>
                        <Button variant='outlined' sx={{ mx: 2 }} startIcon={<BatchPrediction />} onClick={() => {
                            GetChartURI();
                            setResetData(!resetData);
                        }}>Dự báo</Button>
                    </Grid>
                    <Grid item>
                        <ForecastNewsletter data={{
                            station: data,
                            date: predictData?.date.slice(-1)[0],
                            water_level_prediction: predictData?.water_level_predict.slice(-1)[0],
                            amount_rain: amount_rain,
                            chartURL: dataUri,
                        }} />
                    </Grid>
                    <Grid item md={12}>
                        <TableComponent columns={tableColumn} rows={predictData.data} loading={false} pagination rowperpage={25} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={8}>
                <Paper>
                    <ReactApexcharts options={options} series={series} type="line" id="#water_level_chart" />
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
                                    <ForceastAndReport data={data} />,
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
