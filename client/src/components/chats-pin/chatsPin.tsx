'use client';

import React, { use } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

// Keen slider imports
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

// Icons
import { GoPersonAdd } from 'react-icons/go';

export default function ChatsPin() {
  const theme = useTheme();
  const matchMdDown = useMediaQuery('(max-width: 900px)');

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 5, spacing: 15 },
    rtl: true,
    breakpoints: {
      '(max-width: 768px)': { slides: { perView: matchMdDown ? 2 : 3, spacing: 10 } },
    },
  });

  return (
    <>
      <Box textAlign={'center'}>
        <Typography variant="h4" color="text.primary" fontWeight={100} mb={2}>
          📌مخاطبین پین شده
        </Typography>
      </Box>
      <Box ref={sliderRef} className="keen-slider" sx={{ overflow: 'hidden', px: 2 }}>
        {Array.from({ length: 2 }).map((_, index) => (
          <Box key={index} className="keen-slider__slide" p={2} sx={{ backgroundColor: 'background.paper', borderRadius: '12px', textAlign: 'center', width: 'fit-content' }}>
            <Box sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: '50%', overflow: 'hidden', width: '100px', height: '100px', mx: 'auto' }}>
              <img src="/assets/avatars/avatar.png" alt={`avatar-${index}`} width="100%" height="100%" />
            </Box>
            <Box mt={1}>
              <Typography variant="body1" color="text.primary" fontWeight={900}>
                پریسا محمدزاده
              </Typography>
            </Box>
          </Box>
        ))}

        <Box
          className="keen-slider__slide"
          p={2}
          sx={{
            backgroundColor: 'background.default',
            borderRadius: '12px',
            textAlign: 'center',
            width: 'fit-content',
            border: '2px dashed',
            borderColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            minWidth: '120px',
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
          onClick={() => alert('افزودن مخاطب clicked!')}
        >
          <GoPersonAdd size={32} color={theme.palette.primary.main} />
          <Typography variant="h6" color="primary.main" fontWeight={700}>
            افزودن مخاطب جدید
          </Typography>
        </Box>
      </Box>
    </>
  );
}
