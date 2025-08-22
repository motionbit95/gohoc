'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { COLORS } from 'src/constant/colors';
import { ConfigProvider, Flex, Form, Input } from 'antd';
import { CONFIG } from 'src/global-config';
import { login } from 'src/actions/user';

const BUTTON_STYLE = {
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: '220px',
  aspectRatio: '11 / 6', // width:height = 220:120
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const INPUT_STYLE = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  boxShadow: 'none',
  caretColor: '#2772C7',
  textAlign: 'center',
  width: '180px',
  fontFamily: 'GumiRomanceTTF',
};

const LABEL_STYLE = {
  fontSize: '16px',
  fontFamily: 'GumiRomanceTTF',
};

function FormField({
  label,
  name,
  inputName,
  rules,
  error,
  help,
  isMobile,
  labelColor,
  backgroundImage,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 4,
      }}
    >
      <Box
        sx={{
          ...LABEL_STYLE,
          color: labelColor,
        }}
      >
        {label}
      </Box>
      <Form.Item
        colon={false}
        name={name}
        rules={rules}
        validateStatus={error ? 'error' : ''}
        help={help}
      >
        <div
          style={{
            ...BUTTON_STYLE,
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          <Input name={inputName} style={INPUT_STYLE} autoComplete="off" />
        </div>
      </Form.Item>
    </Box>
  );
}

export default function LoginView() {
  // 내부 상태로 모든 처리
  const [fontLoaded, setFontLoaded] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // 폰트 로딩
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.document && window.document.fonts) {
        window.document.fonts.load("1em 'Lilita One'").then(() => {
          setFontLoaded(true);
        });
      } else {
        setTimeout(() => setFontLoaded(true), 300);
      }
    }
  }, []);

  // 모바일 여부 감지
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 480);
    }
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // 입력값 변경 핸들러
  const handleValuesChange = useCallback((changedValues) => {
    // 에러 초기화
    setErrors((prev) => {
      const newErrors = { ...prev };
      if ('user_name' in changedValues) delete newErrors.user_name;
      if ('naver_id' in changedValues) delete newErrors.email;
      return newErrors;
    });
  }, []);

  // 제출 핸들러
  // 제출 핸들러: 실제 로그인 처리 및 리다이렉트
  const handleSubmit = useCallback(
    async (values) => {
      setSubmitting(true);

      // 공백이 있으면 Alert
      if (
        (values.user_name && values.user_name.includes(' ')) ||
        (values.naver_id && values.naver_id.includes(' '))
      ) {
        alert('입력값에 공백이 포함되어 있습니다. 공백 없이 입력해주세요.');
        setSubmitting(false);
        return;
      }

      // 유효성 검사
      const newErrors = {};
      if (!values.user_name) {
        newErrors.user_name = '접수자 성함을 입력해주세요.';
      }
      if (!values.naver_id) {
        newErrors.email = '네이버 아이디를 입력해주세요.';
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setSubmitting(false);
        return;
      }

      // 실제 로그인 처리
      try {
        const data = await login({
          naver_id: values.naver_id,
          user_name: values.user_name,
        });

        console.log(data);

        // 로그인 성공 시 토큰을 로컬 스토리지에 저장
        if (data && data.token) {
          localStorage.setItem('token', data.token);
        }

        // target 페이지로 이동
        if (typeof window !== 'undefined') {
          // URL에서 target 쿼리 파라미터 추출
          const params = new URLSearchParams(window.location.search);
          const target = params.get('target');
          let targetPath = '/';
          if (target === 'new') {
            targetPath = '/new';
          } else if (target === 'revision') {
            targetPath = '/revision';
          } else if (target) {
            targetPath = target.startsWith('/') ? target : `/${target}`;
          }
          window.location.href = targetPath;
        }

        // 성공 시 폼 초기화
        form.resetFields();
      } catch (e) {
        setErrors({ global: '로그인에 실패했습니다.' });
      }

      setTimeout(() => setSubmitting(false), 500); // UX용 임시
    },
    [form]
  );

  const safeErrors = useMemo(() => errors || {}, [errors]);
  const theme = useMemo(
    () => ({
      token: {
        colorPrimary: '#2772C7',
      },
    }),
    []
  );

  return (
    <ConfigProvider theme={theme}>
      <Flex
        vertical
        style={{
          backgroundColor: '#EDF9FF',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Preload font to avoid UI jump */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap"
          rel="stylesheet"
        />

        {/* Only render UI after font is loaded to prevent "움찔거려" */}
        {fontLoaded && (
          <>
            <Typography
              sx={{
                '@media (max-width:480px)': { fontSize: '18px' },
                '@media (min-width:481px) and (max-width:767px)': { fontSize: '24px' },
                '@media (min-width:768px) and (max-width:1023px)': { fontSize: '36px' },
                '@media (min-width:1024px)': { fontSize: '48px' },
              }}
              style={{
                color: '#F3FFF3',
                fontFamily: "'Lilita One', sans-serif",
                borderColor: 'transparent',
                WebkitTextStroke: '1.2px #4DA0FF',
              }}
            >
              Want’s wedding
            </Typography>

            <Form
              form={form}
              onFinish={handleSubmit}
              requiredMark={false}
              variant="filled"
              style={{ zIndex: 99 }}
              onValuesChange={handleValuesChange}
            >
              <Flex vertical gap="middle" style={{ paddingBlock: 24, paddingInline: '24px' }}>
                <FormField
                  label="접수자 성함"
                  name="user_name"
                  inputName="user_name"
                  rules={[{ required: true, message: '접수자 성함을 입력해주세요.' }]}
                  error={safeErrors.user_name}
                  help={safeErrors.user_name}
                  isMobile={isMobile}
                  labelColor="black"
                  backgroundImage={`${CONFIG.assetsDir}/assets/wantswedding/button_click.png`}
                />
                <FormField
                  label="네이버 아이디"
                  name="naver_id"
                  inputName="email"
                  rules={[{ required: true, message: '네이버 아이디를 입력해주세요.' }]}
                  error={safeErrors.email}
                  help={safeErrors.email}
                  isMobile={isMobile}
                  labelColor={COLORS.label}
                  backgroundImage={`${CONFIG.assetsDir}/assets/wantswedding/button_click.png`}
                />

                <div
                  style={{
                    backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/button2.png)`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    htmlType="submit"
                    type="text"
                    size="large"
                    style={{
                      marginTop: '16px',
                      fontFamily: 'GumiRomanceTTF',
                      whiteSpace: 'pre-line',
                      color: '#2772C7',
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      zIndex: 99,
                    }}
                    loading={submitting}
                  >
                    로그인
                  </Button>
                </div>
                {safeErrors.global && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {safeErrors.global}
                  </Typography>
                )}
              </Flex>
            </Form>

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                paddingTop: '30%',
                backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/bg1.png)`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center bottom',
              }}
            ></div>
          </>
        )}

        {/* Optionally, show a blank or loading state while font is loading */}
        {!fontLoaded && <div style={{ minHeight: 200 }} />}
      </Flex>

      <style jsx>{`
        .ant-input,
        .ant-input-filled,
        .ant-input:focus,
        .ant-input-focused {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          color: transparent !important;
          caret-color: #2772c7 !important;
        }
        .ant-input::placeholder {
          color: transparent !important;
        }
        .ant-form-item-label {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
      `}</style>
    </ConfigProvider>
  );
}
