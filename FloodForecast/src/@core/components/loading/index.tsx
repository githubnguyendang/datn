import React from 'react';
import { Backdrop } from '@mui/material';

const Loading = ({ isLoading }: any) => {

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999999 }}
        open={isLoading}
      >
        <div className='loader'></div>
      </Backdrop>
    </div>
  );
};

export default Loading;
