import React, { useState } from 'react';
import { Button, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dynamic from 'next/dynamic';
import proj4 from 'proj4';

const Map = dynamic(() => import("src/@core/components/map"), { ssr: false });

const Construction = () => {

    const [mapCenter,] = useState([15.012172, 108.676488]);
    const [mapZoom,] = useState(9);
    const [coodinate, setCoodinate] = useState({ x: 0, y: 0 });

    const [data, SetData] = useState<any>([
        {
            loaiCT: { maLoaiCT: 4 },
            x: 0,
            y: 0
        }
    ])

    const N_DEC_WGS84 = 8;

    const converter = (x: any, y: any) => {
        proj4.defs('VN2000_QUANG_NGAI', '+proj=tmerc +lat_0=0 +lon_0=108.000 +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,-0.00928836,0.01975479,-0.00427372,0.252906278 +units=m +no_defs');

        const proj4Src: any = proj4.defs('VN2000_QUANG_NGAI');
        const proj4Dest: any = proj4.defs('EPSG:4326');

        const toMeterSrc: any = proj4Src ? proj4Src.units?.to_meter || 1 : 1;
        const toMeterDest: any = proj4Dest ? proj4Dest.units?.to_meter || 1 : 1;
        const xVal = x / toMeterSrc;
        const yVal = y / toMeterSrc;

        const pj = proj4.toPoint([xVal, yVal]);
        const result: any = proj4(proj4Src, proj4Dest).forward(pj);
        result.x *= toMeterDest.toFixed(N_DEC_WGS84);
        result.y *= toMeterDest.toFixed(N_DEC_WGS84);

        return result;
    }

    const handleConvert = () => {
        const xy = converter(coodinate.x, coodinate.y)
        console.log(xy);
        SetData(
            [
                {
                    loaiCT: { maLoaiCT: 4 },
                    x: coodinate.x,
                    y: coodinate.y
                }
            ]
        )
    }

    const handleChange = (prop: any) => (value: any) => {
        setCoodinate({ ...coodinate, [prop]: value })
    }

    return (

        <Grid container spacing={4}>
            <Grid xs={12} md={3} sm={12} sx={{ my: 2 }}>
                <TextField
                    size='small'
                    type='text'
                    fullWidth
                    placeholder=''
                    label='X (VN2000)'
                    value={coodinate.x}
                    onChange={(e) => handleChange('x')(e.target.value)}
                />
            </Grid>
            <Grid xs={12} md={3} sm={12} sx={{ my: 2 }}>
                <TextField
                    size='small'
                    type='text'
                    fullWidth
                    placeholder=''
                    label='Y (VN2000)'
                    value={coodinate.y}
                    onChange={(e) => handleChange('y')(e.target.value)}
                />
            </Grid>
            <Grid sx={{ my: 2 }}>
                <Button variant='outlined' size='small' onClick={handleConvert}>Convert</Button>
            </Grid>
            <Grid xs={12} md={12} sx={{ height: 'calc(100vh - 82px)', overflow: 'hidden' }}>
                <Paper elevation={3} sx={{ height: '100%', position: 'relative' }}>
                    <Map center={mapCenter} zoom={mapZoom} mapData={data} mapMarkerData={data} />
                </Paper>
            </Grid>
        </Grid>

    );
};

export default Construction;
