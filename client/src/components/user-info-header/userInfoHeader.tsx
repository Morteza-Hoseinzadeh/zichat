'use client';

import React from 'react';
import { alpha, Avatar, Box, IconButton, Typography } from '@mui/material';

// Icons
import { TbSun, TbMoon, TbSearch } from 'react-icons/tb';
import { IoClose } from 'react-icons/io5';

// Utils
import { useThemeMode } from '@/utils/hooks/useThemeMode';

export default function UserInfoHeader() {
  const [openSearchBox, setOpenSearchBox] = React.useState(false);

  const { toggleTheme, isDarkMode } = useThemeMode();

  return (
    <Box mb={3} mt={1} display={'flex'} justifyContent="space-between" alignItems="center">
      <Box display={'flex'} alignItems="center" gap={1.5}>
        <Box sx={{ border: '1px solid', borderColor: 'secondary.main', borderRadius: '50%', overflow: 'hidden' }}>
          <Avatar src="/assets/avatars/avatar.png" alt="پریسا-احمدی" sx={{ width: '65px', height: '65px' }} />
        </Box>
        <Box display={'flex'} flexDirection="column">
          <Box sx={{ cursor: 'pointer' }} mb={0.5}>
            <Typography color="primary.main" fontWeight={600} variant="body2">
              افزودن وضعیت +
            </Typography>
          </Box>
          <Typography color="text.primary" variant="h5" fontWeight={900}>
            پریسا محمدزاده
          </Typography>
        </Box>
      </Box>
      <Box display={'flex'} alignItems="center" gap={1}>
        <IconButton
          sx={{
            backgroundColor: isDarkMode ? 'secondary.main' : 'primary.main',
            color: isDarkMode ? 'background.paper' : '#f2f2f2',
            '&:hover': { backgroundColor: isDarkMode ? 'secondary.dark' : 'primary.dark' },
          }}
          onClick={toggleTheme}
        >
          {isDarkMode ? <TbSun /> : <TbMoon />}
        </IconButton>

        <IconButton
          sx={{
            backgroundColor: isDarkMode ? 'secondary.main' : 'primary.main',
            color: isDarkMode ? 'background.paper' : '#f2f2f2',
            '&:hover': { backgroundColor: isDarkMode ? 'secondary.dark' : 'primary.dark' },
          }}
          onClick={() => setOpenSearchBox(!openSearchBox)}
        >
          {openSearchBox ? <IoClose /> : <TbSearch />}
        </IconButton>
      </Box>
    </Box>
  );
}
