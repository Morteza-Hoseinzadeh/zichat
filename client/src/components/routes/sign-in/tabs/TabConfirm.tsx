import { Box, Typography } from '@mui/material';

export default function TabConfirm({ form }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        اطلاعات شما:
      </Typography>
      <Typography>شماره تلفن: {form.phone}</Typography>
    </Box>
  );
}