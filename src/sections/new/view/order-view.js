'use client';

import React, { useRef, useState, useEffect } from 'react';

import {
  Box,
  Stack,
  Alert,
  Button,
  Snackbar,
  Backdrop,
  Container,
  Typography,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { getMe } from 'src/actions/user';
import { COLORS } from 'src/constant/colors';
import { uploadToS3, createOrder } from 'src/actions/order';
import {
  PHOTO_UPLOAD_GUIDE,
  REFERENCE_UPLOAD_GUIDE,
  DEFAULT_TEXTAREA_CONTENT,
  CAUTION_GUIDE,
} from 'src/constant/ourwedding';

import OrderForm from '../order-form';
import OrderRequest from '../order-request';
import CautionAgree from '../caution-agree';
import ImageUploader from '../image-uploader';
import OurWeddingDivider from '../ourwedding-divier';

// View 전체를 BG_COLOR로 감싸기 위한 상수
const BG_COLOR = COLORS.DETAIL_BG_COLOR;
const ACCENT_COLOR_DARK = 'rgb(220, 222, 204)';
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;

// fetchUserInfo에서 에러 발생 시 에러를 던지도록 수정
// (아래 함수는 이미 async로 선언되어 있으므로, 에러 발생 시 throw)
async function fetchUserInfo(token) {
  try {
    const res = await getMe(token);
    return res.user;
  } catch (err) {
    throw err;
  }
}

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

  // 유저 정보 상태
  const [user, setUser] = useState(null);

  // 제출 완료 후 이동을 위한 ref
  const redirectTimeoutRef = useRef(null);

  // 업로드 완료 Dialog 상태
  const [uploadSuccessDialogOpen, setUploadSuccessDialogOpen] = useState(false);

  // 유저 정보 불러오기
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setMessage('로그인이 필요합니다.');
      setMessageType('error');
      setMessageOpen(true);
      // 로그인 페이지로 이동
      if (typeof window !== 'undefined') {
        window.location.href = '/login?target=new';
      }
      return;
    }
    fetchUserInfo(token)
      .then((data) => {
        setUser({
          userId: data.naver_id,
          userName: data.user_name,
        });
      })
      .catch((err) => {
        setMessage('유저 정보를 불러오지 못했습니다.');
        setMessageType('error');
        setMessageOpen(true);
        // 에러 발생 시 로그인 페이지로 이동
        if (typeof window !== 'undefined') {
          window.location.href = '/login?target=new';
        }
      });
  }, []);

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

    if (!orderForm.revisionOptions || !orderForm.revisionOptions.length) {
      setMessage('재수정 옵션을 선택해주세요.');
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
    // cautionAgree가 비어있거나, 모든 항목이 true가 아니면 false
    const allCautions = Object.keys(cautionAgree);
    if (allCautions.length === 0 || allCautions.some((key) => !cautionAgree[key])) {
      setMessage('모든 주의사항에 동의해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return false;
    }

    // 5. 업로드 한 이미지 수와 주문 수량이 일치하지 않을 때
    if (orderImages.length !== Number(orderForm.photoCount)) {
      setMessage(
        `주문 수량(${orderForm.photoCount}장)과 업로드한 이미지 수(${orderImages.length}장)가 일치하지 않습니다.`
      );
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
    if (!user) {
      setMessage('유저 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return;
    }

    setUploading(true);
    setUploadPercent(0);

    try {
      const uploadedOrderImages = [];
      const uploadedReferenceImages = [];

      const orderImgs = formData.orderImages || [];
      const refImgs = formData.referenceImages || [];
      const totalFiles = orderImgs.length + refImgs.length;
      let completedFiles = 0;

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
            const result = await uploadToS3(
              fileToUpload,
              [
                '아워웨딩',
                formData.orderForm?.grade === '샘플' ? '샘플' : '신규',
                user.userName || user.name || user.nickname || user.id || 'unknown',
                user.userId || user.id || 'unknown',
                formData.orderForm?.orderNumber || 'noOrderNum',
                type,
              ],
              (percent) => {
                const overall = ((completedFiles + percent / 100) / totalFiles) * 100;
                setUploadPercent(Math.round(overall * 10) / 10);
              }
            );
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
        status: '아워웨딩',
        label: uploadedOrderImages.grade === '샘플' ? '샘플' : '신규',
      };

      // customer 데이터 추가
      const customer = {
        userId: user.userId || user.id || '',
        email: user.userId,
        name: user.userName || user.name || user.nickname || '',
      };

      console.log(customer);

      await createOrder({ ...finalFormData, customer });

      // 업로드 성공 메시지 및 이동 로직을 finally에서 분리하여, 성공시에만 실행
      setUploading(false);
      setUploadPercent(0);

      // Dialog로 업로드 완료 안내
      setUploadSuccessDialogOpen(true);

      // 기존 Snackbar 메시지 제거
      // setMessage('업로드가 완료되었습니다. 주문 목록 화면으로 이동합니다.');
      // setMessageType('success');
      // setMessageOpen(true);

      // 기존 자동 이동 제거, Dialog에서 이동하도록 변경
      // redirectTimeoutRef.current = setTimeout(() => {
      //   if (typeof window !== 'undefined') {
      //     window.location.replace('/ourwedding');
      //   }
      // }, 1500);
    } catch (e) {
      setUploading(false);
      setTimeout(() => setUploadPercent(0), 1000);
      // 에러 메시지는 위에서 처리됨
    }
  };

  // 메시지 닫기 핸들러
  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setMessageOpen(false);
  };

  // 업로드 성공 Dialog 닫기 및 이동
  const handleUploadSuccessDialogClose = () => {
    setUploadSuccessDialogOpen(false);
    if (typeof window !== 'undefined') {
      window.location.replace('/ourwedding');
    }
  };

  // 언마운트시 타임아웃 정리
  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    },
    []
  );

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
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 24, md: 30 },
              color: COLORS.DETAIL_ACCENT_COLOR_DARK,
              letterSpacing: 1,
              textShadow: '0 1px 2px rgba(35,41,31,0.18)',
              mb: 1.5,
              textAlign: 'center',
              mt: '10vh',
              mb: '5vh',
            }}
          >
            신규 주문 접수
          </Typography>
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
              userId={user?.userId || user?.id || ''}
              userName={user?.userName || user?.name || user?.nickname || ''}
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

          <CautionAgree
            checked={formData.cautionAgree}
            content={CAUTION_GUIDE}
            onChange={handleCautionAgreeChange}
          />
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleUploadClick}
              disabled={uploading}
              sx={{
                mb: 2,
                background: ACCENT_COLOR,
                color: BG_COLOR,
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: 0.5,
                textShadow: '0 1px 2px rgba(0,0,0,0.10)',
                '&:hover': {
                  background: ACCENT_COLOR_DARK,
                },
                boxShadow: '0 2px 8px 0 rgba(255,224,130,0.15)',
                minWidth: '256px',
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
            sx={{ width: '100%', fontWeight: 600, fontSize: 16 }}
            variant="filled"
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
        <Dialog
          open={uploadSuccessDialogOpen}
          onClose={handleUploadSuccessDialogClose}
          aria-labelledby="upload-success-dialog-title"
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
              minWidth: { xs: 260, sm: 340, md: 400 },
              boxShadow: 6,
            },
          }}
        >
          <DialogTitle
            id="upload-success-dialog-title"
            sx={{
              fontWeight: 700,
              fontSize: { xs: 20, sm: 22, md: 24 },
              textAlign: 'center',
              letterSpacing: 0.5,
              mt: 1,
              mb: 0.5,
              color: '#222',
            }}
          >
            업로드 완료
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                fontSize: { xs: 15, sm: 16, md: 17 },
                mt: 1.5,
                mb: 2,
                textAlign: 'center',
                fontWeight: 500,
                lineHeight: 1.7,
                color: '#444',
              }}
            >
              업로드가 완료되었습니다.
              <br />
              작업 완료일정은 [접수 내역 → 진행 상황]에서 확인 가능합니다.
              <br />
              처음 화면으로 이동합니다.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button
              onClick={handleUploadSuccessDialogClose}
              variant="contained"
              color="success"
              sx={{
                fontWeight: 700,
                minWidth: 120,
                fontSize: { xs: 15, sm: 16 },
                py: 1,
                boxShadow: 'none',
                textTransform: 'none',
                letterSpacing: 0.2,
              }}
              size="medium"
            >
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
