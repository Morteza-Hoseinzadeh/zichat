'use client';

import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

// Dynamically import ApexChart to disable SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ApexChart = () => {
  const theme = useTheme();

  const [selectedCoin, setSelectedCoin] = useState<any>('bitcoin');
  const [state, setState] = useState<any>({
    series: [],
    options: getChartOptions('bitcoin'),
  });

  // Sample coin data
  const coinData: any = {
    bitcoin: [
      { x: new Date(1538778600000), y: [6629.81, 6650.5, 6623.04, 6633.33] },
      { x: new Date(1538780400000), y: [6632.01, 6643.59, 6620, 6630.11] },
      { x: new Date(1538782200000), y: [6630.71, 6648.95, 6623.34, 6635.65] },
      { x: new Date(1538784000000), y: [6635.65, 6651, 6629.67, 6638.24] },
    ],
    ethereum: [
      { x: new Date(1538778600000), y: [320.15, 325.5, 318.04, 322.33] },
      { x: new Date(1538780400000), y: [322.01, 328.59, 320.0, 325.11] },
      { x: new Date(1538782200000), y: [325.11, 330.5, 324.0, 328.75] },
      { x: new Date(1538784000000), y: [328.75, 335.0, 327.5, 332.4] },
    ],
    solana: [
      { x: new Date(1538778600000), y: [45.81, 47.5, 44.04, 46.33] },
      { x: new Date(1538780400000), y: [46.01, 48.59, 45.0, 47.11] },
      { x: new Date(1538782200000), y: [47.11, 49.25, 46.5, 48.75] },
      { x: new Date(1538784000000), y: [48.75, 50.0, 47.8, 49.2] },
    ],
  };

  useEffect(() => {
    if (selectedCoin && coinData[selectedCoin]) {
      setState((prev: any) => ({
        ...prev,
        series: [{ name: selectedCoin.toUpperCase(), data: coinData[selectedCoin] }],
        options: getChartOptions(selectedCoin),
      }));
    }
  }, [selectedCoin]);

  function getChartOptions(coin: string) {
    return {
      chart: {
        type: 'candlestick',
        height: 350,
        toolbar: {
          show: false,
        },
        fontFamily: 'YekanBakh, sans-serif',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      title: {
        text: `نمودار ${selectedCoin}`,
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
          style: {
            colors: theme.palette.text.secondary,
            fontFamily: 'YekanBakh',
          },
          formatter: function (val: any) {
            return dayjs(val).format('MMM DD HH:mm');
          },
        },
        axisBorder: {
          show: true,
          color: theme.palette.divider,
        },
        axisTicks: {
          show: true,
          color: theme.palette.divider,
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary,
            fontFamily: 'YekanBakh',
          },
          formatter: function (val: number) {
            return val.toFixed(2);
          },
        },
        opposite: true,
      },
      tooltip: {
        enabled: true,
        style: {
          fontFamily: 'YekanBakh',
        },
        x: {
          formatter: function (val: any) {
            return dayjs(val).format('YYYY/MM/DD HH:mm');
          },
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: theme.palette.success.main,
            downward: theme.palette.error.main,
          },
          wick: {
            useFillColor: true,
          },
        },
      },
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],
    };
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, direction: 'rtl', mb: 14 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', fontFamily: 'YekanBakh' }}>
          نمودار قیمت ارزهای دیجیتال
        </Typography>

        <Box sx={{ minWidth: 200, position: 'relative', '&:after': { content: '"▼"', position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: theme.palette.text.secondary, pointerEvents: 'none' } }}>
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
              fontFamily: 'YekanBakh',
              appearance: 'none',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s',
            }}
          >
            <option value="bitcoin">بیتکوین (BTC)</option>
            <option value="ethereum">اتریوم (ETH)</option>
            <option value="solana">سولانا (SOL)</option>
          </select>
        </Box>
      </Box>

      <ReactApexChart options={state.options} series={state.series} type="candlestick" height={350} />
    </Box>
  );
};

export default ApexChart;
