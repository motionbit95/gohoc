'use client';

import { useState, useEffect } from 'react';

import { Box, Alert, Snackbar } from '@mui/material';
import { Flex, Button, Typography as AntTypography } from 'antd';
import { BsDownload } from 'react-icons/bs';

import useMediaQuery from '@mui/material/useMediaQuery';

import { getMe } from 'src/actions/user';
import { COLORS } from 'src/constant/colors';
import { getOrderByNaverId } from 'src/actions/order';
import { CONFIG } from 'src/global-config';

import OrderBox from '../order-box';
import OrderListCaution from '../order-list-caution';
import { fDateTime } from 'src/utils/format-time';
import NormalButtons from '../normal-buttons';
import SampleButtons from '../sample-buttons';

const BG_COLOR = COLORS.DETAIL_BG_COLOR;
const ACCENT_COLOR_DARK = 'rgb(220, 222, 204)';
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;

const OrderListView = () => {
  // 반응형 처리: 모바일, 태블릿, 데스크탑 구분
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:1024px)');
  const isDesktop = useMediaQuery('(min-width:1025px)');

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 메시지 상태 관리
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageType, setMessageType] = useState('info'); // 'error' | 'success' | 'info' | 'warning'

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          setMessage('로그인이 필요합니다.');
          setMessageType('error');
          setMessageOpen(true);
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              window.location.href = '/login?target=revision';
            }, 1200);
          }
          setLoading(false);
          return;
        }

        await getMe(token)
          .then(async (res) => {
            const userData = {
              userId: res.user.naver_id,
              userName: res.user.user_name,
            };
            setUser(userData);

            const orderData = await getOrderByNaverId(userData.userId);
            setOrders(orderData || []);
          })
          .catch((error) => {
            setMessage(error.message || '유저 정보를 불러오지 못했습니다.');
            setMessageType('error');
            setMessageOpen(true);

            if (typeof window !== 'undefined') {
              setTimeout(() => {
                window.location.href = '/login?target=revision';
              }, 1200);
            }
          });
      } catch (err) {
        setMessage('유저 정보를 불러오지 못했습니다.');
        setMessageType('error');
        setMessageOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setMessageOpen(false);
  };

  // 날짜/시간 변환 함수
  function convertKoreanDateTime(input) {
    if (!input) return '';
    let dateStr = '';
    let timeStr = '';
    if (Array.isArray(input)) {
      dateStr = input[0] || '';
      timeStr = input[2] || '';
    } else if (typeof input === 'string') {
      const parts = input.split(' ');
      dateStr = parts[0] || '';
      timeStr = parts[1] || '';
    } else {
      return '';
    }
    let year = '',
      month = '',
      day = '';
    if (dateStr) {
      const dateParts = dateStr.split('-');
      if (dateParts.length === 3) [year, month, day] = dateParts;
    }
    let hour = '',
      minute = '';
    if (timeStr) {
      const timeParts = timeStr.split(':');
      hour = timeParts[0] || '';
      minute = timeParts[1] || '';
    }
    console.log(`${year}-${month}-${day} ${hour}:${minute}`);
    if (!year || !month || !day || !hour || !minute) return '';
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  // 헤더 렌더링
  function renderHeader() {
    // 반응형 제거, 상대적인 크기만 사용
    return (
      <Flex
        vertical
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          minHeight: '180px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '180px',
            backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/bg2.png)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'relative',
            marginTop: '48px',
            textAlign: 'center',
            zIndex: 1,
            width: '100%',
          }}
        >
          <AntTypography
            style={{
              fontFamily: 'Lilita One, cursive',
              fontSize: '6vw',
              whiteSpace: 'nowrap',
              marginBottom: '-1rem',
              color: '#F4FFF5',
              WebkitTextStroke: '0.5px #2E4B50',
              paddingBlock: '48px',
              lineHeight: 1.1,
            }}
          >
            Wan't Wedding
          </AntTypography>
        </div>
      </Flex>
    );
  }

  // 주문 정보 폼 렌더링
  function renderOrderInfoForm(order) {
    console.log(order);
    return (
      <div
        style={{
          paddingInline: isMobile ? '8px' : isTablet ? '16px' : '20px',
          maxWidth: 1200,
          width: '100%',
        }}
      >
        {[
          {
            label: '(자동) 주문자 성함 / 아이디',
            value: `${order.customer?.name || ''} / ${order.customer?.email || ''}`,
          },
          {
            label: '상품주문번호',
            value: order.orderNumber || '',
          },
          {
            label: '접수 날짜 / 시간',
            value: fDateTime(order.createdAt),
          },
          {
            label: '주문 상품',
            value: order.additionalOptions || '',
          },
          {
            label: '보정 장수',
            value: order.totalQuantity || '',
          },
        ].map((item) => (
          <div key={item.label} style={{ marginBottom: isMobile ? '10px' : '16px' }}>
            <div
              style={{
                color: '#233D5B',
                fontFamily: 'GumiRomanceTTF',
                textAlign: 'center',
                width: '100%',
                fontSize: isMobile ? '13px' : '16px',
                marginBottom: isMobile ? '4px' : '8px',
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                textAlign: 'center',
                border: 'none',
                fontFamily: 'GumiRomanceTTF',
                color: '#006C92',
                padding: isMobile ? '6px' : '8px',
                backgroundColor: 'white',
                borderRadius: '4px',
                marginBottom: isMobile ? '4px' : '8px',
                fontSize: isMobile ? '13px' : '16px',
                wordBreak: 'break-all',
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/line.png)`,
                backgroundRepeat: 'repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: isMobile ? '5px' : '8px',
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // 주문 상태 박스 렌더링
  function renderOrderStatusBox(order, index) {
    return (
      <Flex
        vertical
        style={{
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/top.png)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: isMobile ? '120px' : isTablet ? '160px' : '200px',
            height: isMobile ? '90px' : isTablet ? '120px' : '180px',
            display: 'flex',
            position: 'relative',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <AntTypography
            style={{
              fontFamily: 'GumiRomanceTTF',
              fontSize: isMobile ? '16px' : isTablet ? '20px' : '24px',
              color: '#006C92',
            }}
          >
            진행상황
          </AntTypography>
        </div>
        <Flex
          vertical
          style={{
            backgroundColor: 'white',
            border: '4px solid #C2DEFF',
            borderRadius: '20px',
            paddingInline: isMobile ? '4vw' : isTablet ? '6vw' : '10vw',
            paddingBlock: isMobile ? '1rem' : '2rem',
            alignItems: 'center',
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/button3.png)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: isMobile ? '120px' : isTablet ? '180px' : '220px',
              height: isMobile ? '50px' : isTablet ? '70px' : '100px',
              paddingTop: isMobile ? '4px' : '10px',
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
            }}
          >
            <AntTypography
              style={{
                color: '#1F78DE',
                fontSize: isMobile ? '14px' : isTablet ? '16px' : '20px',
                fontFamily: 'GumiRomanceTTF',
                textAlign: 'center',
              }}
            >
              {`${order?.process || '주문접수'}`}
            </AntTypography>
          </div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '3px solid #CDEFFF',
              borderRadius: '50px',
              padding: isMobile ? '8px' : '16px',
              textAlign: 'center',
              fontFamily: 'GumiRomanceTTF',
              color: '#1F78DE',
              transform: isMobile ? 'translateY(-10%)' : 'translateY(-30%)',
              fontSize: isMobile ? '13px' : '16px',
              marginBottom: isMobile ? '8px' : '0',
            }}
          >
            <div
              style={{
                fontFamily: 'GumiRomanceTTF',
                color: '#8c8c8c',
                fontSize: isMobile ? '12px' : '14px',
              }}
            >
              마감 예상 일자
            </div>
            {fDateTime(order.expiredDate)}
          </div>
          {renderOrderInfoForm(order)}
        </Flex>
      </Flex>
    );
  }

  // 주문 섹션 렌더링
  function renderOrderSection(order, index) {
    let children = [
      renderOrderStatusBox(order, index),
      order.grade === '샘플' ? <SampleButtons order={order} /> : <NormalButtons order={order} />,
    ];

    // 가로일 때만 홀수 index에서 순서 reverse
    if (!isMobile && index % 2 === 1) {
      children.reverse();
    }

    return (
      <Flex
        key={index}
        style={{
          width: '100%',
          justifyContent: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 16 : 32,
          margin: isMobile ? '16px 0' : '32px 0',
        }}
      >
        {children.map((child, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'stretch',
              width: isMobile ? '100%' : '0',
              maxWidth: isMobile ? '100%' : 'none',
            }}
          >
            {child}
          </Box>
        ))}
      </Flex>
    );
  }

  // 공지사항 섹션 렌더링
  function renderNoticeSection() {
    return (
      <Flex
        vertical
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: isMobile ? '100%' : '1000px',
          margin: 'auto',
          paddingInline: isMobile ? '4px' : '0',
        }}
      >
        <Flex
          vertical
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            border: '3px solid #C0EBFF',
            marginBlock: isMobile ? '16px' : '32px',
            marginInline: isMobile ? '4px' : '20px',
            borderRadius: '20px',
            fontFamily: 'GumiRomanceTTF',
            width: '100%',
            boxSizing: 'border-box',
            marginTop: 48,
          }}
        >
          <Flex
            style={{
              width: '100%',
              paddingInline: isMobile ? '8px' : '20px',
              paddingBlock: isMobile ? 18 : 36,
            }}
          >
            <Flex
              vertical
              style={{
                maxWidth: '1000px',
              }}
              gap={isMobile ? 12 : 24}
            >
              <AntTypography
                style={{
                  margin: 0,
                  fontSize: isMobile ? '13px' : '16px',
                  fontFamily: 'GumiRomanceTTF',
                }}
              >
                ▪︎ 작업 중 안내사항
              </AntTypography>
              <div
                style={{
                  alignItems: 'center',
                  whiteSpace: 'pre-line',
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#005978',
                }}
              >
                <span>
                  • 주문 넣어주신 상품에 맞춰 예쁘게 작업 진행 중에 있으니, 잠시만 기다려 주세요 !
                </span>
              </div>
              <div
                style={{
                  alignItems: 'center',
                  whiteSpace: 'pre-line',
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#005978',
                }}
              >
                <span>
                  • 작업 완료 시점이 표시 되고 있으니, 해당 날짜에 맞춰 파일을 다운 받아보실 수
                  있습니다 !
                </span>
              </div>
              <AntTypography
                style={{
                  margin: 0,
                  marginTop: isMobile ? 10 : 20,
                  fontFamily: 'GumiRomanceTTF',
                  fontSize: isMobile ? '13px' : '16px',
                }}
              >
                ▪︎ 작업 완료 안내사항
              </AntTypography>
              <div
                style={{
                  alignItems: 'center',
                  whiteSpace: 'pre-line',
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#005978',
                }}
              >
                <span>
                  {`• 주문 넣어주신 상품에 대해서는 작업이 진행되지만, 
                  그와에 다른 상품에 대한 요청사항이 있을 시에는 적용되지 않는 점 안내드립니다 ! 
                  ( 개별적으로 연락을 드리지 않습니다 . )`}
                </span>
              </div>
              <div
                style={{
                  alignItems: 'center',
                  whiteSpace: 'pre-line',
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#005978',
                }}
              >
                <span>
                  {`• 언제나 최선을 다해 작업에 임하고 있지만, 인물 보정 외에 합성 &제거 요청 시
                  불가능 할 수도 있다는 점 안내드립니다 !`}
                </span>
              </div>
            </Flex>
          </Flex>
        </Flex>
        <AntTypography
          style={{
            fontFamily: 'GumiRomanceTTF',
            color: '#FC9533',
            fontSize: isMobile ? '13px' : '16px',
            textAlign: 'center',
            paddingInline: isMobile ? '8px' : '20px',
            whiteSpace: 'pre-line',
            marginTop: 48,
          }}
        >
          {
            '파일은 접수 기한으로부터 [2주간]만 보관된 후 파기 되오니 꼭 작업 파일은 개인적으로 저장 해주시길 바랍니다.\n이후 파일에 대한 부분에 있어 원츠웨딩은 책임지지 않습니다.'
          }
        </AntTypography>
      </Flex>
    );
  }

  // 하단 다운로드 섹션 렌더링
  function renderBottomDownload() {
    return (
      <div
        style={{
          width: '100%',
          paddingBlock: isMobile ? '5%' : '10%',
          backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/bg3.png)`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center bottom',
        }}
      >
        <Flex
          gap={isMobile ? 4 : 10}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/line.png)`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            height: isMobile ? '6px' : '12px',
          }}
        >
          <div
            style={{
              backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/button_click.png)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '8px' : '16px',
              backgroundColor: '#EFFAFF',
            }}
          >
            <Button
              htmlType="submit"
              icon={<BsDownload />}
              iconPosition="end"
              type="text"
              size={isMobile ? 'middle' : 'large'}
              style={{
                width: 'auto',
                alignSelf: 'center',
                fontFamily: 'GumiRomanceTTF',
                whiteSpace: 'pre-line',
                color: '#2772C7',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                fontSize: isMobile ? '13px' : '16px',
              }}
              loading={loading}
              onClick={() => console.log('전체 다운로드')}
            >
              다운로드
            </Button>
          </div>
        </Flex>
      </div>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#EFFAFF', paddingBottom: 20 }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap"
        rel="stylesheet"
      />
      <Flex
        vertical
        style={{
          backgroundColor: '#EFFAFF',
          justifyContent: 'space-between',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        {renderHeader()}
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            padding: isMobile ? '8px' : '32px',
            boxSizing: 'border-box',
          }}
        >
          {orders.map((order, index) => renderOrderSection(order, index))}
        </div>
        <div
          style={{
            width: '100%',
            paddingTop: isMobile ? '3%' : '6%',
            backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/title3.png)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            marginTop: isMobile ? 60 : 200,
            minHeight: isMobile ? 40 : 120,
          }}
        />
        {renderNoticeSection()}
        {/* {renderBottomDownload()} */}
      </Flex>
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
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Rufina:wght@400;700&display=swap');
          @media (max-width: 600px) {
            .ant-typography, .ant-btn {
              font-size: 13px !important;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default OrderListView;
