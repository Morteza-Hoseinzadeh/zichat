import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import { Box, InputBase, Button, Typography, CircularProgress } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

export default function TabOtp({ otpCode, setOtpCode, phoneNumber }) {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [status, setStatus] = useState('idle'); // 'idle', 'success', 'error', 'warning'
  const timerRef: any = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const handleResendOtp = () => {
    // Reset timer
    setTimeLeft(120);
    setIsResendDisabled(true);
    setStatus('idle');

    // TODO: Add your OTP resend logic here
    console.log('Resending OTP to:', phoneNumber);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(value);

    // Example status changes (replace with your actual validation)
    if (value.length === 6) {
      setStatus('success');
    } else if (value.length === 5) {
      setStatus('warning');
    } else {
      setStatus('idle');
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'success':
        return 'success.main';
      case 'error':
        return 'error.main';
      case 'warning':
        return 'warning.main';
      default:
        return 'divider';
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
        کد تایید را وارد کنید
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        کد ۶ رقمی به شماره {ConvertToPersianDigit(`98${phoneNumber}+`)} ارسال شد
      </Typography>

      {/* OTP Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1, backgroundColor: 'background.paper', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', p: '4px', border: '1px solid', borderColor: getBorderColor(), transition: 'all 0.3s ease', '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' } }}>
          <InputBase fullWidth placeholder="ــ ــ ــ ــ ــ ــ" value={otpCode} onChange={handleOtpChange} inputProps={{ dir: 'ltr', inputMode: 'numeric', maxLength: 6, style: { textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', padding: '12px' } }} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse', gap: 2 }}>
        {/* Circular Timer */}
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" value={(timeLeft / 120) * 100} size={48} thickness={4} color={timeLeft > 60 ? 'primary' : timeLeft > 30 ? 'warning' : 'error'} />
          <Box sx={{ top: 3, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" component="div" color="text.primary">
              {ConvertToPersianDigit(Math.floor(timeLeft / 60))}:{ConvertToPersianDigit(String(timeLeft % 60).padStart(2, '0'))}
            </Typography>
          </Box>
        </Box>
        {/* Resend Button */}
        <Button fullWidth variant="outlined" color="primary" onClick={handleResendOtp} disabled={isResendDisabled} sx={{ borderRadius: '8px', py: 1.5, fontWeight: 600, '&:disabled': { color: 'text.disabled', borderColor: 'divider' } }}>
          ارسال مجدد کد
        </Button>
      </Box>

      {/* Status Message */}
      {status === 'success' && (
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'success.main', textAlign: 'center' }}>
          کد تایید معتبر است
        </Typography>
      )}
      {status === 'error' && (
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'error.main', textAlign: 'center' }}>
          کد تایید نامعتبر است
        </Typography>
      )}
      {status === 'warning' && (
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'warning.main', textAlign: 'center' }}>
          کد تایید ناقص است
        </Typography>
      )}
    </Box>
  );
}
