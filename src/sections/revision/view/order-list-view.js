'use client';

import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import OrderListCaution from '../order-list-caution';
import { COLORS } from 'src/constant/colors';
import { useEffect, useState } from 'react';
import { getOrderByNaverId } from 'src/actions/order';

// getMe 함수가 실제로 import되어야 함. 예시로 추가
import { getMe } from 'src/actions/user';
import OrderBox from '../order-box';

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
            window.location.href = '/ourwedding/login?target=revision';
          }
          setLoading(false);
          return;
        }

        // getMe는 반드시 async/await로 처리
        const res = await getMe(token);

        if (!res || !res.user) {
          throw new Error('유저 정보를 불러오지 못했습니다.');
        }
        const userData = {
          userId: res.user.naver_id,
          userName: res.user.user_name,
        };
        setUser(userData);

        console.log(userData.userId);

        // 주문 정보도 await로 안전하게
        const orderData = await getOrderByNaverId(userData.userId);
        setOrders(orderData || []);
      } catch (err) {
        setMessage('유저 정보를 불러오지 못했습니다.');
        setMessageType('error');
        setMessageOpen(true);
        // 필요시 로그인 페이지로 이동
        // if (typeof window !== 'undefined') {
        //   window.location.href = '/ourwedding/login?target=revision';
        // }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

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
    </Box>
  );
};

export default OrderListView;
