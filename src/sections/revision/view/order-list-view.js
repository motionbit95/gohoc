'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Alert, Divider, Snackbar, Container, Typography } from '@mui/material';

import { getMe } from 'src/actions/user';
import { COLORS } from 'src/constant/colors';
import { getOrderByNaverId } from 'src/actions/order';

import OrderBox from '../order-box';
import OrderListCaution from '../order-list-caution';

// 스타일 분리
const styles = {
  flexColumnCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titleMain: {
    fontFamily: '"Linden Hill", Baskervville, serif',
    fontSize: { xs: '48px', sm: '72px', md: '120px', lg: '160px' },
    whiteSpace: 'nowrap',
    mb: { xs: '-24px', sm: '-36px', md: '-56px', lg: '-80px' },
    lineHeight: 1,
    letterSpacing: 1,
    textAlign: 'center',
    fontWeight: 400,
    width: '100%',
    maxWidth: 900,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleSub: {
    fontFamily: '"Linden Hill", Baskervville, serif',
    whiteSpace: 'nowrap',
    fontWeight: 300,
    fontSize: { xs: '18px', sm: '28px', md: '36px', lg: '48px' },
    textAlign: 'center',
    mt: { xs: 4, md: 8 },
    width: '100%',
    maxWidth: 900,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  divider: {
    width: 4,
    height: 40,
    border: '0.5px solid black',
    my: 2,
  },
  titleTaility: {
    fontFamily: '"Linden Hill", Baskervville, serif',
    my: 2,
    letterSpacing: 2,
    fontWeight: 700,
    textAlign: 'center',
    width: '100%',
    maxWidth: 900,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleReceipt: {
    fontFamily: '"Linden Hill", Baskervville, serif',
    fontWeight: 600,
    textAlign: 'center',
    mt: 1,
    width: '100%',
    maxWidth: 900,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  container: {
    minHeight: '100vh',
    background: COLORS.DETAIL_BG_COLOR,
  },
  innerContainer: {
    py: { xs: 2, md: 4 },
  },
  stack: {
    mx: 'auto',
    width: '100%',
    px: { xs: 1, sm: 2, md: 0 },
  },
  loadingText: {
    color: COLORS.DETAIL_ACCENT_COLOR_DARK,
  },
  emptyText: {
    color: COLORS.DETAIL_ACCENT_COLOR_DARK,
  },
  dividerBox: {
    borderColor: 'black',
    borderBottomWidth: 2,
    borderStyle: 'dashed',
  },
  alert: {
    width: '100%',
    fontWeight: 600,
    fontSize: 16,
  },
};

// Flex 대체: MUI Box로 직접 구현
const Flex = ({ vertical, style, children, ...props }) => (
  <Box display="flex" flexDirection={vertical ? 'column' : 'row'} {...props} style={style}>
    {children}
  </Box>
);

const OrderListView = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 메시지 상태 관리
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageType, setMessageType] = useState('info'); // 'error' | 'success' | 'info' | 'warning'

  // 유저 정보와 주문 정보 모두 비동기로 안전하게 처리
  useEffect(() => {
    const fetchUserAndOrders = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          setMessage('로그인이 필요합니다.');
          setMessageType('error');
          setMessageOpen(true);
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.href = '/login?target=revision';
            }, 1200); // 1.2초 후 이동 (스낵바 보이게)
          }
          setLoading(false);
          return;
        }

        // getMe는 반드시 async/await로 처리
        await getMe(token)
          .then(async (res) => {
            const userData = {
              userId: res.user.naver_id,
              userName: res.user.user_name,
            };
            setUser(userData);

            // 주문 정보도 await로 안전하게
            const orderData = await getOrderByNaverId(userData.userId);
            setOrders(orderData || []);
          })
          .catch((error) => {
            setMessage(error.message || '유저 정보를 불러오지 못했습니다.');
            setMessageType('error');
            setMessageOpen(true);

            if (typeof window !== 'undefined') {
              setTimeout(() => {
                window.location.href = '/login?target=revision';
              }, 1200); // 1.2초 후 이동 (스낵바 보이게)
            }
          });
      } catch (err) {
        setMessage('유저 정보를 불러오지 못했습니다.');
        setMessageType('error');
        setMessageOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setMessageOpen(false);
  };

  function renderTitleSection() {
    return (
      <Flex vertical style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Flex vertical style={styles.flexColumnCenter}>
          <Typography sx={styles.titleMain}>Receipt details</Typography>
          <Typography sx={styles.titleSub}>(Application for revision)</Typography>
        </Flex>

        <Box sx={styles.divider} />

        <Typography variant="h5" sx={styles.titleTaility}>
          TAILITY
        </Typography>
        <Typography variant="h4" sx={styles.titleReceipt}>
          접수내역
        </Typography>
      </Flex>
    );
  }

  return (
    <>
      {/* 폰트 import를 next/head로 head에 삽입 (세로고침시 스타일 깨짐 방지) */}
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Aboreto&family=Baskervville:ital@0;1&family=Castoro+Titling&family=Linden+Hill:ital@0;1&display=swap"
        />
      </head>
      <Box sx={styles.container}>
        <Container maxWidth={false} disableGutters sx={styles.innerContainer}>
          <Stack spacing={4} alignItems="stretch" sx={styles.stack}>
            {renderTitleSection()}

            <OrderListCaution />

            {/* 예시: 주문 목록 출력 */}
            {loading ? (
              <Typography align="center" sx={styles.loadingText}>
                불러오는 중...
              </Typography>
            ) : orders && orders.length > 0 ? (
              <Stack spacing={2}>
                {orders.map((order, idx) => (
                  <Box key={idx}>
                    <OrderBox order={order} />
                    <Divider sx={styles.dividerBox} />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography align="center" sx={styles.emptyText}>
                주문 내역이 없습니다.
              </Typography>
            )}
          </Stack>
        </Container>
        <Snackbar
          open={messageOpen}
          autoHideDuration={3500}
          onClose={handleMessageClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleMessageClose}
            severity={messageType}
            sx={styles.alert}
            variant="filled"
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default OrderListView;
