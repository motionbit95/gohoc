'use client';

// 입력값 변경 핸들러
// (LoginView 함수 내부에서 정의)

import { useState } from 'react';

import { Box, Button, useTheme, Container, TextField, useMediaQuery } from '@mui/material';

import { login } from 'src/actions/user';
import { FONTS, COLORS } from 'src/constant/colors';

import OurWeddingDivider from 'src/sections/new/ourwedding-divier';
import { CONFIG } from 'src/global-config';
import { Image } from 'src/components/image';

// Taility 전용 블랙&화이트 스타일
const BG_COLOR = '#fff'; // 흰색 배경
const TEXT_COLOR = '#111'; // 진한 검정 텍스트
const ACCENT_COLOR = '#111'; // 버튼/입력: 검정
const ACCENT_COLOR_DARK = '#000'; // hover: 더 진한 검정
const PAPER_BG = '#fff';
const FONT_HEADING = 'Pretendard, Noto Sans KR, sans-serif';

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

  // 스타일 공통화 (상하로 가운데 정렬)
  const textFieldSx = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 상하(수직) 가운데 정렬
    '& .MuiFilledInput-root': {
      background: ACCENT_COLOR,
      color: TEXT_COLOR,
      borderRadius: 1,
      border: `1.5px solid ${ACCENT_COLOR}`,
      fontFamily: FONT_HEADING,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center', // input 내부 상하 가운데 정렬
      '& input': {
        paddingTop: 0,
        paddingBottom: 0,
        height: '2.5em', // 높이 고정(상하 가운데)
        display: 'flex',
        alignItems: 'center',
      },
      '&:hover': {
        background: ACCENT_COLOR,
      },
    },
    '& .MuiFormLabel-root': {
      color: TEXT_COLOR,
      fontFamily: FONT_HEADING,
      width: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      position: 'absolute',
      top: '50%',
      transformOrigin: 'center',
      translate: '0 -50%', // 상하 가운데
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Aboreto&family=Baskervville:ital@0;1&display=swap');`}</style>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: BG_COLOR,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
          fontFamily: FONT_HEADING,
          px: 0,
        }}
      >
        {/* 좌측 대형 타이틀 (PC) */}
        {!isMobile && (
          <Box
            sx={{
              position: 'relative',
              width: '20%',
              minWidth: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                fontFamily: 'Aboreto',
                fontSize: 180,
                transform: 'rotate(90deg)',
                transformOrigin: 'bottom left',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                position: 'absolute',
                top: 0,
                left: -36,
                color: 'rgba(0,0,0,0.12)',
                userSelect: 'none',
              }}
            >
              TAILITY
            </Box>
          </Box>
        )}

        {!isMobile && (
          <div
            style={{
              position: 'relative',
              width: '20%',
              minWidth: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 1,
                backgroundColor: 'black',
                height: '100vh',
                left: '50%',
                transform: 'translateX(-0.5px)',
              }}
            />
            <Image preview={false} src={`${CONFIG.assetsDir}/assets/taility/s.png`} alt="Logo" />
          </div>
        )}

        {/* 중앙 폼 영역 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: isMobile ? 4 : 0,
          }}
        >
          <Box sx={{ width: '100%', textAlign: 'center', mb: isMobile ? 2 : 4 }}>
            <Box
              sx={{
                fontFamily: 'Baskervville',
                fontWeight: 400,
                fontSize: isMobile ? 38 : 54,
                color: 'rgba(0,0,0,0.5)',
                letterSpacing: 2,
                mb: 2,
              }}
            >
              TAILITY
            </Box>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              maxWidth: 400,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              background: '#fff',
              borderRadius: 0,
              p: isMobile ? 2 : 4,
            }}
            autoComplete="off"
          >
            <Box>
              <Box
                component="label"
                htmlFor="user_name"
                sx={{
                  display: 'block',
                  color: '#111',
                  fontFamily: 'Baskervville',
                  fontWeight: 600,
                  mb: 1,
                  fontSize: isMobile ? 16 : 18,
                  letterSpacing: 1,
                }}
              >
                접수자 성함
              </Box>
              <TextField
                id="user_name"
                name="user_name"
                value={form.user_name}
                onChange={handleChange}
                required
                fullWidth
                variant="standard"
                error={!!errors.user_name}
                helperText={errors.user_name}
                InputProps={{
                  style: {
                    background: 'transparent',
                    color: '#111',
                    border: 'none',
                    borderBottom: '1.5px solid #111',
                    fontFamily: 'Baskervville',
                    fontSize: isMobile ? 18 : 20,
                    padding: '8px 0',
                  },
                  disableUnderline: false,
                }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 2,
                  '& .MuiInput-underline:before': {
                    borderBottom: '1.5px solid #111',
                  },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottom: '2px solid #111',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottom: '2px solid #111',
                  },
                }}
              />
            </Box>
            <Box>
              <Box
                component="label"
                htmlFor="email"
                sx={{
                  display: 'block',
                  color: '#111',
                  fontFamily: 'Baskervville',
                  fontWeight: 600,
                  mb: 1,
                  fontSize: isMobile ? 16 : 18,
                  letterSpacing: 1,
                }}
              >
                네이버 아이디
              </Box>
              <TextField
                id="email"
                name="email"
                type="text"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
                variant="standard"
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  style: {
                    background: 'transparent',
                    color: '#111',
                    border: 'none',
                    borderBottom: '1.5px solid #111',
                    fontFamily: 'Baskervville',
                    fontSize: isMobile ? 18 : 20,
                    padding: '8px 0',
                  },
                  disableUnderline: false,
                }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 2,
                  '& .MuiInput-underline:before': {
                    borderBottom: '1.5px solid #111',
                  },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottom: '2px solid #111',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottom: '2px solid #111',
                  },
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="text"
              size={isMobile ? 'medium' : 'large'}
              disabled={submitting}
              sx={{
                width: 'auto',
                px: 4,
                alignSelf: 'center',
                mt: 2,
                background: '#111',
                color: '#fff',
                fontWeight: 600,
                fontFamily: 'Baskervville',
                fontSize: isMobile ? 18 : 20,
                borderRadius: 0,
                borderBottom: '2px solid #111',
                boxShadow: 'none',
                letterSpacing: 1,
                '&:hover': {
                  background: '#000',
                  color: '#fff',
                  boxShadow: 'none',
                },
                transition: 'background 0.2s',
              }}
            >
              로그인
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
