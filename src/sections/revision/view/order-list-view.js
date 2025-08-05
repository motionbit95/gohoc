'use client';

import { useState, useEffect } from 'react';

import { Box, Stack, Alert, Divider, Snackbar, Container, Typography } from '@mui/material';

// getMe 함수가 실제로 import되어야 함. 예시로 추가
import { getMe } from 'src/actions/user';
import { COLORS } from 'src/constant/colors';
import { getOrderByNaverId } from 'src/actions/order';

import OrderBox from '../order-box';
import OrderListCaution from '../order-list-caution';

const BG_COLOR = COLORS.DETAIL_BG_COLOR;
const ACCENT_COLOR_DARK = 'rgb(220, 222, 204)';
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;

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
              window.location.href = '/ourwedding/login?target=revision';
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
                window.location.href = '/ourwedding/login?target=revision';
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

  return (
    <Box sx={{ minHeight: '100vh', background: BG_COLOR }}>
      <Container maxWidth={false} disableGutters sx={{ py: { xs: 2, md: 4 } }}>
        <Stack
          spacing={4}
          alignItems="stretch"
          sx={{
            mx: 'auto',
            width: '100%',
            px: { xs: 1, sm: 2, md: 0 },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 24, md: 30 },
              color: COLORS.DETAIL_ACCENT_COLOR_DARK,
              letterSpacing: 1,
              textShadow: '0 1px 2px rgba(35,41,31,0.18)',
              mb: 1.5,
              textAlign: 'center',
              mt: '10vh',
              mb: '5vh',
            }}
          >
            접수내역 (재수정 신청)
          </Typography>

          <OrderListCaution />

          {/* 예시: 주문 목록 출력 */}
          {loading ? (
            <Typography align="center" sx={{ color: COLORS.DETAIL_ACCENT_COLOR_DARK }}>
              불러오는 중...
            </Typography>
          ) : orders && orders.length > 0 ? (
            <Stack spacing={2}>
              {orders.map((order, idx) => (
                <Box key={idx}>
                  <OrderBox order={order} />
                  <Divider />
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography align="center" sx={{ color: COLORS.DETAIL_ACCENT_COLOR_DARK }}>
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
          sx={{ width: '100%', fontWeight: 600, fontSize: 16 }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderListView;
