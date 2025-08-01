// Render: Sample Buttons (MUI 리팩토링, 반응형)
import React, { useState } from 'react';
import { BsCaretRightFill } from 'react-icons/bs';

import { Stack, Button, useMediaQuery, CircularProgress } from '@mui/material';

import { COLORS } from 'src/constant/colors';

const SampleButtons = ({ order }) => {
  const isMdUp = useMediaQuery('(min-width:726px)');
  const [loading, setLoading] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState('');
  // setSelectedOrder는 상위에서 내려받거나 context로 처리해야 함. 임시로 noop
  const setSelectedOrder = () => {};

  // downloadFolder도 상위에서 import되어야 함. 임시로 window.alert
  const downloadFolder = (order, files, label) => {
    window.alert(`${label} 다운로드: ${Array.isArray(files) ? files.length : 0}개 파일`);
  };

  // --- 정확한 disable 조건 정의 ---
  // 1. 미리보기 버튼: sendStatus가 true여야 활성화
  const isPreviewDisabled = loading || !order?.sendStatus;

  // 2. 샘플 다운로드 버튼:
  //    - loading 중이면 비활성화
  //    - order.isClear가 true여야 활성화
  //    - order.first(샘플 파일)가 있어야 활성화
  const isSampleDownloadDisabled =
    loading ||
    !order?.isClear ||
    !order?.first ||
    (Array.isArray(order.first) && order.first.length === 0);

  return (
    <Stack
      direction={isMdUp ? 'row' : 'column'}
      spacing={2.5}
      alignItems="center"
      sx={{
        alignSelf: 'center',
        py: 4.5,
        width: isMdUp ? '50%' : '100%',
      }}
    >
      <Button
        variant="contained"
        endIcon={<BsCaretRightFill />}
        disabled={isPreviewDisabled}
        fullWidth
        onClick={() => {
          if (isPreviewDisabled) return;
          setSelectedOrder(order);
        }}
        sx={{
          fontSize: { xs: 15, md: 17 },
          backgroundColor: isPreviewDisabled ? 'rgba(150,150,150,0.4)' : COLORS.DETAIL_ACCENT_COLOR,
          color: COLORS.DETAIL_BG_COLOR,
          fontWeight: 700,
          boxShadow: '0 2px 8px 0 rgba(110,133,87,0.10)',
          opacity: isPreviewDisabled ? 0.6 : 1,
          cursor: isPreviewDisabled ? 'not-allowed' : 'pointer',
          '&:hover': {
            backgroundColor: isPreviewDisabled
              ? 'rgba(150,150,150,0.4)'
              : COLORS.DETAIL_ACCENT_COLOR_DARK,
          },
        }}
      >
        웹에서 미리보기
      </Button>
      <Button
        variant="contained"
        endIcon={
          loading && loadingTarget === '샘플' ? (
            <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
          ) : (
            <BsCaretRightFill />
          )
        }
        fullWidth
        sx={{
          backgroundColor: isSampleDownloadDisabled
            ? 'rgba(150,150,150,0.4)'
            : COLORS.DETAIL_ACCENT_COLOR,
          color: COLORS.DETAIL_BG_COLOR,
          cursor: isSampleDownloadDisabled ? 'not-allowed' : 'pointer',
          opacity: isSampleDownloadDisabled ? 0.6 : 1,
          fontSize: { xs: 15, md: 17 },
          fontWeight: 700,
          boxShadow: '0 2px 8px 0 rgba(110,133,87,0.10)',
          '&:hover': {
            backgroundColor: isSampleDownloadDisabled
              ? 'rgba(150,150,150,0.4)'
              : COLORS.DETAIL_ACCENT_COLOR_DARK,
          },
        }}
        onClick={() => {
          if (isSampleDownloadDisabled) return;
          setLoading(true);
          setLoadingTarget('샘플');
          downloadFolder(order, order.first, '샘플');
          setTimeout(() => {
            setLoading(false);
            setLoadingTarget('');
          }, 1000);
        }}
        disabled={isSampleDownloadDisabled}
      >
        샘플 다운로드
      </Button>
    </Stack>
  );
};

export default SampleButtons;
