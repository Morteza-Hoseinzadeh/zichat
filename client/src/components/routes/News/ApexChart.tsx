'use client';

import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography, useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import useGet from '@/utils/hooks/API/useGet';

// Dynamically import ApexChart to disable SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Helper: round date to nearest interval seconds
function roundToNearestInterval(date: Date, intervalSeconds: number) {
  const ms = date.getTime();
  const rounded = Math.floor(ms / (intervalSeconds * 1000)) * intervalSeconds * 1000;
  return new Date(rounded);
}

const ApexChart = ({ coins }: any) => {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedCoin, setSelectedCoin] = useState<string>('USDTIRT');
  const [state, setState] = useState<any>({
    series: [],
    options: getChartOptions('USDTIRT'),
  });

  const [candlesHistory, setCandlesHistory] = useState<any[]>([]);

  const { data, refetch } = useGet(`/api/crypto/${selectedCoin}/chart`);

  // Refetch chart data every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(intervalId);
  }, [selectedCoin]);

  useEffect(() => {
    setCandlesHistory([]);
    refetch(); // Fetch immediately for the new coin
  }, [selectedCoin]);

  // Transform API bids/asks into candlestick data
  function generateNewCandle(data: any, prevClose: number | null) {
    if (!data || !data.bids || !data.asks) return null;

    const bidPrice = data.bids[0] ? parseFloat(data.bids[0][0]) : null;
    const askPrice = data.asks[0] ? parseFloat(data.asks[0][0]) : null;
    if (bidPrice === null || askPrice === null) return null;

    const currentPrice = (bidPrice + askPrice) / 2;
    const open = prevClose !== null ? prevClose : currentPrice;
    const close = currentPrice;
    const high = Math.max(open, close) * 1.002;
    const low = Math.min(open, close) * 0.998;

    // Determine candle time - fixed 3s interval after last candle or rounded now
    const intervalMs = 3000; // 3 seconds
    const lastCandle = candlesHistory[candlesHistory.length - 1];
    const newTime = lastCandle ? new Date(lastCandle.x.getTime() + intervalMs) : roundToNearestInterval(new Date(), 3);

    return {
      x: newTime,
      y: [open, high, low, close],
    };
  }

  // When API data changes, update chart series
  useEffect(() => {
    if (!data) return;

    const bidPrice = data.bids?.[0] ? parseFloat(data.bids[0][0]) : null;
    const askPrice = data.asks?.[0] ? parseFloat(data.asks[0][0]) : null;
    if (bidPrice === null || askPrice === null) return;

    const currentPrice = (bidPrice + askPrice) / 2;

    const lastCandle = candlesHistory[candlesHistory.length - 1];
    const prevClose = lastCandle ? lastCandle.y[3] : null;

    // Only add candle if price changed (rounded to 2 decimals to avoid tiny float diffs)
    if (prevClose !== null && currentPrice.toFixed(2) === prevClose.toFixed(2)) return;

    const newCandle = generateNewCandle(data, prevClose);
    if (!newCandle) return;

    const newHistory = [...candlesHistory, newCandle].slice(-15);
    setCandlesHistory(newHistory);

    setState({
      series: [{ name: selectedCoin.toUpperCase(), data: newHistory }],
      options: getChartOptions(selectedCoin),
    });
  }, [data]);

  // Chart options (same as before)
  function getChartOptions(coin: string) {
    return {
      chart: {
        type: 'candlestick',
        height: 300,
        toolbar: { show: false },
        fontFamily: 'YekanBakh, sans-serif',
        animations: { enabled: true, easing: 'easeinout', speed: 800 },
      },
      title: {
        text: `نمودار ${coin}`,
        align: 'right',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#A970FF',
          fontFamily: 'YekanBakh',
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: { colors: theme.palette.text.secondary, fontFamily: 'YekanBakh' },
          formatter: (val: any) => dayjs(val).format('MMM DD HH:mm'),
        },
        axisBorder: { show: true, color: theme.palette.divider },
        axisTicks: { show: true, color: theme.palette.divider },
        tooltip: { enabled: false },
      },
      yaxis: {
        labels: {
          style: { colors: theme.palette.text.secondary, fontFamily: 'YekanBakh' },
          formatter: (val: number) => val.toFixed(2),
        },
        opposite: true,
      },
      tooltip: {
        enabled: true,
        style: { fontFamily: 'YekanBakh' },
        x: {
          formatter: (val: any) => dayjs(val).format('YYYY/MM/DD HH:mm'),
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: theme.palette.success.main,
            downward: theme.palette.error.main,
          },
          wick: { useFillColor: true },
        },
      },
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      responsive: [{ breakpoint: 600, options: { chart: { height: 300 } } }],
    };
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, direction: 'rtl', mb: 14 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', fontFamily: 'YekanBakh' }}>
          نمودار قیمت ارزهای دیجیتال
        </Typography>

        <Box sx={{ minWidth: 200, position: 'relative' }}>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 36px',
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {coins.map(
              (item: any) =>
                item.selected_coin && (
                  <option key={item.symbol} value={item.symbol}>
                    {item.persian_name} ({item.english_name})
                  </option>
                )
            )}
          </select>
        </Box>
      </Box>

      <ReactApexChart options={state.options} series={state.series} type="candlestick" height={350} />
    </Box>
  );
};

export default ApexChart;
