'use client';

import React from 'react';
import { Box, Button, Grid2, IconButton, Typography } from '@mui/material';
import { CgArrowsExchange } from 'react-icons/cg';

export default function News() {
  return (
    <Box mb={6}>
      <Box display={'flex'} alignItems="center" justifyContent={'space-between'} mb={2}>
        <Typography variant="h4" color="text.primary" fontWeight={100} mb={2}>
          نرخ کریپتو💸
        </Typography>
        <IconButton>
          <CgArrowsExchange size={22} color="pirmary.main" />
        </IconButton>
      </Box>
      <Grid2 container spacing={2} textAlign={'center'}>
        {[...Array(4)].map((_, index) => (
          <Grid2 key={index} size={6}>
            <Box sx={{ backgroundColor: 'background.paper', borderRadius: '12px' }}>
              <Box>
                <img src="" alt="عکس دلار" />
                <Typography color="text.primary">دلار</Typography>
              </Box>
              <Box>
                <Typography color="text.primary">89.000</Typography>
              </Box>
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
