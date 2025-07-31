// Ourwedding 프로젝트 색상 팔레트
// 모든 컴포넌트에서 일관된 색상을 사용하기 위한 중앙 집중식 색상 관리

// 기본 색상 팔레트
// export const COLORS = {
//   // 기본 배경 및 카드
//   BG_COLOR: '#23291f', // 메인 배경색 (다크 그린)
//   PAPER_BG: '#2e3527', // 카드/섹션 배경색 (BG보다 밝은 톤)

//   // 텍스트
//   TEXT_COLOR: '#fffbe9', // 기본 텍스트 색상 (밝은 베이지/화이트)

//   // 메인 액센트 (버튼, 포인트 등)
//   ACCENT_COLOR: '#ffe082b3', // 기본 액센트 색 (밝은 옐로우, 톤 다운)
//   ACCENT_COLOR_DARK: '#e6c86a', // 액센트 hover 등 (톤다운)

//   // 버튼
//   BUTTON_COLOR: '#746D4B', // 버튼 배경 (모카 브라운)
//   BUTTON_HOVER_COLOR: '#68644F', // 버튼 hover
//   BUTTON_TEXT_COLOR: '#fffbe9', // 버튼 텍스트

//   // 로그인 전용 (기존 버튼 색 활용)
//   LOGIN_ACCENT_COLOR: '#746D4B',
//   LOGIN_ACCENT_COLOR_DARK: '#68644F',

//   // 상세페이지 전용 색상 (별도 페이지용 톤)
//   DETAIL_BG_COLOR: '#FDFBF7', // 배경
//   DETAIL_TEXT_COLOR: '#5B4C2B', // 텍스트 (소프트 브라운)
//   DETAIL_SECTION_BG: '#E7E2D2', // 박스 배경
//   DETAIL_HIGHLIGHT_BG: '#D9D1B4', // 강조 배경
//   DETAIL_SUBTEXT_COLOR: '#9C937F', // 설명, 서브텍스트
//   DETAIL_WARNING_COLOR: '#D7562B', // 경고 텍스트

//   // 상태 컬러
//   DIVIDER_COLOR: '#A79166',
//   ERROR_COLOR: '#d32f2f',
//   SUCCESS_COLOR: '#388e3c',
//   WARNING_COLOR: '#ed6c02',
//   INFO_COLOR: '#0288d1',
// };

export const COLORS = {
  // 기본 배경 및 카드
  BG_COLOR: '#23291f', // 메인 배경색 (다크 그린)
  PAPER_BG: '#2e3527', // 카드/섹션 배경색 (BG보다 밝은 톤)

  // 텍스트
  TEXT_COLOR: '#fffbe9', // 기본 텍스트 색상 (밝은 베이지/화이트)

  // 메인 액센트 (버튼, 포인트 등)
  ACCENT_COLOR: '#ffe082b3', // 기본 액센트 색 (밝은 옐로우, 톤 다운)
  ACCENT_COLOR_DARK: '#e6c86a', // 액센트 hover 등 (톤다운)

  // 버튼
  BUTTON_COLOR: '#746D4B', // 버튼 배경 (모카 브라운)
  BUTTON_HOVER_COLOR: '#68644F', // 버튼 hover
  BUTTON_TEXT_COLOR: '#fffbe9', // 버튼 텍스트

  // 로그인 전용 (기존 버튼 색 활용)
  LOGIN_ACCENT_COLOR: '#746D4B',
  LOGIN_ACCENT_COLOR_DARK: '#68644F',

  // 상세페이지 전용 색상 (별도 페이지용 톤)
  DETAIL_BG_COLOR: 'white', // 배경
  DETAIL_PAPER_BG: '#E7E0D1', // 카드/섹션 배경색
  DETAIL_ALERT_BG: 'rgba(110, 133, 87, 0.2)',

  DETAIL_ACCENT_COLOR: '#6E8557', // 액센트 컬러
  DETAIL_ACCENT_COLOR_DARK: '#5B4C2B', // 액센트 hover 등 (진한 그린)

  DETAIL_TEXT_COLOR: '#5B4C2B', // 텍스트 (소프트 브라운)
  DETAIL_SECTION_BG: '#E7E2D2', // 박스 배경
  DETAIL_HIGHLIGHT_BG: '#D9D1B4', // 강조 배경
  DETAIL_SUBTEXT_COLOR: '#9C937F', // 설명, 서브텍스트
  DETAIL_WARNING_COLOR: '#D7562B', // 경고 텍스트

  // 상태 컬러
  DIVIDER_COLOR: '#A79166',
  ERROR_COLOR: '#d32f2f',
  SUCCESS_COLOR: '#388e3c',
  WARNING_COLOR: '#ed6c02',
  INFO_COLOR: '#0288d1',
};

// 폰트 설정
export const FONTS = {
  HEADING: 'Pretendard, Noto Sans KR, sans-serif',
  SERIF: 'Noto Serif KR, serif',
  MONOSPACE: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

// 스타일 상수
export const STYLES = {
  // 통일된 input 스타일 변수
  UNIFIED_RADIUS: 2, // theme.spacing 단위
  UNIFIED_HEIGHT: 44, // px, 모든 input/셀렉트 높이 통일

  // 그림자 설정
  SHADOW_LIGHT: '0 2px 16px 0 rgba(35,41,31,0.08)',
  SHADOW_MEDIUM: '0 2px 12px 0 rgba(35,41,31,0.10)',
  SHADOW_ACCENT: '0 2px 8px 0 rgba(255,224,130,0.15)',

  // 텍스트 그림자
  TEXT_SHADOW: '0 1px 2px rgba(0,0,0,0.10)',
  TEXT_SHADOW_DARK: '0 1px 2px rgba(0,0,0,0.18)',
};

// 테마별 색상 세트 (컴포넌트별로 사용)
export const THEME_SETS = {
  // 메인 테마 (대부분의 컴포넌트)
  main: {
    bgColor: COLORS.BG_COLOR,
    paperBg: COLORS.PAPER_BG,
    textColor: COLORS.TEXT_COLOR,
    accentColor: COLORS.ACCENT_COLOR,
    accentColorDark: COLORS.ACCENT_COLOR_DARK,
  },

  // 로그인 페이지 테마
  login: {
    bgColor: COLORS.BG_COLOR,
    paperBg: COLORS.BG_COLOR,
    textColor: COLORS.TEXT_COLOR,
    accentColor: COLORS.LOGIN_ACCENT_COLOR,
    accentColorDark: COLORS.LOGIN_ACCENT_COLOR_DARK,
  },

  // 인트로 페이지 테마
  intro: {
    bgColor: COLORS.BG_COLOR,
    textColor: COLORS.TEXT_COLOR,
    accentColor: COLORS.LOGIN_ACCENT_COLOR,
    accentColorDark: COLORS.LOGIN_ACCENT_COLOR_DARK,
  },
};

// 편의 함수들
export const getThemeColors = (themeSet = 'main') => THEME_SETS[themeSet] || THEME_SETS.main;

// 색상 유틸리티 함수들
export const colorUtils = {
  // 투명도가 적용된 색상 생성
  withOpacity: (color, opacity) => {
    // HEX 색상을 RGBA로 변환
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // 밝기 조정 (간단한 버전)
  lighten: (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  // 어둡게 조정 (간단한 버전)
  darken: (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};

// MUI sx 스타일 헬퍼 함수들
export const sxHelpers = {
  // 기본 박스 스타일
  box: (themeSet = 'main') => {
    const colors = getThemeColors(themeSet);
    return {
      background: colors.bgColor,
      borderRadius: 3,
      color: colors.textColor,
      boxShadow: STYLES.SHADOW_LIGHT,
    };
  },

  // 제목 스타일
  title: (themeSet = 'main') => {
    const colors = getThemeColors(themeSet);
    return {
      color: colors.accentColor,
      fontWeight: 800,
      letterSpacing: 0.5,
      fontSize: { xs: 20, sm: 22 },
      textShadow: STYLES.TEXT_SHADOW,
    };
  },

  // 버튼 스타일
  button: (themeSet = 'main', variant = 'contained') => {
    const colors = getThemeColors(themeSet);
    const baseStyle = {
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: 0.5,
      borderRadius: 2,
      transition: 'background 0.2s, color 0.2s',
    };

    if (variant === 'contained') {
      return {
        ...baseStyle,
        background: colors.accentColor,
        color: colors.bgColor,
        boxShadow: STYLES.SHADOW_ACCENT,
        '&:hover': {
          background: colors.accentColorDark,
          color: colors.bgColor,
          boxShadow: STYLES.SHADOW_ACCENT,
        },
      };
    }

    return baseStyle;
  },

  // 입력 필드 스타일
  input: (themeSet = 'main') => {
    const colors = getThemeColors(themeSet);
    return {
      color: colors.textColor,
      background: colors.bgColor,
      borderRadius: STYLES.UNIFIED_RADIUS,
      fontWeight: 500,
      letterSpacing: 0.5,
      height: STYLES.UNIFIED_HEIGHT,
      minHeight: STYLES.UNIFIED_HEIGHT,
      '& .MuiInputBase-input': {
        color: colors.textColor,
        height: STYLES.UNIFIED_HEIGHT - 2,
        minHeight: STYLES.UNIFIED_HEIGHT - 2,
        boxSizing: 'border-box',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: STYLES.UNIFIED_RADIUS,
        minHeight: STYLES.UNIFIED_HEIGHT,
        height: STYLES.UNIFIED_HEIGHT,
        '& fieldset': {
          borderRadius: STYLES.UNIFIED_RADIUS,
        },
        '&.Mui-focused fieldset': {
          borderColor: colors.accentColor,
        },
      },
      '& .MuiInputLabel-root': {
        color: colors.accentColor,
        fontWeight: 700,
        letterSpacing: 0.2,
        fontSize: 16,
        textShadow: STYLES.TEXT_SHADOW_DARK,
        lineHeight: 1.2,
      },
    };
  },
};

// 사용 예시:
/*
// 1. 기본 색상 사용
import { COLORS, FONTS } from 'src/constant/colors';

const MyComponent = () => (
  <Box sx={{ background: COLORS.BG_COLOR, color: COLORS.TEXT_COLOR }}>
    <Typography sx={{ fontFamily: FONTS.HEADING }}>
      Hello World
    </Typography>
  </Box>
);

// 2. 테마 세트 사용
import { getThemeColors } from 'src/constant/colors';

const LoginComponent = () => {
  const colors = getThemeColors('login');
  return (
    <Box sx={{ background: colors.bgColor, color: colors.textColor }}>
      <Button sx={{ background: colors.accentColor }}>
        Login
      </Button>
    </Box>
  );
};

// 3. 헬퍼 함수 사용
import { sxHelpers } from 'src/constant/colors';

const FormComponent = () => (
  <Box sx={sxHelpers.box('main')}>
    <Typography sx={sxHelpers.title('main')}>
      Form Title
    </Typography>
    <TextField sx={sxHelpers.input('main')} />
    <Button sx={sxHelpers.button('main')}>
      Submit
    </Button>
  </Box>
);

// 4. 색상 유틸리티 사용
import { colorUtils } from 'src/constant/colors';

const CustomComponent = () => (
  <Box sx={{ 
    background: colorUtils.withOpacity(COLORS.ACCENT_COLOR, 0.1),
    border: `1px solid ${colorUtils.lighten(COLORS.ACCENT_COLOR, 20)}`
  }}>
    Custom styled component
  </Box>
);
*/

// 기본 export (하위 호환성을 위해)
export default {
  COLORS,
  FONTS,
  STYLES,
  THEME_SETS,
  getThemeColors,
  colorUtils,
  sxHelpers,
};
