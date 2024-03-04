import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import RealTime from './real-time';
import HomeMap from './map';
import ListData from './list-data';
import { getData } from 'src/api/axios';
import ForecastNewsletter from './forecast-newsletter';

const Home = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const isMounted = useRef(true);

    const getDataStations = async () => {
        setLoading(true)
        try {
            const data = await getData('Station/list');
            if (isMounted.current) {
                setData(data);

            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
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
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <RealTime />
            </Grid>
            <Grid item xs={12} md={4}>
                <Grid item xs={12} md={12} marginBottom={2}>
                    <ListData data={data} loading={loading} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <ForecastNewsletter />
                </Grid>
            </Grid>
            <Grid item xs={12} md={8}>
                <HomeMap data={data} />
            </Grid>
        </Grid>
    );
};

export default Home;
