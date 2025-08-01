// 파일 관련 API 호출 함수들 (Next.js 클라이언트/서버 fetch 기반, 경로: /file)

/**
 * 파일 전체 목록 조회
 * @returns {Promise<Array>} - 모든 파일 배열
 */
export async function getAllFiles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error('파일 목록을 불러오지 못했습니다.');
  }
  return await res.json();
}

/**
 * 파일 ID로 단일 파일 조회
 * @param {string} fileId
 * @returns {Promise<Object|null>}
 */
export async function getFileById(fileId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file/${encodeURIComponent(fileId)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error('파일 정보를 불러오지 못했습니다.');
  }
  return await res.json();
}

/**
 * 파일 생성
 * @param {Object} fileData - 파일 데이터
 * @returns {Promise<Object>}
 */
export async function createFile(fileData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fileData),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || '파일 생성에 실패했습니다.');
  }
  return await res.json();
}

/**
 * 파일 정보 수정
 * @param {string} fileId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
export async function updateFile(fileId, updateData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file/${encodeURIComponent(fileId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || '파일 정보 수정에 실패했습니다.');
  }
  return await res.json();
}

/**
 * 파일 삭제 (하드 삭제)
 * @param {string} fileId
 * @returns {Promise<Object>}
 */
export async function deleteFile(fileId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file/${encodeURIComponent(fileId)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || '파일 삭제에 실패했습니다.');
  }
  return await res.json();
}
