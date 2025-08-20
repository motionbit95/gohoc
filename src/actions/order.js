// S3에 파일 업로드하는 action 함수

import axiosInstance from 'src/lib/axios';
import { createCustomer } from './customer';
import { createFile } from './file';
import { createTimeline } from './timeline';

const url = process.env.NEXT_PUBLIC_API_URL;

// 파일 해시 계산 함수 (SHA-256)
async function calculateHash(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * S3에 파일 업로드
 * @param {File} file - 업로드할 파일 객체
 * @param {string} folderName - 'rootLabel_type_userName_userId_orderNumber' 형식의 폴더명
 * @param {function} [onProgress] - 업로드 진행률 콜백 (0~100)
 * @param {function} [onServerProcessing] - presigned 업로드 후 서버 처리 콜백
 * @param {string} [folderId] - (옵션) 폴더 ID (서버 확인용)
 * @returns {Promise<object>} - 서버 응답 데이터
 */
export async function uploadToS3(file, parts, onProgress, onServerProcessing, folderId) {
  try {
    const fileHash = await calculateHash(file);

    const [rootLabel, type, userName, userId, orderNumber] = parts;

    console.log(
      JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        rootLabel,
        type,
        userName,
        userId,
        orderNumber,
      })
    );

    // presigned URL 요청
    const presignedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/s3/presigned-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        rootLabel,
        type,
        userName,
        userId,
        orderNumber,
      }),
    });

    if (!presignedRes.ok) {
      throw new Error('[E200] Presigned URL 요청 실패');
    }
    const { uploadUrl, key: s3Key } = await presignedRes.json();

    // S3에 파일 업로드
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (onProgress) onProgress(100);
    if (onServerProcessing) onServerProcessing();

    // 서버에 업로드 확인 요청
    const confirmRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/s3/confirm-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: s3Key,
        fileHash,
        originalFileName: file.name,
        folderId,
      }),
    });

    if (!confirmRes.ok) {
      window.alert('파일 업로드 후 서버 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      throw new Error('파일 업로드 후 서버 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
    return await confirmRes.json();
  } catch (err) {
    console.error(`${file.name} 업로드 실패:`, err);
    window.alert(
      `${file.name} 파일 업로드에 실패했습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.${
        err && err.message ? `\n\n(오류: ${err.message})` : ''
      }`
    );
    throw err;
  }
}

// 주문 생성 API 호출 함수
export async function createOrder(orderData) {
  console.log(orderData);

  // 1. customer 생성
  let createdCustomer = null;
  try {
    if (orderData.customer) {
      createdCustomer = await createCustomer(orderData.customer);
    }
  } catch (err) {
    console.error('[ORDER][CUSTOMER][CREATE] 요청 실패:', err);
    throw err;
  }

  // 2. 주문 생성 (order id를 사용)
  let createdOrder = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderData,
        customer: createdCustomer.customer,
      }),
    });
    if (!res.ok) {
      throw new Error('주문 생성에 실패했습니다.');
    }
    createdOrder = await res.json();
    // orderData에 orderId를 할당 (타임라인 생성 등에서 사용)
    if (createdOrder && createdOrder.order && createdOrder.order.id) {
      orderData.orderId = createdOrder.order.id;
    } else if (createdOrder && createdOrder.id) {
      orderData.orderId = createdOrder.id;
    }
  } catch (err) {
    console.error('[ORDER][CREATE] 요청 실패:', err);
    throw err;
  }

  // 3. 타임라인 생성 (주문 생성 후)
  if (orderData.orderId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          title: '주문접수',
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || '타임라인 생성에 실패했습니다.');
      }
      // 타임라인 결과를 반환값에 포함하고 싶으면 아래처럼 추가
      // return { ...result, timeline: result.timeline };
    } catch (err) {
      console.error('[TIMELINE][CREATE] 요청 실패:', err);
      throw err;
    }
  }

  // 4. 작업 제출물 생성 (orderId, type, files)
  // orderData.uploadedOrderImages, orderData.uploadedReferenceImages를 files로 사용
  // [중복 파일 생성 방지: 작업 제출물 생성만 수행, 파일 정보 생성(createFile) 생략]
  try {
    const workSubmissionTypes = [
      { type: 'origin', files: orderData.uploadedOrderImages || [] },
      { type: 'reference', files: orderData.uploadedReferenceImages || [] },
    ];

    for (const { type, files } of workSubmissionTypes) {
      // 성공적으로 업로드된 파일만 추출
      const validFiles = files.filter((file) => file.success);
      if (validFiles.length > 0) {
        // createWorkSubmission은 파일 배열을 받음
        await import('./work-submission').then(({ createWorkSubmission }) =>
          createWorkSubmission(orderData.orderId, type, validFiles)
        );
      }
    }
  } catch (err) {
    console.error('[WORK_SUBMISSION][CREATE] 요청 실패:', err);
    throw err;
  }

  // 6. 코멘트 생성
  try {
    if (orderData.orderRequest) {
      await import('./comment').then(({ createOrderComment }) =>
        createOrderComment({
          orderId: orderData.orderId,
          step: '신규',
          comment: orderData.orderRequest,
        })
      );
    }
  } catch (err) {
    console.error('[COMMENT][CREATE] 요청 실패:', err);
    throw err;
  }
}

// 예시: 특정 naver_id로 유저 정보를 조회하는 함수

export async function getOrderByNaverId(naver_id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/user/${encodeURIComponent(naver_id)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!res.ok) {
      throw new Error('주문 정보를 불러오지 못했습니다.');
    }
    const data = await res.json();
    return data.orders || [];
  } catch (err) {
    console.error('[ORDER][GET] 요청 실패:', err);
    throw err;
  }
}

export const getOrderById = async (id) => {
  const response = await axiosInstance.get(`${url}/order/${id}`);
  return response.data.order;
};

export const updateOrderById = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`${url}/order/${id}`, updateData);
    return response.data;
  } catch (err) {
    console.log(err);
    console.error('[ORDER][UPDATE_ORDER_BY_ID] Error:', err);
    throw err.message;
  }
};
