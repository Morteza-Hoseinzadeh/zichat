import { Box, TextField } from '@mui/material';

export default function TabOtp({ otpCode, setOtpCode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <TextField fullWidth label="کد تایید" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} sx={{ mb: 2 }} />
    </Box>
  );
}
