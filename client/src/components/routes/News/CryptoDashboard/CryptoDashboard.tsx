'use client';

import React, { useEffect, useState } from 'react';

// Mui imports
import { Box, Button, Grid2, IconButton, Typography, useTheme } from '@mui/material';

// Icons
import { MdOutlineAttachMoney } from 'react-icons/md';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { TbCircleDashed, TbDragDrop2, TbSettings, TbTrash } from 'react-icons/tb';

// Drag & Drop imports
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';

// Custom component's
import { SortableItem } from '@/components/custom/SortableItem';
import CustomDialog from '@/components/custom/CustomDialog';

// Utils
import ConvertToPersianDigit from '@/utils/functions/convertToPersianDigit';
import AnimatedMotion from '@/components/AnimatedMotion';

const mock_cryptoInfo: any = [
  {
    english_name: 'Bitcoin',
    persian_name: 'بیت‌کوین',
    symbol: 'BTC',
    image_file: 'bitcoin-btc-logo',
    category: 'Store of Value / Digital Gold',
    blockchain_type: 'Public, Proof of Work (PoW)',
    launch_year: 2009,
    founder: 'Satoshi Nakamoto',
    price: '118123.1',
    selected_coin: true,
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
    price: '118123.1',
    selected_coin: true,
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
    price: '118123.1',
    selected_coin: true,
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
    price: '118123.1',
    selected_coin: true,
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
    price: '118123.1',
    selected_coin: false,
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
    price: '118123.1',
    selected_coin: false,
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
    price: '118123.1',
    selected_coin: false,
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
    price: '118123.1',
    selected_coin: false,
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
    price: '118123.1',
    selected_coin: false,
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
    price: '118123.1',
    selected_coin: false,
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
    price: '118123.1',
    selected_coin: false,
  },
];

const CoinsCardSection = ({ item, isShowDragAnDropButton, handleRemoveCoin }: any) => {
  const theme = useTheme();

  return (
    <AnimatedMotion>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: 'background.default', borderRadius: '16px', border: `1px solid ${theme.palette.divider}`, '&:hover': { backgroundColor: 'action.hover' } }}>
        <Box display={'flex'} alignItems={'center'} gap={2} sx={{ flexGrow: 1 }}>
          <img src={`/assets/cryptos-icon/${item.image_file}.png`} alt={item.persian_name} width={30} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {item.persian_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.symbol}
            </Typography>
          </Box>
        </Box>
        {isShowDragAnDropButton && (
          <IconButton size="small" sx={{ color: 'primary.main', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
            <TbDragDrop2 size={20} />
          </IconButton>
        )}
        {!isShowDragAnDropButton && (
          <IconButton size="small" sx={{ color: 'error.main' }} onClick={(e) => handleRemoveCoin(e, item?.symbol)}>
            <TbTrash size={20} />
          </IconButton>
        )}
      </Box>
    </AnimatedMotion>
  );
};

export default function CryptoDashboard() {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [coins, setCoins] = useState<any[]>([]);

  const [isShowDragAnDropButton, setIsShowDragAnDropButton] = useState(false);

  useEffect(() => {
    setCoins(mock_cryptoInfo);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setCoins((coins) => {
        const oldIndex = coins.findIndex((coin) => coin.symbol === active.id);
        const newIndex = coins.findIndex((coin) => coin.symbol === over?.id);
        return arrayMove(coins, oldIndex, newIndex);
      });
    }
  };

  const handleOnChangeCoin = (symbol: string) => {
    setCoins((prev) => {
      return prev.map((coin) => (coin.symbol === symbol ? { ...coin, selected_coin: !coin.selected_coin } : coin));
    });
  };

  const handleRemoveCoin = (e: any, symbol: any) => {
    handleOnChangeCoin(symbol);
    e.stopPropagation();
  };

  const handleClose = () => setOpenModal(false);

  return (
    <>
      <Box my={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" color="text.primary" fontWeight={100}>
            نرخ کریپتو💸
          </Typography>
          <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => setOpenModal(true)}>
            <TbSettings size={32} />
          </IconButton>
        </Box>

        <Grid2 container spacing={1} textAlign="center">
          {coins
            .filter((coin) => coin.selected_coin)
            .map((item, index) => (
              <Grid2 key={item.symbol} size={{ xs: 6, md: 4, lg: 3, xl: 2 }} sx={{ backgroundColor: 'background.paper', borderRadius: '12px' }}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', p: 2, gap: 1 }}>
                  <img src={`/assets/cryptos-icon/${item.image_file}.png`} alt={item.persian_name} width={45} />
                  <Typography variant="h6" fontWeight={900} color="text.primary" gutterBottom>
                    {item.persian_name}
                  </Typography>
                  <Box width="100%" display="flex" alignItems="center" flexDirection="row" justifyContent={'center'} gap={1} color="text.primary">
                    <Box display="flex" alignItems="center" color={`${index > 0 ? 'success' : 'error'}.main`}>
                      {index > 0 ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                      <Typography variant="body1">{ConvertToPersianDigit('1.74 -') + ' %'}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6">{ConvertToPersianDigit(item?.price)}</Typography>
                      <MdOutlineAttachMoney size={22} />
                    </Box>
                  </Box>
                </Box>
              </Grid2>
            ))}
        </Grid2>
      </Box>

      {openModal && (
        <CustomDialog open={openModal} onClose={handleClose} maxWidth={'md'} title={'مدیریت ارزها'}>
          <AnimatedMotion>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
                <input type="text" placeholder="جستجوی ارز..." style={{ width: '100%', padding: '12px 16px', borderRadius: '16px', border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.default, fontSize: '1rem' }} />
              </Box>

              {/* Selected Coins Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden', flexGrow: 1 }}>
                <Box width={'100%'} sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 2, flexShrink: 0 }}>
                  <Box mb={2} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      ارزهای انتخاب شده ({ConvertToPersianDigit(coins.filter((c) => c.selected_coin).length)})
                    </Typography>
                    <Button variant="text" onClick={() => setIsShowDragAnDropButton(!isShowDragAnDropButton)}>
                      {isShowDragAnDropButton ? 'بستن' : 'جا به جایی ارز ها'}
                    </Button>
                  </Box>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
                    <SortableContext items={coins.filter((c) => c.selected_coin).map((coin) => coin.symbol)} strategy={verticalListSortingStrategy}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {coins
                          .filter((c) => c.selected_coin)
                          .map((item) =>
                            isShowDragAnDropButton ? (
                              <SortableItem key={item.symbol} id={item.symbol}>
                                <CoinsCardSection item={item} isShowDragAnDropButton={isShowDragAnDropButton} handleRemoveCoin={handleRemoveCoin} />
                              </SortableItem>
                            ) : (
                              <Box key={item.symbol}>
                                <CoinsCardSection item={item} isShowDragAnDropButton={isShowDragAnDropButton} handleRemoveCoin={handleRemoveCoin} />
                              </Box>
                            )
                          )}
                      </Box>
                    </SortableContext>
                  </DndContext>
                </Box>

                {/* Available Coins Section */}
                <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 2, flexGrow: 1, overflow: 'auto' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                    سایر ارزهای موجود
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {coins
                      .filter((c) => !c.selected_coin)
                      .map((item) => (
                        <Box key={item.symbol} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: 'background.default', borderRadius: '16px', border: `1px solid ${theme.palette.divider}`, '&:hover': { backgroundColor: 'action.hover' } }}>
                          <Box display={'flex'} alignItems={'center'} gap={2}>
                            <img src={`/assets/cryptos-icon/${item.image_file}.png`} alt={item.persian_name} width={30} />
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {item.persian_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.symbol}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton size="small" sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={() => handleOnChangeCoin(item.symbol)}>
                            <TbCircleDashed size={22} />
                          </IconButton>
                        </Box>
                      ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </AnimatedMotion>
        </CustomDialog>
      )}
    </>
  );
}
