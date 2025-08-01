/**
 * 주문 코멘트 관련 API 호출 함수들 (Next.js 클라이언트/서버 fetch 기반, 경로: /comment)
 */

/**
 * 코멘트 생성
 * @param {Object} commentData - { orderId, step, comment }
 * @returns {Promise<Object>}
 */
export async function createOrderComment(commentData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || '코멘트 생성에 실패했습니다.');
  }
  return data.comment;
}

/**
 * 주문별 코멘트 전체 조회
 * @param {string} orderId
 * @returns {Promise<Array>}
 */
export async function getOrderCommentsByOrderId(orderId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/comment/order/${encodeURIComponent(orderId)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || '코멘트 목록을 불러오지 못했습니다.');
  }
  return data.comments;
}

/**
 * 코멘트 단일 조회
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getOrderCommentById(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || '코멘트 정보를 불러오지 못했습니다.');
  }
  return data.comment;
}

/**
 * 코멘트 수정
 * @param {string} id
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
export async function updateOrderComment(id, updateData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || '코멘트 수정에 실패했습니다.');
  }
  return data.comment;
}

/**
 * 코멘트 삭제
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteOrderComment(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || '코멘트 삭제에 실패했습니다.');
  }
}
