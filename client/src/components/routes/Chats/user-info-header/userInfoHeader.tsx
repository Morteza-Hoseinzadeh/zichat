'use client';

import React from 'react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';

// Icons
import { TbUserCircle } from 'react-icons/tb';

export default function UserInfoHeader() {
  const [isSettingOpen, setIsSettingOpen] = React.useState(false);

  return (
    <Box mb={4} mt={2} display={'flex'} justifyContent="space-between" alignItems="center" sx={{ border: '2px dashed', borderRadius: '12px', p: 2, borderColor: 'primary.main' }}>
      <Box display={'flex'} alignItems="center" gap={1.2}>
        <Box sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: '50%', overflow: 'hidden' }}>
          <Avatar src="/assets/avatars/avatar.jpg" alt="پریسا-احمدی" sx={{ width: '65px', height: '65px' }} />
        </Box>
        <Box display={'flex'} flexDirection="column">
          <Box sx={{ width: 'fit-content', transition: 'all 0.2s ease-in-out', p: 0.2, borderRadius: '8px', cursor: 'pointer', '&:hover': { backgroundColor: 'background.paper' } }} mb={0.5}>
            <Typography color="primary.main" fontWeight={600} variant="body2">
              افزودن وضعیت +
            </Typography>
          </Box>
          <Typography color="text.primary" variant="h5" fontWeight={900}>
            مزتضی حسین زاده
          </Typography>
        </Box>
      </Box>
      <Box display={'flex'} alignItems="center" gap={1}>
        <IconButton sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }} onClick={() => setIsSettingOpen(!isSettingOpen)}>
          <TbUserCircle size={34} />
        </IconButton>
      </Box>
    </Box>
  );
}
