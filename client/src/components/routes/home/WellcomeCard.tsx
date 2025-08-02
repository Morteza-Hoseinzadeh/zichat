'use client';

import GlitchText from '@/components/custom/GlitchText';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const WelcomeCard = ({ userName }: any) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={styles.welcomeCard}>
        {/* Decorative Elements */}
        <Box sx={styles.decorationCircle} />
        <Box sx={styles.decorationDots} />

        {/* Content */}
        <Box sx={styles.content}>
          <Typography variant="h5" sx={styles.greeting}>
            <GlitchText text={`سلام ${userName} عزیز خوش اومدی! 🎉`} />
          </Typography>
          <Typography variant="body1" sx={styles.message}>
            به پیام رسان زیچت خوش آمدید. امروز چه کاری می‌خواهید انجام دهید؟
          </Typography>

          <Box sx={styles.actions}>
            <Button variant="contained" sx={styles.primaryButton}>
              شروع کنید
            </Button>
            <Button variant="outlined" sx={styles.secondaryButton}>
              راهنما
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

const styles = {
  welcomeCard: {
    position: 'relative',
    backgroundColor: 'primary.light',
    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
    borderRadius: '16px',
    padding: { xs: '24px', md: '32px' },
    overflow: 'hidden',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(25, 118, 210, 0.1)',
    minHeight: '200px',
  },
  decorationCircle: {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  decorationDots: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    width: '80px',
    height: '80px',
    backgroundImage: 'radial-gradient(rgba(25, 118, 210, 0.3) 2px, transparent 2px)',
    backgroundSize: '15px 15px',
    opacity: 0.6,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
    paddingRight: { md: '32px' },
  },
  greeting: {
    fontWeight: 700,
    color: 'primary.dark',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '8px',
    fontSize: '28px',
    color: 'warning.main',
  },
  message: {
    color: 'text.secondary',
    marginBottom: '24px',
    maxWidth: '500px',
    lineHeight: '1.6',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  primaryButton: {
    borderRadius: '12px',
    padding: '8px 20px',
    fontWeight: 600,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
    },
  },
  secondaryButton: {
    borderRadius: '12px',
    padding: '8px 20px',
    fontWeight: 600,
    borderWidth: '2px',
    '&:hover': {
      borderWidth: '2px',
    },
  },
  illustration: {
    width: { xs: '100%', md: '40%' },
    maxWidth: '300px',
    marginTop: { xs: '24px', md: '0' },
    position: 'relative',
    zIndex: 2,
  },
};

export default WelcomeCard;
