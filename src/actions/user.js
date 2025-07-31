// user 관련 API 호출 함수들 (axiosInstance 사용, 경로: /user)

import axiosInstance from 'src/lib/axios';

const url = process.env.NEXT_PUBLIC_API_URL;

// Create User
export async function createUser(userData) {
  const res = await axiosInstance.post(`${url}/user`, userData);
  return res.data;
}

// Get User by naver_id
export async function getUser(naver_id) {
  const res = await axiosInstance.get(`${url}/user/${encodeURIComponent(naver_id)}`);
  return res.data;
}

// Update User
export async function updateUser(naver_id, updateData) {
  const res = await axiosInstance.put(`${url}/user/${encodeURIComponent(naver_id)}`, updateData);
  return res.data;
}

// Delete User
export async function deleteUser(naver_id) {
  const res = await axiosInstance.delete(`${url}/user/${encodeURIComponent(naver_id)}`);
  return res.data;
}

// Login
export async function login(loginData) {
  const res = await axiosInstance.post(`${url}/user/login`, loginData);
  return res.data;
}

// Logout
export async function logout() {
  const res = await axiosInstance.post(`${url}/user/logout`);
  return res.data;
}

// Get current logged-in user info (from token)
export async function getMe(token) {
  try {
    const res = await axiosInstance.get(`${url}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    // 서버가 실행이 안될 때 사용자에게 명확한 메시지 제공
    throw new Error('서버가 응답하지 않습니다. 잠시 후 다시 시도해 주세요.');
  }
}
