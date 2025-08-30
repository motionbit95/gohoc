import OrderRequest from '../components/order-request';
import SectionCard from '../../shared/components/section-card';

export default function OrderRequestSection({ value, onChange }) {
  return (
    <SectionCard title="주문 요청사항">
      <OrderRequest value={value} onChange={onChange} />
    </SectionCard>
  );
}
