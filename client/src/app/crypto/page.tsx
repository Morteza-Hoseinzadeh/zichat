'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';

import { motion } from 'framer-motion';

import CurvedBottomNavigation from '@/components/UI/menu/menu';
import AnimatedMotion from '@/components/AnimatedMotion';
import SideBar from '@/components/UI/sidebar/sidebar';
import CryptoDashboard from '@/components/routes/News/CryptoDashboard';
import ApexChart from '@/components/routes/News/ApexChart';
import useGet from '@/utils/hooks/API/useGet';

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function page() {
  const { data, refetch, loading } = useGet('/api/crypto/prices/all');
  const getCryptoesData = useMemo(() => data || [], [data]);

  const [coins, setCoins] = useState<any[]>([]);

  useEffect(() => {
    setCoins(getCryptoesData);
  }, [getCryptoesData]);

  return (
    <Box position="relative">
      <AnimatedMotion>
        <SideBar />
      </AnimatedMotion>
      <AnimatedMotion>
        <CryptoDashboard coins={coins} setCoins={setCoins} refetch={refetch} loading={loading} />
      </AnimatedMotion>
      <AnimatedMotion>
        <ApexChart coins={coins} />
      </AnimatedMotion>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <CurvedBottomNavigation />
      </motion.div>
    </Box>
  );
}
