import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export default function TabWelcome() {
  const theme = useTheme();
  const matchMdDown = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant={matchMdDown ? 'h5' : 'h4'} fontWeight={900} color="text.primary" sx={{ mb: 1 }}>
        به زیچت خوش آمدید 🎉
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ opacity: 0.8 }}>
        پیام‌رسان هوشمند فارسی
      </Typography>
    </Box>
  );
}
