'use client';

import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid2, IconButton, Typography, useTheme } from '@mui/material';

// Icons
import { MdOutlineAttachMoney } from 'react-icons/md';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import CustomDialog from '@/components/custom/CustomDialog';
import { TbSettings, TbTrash } from 'react-icons/tb';
import { IoIosArrowDown } from 'react-icons/io';
import { GrRadialSelected } from 'react-icons/gr';

// Utils
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';

const mock_cryptoInfo = [
  {
    english_name: 'Bitcoin',
    persian_name: 'بیت‌کوین',
    symbol: 'BTC',
    image_file: 'bitcoin-btc-logo',
    category: 'Store of Value / Digital Gold',
    blockchain_type: 'Public, Proof of Work (PoW)',
    launch_year: 2009,
    founder: 'Satoshi Nakamoto',
  },
  {
    english_name: 'Solana',
    persian_name: 'سولانا',
    symbol: 'SOL',
    image_file: 'solana-sol-logo',
    category: 'High-Performance Smart Contracts Platform',
    blockchain_type: 'Proof of History + Proof of Stake',
    launch_year: 2020,
    founder: 'Anatoly Yakovenko',
  },
  {
    english_name: 'Tether USD',
    persian_name: 'تتر',
    symbol: 'USDT',
    image_file: 'tether-usdt-logo',
    category: 'Stablecoin (Fiat-backed)',
    blockchain_type: 'Ethereum, Tron, Solana, etc.',
    launch_year: 2014,
    issuer: 'Tether Limited',
  },
  {
    english_name: 'Toncoin',
    persian_name: 'تون‌کوین',
    symbol: 'TON',
    image_file: 'toncoin-ton-logo',
    category: 'Layer-1 Blockchain / Smart Contracts',
    blockchain_type: 'Proof of Stake',
    launch_year: 2021,
    original_developer: 'Telegram (now community-developed)',
  },
  {
    english_name: 'BNB (Build and Build)',
    persian_name: 'بایننس کوین',
    symbol: 'BNB',
    image_file: 'bnb-bnb-logo',
    category: 'Exchange Token',
    blockchain_type: 'Binance Chain / BNB Smart Chain (BSC)',
    launch_year: 2017,
    founder: 'Binance (Changpeng Zhao)',
  },
  {
    english_name: 'Cardano',
    persian_name: 'کاردانو',
    symbol: 'ADA',
    image_file: 'cardano-ada-logo',
    category: 'Smart Contracts Platform',
    blockchain_type: 'Proof of Stake (Ouroboros)',
    launch_year: 2017,
    founder: 'Charles Hoskinson',
  },
  {
    english_name: 'Dogecoin',
    persian_name: 'دوج‌کوین',
    symbol: 'DOGE',
    image_file: 'dogecoin-doge-logo',
    category: 'Meme Coin',
    blockchain_type: 'Proof of Work (based on Litecoin)',
    launch_year: 2013,
    founders: ['Billy Markus', 'Jackson Palmer'],
  },
  {
    english_name: 'Ethereum',
    persian_name: 'اتریوم',
    symbol: 'ETH',
    image_file: 'ethereum-eth-logo',
    category: 'Smart Contracts Platform',
    blockchain_type: 'Public, Proof of Stake (post-Merge)',
    launch_year: 2015,
    founder: 'Vitalik Buterin + team',
  },
  {
    english_name: 'TRON',
    persian_name: 'ترون',
    symbol: 'TRX',
    image_file: 'tron-trx-logo',
    category: 'Smart Contracts & dApps Platform',
    blockchain_type: 'Delegated Proof of Stake (DPoS)',
    launch_year: 2017,
    founder: 'Justin Sun',
  },
  {
    english_name: 'USD Coin',
    persian_name: 'یواس‌دی کوین',
    symbol: 'USDC',
    image_file: 'usd-coin-usdc-logo',
    category: 'Stablecoin (Fiat-backed)',
    blockchain_type: 'Ethereum + multiple chains',
    launch_year: 2018,
    issuer: 'Circle (co-launched with Coinbase)',
  },
  {
    english_name: 'XRP',
    persian_name: 'ریپل',
    symbol: 'XRP',
    image_file: 'xrp-xrp-logo',
    category: 'Cross-border Payments',
    blockchain_type: 'RippleNet / XRP Ledger',
    launch_year: 2012,
    founders: ['Jed McCaleb', 'Chris Larsen', 'Arthur Britto'],
  },
];

export default function News() {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState(false);

  const handleClose = () => setOpenModal(false);

  return (
    <>
      <Box my={6}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" color="text.primary" fontWeight={100}>
            نرخ کریپتو💸
          </Typography>
          <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => setOpenModal(true)}>
            <TbSettings size={32} />
          </IconButton>
        </Box>

        <Grid2 container spacing={1} textAlign="center">
          {mock_cryptoInfo.slice(0, 4).map((item, index) => {
            const check_value = index > 0;

            return (
              <Grid2 key={index} size={{ xs: 6, md: 4, lg: 3, xl: 2 }} sx={{ backgroundColor: 'background.paper', borderRadius: '12px' }}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', p: 2, gap: 1 }}>
                  <img src={`/assets/cryptos-icon/${item.image_file}.png`} alt={item.persian_name} width={45} />
                  <Typography variant="h6" fontWeight={900} color="text.primary" gutterBottom>
                    {item.persian_name}
                  </Typography>

                  <Box width="100%" display="flex" alignItems="center" flexDirection="row" justifyContent={'center'} gap={1} color="text.primary">
                    <Box display="flex" alignItems="center" color={`${check_value ? 'success' : 'error'}.main`}>
                      {check_value ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                      <Typography variant="body1">{ConvertToPersianDigit('1.74 -') + ' %'}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <Typography variant="h6">{ConvertToPersianDigit(118123.1)}</Typography>
                      <MdOutlineAttachMoney size={22} />
                    </Box>
                  </Box>
                </Box>
              </Grid2>
            );
          })}
        </Grid2>
      </Box>

      {openModal && (
        <CustomDialog open={openModal} onClose={handleClose} maxWidth={'lg'} title={'تنظیمات'}>
          <Grid2 container spacing={2}>
            <Grid2 size={12} sx={{ '& .MuiAccordion-root': { borderRadius: '12px' } }}>
              <Accordion sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<IoIosArrowDown />}>
                  <Typography component="span">اضافه کردن ارز</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <input type="text" />
                </AccordionDetails>
              </Accordion>
            </Grid2>
            {mock_cryptoInfo?.map((item, index) => {
              return (
                <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ backgroundColor: 'background.paper', borderRadius: '12px' }}>
                  <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} p={2}>
                    <Box display={'flex'} alignItems={'center'} gap={2}>
                      <img src={`/assets/cryptos-icon/${item.image_file}.png`} alt={item.persian_name} width={35} />
                      <Typography variant="h6" fontWeight={900} color="text.primary">
                        {item.persian_name}
                      </Typography>
                    </Box>
                    <Box display={'flex'} alignItems={'center'}>
                      <IconButton>
                        <TbTrash size={24} color={theme.palette.error.main} />
                      </IconButton>
                      <IconButton sx={{ color: 'success.main' }}>
                        <GrRadialSelected size={24} />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid2>
              );
            })}
          </Grid2>
        </CustomDialog>
      )}
    </>
  );
}
