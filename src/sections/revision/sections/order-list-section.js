import { Box, Typography } from '@mui/material';
import OrderBox from '../components/order-box';
import OrderListCaution from '../components/order-list-caution';
import SectionCard from '../../shared/components/section-card';

export default function OrderListSection({ orders, onOrderSelect }) {
  return (
    <SectionCard title="주문 목록">
      {/* 주의사항 */}
      <OrderListCaution />

      {/* 주문 목록 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {orders?.map((order) => (
          <OrderBox key={order.id} order={order} onClick={() => onOrderSelect(order)} />
        ))}

        {(!orders || orders.length === 0) && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            수정 가능한 주문이 없습니다.
          </Typography>
        )}
      </Box>
    </SectionCard>
  );
}
