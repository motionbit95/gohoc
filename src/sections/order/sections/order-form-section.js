import OrderForm from '../components/order-form';
import ImageUploader from '../components/image-uploader';
import CautionAgree from '../components/caution-agree';
import SectionCard from '../../shared/components/section-card';

export default function OrderFormSection({ onSubmit, loading, initialData }) {
  return (
    <SectionCard title="주문서 작성">
      {/* 주문 폼 */}
      <OrderForm onSubmit={onSubmit} loading={loading} initialData={initialData} />

      {/* 이미지 업로더 */}
      <ImageUploader />

      {/* 주의사항 동의 */}
      <CautionAgree />
    </SectionCard>
  );
}
