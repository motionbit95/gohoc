'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo, useCallback, useEffect } from 'react';

import { Box, useTheme, useMediaQuery } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// 스타일 유틸리티 import
import { mainContainerStyle } from '../styles/utils';

// 컴포넌트 import
import TailityActionButton from '../components/taility-action-button';
import HomeContainer from '../components/home-container';

const BUTTON_CONFIGS = [
  {
    label: '신규신청',
    page: 'new',
  },
  {
    label: '접수내역 (재수정신청)',
    page: 'revision',
  },
];

export default function Taility() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  // 여기오면 localstorage 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  }, []);

  const handleButtonClick = useCallback(
    (page) => {
      router.push(`/taility/login/?target=${page}`);
    },
    [router]
  );

  // useMemo로 버튼 목록 생성 (불필요한 리렌더 방지)
  const buttons = useMemo(
    () =>
      BUTTON_CONFIGS.map(({ label, page, icon }) => (
        <TailityActionButton
          key={page}
          label={label}
          icon={icon}
          isMobile={isMobile}
          onClick={() => handleButtonClick(page)}
        />
      )),
    [isMobile, handleButtonClick]
  );

  return (
    <Box sx={mainContainerStyle}>
      <HomeContainer>{buttons}</HomeContainer>
    </Box>
  );
}
