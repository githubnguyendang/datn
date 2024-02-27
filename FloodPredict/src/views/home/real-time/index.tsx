import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';

const RealTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const formatted = currentTime.toLocaleString();
      setFormattedTime(formatted);
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);

  }, [currentTime]);

  return (
    <Paper elevation={3} sx={{ py: 1, px: 3 }}>
      <Typography variant='body2'>THỐNG KÊ DỮ LIỆU TÀI NGUYÊN NƯỚC ({formattedTime}) </Typography>
    </Paper>
  );

};

export default RealTime;
