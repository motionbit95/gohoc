// Render: Sample Buttons (MUI 리팩토링, 반응형)
import React, { useState } from 'react';
import { Stack, Button, CircularProgress, useMediaQuery } from '@mui/material';
import { BsCaretRightFill } from 'react-icons/bs';

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
        color="primary"
        endIcon={<BsCaretRightFill />}
        disabled={!order.sendStatus}
        fullWidth
        onClick={() => setSelectedOrder(order)}
        sx={{
          fontSize: { xs: 15, md: 17 },
        }}
      >
        웹에서 미리보기
      </Button>
      <Button
        variant="contained"
        color="primary"
        endIcon={<BsCaretRightFill />}
        fullWidth
        sx={{
          backgroundColor: !order.isClear ? 'rgba(150,150,150,0.4)' : 'rgba(69, 85, 43, 1)',
          color: 'white',
          cursor: !order.isClear ? 'not-allowed' : 'pointer',
          opacity: !order.isClear ? 0.6 : 1,
          fontSize: { xs: 15, md: 17 },
          '&:hover': {
            backgroundColor: !order.isClear ? 'rgba(150,150,150,0.4)' : 'rgba(69, 85, 43, 0.85)',
          },
        }}
        onClick={() => {
          setLoading(true);
          setLoadingTarget('샘플');
          downloadFolder(order, order.first, '샘플');
          setTimeout(() => {
            setLoading(false);
            setLoadingTarget('');
          }, 1000);
        }}
        disabled={!order.isClear}
      >
        {loading && loadingTarget === '샘플' ? (
          <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
        ) : null}
        샘플 다운로드
      </Button>
    </Stack>
  );
};

export default SampleButtons;
