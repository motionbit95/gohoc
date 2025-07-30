'use client';

import React, { useState } from 'react';
import OrderForm from '../order-form';
import ImageUploader from '../image-uploader';
import {
  Box,
  Container,
  Stack,
  Button,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Typography,
  LinearProgress,
} from '@mui/material';
import OrderRequest from '../order-request';
import CautionAgree from '../caution-agree';
import { createOrder, uploadToS3 } from 'src/actions/order';
import {
  DEFAULT_TEXTAREA_CONTENT,
  PHOTO_UPLOAD_GUIDE,
  REFERENCE_UPLOAD_GUIDE,
} from 'src/constant/ourwedding';
import OurWeddingDivider from '../ourwedding-divier';

// View 전체를 BG_COLOR로 감싸기 위한 상수
const BG_COLOR = '#23291f';

export default function OrderView() {
  // formdata: { orderForm, orderImages, referenceImages, orderRequest, cautionAgree }
  const [formData, setFormData] = useState({
    orderForm: {},
    orderImages: [],
    referenceImages: [],
    orderRequest: DEFAULT_TEXTAREA_CONTENT,
    cautionAgree: {},
  });

  // 메시지 상태 관리
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageType, setMessageType] = useState('info'); // 'error' | 'success' | 'info' | 'warning'

  // 업로드 상태 관리
  const [uploading, setUploading] = useState(false);

  // 업로드 퍼센트 상태
  const [uploadPercent, setUploadPercent] = useState(0);

  // 임시 테스트 계정 정보
  const testUserId = 'krystalvv';
  const testUserName = '박수정';

  // 각 컴포넌트의 변경 핸들러
  const handleOrderFormChange = (newOrderForm) => {
    setFormData((prev) => ({
      ...prev,
      orderForm: newOrderForm,
    }));
  };

  const handleOrderImagesChange = (newImages) => {
    setFormData((prev) => ({
      ...prev,
      orderImages: newImages,
    }));
  };

  const handleReferenceImagesChange = (newImages) => {
    setFormData((prev) => ({
      ...prev,
      referenceImages: newImages,
    }));
  };

  const handleOrderRequestChange = (newRequest) => {
    setFormData((prev) => ({
      ...prev,
      orderRequest: newRequest,
    }));
  };

  const handleCautionAgreeChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      cautionAgree: checked,
    }));
  };

  // 필수 입력 정보 체크 함수
  const validateRequiredFields = () => {
    const { orderForm, orderImages, orderRequest, cautionAgree } = formData;
    // 1. 주문번호, 등급, 사진 수량
    if (!orderForm.orderNumber || !orderForm.grade || !orderForm.photoCount) {
      setMessage('주문번호, 등급, 사진 수량을 모두 입력해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return false;
    }
    // 2. 주문 이미지 1개 이상
    if (!orderImages || orderImages.length === 0) {
      setMessage('주문 이미지를 1개 이상 업로드해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return false;
    }
    // 3. 요청사항(필수)
    if (!orderRequest || orderRequest.trim() === '') {
      setMessage('요청사항을 입력해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return false;
    }
    // 4. 주의사항 모든 항목 동의 필요
    const allCautions = Object.keys(cautionAgree);
    const notAgreed = allCautions.filter((key) => !cautionAgree[key]);
    if (notAgreed.length > 0) {
      setMessage('모든 주의사항에 동의해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return false;
    }
    return true;
  };

  // 업로드 버튼 클릭 시 formData 출력
  // 주문 이미지와 참고 이미지 모두 S3에 업로드하고, 최종 데이터에는 파일 데이터 대신 업로드 결과만 포함
  const handleUploadClick = async () => {
    if (!validateRequiredFields()) return;

    setUploading(true);
    setUploadPercent(0);

    try {
      const uploadedOrderImages = [];
      const uploadedReferenceImages = [];

      const orderImgs = formData.orderImages || [];
      const refImgs = formData.referenceImages || [];
      const totalFiles = orderImgs.length + refImgs.length;
      let completedFiles = 0;

      const getFolderName = (type) =>
        [
          'ourwedding',
          formData.orderForm?.grade,
          testUserName,
          testUserId,
          formData.orderForm?.orderNumber || 'noOrderNum',
          type,
        ].join('_');

      // 파일 업로드 공통 함수 (order는 그대로, reference는 네이밍 변경)
      const uploadFiles = async (files, type, uploadedList) => {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          let fileToUpload = file;

          // 참고(reference) 이미지는 파일명을 참고_001.jpg, 참고_002.jpg ... 형식으로 변경
          if (type === 'reference') {
            const ext = file.name.split('.').pop();
            const indexStr = String(i + 1).padStart(3, '0');
            const newName = `참고_${indexStr}.${ext}`;
            // File 생성자 지원 브라우저만 가능
            try {
              fileToUpload = new File([file], newName, { type: file.type });
            } catch (e) {
              // fallback: name 속성만 바꿔봄 (권장X)
              fileToUpload = file;
              fileToUpload.name = newName;
            }
          }

          try {
            const result = await uploadToS3(fileToUpload, getFolderName(type), (percent) => {
              const overall = ((completedFiles + percent / 100) / totalFiles) * 100;
              setUploadPercent(Math.round(overall * 10) / 10);
            });
            uploadedList.push(result);
            completedFiles += 1;
            setUploadPercent(Math.round((completedFiles / totalFiles) * 1000) / 10);
          } catch (err) {
            console.error(`${type === 'order' ? '주문' : '참고'} 이미지 S3 업로드 실패:`, err);
            setMessage(
              `${type === 'order' ? '주문' : '참고'} 이미지 업로드에 실패했습니다. 다시 시도해 주세요.`
            );
            setMessageType('error');
            setMessageOpen(true);
            throw err;
          }
        }
      };

      await uploadFiles(orderImgs, 'order', uploadedOrderImages);
      await uploadFiles(refImgs, 'reference', uploadedReferenceImages);

      setUploadPercent(100);

      // 최종 폼 데이터에는 파일(File) 객체 대신 업로드 결과만 포함
      const { orderImages, referenceImages, ...restFormData } = formData;
      const finalFormData = {
        ...restFormData,
        uploadedOrderImages,
        uploadedReferenceImages,
      };

      // customer 데이터 추가
      const customer = {
        userId: testUserId,
        userName: testUserName,
      };
      await createOrder({ ...finalFormData, customer });
      //   console.log('최종 폼 데이터:', finalFormData);

      //   setMessage('폼 데이터가 정상적으로 준비되었습니다.');
      //   setMessageType('success');
      //   setMessageOpen(true);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadPercent(0), 1000);
    }
  };

  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setMessageOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: BG_COLOR }}>
      <Container maxWidth={false} disableGutters sx={{ py: { xs: 2, md: 4 } }}>
        <Stack
          spacing={4}
          alignItems="stretch"
          sx={{
            // maxWidth: 'md',
            mx: 'auto',
            width: '100%',
            px: { xs: 1, sm: 2, md: 0 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              background: 'linear-gradient(90deg, #ffe082 0%, #ffd54f 100%)',
              color: '#23291f',
              px: { xs: 2, md: 4 },
              py: { xs: 2, md: 2 },
              boxShadow: '0 2px 12px 0 rgba(35,41,31,0.10)',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: { xs: 18, md: 22 },
              letterSpacing: 0.5,
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                fontSize: { xs: 18, md: 22 },
                color: '#23291f',
                letterSpacing: 1,
                textShadow: '0 1px 2px rgba(255,255,255,0.12)',
              }}
            >
              신규 주문 접수
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#23291f',
                fontWeight: 500,
                mt: 0.5,
                fontSize: { xs: 14, md: 16 },
                opacity: 0.85,
              }}
            >
              아래 양식을 작성하여 신규 주문을 접수해 주세요.
            </Typography>
          </Box>
          <Box
            sx={{
              maxWidth: 'md',
              mx: 'auto',
              width: '100%',
              px: { xs: 1, sm: 2, md: 0 },
            }}
          >
            <OrderForm
              value={formData.orderForm}
              onChange={handleOrderFormChange}
              userId={testUserId}
              userName={testUserName}
            />
          </Box>
          <OurWeddingDivider text="Ourwedding Ourdrama" />
          <Box
            sx={{
              maxWidth: 'md',
              mx: 'auto',
              width: '100%',
              px: { xs: 1, sm: 2, md: 0 },
            }}
          >
            <ImageUploader
              title="사진 업로드"
              alert={PHOTO_UPLOAD_GUIDE}
              onChange={handleOrderImagesChange}
              maxCount={formData.orderForm?.photoCount || undefined}
            />
          </Box>
          <Box
            sx={{
              maxWidth: 'md',
              mx: 'auto',
              width: '100%',
              px: { xs: 1, sm: 2, md: 0 },
            }}
          >
            <ImageUploader
              title="참고 사진 업로드"
              alert={REFERENCE_UPLOAD_GUIDE}
              onChange={handleReferenceImagesChange}
              maxCount={1}
            />
          </Box>
          <Box
            sx={{
              maxWidth: 'md',
              mx: 'auto',
              width: '100%',
              px: { xs: 1, sm: 2, md: 0 },
            }}
          >
            <OrderRequest
              title="요청사항 작성"
              value={formData.orderRequest}
              onChange={handleOrderRequestChange}
            />
          </Box>
          <OurWeddingDivider text="Ourdrama" isBorder />
          <Box
            sx={{
              maxWidth: 'md',
              mx: 'auto',
              width: '100%',
              px: { xs: 1, sm: 2, md: 0 },
            }}
          >
            <CautionAgree checked={formData.cautionAgree} onChange={handleCautionAgreeChange} />
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleUploadClick}
              disabled={uploading}
              sx={{
                minWidth: 180,
                fontWeight: 700,
                fontSize: 18,
                py: 1.2,
                borderRadius: 2,
                background: '#ffe082',
                color: '#23291f',
                boxShadow: '0 2px 8px 0 rgba(255,224,130,0.18)',
                letterSpacing: 1,
                transition: 'background 0.2s, color 0.2s',
                '&:hover': {
                  background: '#ffd54f',
                  color: '#23291f',
                },
                '&:disabled': {
                  background: '#bdbdbd',
                  color: '#fffbe9',
                },
              }}
            >
              {uploading ? '업로드 중...' : '업로드'}
            </Button>
          </Box>
        </Stack>
        <Snackbar
          open={messageOpen}
          autoHideDuration={3500}
          onClose={handleMessageClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleMessageClose}
            severity={messageType}
            sx={{
              width: '100%',
              fontWeight: messageType === 'error' ? 700 : 500,
              color:
                messageType === 'error'
                  ? '#d32f2f'
                  : messageType === 'success'
                    ? '#388e3c'
                    : undefined,
              background:
                messageType === 'error'
                  ? '#ffebee'
                  : messageType === 'success'
                    ? '#e8f5e9'
                    : undefined,
              border:
                messageType === 'error'
                  ? '1.5px solid #d32f2f'
                  : messageType === 'success'
                    ? '1.5px solid #388e3c'
                    : undefined,
            }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Backdrop
          sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 100 }}
          open={uploading}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            minWidth={500}
            sx={{ bgcolor: 'white', borderRadius: 3, padding: 5 }}
          >
            <CircularProgress color="inherit" />
            <Box sx={{ width: '100%', mt: 3 }}>
              <LinearProgress
                variant="determinate"
                value={uploadPercent}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  background: '#eee',
                  '& .MuiLinearProgress-bar': { background: '#1976d2' },
                }}
              />
            </Box>
            <Typography sx={{ mt: 2, fontWeight: 500 }}>
              업로드 중입니다. 잠시만 기다려주세요...
            </Typography>
            <Typography sx={{ mt: 1, fontWeight: 400, color: '#000' }}>
              {uploadPercent}% 완료
            </Typography>
          </Box>
        </Backdrop>
      </Container>
    </Box>
  );
}
