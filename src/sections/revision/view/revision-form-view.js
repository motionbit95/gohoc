'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

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

import { COLORS } from 'src/constant/colors';
import { uploadToS3, getOrderById, updateOrderById } from 'src/actions/order';
import { getMe } from 'src/actions/user';
import {
  PHOTO_UPLOAD_GUIDE,
  REFERENCE_UPLOAD_GUIDE,
  DEFAULT_TEXTAREA_CONTENT,
  REVISE_PHOTO_UPLOAD_GUIDE,
  REVISE_REFERENCE_UPLOAD_GUIDE,
  REVISE_DEFAULT_TEXTAREA_CONTENT,
  REVISE_CAUTION_GUIDE,
} from 'src/constant/ourwedding';

import OrderRequest from '../../new/order-request';
import CautionAgree from '../../new/caution-agree';
import ImageUploader from '../../new/image-uploader';
import OurWeddingDivider from '../../new/ourwedding-divier';
import OrderForm from '../order-form';
import { createWorkSubmission } from 'src/actions/work-submission';
import { createOrderComment } from 'src/actions/comment';
import { timeline } from 'src/theme/core/components/timeline';

const BG_COLOR = COLORS.DETAIL_BG_COLOR;
const ACCENT_COLOR_DARK = 'rgb(220, 222, 204)';
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;

export default function RevisionFormView() {
  const router = useRouter();
  const params = useParams();

  const [loadingOrder, setLoadingOrder] = useState(true);

  // formdata: { orderForm, orderImages, referenceImages, orderRequest, cautionAgree }
  const [formData, setFormData] = useState({
    orderForm: {},
    orderImages: [],
    referenceImages: [],
    orderRequest: REVISE_DEFAULT_TEXTAREA_CONTENT,
    cautionAgree: {},
  });

  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageType, setMessageType] = useState('info');
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [user, setUser] = useState(null);
  const [uploadSuccessDialogOpen, setUploadSuccessDialogOpen] = useState(false);

  const redirectTimeoutRef = useRef(null);
  const [order, setOrder] = useState();

  // 주문 id로 주문 데이터 불러오기
  useEffect(() => {
    const fetchOrder = async () => {
      let orderId = null;
      if (params && params.id) {
        orderId = params.id;
      } else if (params && Array.isArray(params) && params.length > 0) {
        orderId = params[0];
      } else if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const match = path.match(/\/revision\/([^/]+)/);
        if (match) {
          orderId = match[1];
        }
      }

      if (!orderId) {
        setMessage('잘못된 접근입니다. 주문 ID가 없습니다.');
        setMessageType('error');
        setMessageOpen(true);
        setLoadingOrder(false);
        return;
      }

      try {
        const order = await getOrderById(orderId);
        setOrder(order);
        if (!order) {
          setMessage('주문 정보를 불러올 수 없습니다.');
          setMessageType('error');
          setMessageOpen(true);
          setLoadingOrder(false);
          return;
        }
        setFormData((prev) => ({
          ...prev,
          orderForm: {
            orderNumber: order.orderNumber || order.order_number || '',
            grade: order.grade || '',
            photoCount: order.photoCount || order.photo_count || '',
          },
        }));
      } catch (err) {
        setMessage('주문 정보를 불러오는 중 오류가 발생했습니다.');
        setMessageType('error');
        setMessageOpen(true);
      }
      setLoadingOrder(false);
    };

    fetchOrder();
    // eslint-disable-next-line
  }, [params]);

  // 유저 정보 불러오기
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setMessage('로그인이 필요합니다.');
      setMessageType('error');
      setMessageOpen(true);
      if (typeof window !== 'undefined') {
        window.location.href = '/ourwedding/login?target=revision';
      }
      return;
    }
    getMe(token)
      .then((data) => {
        setUser({
          userId: data.user.naver_id,
          userName: data.user.user_name,
        });
      })
      .catch(() => {
        setMessage('유저 정보를 불러오지 못했습니다.');
        setMessageType('error');
        setMessageOpen(true);
        if (typeof window !== 'undefined') {
          window.location.href = '/ourwedding/login?target=revision';
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
    if (!orderForm.orderNumber || !orderForm.grade) {
      setMessage('주문번호, 등급을 모두 입력해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return false;
    }
    if (!orderImages || orderImages.length === 0) {
      setMessage('재수정 이미지를 1개 이상 업로드해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return false;
    }
    if (!orderRequest || orderRequest.trim() === '') {
      setMessage('재수정 요청사항을 입력해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return false;
    }
    const allCautions = Object.keys(cautionAgree);
    if (allCautions.length === 0 || allCautions.some((key) => !cautionAgree[key])) {
      setMessage('모든 주의사항에 동의해 주세요.');
      setMessageType('error');
      setMessageOpen(true);
      return false;
    }
    return true;
  };

  // 업로드 버튼 클릭 시
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

      // 파일 업로드 공통 함수
      const uploadFiles = async (files, type, uploadedList) => {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          let fileToUpload = file;

          if (type === 'reviseReference') {
            const ext = file.name.split('.').pop();
            const indexStr = String(i + 1).padStart(3, '0');
            const newName = `참고_${indexStr}.${ext}`;
            try {
              fileToUpload = new File([file], newName, { type: file.type });
            } catch (e) {
              fileToUpload = file;
              fileToUpload.name = newName;
            }
          }

          try {
            const result = await uploadToS3(
              fileToUpload,
              [
                '아워웨딩',
                '재수정',
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
            setMessage(
              `${type === 'order' ? '재수정' : '참고'} 이미지 업로드에 실패했습니다. 다시 시도해 주세요.`
            );
            setMessageType('error');
            setMessageOpen(true);
            throw err;
          }
        }
      };

      await uploadFiles(orderImgs, 'revise', uploadedOrderImages);
      await uploadFiles(refImgs, 'reviseReference', uploadedReferenceImages);

      setUploadPercent(100);

      const { orderImages, referenceImages, ...restFormData } = formData;
      const finalFormData = {
        ...restFormData,
        uploadedOrderImages,
        uploadedReferenceImages,
        status: '재수정',
      };

      const customer = {
        userId: user.userId || user.id || '',
        email: user.userId,
        name: user.userName || user.name || user.nickname || '',
      };

      // worksubmission 추가
      await createWorkSubmission(order?.id || '', 'revise', uploadedOrderImages);
      await createWorkSubmission(order?.id || '', 'reviseReference', uploadedReferenceImages);

      // comment 추가
      await createOrderComment({
        orderId: order?.id,
        step: '재수정',
        comment: formData.orderRequest,
      });

      // 마감일 계산
      // 지금이 19시 이전이면 오늘을 1일로 세서 다음날 21시, 19시 이후면 내일을 1일로 세서 다다음날 21시
      const now = new Date();
      let baseDate = new Date(now);
      if (now.getHours() < 19) {
        // 오늘이 1일, 다음날 21시
        baseDate.setDate(baseDate.getDate() + 1);
      } else {
        // 내일이 1일, 다다음날 21시
        baseDate.setDate(baseDate.getDate() + 2);
      }
      baseDate.setHours(21, 0, 0, 0); // 21:00:00.000

      // order 수정
      await updateOrderById(order?.id, {
        orderForm: {
          label: '재수정',
          step: '재수정',
          process: '재수정 작업 진행중',
          createdAt: new Date().toISOString(),
          expireDate: baseDate.toISOString(),
          isClear: false,
          sendStatus: false,
          reviseQuantity: uploadedOrderImages.length || 0,
        },
        timeline: { title: '재수정 접수' },
      });
      setUploading(false);
      setUploadPercent(0);
      setUploadSuccessDialogOpen(true);
    } catch (e) {
      setUploading(false);
      setTimeout(() => setUploadPercent(0), 1000);
    }
  };

  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setMessageOpen(false);
  };

  const handleUploadSuccessDialogClose = () => {
    setUploadSuccessDialogOpen(false);
    if (typeof window !== 'undefined') {
      window.location.replace('/ourwedding');
    }
  };

  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    },
    []
  );

  if (loadingOrder) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: BG_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: BG_COLOR }}>
      <Container maxWidth={false} disableGutters sx={{ py: { xs: 2, md: 4 } }}>
        <Stack
          spacing={4}
          alignItems="stretch"
          sx={{
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
            재수정 신청
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
              value={{ ...formData.orderForm, additionalOptions: order?.additionalOptions || [] }}
              onChange={handleOrderFormChange}
              userId={user?.userId || user?.id || ''}
              userName={user?.userName || user?.name || user?.nickname || ''}
              isRevision
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
              title="재수정 사진 업로드"
              alert={REVISE_PHOTO_UPLOAD_GUIDE}
              onChange={handleOrderImagesChange}
              isRevision={true}
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
              alert={REVISE_REFERENCE_UPLOAD_GUIDE}
              onChange={handleReferenceImagesChange}
              isRevision={true}
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
              title="재수정 요청사항 작성"
              value={formData.orderRequest}
              onChange={handleOrderRequestChange}
              isRevision={true}
            />
          </Box>
          <OurWeddingDivider text="Ourdrama" isBorder />

          <CautionAgree
            checked={formData.cautionAgree}
            content={REVISE_CAUTION_GUIDE}
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
              {uploading ? '업로드 중...' : '재수정 신청'}
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
            재수정 신청 완료
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
              재수정 신청이 완료되었습니다.
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
