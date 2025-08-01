// 타임라인 관련 API 호출 함수들 (axiosInstance 사용, 경로: /timeline)

import axiosInstance from 'src/lib/axios';

const url = process.env.NEXT_PUBLIC_API_URL;

// [POST] 타임라인 생성
export async function createTimeline({ orderId, title }) {
  const res = await axiosInstance.post(`${url}/timeline`, {
    orderId,
    title,
  });
  return res.data;
}

// [GET] 주문별 타임라인 목록 조회
export async function getTimelinesByOrderId(orderId) {
  const res = await axiosInstance.get(`${url}/timeline/order/${encodeURIComponent(orderId)}`);
  return res.data;
}

// [GET] 타임라인 단건 조회
export async function getTimelineById(id) {
  const res = await axiosInstance.get(`${url}/timeline/${encodeURIComponent(id)}`);
  return res.data;
}

// [PUT] 타임라인 수정
export async function updateTimeline(id, updateData) {
  const res = await axiosInstance.put(`${url}/timeline/${encodeURIComponent(id)}`, updateData);
  return res.data;
}

// [DELETE] 타임라인 삭제
export async function deleteTimeline(id) {
  const res = await axiosInstance.delete(`${url}/timeline/${encodeURIComponent(id)}`);
  return res.data;
}
