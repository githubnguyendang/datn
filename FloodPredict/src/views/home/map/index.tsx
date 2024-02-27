import { Paper, Typography } from "@mui/material"
import React, { useState } from 'react';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import("src/@core/components/map"), { ssr: false });

const HomeMap = (data: any) => {
    const [mapCenter] = useState([15.012172, 108.676488]);
    const [mapZoom] = useState(9);

    return (
        <Paper elevation={3} sx={{ position: 'relative', height: 'calc(100vh - 170px)' }}>
            <Paper elevation={3} sx={{ py: 0.5, BorderRadius: 0, textAlign: 'center' }}>
                <Typography variant='overline' sx={{ fontWeight: 'bold' }}>Bản đồ vị trí trạm</Typography>
            </Paper>
            <Map center={mapCenter} zoom={mapZoom} mapData={data.data} loading={false} />
        </Paper>
    )
}
export default HomeMap