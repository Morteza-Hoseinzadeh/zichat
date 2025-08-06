'use client';

import React, { useEffect, useMemo, useState } from 'react';

// Mui imports
import { Box, Button, Grid2, IconButton, Typography, useTheme, Skeleton, CircularProgress } from '@mui/material';

// Icons
import { MdOutlineAttachMoney } from 'react-icons/md';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { TbCircleDashed, TbDragDrop2, TbExchange, TbTrash } from 'react-icons/tb';

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
import axiosInstance from '@/utils/hooks/axiosInstance';

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
              {item.symbol.split('IRT')[0]}
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

export default function CryptoDashboard({ refetch, loading, coins, setCoins, getCryptoesData }: any) {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [checkCoinsPrice, setCheckCoinsPrice] = useState<any[]>([]);

  const [isShowDragAnDropButton, setIsShowDragAnDropButton] = useState(false);

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      refetch();
    }, 15000);

    const snapshotInterval = setInterval(() => {
      setCheckCoinsPrice(getCryptoesData);
    }, 20000);

    return () => {
      clearInterval(refetchInterval);
      clearInterval(snapshotInterval);
    };
  }, [coins]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleCheckDiffPrice = (symbol: string, currentPrice: number) => {
    const oldCoin = checkCoinsPrice.find((coin) => coin.symbol === symbol);
    if (!oldCoin || !oldCoin.price) return 0;

    const oldPrice = Number(oldCoin.price);
    const newPrice = Number(currentPrice);

    if (isNaN(oldPrice) || isNaN(newPrice) || oldPrice === 0) return 0;

    const diff = ((newPrice - oldPrice) / oldPrice) * 100;

    return diff;
  };

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

  const handleOnChangeCoin = async (symbol: string) => {
    setCoins((prev) => {
      return prev.map((coin) => (coin.symbol === symbol ? { ...coin, selected_coin: !coin.selected_coin } : coin));
    });
    return await axiosInstance.put(`/api/crypto/${symbol.toUpperCase()}/update`);
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
            <TbExchange size={32} />
          </IconButton>
        </Box>

        <Grid2 container spacing={1} textAlign="center">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Grid2 key={index} size={{ xs: 6, md: 4, lg: 3, xl: 2 }} sx={{ borderRadius: '12px' }}>
                  <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Skeleton variant="circular" width={45} height={45} sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: '8px' }} />
                  </Box>
                </Grid2>
              ))
            : coins
                .filter((coin) => coin.selected_coin)
                .map((item, index) => {
                  const priceDiff = handleCheckDiffPrice(item.symbol, item.price);

                  return (
                    <Grid2 key={item.symbol} size={{ xs: 6, md: 4, lg: 3, xl: 2 }}>
                      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', p: 2, gap: 1, bgcolor: 'background.paper', borderRadius: '12px' }}>
                        <img src={`/assets/cryptos-icon/${item.image_file}.png`} alt={item.persian_name} width={45} />
                        <Typography variant="h6" fontWeight={900} color="text.primary" gutterBottom>
                          {item.persian_name}
                        </Typography>
                        <Box width="100%" display="flex" alignItems="center" flexDirection="column" justifyContent={'center'} gap={1} color="text.primary">
                          <Box display="flex" alignItems="center" color={priceDiff > 0 ? 'success.main' : priceDiff < 0 ? 'error.main' : 'text.primary'}>
                            {priceDiff > 0 ? <TiArrowSortedUp /> : priceDiff < 0 ? <TiArrowSortedDown /> : null}
                            <Typography variant="body1">{ConvertToPersianDigit(Math.abs(priceDiff).toFixed(2))} %</Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h6">{ConvertToPersianDigit(item?.price)}</Typography>
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
        <CustomDialog open={openModal} onClose={handleClose} maxWidth={'md'} title={'مدیریت ارزها'}>
          <AnimatedMotion>
            {loading ? (
              <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
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
            )}
          </AnimatedMotion>
        </CustomDialog>
      )}
    </>
  );
}
