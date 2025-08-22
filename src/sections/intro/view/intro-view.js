'use client';

// React 및 필요한 훅, 컴포넌트 import
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ConfigProvider, Flex } from 'antd';

// 버튼에 대한 라벨과 이동할 페이지 정보 설정
const BUTTON_CONFIGS = [
  { label: '신규신청', page: 'new' },
  { label: '접수내역 (재수정신청)', page: 'revision' },
];

// 스타일 객체 정의
const styles = {
  wrapper: {
    height: '100vh',
    backgroundColor: '#EDF9FF',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  button: {
    maxWidth: 300,
    paddingInline: 40,
    paddingBlock: 24,
    fontSize: 16,
    fontWeight: 500,
    whiteSpace: 'pre-line',
    color: '#6BB0FF',
    fontFamily: 'GumiRomanceTTF',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
  // 버튼 컨테이너 스타일, 선택 여부에 따라 이미지 변경
  buttonContainer: (isSelected) => ({
    backgroundImage: `url(/assets/wantswedding/${isSelected ? 'button_click.png' : 'button.png'})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: 300,
    height: 100,
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  // 링크 아이콘 스타일
  linkIcon: {
    backgroundImage: 'url(/assets/wantswedding/link.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: 24,
    height: 24,
    position: 'absolute',
    top: 24,
    right: 24,
  },
};

// 버튼과 링크 아이콘을 함께 렌더링하는 컴포넌트
function ButtonWithIcon({
  label,
  page,
  isSelected,
  onClick,
  onMouseDown,
  onMouseLeave,
  onMouseUp,
}) {
  return (
    <div style={styles.buttonContainer(isSelected)}>
      <Button
        type="text"
        size="large"
        style={styles.button}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      >
        {label}
      </Button>
      {/* 링크 아이콘 */}
      <div style={styles.linkIcon} />
    </div>
  );
}

// 메인 컴포넌트
export default function WantsWedding() {
  // 선택된 버튼의 페이지 상태 관리
  const [selectedPage, setSelectedPage] = useState(null);
  const router = useRouter();

  // 컴포넌트 마운트 시 localStorage 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  }, []);

  // 버튼 클릭 시 해당 페이지로 이동
  const handleButtonClick = useCallback(
    (page) => {
      router.push(`/login/?target=${page}`);
    },
    [router]
  );

  return (
    <ConfigProvider theme={{ components: { Button: {} } }}>
      <div style={styles.wrapper}>
        <Flex align="center" justify="center" style={{ height: '100%' }}>
          <Flex vertical align="center" gap={48}>
            {/* 버튼 목록 렌더링 */}
            {BUTTON_CONFIGS.map(({ label, page }, idx) => (
              <ButtonWithIcon
                key={page}
                label={label}
                page={page}
                isSelected={page === selectedPage}
                onClick={() => handleButtonClick(page)}
                onMouseDown={() => setSelectedPage(page)}
                onMouseLeave={() => setSelectedPage(null)}
                onMouseUp={() => setSelectedPage(null)}
              />
            ))}
          </Flex>
        </Flex>
      </div>
    </ConfigProvider>
  );
}
