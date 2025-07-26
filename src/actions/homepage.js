// 홈페이지 주의문구 CRUD 클라이언트 액션 함수

import axiosInstance from 'src/lib/axios';

const url = process.env.NEXT_PUBLIC_API_URL;

// [CREATE] 홈페이지 주의문구 생성
export async function createHomepageNotice(data) {
  // 현재 워크스페이스 정보를 localStorage에서 가져옴
  let workspaceId;
  if (typeof window !== 'undefined') {
    try {
      workspaceId = localStorage.getItem('selectedWorkspaceId');
    } catch (e) {
      // ignore
    }
  }
  const payload = workspaceId ? { ...data, workspace: workspaceId } : data;
  try {
    const response = await axiosInstance.post(`${url}/homepage`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '등록 실패');
  }
}

// [READ] 전체 목록 조회 (옵션: workspace별)
export async function fetchHomepageNotices({ workspace } = {}) {
  let workspaceId = workspace;
  if (!workspaceId && typeof window !== 'undefined') {
    try {
      workspaceId = localStorage.getItem('selectedWorkspaceId');
    } catch (e) {
      // ignore
    }
  }
  const params = workspaceId ? { workspace: workspaceId } : {};
  const response = await axiosInstance.get(`${url}/homepage`, { params });
  return response.data;
}

// [READ] 단일 조회 (id)
export async function fetchHomepageNotice(id) {
  try {
    const response = await axiosInstance.get(`${url}/homepage/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '조회 실패');
  }
}

// [UPDATE] 수정
export async function updateHomepageNotice(id, data) {
  try {
    const response = await axiosInstance.put(`${url}/homepage/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '수정 실패');
  }
}

// [DELETE] 삭제
export async function deleteHomepageNotice(id) {
  try {
    const response = await axiosInstance.delete(`${url}/homepage/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '삭제 실패');
  }
}
