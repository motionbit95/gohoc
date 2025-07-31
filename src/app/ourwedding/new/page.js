import OrderView from 'src/sections/new/view/order-view';
import { Metadata } from 'next';

export const metadata = {
  title: '아워웨딩 | 주문접수',
  description: '아워웨딩 주문 접수 페이지입니다.',
};

export default function OrderPage() {
  return <OrderView />;
}
