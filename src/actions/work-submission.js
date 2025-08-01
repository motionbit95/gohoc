/**
 * 작업 제출물 관련 API 호출 함수들 (Next.js 클라이언트/서버 fetch 기반, 경로: /work-submission)
 */

/**
 * 특정 주문의 작업 제출물 전체 조회
 * @param {string} orderId
 * @returns {Promise<Array>}
 */
export async function getWorkSubmissionsByOrderId(orderId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/work-submission/order/${encodeURIComponent(orderId)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!res.ok) {
    throw new Error('작업 제출물 목록을 불러오지 못했습니다.');
  }
  const data = await res.json();
  return data.submissions || [];
}

/**
 * 작업 제출물 단일 조회
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getWorkSubmissionById(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/work-submission/${encodeURIComponent(id)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('작업 제출물 정보를 불러오지 못했습니다.');
  }
  const data = await res.json();
  return data.submission || null;
}

/**
 * 작업 제출물 생성
 * @param {string} orderId
 * @param {string} type
 * @param {Array} files
 * @returns {Promise<Object>}
 */
export async function createWorkSubmission(orderId, type, files = []) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work-submission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, type, files }),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || '작업 제출물 생성에 실패했습니다.');
  }
  const data = await res.json();
  return data.submission;
}

/**
 * 작업 제출물 수정
 * @param {string} id
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
export async function updateWorkSubmission(id, updateData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/work-submission/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    }
  );
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || '작업 제출물 수정에 실패했습니다.');
  }
  const data = await res.json();
  return data.submission;
}

/**
 * 작업 제출물 soft delete
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function softDeleteWorkSubmission(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/work-submission/soft/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || '작업 제출물 소프트 삭제에 실패했습니다.');
  }
  const data = await res.json();
  return data.submission;
}

/**
 * 작업 제출물 완전 삭제
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteWorkSubmission(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/work-submission/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || '작업 제출물 삭제에 실패했습니다.');
  }
}
