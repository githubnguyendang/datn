import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import { Button, Card, CardActions, CardContent, Divider, Paper } from "@mui/material";

const ForecastNewsletter = () => {

    const now = `${new Date().getDay()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

    return (
        <Paper elevation={3}>
            <Paper elevation={3} sx={{ py: 0.5, mb: 2, BorderRadius: 0, textAlign: 'center' }}>
                <Typography variant='overline' sx={{ fontWeight: 'bold' }}>Báo cáo dự báo mực nước</Typography>
            </Paper>
            <Box px={5} pb={3} sx={{ height: '40vh', overflowY: 'auto' }}>
                <Card sx={{ my: 2 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Báo cáo dự báo mực nước
                        </Typography>
                        <Typography variant="subtitle2" component="div">
                            Ngày {now}
                        </Typography>
                        <Divider variant="middle" />
                        <Typography variant="body2" color="text.secondary">
                            Mực nước dự báo ngày {now}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant="outlined" size="small" color="primary">
                            Xem
                        </Button>
                    </CardActions>
                </Card>
                <Card sx={{ my: 2 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Báo cáo dự báo mực nước
                        </Typography>
                        <Typography variant="subtitle2" component="div">
                            Ngày {now}
                        </Typography>
                        <Divider variant="middle" />
                        <Typography variant="body2" color="text.secondary">
                            Mực nước dự báo ngày {now}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant="outlined" size="small" color="primary">
                            Xem
                        </Button>
                    </CardActions>
                </Card>
                <Card sx={{ my: 2 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Báo cáo dự báo mực nước
                        </Typography>
                        <Typography variant="subtitle2" component="div">
                            Ngày {now}
                        </Typography>
                        <Divider variant="middle" />
                        <Typography variant="body2" color="text.secondary">
                            Mực nước dự báo ngày {now}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant="outlined" size="small" color="primary">
                            Xem
                        </Button>
                    </CardActions>
                </Card>
                <Card sx={{ my: 2 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Báo cáo dự báo mực nước
                        </Typography>
                        <Typography variant="subtitle2" component="div">
                            Ngày {now}
                        </Typography>
                        <Divider variant="middle" />
                        <Typography variant="body2" color="text.secondary">
                            Mực nước dự báo ngày {now}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant="outlined" size="small" color="primary">
                            Xem
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Paper>
    );
};

export default ForecastNewsletter;
