import RevisionTitle from '../components/revision-title';
import OrderForm from '../components/order-form';
import NormalButtons from '../components/normal-buttons';
import SectionCard from '../../shared/components/section-card';

export default function RevisionFormSection({ revisionData, onSubmit, loading }) {
  return (
    <SectionCard title="수정 요청서">
      {/* 수정 제목 */}
      <RevisionTitle />

      {/* 수정 폼 */}
      <OrderForm onSubmit={onSubmit} loading={loading} initialData={revisionData} />

      {/* 버튼 그룹 */}
      <NormalButtons />
    </SectionCard>
  );
}
