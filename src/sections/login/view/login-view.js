'use client';

import { useState } from 'react';

import { Box, Button, useTheme, Container, TextField, useMediaQuery } from '@mui/material';

import { login } from 'src/actions/user';
import { FONTS, COLORS } from 'src/constant/colors';

import OurWeddingDivider from 'src/sections/new/ourwedding-divier';

// 디자인 컬러 (image-uploader.js와 통일)
const BG_COLOR = COLORS.BG_COLOR;
const TEXT_COLOR = COLORS.TEXT_COLOR;
const ACCENT_COLOR = COLORS.LOGIN_ACCENT_COLOR; // 로그인 전용 컬러
const ACCENT_COLOR_DARK = COLORS.LOGIN_ACCENT_COLOR_DARK; // 로그인 전용 어두운 버전
const PAPER_BG = COLORS.BG_COLOR;

const FONT_HEADING = FONTS.HEADING;

// 이메일 형식 검사 함수
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginView() {
  const [form, setForm] = useState({
    user_name: '',
    email: '',
  });
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

  // 리팩토링: validate 함수 간단화
  const validate = () => {
    const newErrors = {};
    if (!form.user_name) newErrors.user_name = '성함을 입력해주세요.';
    // else if (isNew && !noUnderscoreRule(form.user_name))
    //   newErrors.user_name = '언더바(_)는 입력할 수 없습니다.';
    if (!form.email) newErrors.email = '이메일을 입력해주세요.';
    // else if (!isValidEmail(form.email)) newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    return newErrors;
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: undefined,
    }));
  };

  // 제출 핸들러: 값 출력
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // 공백 체크 및 제거
    const trimmedUserName = form.user_name.replace(/\s/g, '');
    const trimmedEmail = form.email.replace(/\s/g, '');

    if (/\s/.test(form.user_name) || /\s/.test(form.email)) {
      if (typeof window !== 'undefined') {
        window.alert('성함과 네이버 아이디에는 공백이 없어야 합니다.');
      }
      setSubmitting(false);
      return;
    }

    setSubmitting(true);

    // 값 출력
    console.log('이메일:', trimmedEmail, '성함:', trimmedUserName);

    let data = await login({
      naver_id: trimmedEmail,
      user_name: trimmedUserName,
    });

    console.log(data);

    // 로그인 성공 시 토큰을 로컬 스토리지에 저장
    if (data && data.token) {
      localStorage.setItem('token', data.token);
    }

    // target 페이지로 이동
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (nextPage === 'new') {
        targetPath = '/ourwedding/new';
      } else if (nextPage === 'revision') {
        targetPath = '/ourwedding/revision';
      } else if (nextPage) {
        targetPath = nextPage;
      }

      window.location.href = targetPath;
    }

    setTimeout(() => setSubmitting(false), 500); // UX용 임시
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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: BG_COLOR,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: FONT_HEADING,
        px: isMobile ? 1 : 0,
      }}
    >
      <OurWeddingDivider text="Ourwedding Ourdrama" />
      <Container maxWidth="xs" sx={{ px: isMobile ? 0.5 : 2 }}>
        <Box
          sx={{
            bgcolor: PAPER_BG,
            borderRadius: 2,
            p: isMobile ? 2 : 4,
            mt: isMobile ? 2 : 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 2 : 3,
              py: isMobile ? 1 : 2,
            }}
            autoComplete="off"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 2 : 3 }}>
              <Box sx={{ mb: isMobile ? 0.5 : 1 }}>
                <Box
                  component="label"
                  htmlFor="user_name"
                  sx={{
                    display: 'block',
                    color: TEXT_COLOR, // 라벨을 흰색으로
                    fontFamily: FONT_HEADING,
                    fontWeight: 600,
                    mb: 1,
                    fontSize: isMobile ? 15 : 17,
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
                  variant="filled"
                  // placeholder={isNew ? '언더바(_)는 입력할 수 없습니다.' : undefined}
                  error={!!errors.user_name}
                  helperText={errors.user_name}
                  InputProps={{
                    style: {
                      background: ACCENT_COLOR,
                      color: TEXT_COLOR,
                      borderColor: ACCENT_COLOR,
                      fontFamily: FONT_HEADING,
                    },
                    disableUnderline: true, // 밑줄(언더라인) 제거
                  }}
                  sx={{
                    ...textFieldSx,
                    mt: 0, // input 위에 마진 제거
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ mb: isMobile ? 0.5 : 1 }}>
                <Box
                  component="label"
                  htmlFor="email"
                  sx={{
                    display: 'block',
                    color: TEXT_COLOR, // 라벨을 흰색으로
                    fontFamily: FONT_HEADING,
                    fontWeight: 600,
                    mb: 1,
                    fontSize: isMobile ? 15 : 17,
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
                  variant="filled"
                  // placeholder=""
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    style: {
                      background: ACCENT_COLOR,
                      color: TEXT_COLOR,
                      borderColor: ACCENT_COLOR,
                      fontFamily: FONT_HEADING,
                    },
                    disableUnderline: true, // 밑줄(언더라인) 제거
                  }}
                  sx={{
                    ...textFieldSx,
                    mt: 0, // input 위에 마진 제거
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
            <Button
              type="submit"
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              disabled={submitting}
              sx={{
                width: isMobile ? '100%' : 'auto',
                px: isMobile ? 0 : 4,
                alignSelf: isMobile ? 'stretch' : 'center',
                mt: isMobile ? 2 : 4,
                background: ACCENT_COLOR,
                color: TEXT_COLOR,
                fontWeight: 600,
                fontFamily: FONT_HEADING,
                border: `1.5px solid ${ACCENT_COLOR_DARK}`,
                boxShadow: 'none',
                '&:hover': {
                  background: ACCENT_COLOR_DARK,
                  color: TEXT_COLOR,
                  boxShadow: 'none',
                },
              }}
            >
              로그인
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
