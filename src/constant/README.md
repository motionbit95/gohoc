# Taility 색상 시스템

이 디렉토리는 Taility 프로젝트의 색상과 스타일을 중앙 집중식으로 관리하는 constant 파일들을 포함합니다.

## 파일 구조

```
src/constant/
├── colors.js          # 색상 팔레트 및 스타일 상수
├── taility.js      # Taility 관련 텍스트 상수
└── README.md          # 이 파일
```

## colors.js 사용법

### 1. 기본 색상 사용

```javascript
import { COLORS, FONTS } from 'src/constant/colors';

const MyComponent = () => (
  <Box
    sx={{
      background: COLORS.BG_COLOR,
      color: COLORS.TEXT_COLOR,
    }}
  >
    <Typography sx={{ fontFamily: FONTS.HEADING }}>Hello World</Typography>
  </Box>
);
```

### 2. 테마 세트 사용

```javascript
import { getThemeColors } from 'src/constant/colors';

const LoginComponent = () => {
  const colors = getThemeColors('login');
  return (
    <Box
      sx={{
        background: colors.bgColor,
        color: colors.textColor,
      }}
    >
      <Button sx={{ background: colors.accentColor }}>Login</Button>
    </Box>
  );
};
```

### 3. 헬퍼 함수 사용 (권장)

```javascript
import { sxHelpers } from 'src/constant/colors';

const FormComponent = () => (
  <Box sx={sxHelpers.box('main')}>
    <Typography sx={sxHelpers.title('main')}>Form Title</Typography>
    <TextField sx={sxHelpers.input('main')} />
    <Button sx={sxHelpers.button('main')}>Submit</Button>
  </Box>
);
```

### 4. 색상 유틸리티 사용

```javascript
import { colorUtils, COLORS } from 'src/constant/colors';

const CustomComponent = () => (
  <Box
    sx={{
      background: colorUtils.withOpacity(COLORS.ACCENT_COLOR, 0.1),
      border: `1px solid ${colorUtils.lighten(COLORS.ACCENT_COLOR, 20)}`,
    }}
  >
    Custom styled component
  </Box>
);
```

## 사용 가능한 색상

### 기본 색상 (COLORS)

- `BG_COLOR`: 메인 배경색 (#23291f)
- `PAPER_BG`: 카드/페이퍼 배경색 (#2e3527)
- `TEXT_COLOR`: 메인 텍스트 색상 (#fffbe9)
- `ACCENT_COLOR`: 메인 액센트 색상 (#ffe082)
- `ACCENT_COLOR_DARK`: 어두운 액센트 색상 (#ffd54f)
- `LOGIN_ACCENT_COLOR`: 로그인 페이지 전용 컬러 (#746D4B)
- `LOGIN_ACCENT_COLOR_DARK`: 로그인 페이지 어두운 버전 (#68644F)
- `DIVIDER_COLOR`: 구분선 색상 (#A79166)
- `ERROR_COLOR`: 에러 색상 (#d32f2f)
- `SUCCESS_COLOR`: 성공 색상 (#388e3c)
- `WARNING_COLOR`: 경고 색상 (#ed6c02)
- `INFO_COLOR`: 정보 색상 (#0288d1)

### 폰트 (FONTS)

- `HEADING`: 제목용 폰트 (Pretendard, Noto Sans KR, sans-serif)
- `SERIF`: 세리프 폰트 (Noto Serif KR, serif)
- `MONOSPACE`: 모노스페이스 폰트 (Menlo, Monaco, Consolas, ...)

### 스타일 상수 (STYLES)

- `UNIFIED_RADIUS`: 통일된 모서리 반경 (2)
- `UNIFIED_HEIGHT`: 통일된 높이 (44px)
- `SHADOW_LIGHT`: 가벼운 그림자
- `SHADOW_MEDIUM`: 중간 그림자
- `SHADOW_ACCENT`: 액센트 그림자
- `TEXT_SHADOW`: 텍스트 그림자
- `TEXT_SHADOW_DARK`: 어두운 텍스트 그림자

## 테마 세트

### main (기본)

- 대부분의 컴포넌트에서 사용
- 밝은 골드 액센트 컬러

### login

- 로그인 페이지에서 사용
- 어두운 브라운 액센트 컬러

### intro

- 인트로 페이지에서 사용
- 로그인과 동일한 컬러

## 헬퍼 함수

### sxHelpers.box(themeSet)

기본 박스 스타일을 반환합니다.

### sxHelpers.title(themeSet)

제목 스타일을 반환합니다.

### sxHelpers.button(themeSet, variant)

버튼 스타일을 반환합니다.

### sxHelpers.input(themeSet)

입력 필드 스타일을 반환합니다.

## 색상 유틸리티

### colorUtils.withOpacity(color, opacity)

색상에 투명도를 적용합니다.

### colorUtils.lighten(color, amount)

색상을 밝게 만듭니다.

### colorUtils.darken(color, amount)

색상을 어둡게 만듭니다.

## 마이그레이션 가이드

기존 코드에서 하드코딩된 색상을 constant로 변경하는 방법:

### Before

```javascript
const BG_COLOR = '#23291f';
const TEXT_COLOR = '#fffbe9';
const ACCENT_COLOR = '#ffe082';
```

### After

```javascript
import { COLORS } from 'src/constant/colors';

const BG_COLOR = COLORS.BG_COLOR;
const TEXT_COLOR = COLORS.TEXT_COLOR;
const ACCENT_COLOR = COLORS.ACCENT_COLOR;
```

또는 더 간단하게:

```javascript
import { getThemeColors } from 'src/constant/colors';

const colors = getThemeColors('main');
// colors.bgColor, colors.textColor, colors.accentColor 사용
```

## 주의사항

1. 새로운 색상을 추가할 때는 `colors.js`에 정의하고 모든 컴포넌트에서 import해서 사용하세요.
2. 하드코딩된 색상 값은 피하고 항상 constant를 사용하세요.
3. 테마별로 다른 색상을 사용해야 할 때는 `THEME_SETS`에 새로운 테마를 추가하세요.
4. 공통 스타일은 `sxHelpers`에 추가하여 재사용성을 높이세요.
