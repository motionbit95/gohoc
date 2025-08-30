'use client';

import { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

import { login } from 'src/actions/user';
import { CONFIG } from 'src/global-config';

// 스타일 유틸리티 import
import { mainContainerStyle, centerFormStyle, formContainerStyle } from '../styles/utils';

// 컴포넌트 import
import AuthTitle from '../components/auth-title';
import AuthInputField from '../components/auth-input-field';
import AuthButton from '../components/auth-button';
import RotatedTitle from '../components/rotated-title';
import LogoDivider from '../components/logo-divider';

// 이메일 형식 검사 함수
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginView() {
  const [form, setForm] = useState({
    user_name: '',
    email: '',
  });
  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // nextPage 파라미터 파싱
  let nextPage = null;
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    nextPage = searchParams.get('target');
  }
  const isNew = nextPage === 'new';

  // 반응형
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 언더바 제한 규칙
  const noUnderscoreRule = (value) => /^[^_]+$/.test(value);

  // 값 검증만 수행 (비동기/부수효과 없음)
  const validate = () => {
    const trimmedUserName = form.user_name.replace(/\s/g, '');
    const trimmedEmail = form.email.replace(/\s/g, '');
    if (/\s/.test(form.user_name) || /\s/.test(form.email)) {
      if (typeof window !== 'undefined') {
        window.alert('성함과 네이버 아이디에는 공백이 없어야 합니다.');
      }
      return false;
    }
    // 추가 검증 필요시 여기에
    return { trimmedUserName, trimmedEmail };
  };

  // 로그인 및 이동 처리 (async)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = validate();
    if (!result) {
      setSubmitting(false);
      return;
    }
    const { trimmedUserName, trimmedEmail } = result;

    try {
      let data = await login({
        naver_id: trimmedEmail,
        user_name: trimmedUserName,
      });

      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }

      // target 페이지로 이동
      let targetPath = '/';
      if (nextPage === 'new') targetPath = '/new';
      else if (nextPage === 'revision') targetPath = '/revision';
      else if (nextPage) targetPath = nextPage;
      window.location.href = targetPath;
    } catch (err) {
      window.alert('로그인에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Aboreto&family=Baskervville:ital@0;1&display=swap');`}</style>
      <Box sx={mainContainerStyle(isMobile)}>
        {/* 좌측 대형 타이틀 (PC) */}
        {!isMobile && <RotatedTitle>TAILITY</RotatedTitle>}

        {!isMobile && (
          <LogoDivider
            logoSrc={`${CONFIG.assetsDir}/assets/taility/s.png`}
            logoAlt="TAILITY Logo"
          />
        )}

        {/* 중앙 폼 영역 */}
        <Box sx={centerFormStyle(isMobile)}>
          <AuthTitle isMobile={isMobile}>TAILITY</AuthTitle>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={formContainerStyle(isMobile)}
            autoComplete="off"
          >
            <AuthInputField
              id="user_name"
              name="user_name"
              label="접수자 성함"
              value={form.user_name}
              onChange={handleChange}
              required
              error={!!errors.user_name}
              helperText={errors.user_name}
              isMobile={isMobile}
            />

            <AuthInputField
              id="email"
              name="email"
              label="네이버 아이디"
              value={form.email}
              onChange={handleChange}
              required
              error={!!errors.email}
              helperText={errors.email}
              isMobile={isMobile}
            />

            <AuthButton disabled={submitting} isMobile={isMobile}>
              로그인
            </AuthButton>
          </Box>
        </Box>
      </Box>
    </>
  );
}
