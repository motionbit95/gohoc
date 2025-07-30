// S3에 파일 업로드하는 action 함수

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
export async function uploadToS3(file, folderName, onProgress, onServerProcessing, folderId) {
  try {
    const fileHash = await calculateHash(file);

    const parts = folderName.split('_');
    if (parts.length < 5) {
      throw new Error('폴더 정보가 올바르지 않습니다. 다시 시도해 주세요.');
    }

    const [rootLabel, type, userName, userId, orderNumber] = parts;

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
        folderId: folderId,
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
  try {
    // customer 데이터가 없으면 추가 (userId, userName이 orderData에 있으면 customer로 래핑)
    let dataToSend = { ...orderData };
    if (!orderData.customer) {
      const { userId, userName, ...rest } = orderData;
      if (userId && userName) {
        dataToSend = {
          ...rest,
          customer: {
            userId,
            userName,
          },
        };
      }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || '주문 생성에 실패했습니다.');
    }
    return result;
  } catch (err) {
    console.error('[ORDER][CREATE] 요청 실패:', err);
    throw err;
  }
}
