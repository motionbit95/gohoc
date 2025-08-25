import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Form, Input, Checkbox, Typography, Flex } from 'antd';
import { Stack, useMediaQuery } from '@mui/material';
import { theme } from './theme';
import { CONFIG } from 'src/global-config';

const { Title, Text } = Typography;

// 등급 옵션
export const GRADE_OPTIONS = [
  { value: '샘플', label: '샘플' },
  { value: '~4일', label: '~4일 (기본)' },
  { value: '~48시간', label: '~48시간 (추가금 : 1500원)' },
];

// 추가 옵션 목록
export const ADDITIONAL_OPTIONS = [
  { value: '피부', label: '피부', price: 1500 },
  { value: '체형(+얼굴)', label: '체형(+얼굴)', price: 2000 },
  { value: '합성', label: '합성', price: 2000 },
  { value: '색감', label: '색감', price: 2000 },
];

const labelStyle = {
  color: theme.colors.label,
  fontFamily: 'GumiRomanceTTF',
};

const checkboxContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing.sm,
};

const gradeCheckboxStyle = {
  borderRadius: '50%',
};

const additionalCheckboxStyle = {
  borderRadius: '50%',
};

// 시간까지 포함된 오늘 날짜 문자열 반환
function getTodayStringWithTime() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const hh = String(today.getHours()).padStart(2, '0');
  const min = String(today.getMinutes()).padStart(2, '0');
  const ss = String(today.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

// 구글 폰트 동적 로드 함수
function loadGoogleFont() {
  // 이미 로드된 경우 중복 삽입 방지
  if (document.getElementById('lilita-one-font-link')) return;
  const link = document.createElement('link');
  link.id = 'lilita-one-font-link';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
  document.head.appendChild(link);
}

// ===== 함수부분만 참고해서 바꿔궈 =====

const getInitialFormData = (formData) => ({
  userName: formData.userName || '',
  userId: formData.userId || '',
  orderNumber: formData.orderNumber || '',
  grade: formData.grade || '',
  additionalOptions: formData.additionalOptions || [],
  photoCount: formData.photoCount || '',
  photoReview: formData.photoReview || '',
  receivedDate: formData.receivedDate || '',
});

const OrderForm = ({
  formData = {},
  onFormDataChange, // 부모로 전체 폼 데이터만 넘김
}) => {
  // 폰트 로드 (한 번만)
  useEffect(() => {
    loadGoogleFont();
  }, []);

  // 내부 상태로 폼 데이터 관리
  const [localFormData, setLocalFormData] = useState(() => getInitialFormData(formData));

  // formData prop이 바뀌면 localFormData도 동기화 (단, 값이 실제로 바뀔 때만)
  const prevFormDataRef = useRef(formData);

  useEffect(() => {
    // shallow compare: 만약 formData가 바뀌었으면 동기화
    const prev = prevFormDataRef.current;
    let changed = false;
    for (const key of Object.keys(getInitialFormData({}))) {
      if (formData[key] !== prev[key]) {
        changed = true;
        break;
      }
    }
    if (changed) {
      setLocalFormData(getInitialFormData(formData));
      prevFormDataRef.current = formData;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // localFormData가 바뀔 때마다 부모로 전체 데이터 전달
  const prevOnFormDataChange = useRef(onFormDataChange);
  useEffect(() => {
    if (typeof onFormDataChange === 'function') {
      onFormDataChange(localFormData);
    }
    prevOnFormDataChange.current = onFormDataChange;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFormData, onFormDataChange]);

  // 반응형 폰트 사이즈
  const isXs = useMediaQuery('(max-width:600px)');
  const isSm = useMediaQuery('(min-width:601px) and (max-width:900px)');
  const isMd = useMediaQuery('(min-width:901px)');

  let baseFontSize = 18;
  if (isXs) baseFontSize = 16;
  else if (isSm) baseFontSize = 18;
  else if (isMd) baseFontSize = 20;

  // input 글씨 너무 큼 -> input 폰트 사이즈를 더 작게 조정
  const inputFontSize = Math.max(13, Math.round(baseFontSize * 0.75));
  const labelFontSize = baseFontSize * 0.8;
  const checkboxFontSize = baseFontSize * 0.8;

  let headerMainFontSize, headerSubFontSize, headerKorFontSize;
  if (isXs) {
    headerMainFontSize = 36;
    headerSubFontSize = 28;
    headerKorFontSize = 18;
  } else if (isSm) {
    headerMainFontSize = 48;
    headerSubFontSize = 36;
    headerKorFontSize = 22;
  } else {
    headerMainFontSize = 64;
    headerSubFontSize = 44;
    headerKorFontSize = 28;
  }

  // 등급 체크박스 렌더링
  const renderGradeCheckboxes = () =>
    GRADE_OPTIONS.map((option) => (
      <div key={option.value} style={checkboxContainerStyle}>
        <Checkbox value={option.value} style={gradeCheckboxStyle}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: theme.colors.text,
              fontFamily: 'GumiRomanceTTF',
              fontSize: checkboxFontSize,
            }}
          >
            {option.label}
          </div>
        </Checkbox>
      </div>
    ));

  // 추가 옵션 체크박스 렌더링
  const renderAdditionalOptions = () =>
    ADDITIONAL_OPTIONS.map((option) => (
      <div key={option.value} style={checkboxContainerStyle}>
        <Checkbox value={option.value} style={additionalCheckboxStyle}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: theme.colors.text,
              fontFamily: 'GumiRomanceTTF',
              fontSize: checkboxFontSize,
            }}
          >
            <span>{option.label}</span>
            {/* <span>{option.price.toLocaleString()}원</span> */}
          </div>
        </Checkbox>
      </div>
    ));

  // 접수날짜 자동 입력 (localFormData.receivedDate가 없으면 오늘 날짜+시간)
  const receivedDate = useMemo(() => {
    if (!localFormData.receivedDate) return getTodayStringWithTime();
    if (/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/.test(localFormData.receivedDate)) {
      if (localFormData.receivedDate.length > 10) return localFormData.receivedDate;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      return `${localFormData.receivedDate} ${hh}:${min}:${ss}`;
    }
    return localFormData.receivedDate;
  }, [localFormData.receivedDate]);

  // 핸들러: input, number 등
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 핸들러: 등급(grade) 체크박스 (단일 선택)
  const handleGradeChange = (values) => {
    const lastValue = values[values.length - 1];
    setLocalFormData((prev) => ({
      ...prev,
      grade: lastValue,
    }));
  };

  // 핸들러: 추가 옵션(복수 선택)
  const handleAdditionalOptionsChange = (values) => {
    setLocalFormData((prev) => ({
      ...prev,
      additionalOptions: values,
    }));
  };

  // 핸들러: 포토리뷰 (라디오처럼 동작)
  const handlePhotoReviewChange = (value) => {
    setLocalFormData((prev) => ({
      ...prev,
      photoReview: value,
    }));
  };

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{
        padding: theme.spacing.lg,
        paddingBlock: theme.spacing.xxl,
        fontFamily: 'GumiRomanceTTF',
        fontSize: baseFontSize,
      }}
    >
      <Stack gap={2}>
        {/* 폰트는 useEffect에서 동적으로 로드 */}
        <div
          style={{
            position: 'relative',
            marginBottom: theme.spacing.xl,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isXs ? 8 : 16,
          }}
        >
          <Title
            level={1}
            style={{
              fontFamily: "'Lilita One', sans-serif",
              whiteSpace: 'nowrap',
              fontWeight: 300,
              fontSize: headerMainFontSize,
              color: 'white',
              WebkitTextStroke: '0.5px #2E4B50',
              marginBottom: isXs ? 6 : 10,
              letterSpacing: 2,
              lineHeight: 1.1,
            }}
          >
            Order Information
          </Title>
          <Title
            level={1}
            style={{
              fontFamily: "'Lilita One', sans-serif",
              whiteSpace: 'nowrap',
              fontWeight: 300,
              fontSize: headerMainFontSize,
              color: 'white',
              WebkitTextStroke: '0.5px #2E4B50',
              marginTop: 0,
              marginBottom: isXs ? 6 : 10,
              letterSpacing: 2,
              lineHeight: 1.1,
            }}
          >
            (New)
          </Title>

          <Title
            level={3}
            style={{
              fontFamily: "'Lilita One', sans-serif",
              fontSize: headerSubFontSize,
              whiteSpace: 'nowrap',
              color: '#F2FFF2',
              WebkitTextStroke: '0.5px #4DA0FF',
              marginTop: isXs ? 2 : 6,
              marginBottom: isXs ? 6 : 10,
              letterSpacing: 1,
              lineHeight: 1.1,
            }}
          >
            Wan&apos;t Wedding
          </Title>
          <Text
            style={{
              fontFamily: 'GumiRomanceTTF',
              fontSize: headerKorFontSize,
              whiteSpace: 'nowrap',
              color: '#006C92',
            }}
          >
            주문자정보입력
          </Text>
        </div>

        <Form.Item
          label={
            <div style={{ ...labelStyle, fontSize: labelFontSize }}>{'(자동) 주문자 성함'}</div>
          }
          colon={false}
          style={{ marginBottom: theme.spacing.lg }}
        >
          <Input
            readOnly
            value={localFormData.userName}
            style={{ color: theme.colors.label, fontSize: inputFontSize }}
          />
        </Form.Item>

        <Form.Item
          label={<div style={{ ...labelStyle, fontSize: labelFontSize }}>{'(자동) 접수 날짜'}</div>}
          colon={false}
          style={{ marginBottom: theme.spacing.lg }}
        >
          <Text
            style={{
              color: theme.colors.label,
              fontFamily: 'GumiRomanceTTF',
              fontSize: baseFontSize,
            }}
          >
            {receivedDate}
          </Text>
          <div
            style={{
              backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/line.png)`,
              backgroundRepeat: 'repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              height: 12,
            }}
          />
        </Form.Item>

        <Form.Item
          label={
            <div style={{ ...labelStyle, fontSize: labelFontSize }}>{'네이버 아이디(자동)'}</div>
          }
          colon={false}
          style={{ marginBottom: theme.spacing.lg }}
        >
          <Input
            readOnly
            value={localFormData.userId}
            style={{ color: theme.colors.label, fontSize: inputFontSize }}
          />
        </Form.Item>

        <Form.Item
          label={<div style={{ ...labelStyle, fontSize: labelFontSize }}>{'상품주문번호'}</div>}
          colon={false}
          help={
            <div style={{ color: '#FF7B00DD', fontSize: labelFontSize }}>
              {'ㄴ * 오타없이 꼭 정확한 상품 주문번호 기재 바랍니다. *'}
            </div>
          }
          style={{ marginBottom: theme.spacing.lg }}
        >
          <Input
            name="orderNumber"
            value={localFormData.orderNumber}
            onChange={handleInputChange}
            style={{ color: theme.colors.text, fontSize: inputFontSize }}
          />
        </Form.Item>

        <Form.Item
          label={<div style={{ ...labelStyle, fontSize: labelFontSize }}>{'등급'}</div>}
          colon={false}
          style={{ marginBottom: theme.spacing.lg }}
        >
          <Checkbox.Group
            onChange={handleGradeChange}
            value={localFormData.grade ? [localFormData.grade] : []}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            {renderGradeCheckboxes()}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label={<div style={{ ...labelStyle, fontSize: labelFontSize }}>{'상품'}</div>}
          colon={false}
        >
          <Checkbox.Group
            onChange={handleAdditionalOptionsChange}
            value={localFormData.additionalOptions}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: theme.spacing.lg,
              backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/grid.png)`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {renderAdditionalOptions()}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label={<div style={{ ...labelStyle, fontSize: labelFontSize }}>{'사진 장수'}</div>}
          colon={false}
          style={{ marginBottom: theme.spacing.lg }}
        >
          <Input
            name="photoCount"
            value={localFormData.photoCount}
            onChange={handleInputChange}
            type="number"
            style={{ color: theme.colors.text, fontSize: inputFontSize }}
          />
        </Form.Item>

        <Form.Item
          label={<div style={{ ...labelStyle, fontSize: labelFontSize }}>{'포토리뷰'}</div>}
          colon={false}
        >
          <div
            className="checkbox-group"
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: theme.spacing.sm,
            }}
          >
            <div
              className="checkbox-item"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: theme.spacing.sm,
                borderRadius: '4px',
                gap: 8,
                fontFamily: 'GumiRomanceTTF',
                width: '100%',
                fontSize: checkboxFontSize,
              }}
            >
              <Checkbox
                checked={localFormData.photoReview === '포토리뷰 O'}
                onChange={() => handlePhotoReviewChange('포토리뷰 O')}
              />
              <span
                className="checkbox-label"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  width: '100%',
                  color: theme.colors.text,
                }}
              >
                <Flex vertical>
                  <span
                    className="checkbox-title"
                    style={{ fontSize: checkboxFontSize }}
                  >{`포토리뷰 O`}</span>
                  <span
                    className="checkbox-price"
                    style={{
                      color: 'black',
                      fontFamily: 'GumiRomanceTTF',
                      fontSize: checkboxFontSize * 0.95,
                    }}
                  >
                    {`ㄴ 포토리뷰 작성 시 +1장 서비스장수로 작업 진행 가능합니다.`}
                  </span>
                </Flex>
              </span>
            </div>

            <div
              className="checkbox-item"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: theme.spacing.sm,
                borderRadius: '4px',
                gap: 8,
                fontFamily: 'GumiRomanceTTF',
                width: '100%',
                fontSize: checkboxFontSize,
              }}
            >
              <Checkbox
                checked={localFormData.photoReview === '포토리뷰 X'}
                onChange={() => handlePhotoReviewChange('포토리뷰 X')}
              />
              <span
                className="checkbox-label"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  width: '100%',
                  color: theme.colors.text,
                }}
              >
                <Flex vertical>
                  <span className="checkbox-title" style={{ fontSize: checkboxFontSize }}>
                    {'포토리뷰 X'}
                  </span>
                </Flex>
              </span>
            </div>
          </div>
        </Form.Item>
      </Stack>
    </Form>
  );
};

export default OrderForm;
