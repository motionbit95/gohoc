'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ConfigProvider, Flex, Button } from 'antd';
import { BsCaretRightFill } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { theme } from '../theme';
import { CONFIG } from 'src/global-config';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { useBoolean } from 'minimal-shared/hooks';
import CautionAgree from '../caution-agree';
import OrderForm from '../order-form';
import ImageUploader from '../image-uploader';
import OrderRequest from '../order-request';
import { CAUTION_GUIDE, PHOTO_UPLOAD_GUIDE } from 'src/constant/wantswedding';

import { getMe } from 'src/actions/user';
import { createOrder, uploadToS3 } from 'src/actions/order';

const getStyles = (assetsDir) => ({
  loadingOverlay: {
    display: 'flex',
    position: 'fixed',
    zIndex: 99,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: '5vh',
  },
  loadingText: {
    color: '#888',
    fontSize: theme.typography.fontSize.md,
    whiteSpace: 'pre-line',
    textAlign: 'center',
  },
  mainFlex: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFFAFF',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingTop: '30%',
    backgroundImage: `url(${assetsDir}/assets/wantswedding/bg2.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
  },
  titleImage: {
    width: '100%',
    paddingTop: '10%',
    backgroundImage: `url(${assetsDir}/assets/wantswedding/title.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
    marginBlock: '64px',
  },
  title2Image: {
    width: '100%',
    paddingTop: '6%',
    backgroundImage: `url(${assetsDir}/assets/wantswedding/title2.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
    marginTop: '64px',
  },
  buttonWrapper: {
    backgroundImage: `url(${assetsDir}/assets/wantswedding/button_click.png)`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    transform: 'translateY(-50%)',
  },
  divider: {
    height: '100px',
    width: 1,
    backgroundColor: '#94C6FF',
  },
  orderFormFlex: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  imageUploaderFlex: {
    justifyContent: 'center',
    maxWidth: '900px',
    width: '100%',
  },
});

// 실제 함수
function getExpiredDate(status, grade, receivedDate) {
  // 실제 구현 필요
  // 예시: 7일 뒤 날짜 반환
  const date = new Date(receivedDate);
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

function WantsNewOrderPage() {
  const router = useRouter();

  const styles = useMemo(() => getStyles(CONFIG.assetsDir), [CONFIG.assetsDir]);

  const [checkedItems, setCheckedItems] = useState([false, false, false, false, false, false]);
  const [photoList, setPhotoList] = useState([]);
  const [uploadSuccessDialogOpen, setUploadSuccessDialogOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await getMe(localStorage.getItem('token'));
      setUser(res.user);
    }
    fetchUser();
  }, []);

  const [folderId, setFolderId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('info');

  const formattedDate = useMemo(() => {
    const now = new Date();
    const datePart = now
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '-')
      .replace(/\./g, '');
    const timePart = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return `${datePart} ${timePart}`;
  }, []);

  const [formData, setFormData] = useState({
    userName: '',
    userId: '',
    receivedDate: formattedDate,
    orderNumber: '',
    photoCount: 0,
    grade: '',
    additionalOptions: [],
    photoReview: '',
    orderImages: [],
    orderRequest: '',
    cautionAgree: false,
  });

  useEffect(() => {
    if (user?.naver_id || user?.user_name) {
      setFormData((prev) => ({
        ...prev,
        userName: user?.user_name || user?.name || user?.nickname || '',
        userId: user?.naver_id || user?.userId || user?.id || '',
      }));
    }
  }, [user]);

  useEffect(() => {}, [formData]);

  const showSnackbar = useCallback((type, content) => {
    setSnackbarType(type);
    setSnackbarMessage(content);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleCheck = useCallback((index) => {
    setCheckedItems((prev) => {
      const newCheckedItems = [...prev];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, grade: value }));
  };

  const handleCheckboxChange = (checkedValues) => {
    setFormData((prev) => ({ ...prev, additionalOptions: checkedValues }));
  };

  const handleRadioChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, photoReview: value }));
  }, []);

  const handleOrderImagesChange = (newImages) => {
    setFormData((prev) => ({
      ...prev,
      orderImages: newImages,
    }));
    setPhotoList(newImages);
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

  const handleUploadSuccessDialogClose = () => {
    setUploadSuccessDialogOpen(false);
    if (typeof window !== 'undefined') {
      window.location.replace('/');
    }
  };

  const confirmDialog = useBoolean();

  const validateRequiredFields = () => {
    const { orderNumber, grade, photoCount, orderImages, orderRequest, cautionAgree } = formData;
    if (!orderNumber || !grade || !photoCount) {
      showSnackbar('error', '주문번호, 등급, 사진 수량을 모두 입력해주세요.');
      return false;
    }
    if (!orderImages || orderImages.length === 0) {
      showSnackbar('error', '주문 이미지를 1개 이상 업로드해주세요.');
      return false;
    }
    if (!orderRequest || orderRequest.trim() === '') {
      showSnackbar('error', '요청사항을 입력해주세요.');
      return false;
    }
    if (!cautionAgree || Object.keys(cautionAgree).some((k) => !cautionAgree[k])) {
      showSnackbar('error', '모든 주의사항에 동의해주세요.');
      return false;
    }
    if (orderImages.length !== Number(photoCount)) {
      showSnackbar(
        'error',
        `주문 수량(${photoCount}장)과 업로드한 이미지 수(${orderImages.length}장)가 일치하지 않습니다.`
      );
      return false;
    }
    return true;
  };

  // 업로드 로직 수정
  const handleFormUpload = async () => {
    if (!validateRequiredFields()) return;

    setUploading(true);
    setUploadPercent(0);

    try {
      const uploadedOrderImages = [];
      const orderImgs = formData.orderImages || [];
      const totalFiles = orderImgs.length;
      let completedFiles = 0;

      for (let i = 0; i < orderImgs.length; i++) {
        const file = orderImgs[i];
        const result = await uploadToS3(
          file,
          [
            '원츠웨딩',
            formData.grade === '샘플' ? '샘플' : '신규',
            formData.userName,
            formData.userId,
            formData.orderNumber,
            'order',
          ],
          (percent) => {
            const overall = ((completedFiles + percent / 100) / totalFiles) * 100;
            setUploadPercent(Math.round(overall));
          }
        );
        uploadedOrderImages.push(result);
        completedFiles++;
        setUploadPercent(Math.round((completedFiles / totalFiles) * 100));
      }

      // 주문 데이터 구조를 orderForm, customer, status로 분리
      const orderForm = {
        ...formData,
        uploadedOrderImages,
        photoCount: Number(formData.photoCount),
      };

      const customer = {
        userId: formData.userId,
        email: formData.userId,
        name: formData.userName,
      };

      const status = '원츠웨딩';
      const label = formData.grade === '샘플' ? '샘플' : '신규';

      // createOrder에 구조 맞춰서 전달
      await createOrder({
        orderForm,
        customer,
        status,
        label,
      });

      setUploadPercent(100);
      setUploadSuccessDialogOpen(true);
      showSnackbar('success', '주문이 성공적으로 등록되었습니다.');
    } catch (err) {
      console.error(err);
      setUploadPercent(0);
      showSnackbar('error', '주문 등록에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: '100vh', background: '#EFFAFF' }} />;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelColor: theme.colors.text,
            labelFontSize: '16px',
            labelColonMarginInlineEnd: '10vw',
            fontFamily: 'GumiRomanceTTF',
          },
          Checkbox: {
            colorPrimary: '#F6C18C',
            colorBgContainer: 'white',
            colorBorder: '#F6C18C',
            colorPrimaryHover: 'F6C18CDD',
            controlInteractiveSize: 20,
          },
          Button: {
            colorPrimary: '#C9D2B9',
            colorPrimaryHover: '#6E865F',
            colorTextLightSolid: theme.colors.text,
            colorPrimaryActive: '#ADA69E',
          },
          Upload: {
            colorPrimary: '#C9D2B9',
            colorPrimaryHover: '#6E865F',
          },
          Input: {
            colorBorder: 'transparent',
            boxShadow: 'none',
            colorBorderSecondary: 'transparent',
            fontFamily: 'GumiRomanceTTF',
          },
        },
      }}
    >
      <Flex vertical style={styles.mainFlex}>
        <div style={styles.bgImage}></div>
        <OrderForm formData={formData} onFormDataChange={setFormData} />
        <Flex style={styles.orderFormFlex} vertical>
          <div style={styles.titleImage}></div>
          <Flex vertical gap="large" style={styles.imageUploaderFlex}>
            <ImageUploader
              title="사진 업로드"
              alert={PHOTO_UPLOAD_GUIDE}
              onChange={handleOrderImagesChange}
              maxCount={formData.photoCount || undefined}
            />
          </Flex>
        </Flex>
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
        <div style={styles.title2Image}></div>
        <CautionAgree
          checked={formData.cautionAgree}
          content={CAUTION_GUIDE}
          onChange={handleCautionAgreeChange}
        />
        <div style={styles.divider} />
        <div style={styles.buttonWrapper}>
          <Flex vertical>
            <Button
              onClick={handleFormUpload}
              htmlType="submit"
              icon={<BsCaretRightFill />}
              iconPosition="end"
              type="text"
              // cautionAgree의 모든 항목이 체크되어야만 버튼 활성화
              disabled={
                !formData.cautionAgree || !Object.values(formData.cautionAgree).every(Boolean)
              }
              style={{
                width: 'auto',
                alignSelf: 'center',
                fontFamily: 'GumiRomanceTTF',
                color: '#006C92',
              }}
            >
              작업접수
            </Button>
          </Flex>
        </div>
      </Flex>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarType}
          sx={{ width: '100%', fontWeight: 600, fontSize: 16 }}
          variant="filled"
        >
          {snackbarMessage}
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
          minWidth={300}
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
    </ConfigProvider>
  );
}

export default WantsNewOrderPage;
