// 고객 관련 API 호출 함수들 (axiosInstance 사용, 경로: /customer)

import axiosInstance from 'src/lib/axios';

const url = process.env.NEXT_PUBLIC_API_URL;

// [GET] 고객 전체 목록 조회
export async function getAllCustomers() {
  const res = await axiosInstance.get(`${url}/customer`);
  return res.data;
}

// [GET] 고객 단일 조회
export async function getCustomerById(id) {
  const res = await axiosInstance.get(`${url}/customer/${encodeURIComponent(id)}`);
  return res.data;
}

// [POST] 고객 생성
export async function createCustomer(customerData) {
  const res = await axiosInstance.post(`${url}/customer`, customerData);
  return res.data;
}

// [PUT] 고객 정보 수정
export async function updateCustomer(id, updateData) {
  const res = await axiosInstance.put(`${url}/customer/${encodeURIComponent(id)}`, updateData);
  return res.data;
}

// [DELETE] 고객 삭제
export async function deleteCustomer(id) {
  const res = await axiosInstance.delete(`${url}/customer/${encodeURIComponent(id)}`);
  return res.data;
}
