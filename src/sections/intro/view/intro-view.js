'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ConfigProvider } from 'antd';

// 버튼에 대한 라벨과 이동할 페이지 정보 설정
const BUTTON_CONFIGS = [
  { label: '신규신청', page: 'new' },
  { label: '접수내역 (재수정신청)', page: 'revision' },
];

// CSS-in-JS 대신 CSS 모듈/글로벌 스타일로 분리 권장, 여기선 인라인 스타일 유지
const styles = {
  wrapper: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#EDF9FF',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
  },
  buttonList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 48,
    width: '100%',
    maxWidth: 400,
  },
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
    minWidth: 300,
    minHeight: 100,
    boxSizing: 'border-box',
    transition: 'background-image 0.1s',
  }),
  button: {
    width: '100%',
    height: '100%',
    maxWidth: 300,
    maxHeight: 100,
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
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkIcon: {
    backgroundImage: 'url(/assets/wantswedding/link.png)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: 24,
    height: 24,
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 2,
    pointerEvents: 'none',
  },
};

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
      <div style={styles.linkIcon} />
    </div>
  );
}

export default function WantsWedding() {
  const [selectedPage, setSelectedPage] = useState(null);
  const router = useRouter();

  // 새로고침 시 UI 깨짐 방지: hydration mismatch 방지용 마운트 플래그
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  }, []);

  const handleButtonClick = useCallback(
    (page) => {
      router.push(`/login/?target=${page}`);
    },
    [router]
  );

  // SSR hydration mismatch 방지: 마운트 후에만 렌더
  if (!mounted) return null;

  return (
    <ConfigProvider theme={{ components: { Button: {} } }}>
      <div style={styles.wrapper}>
        <div style={styles.buttonList}>
          {BUTTON_CONFIGS.map(({ label, page }) => (
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
        </div>
      </div>
    </ConfigProvider>
  );
}
