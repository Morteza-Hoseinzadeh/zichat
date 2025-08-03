import React from 'react';
import { Box } from '@mui/material';

export default function loading() {
  return (
    <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100vh'}>
      <img src="/assets/logo/zichat-logo.png" alt="zichat-logo.png" width={75} />
    </Box>
  );
}
