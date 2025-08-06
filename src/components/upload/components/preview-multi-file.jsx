import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fData } from 'src/utils/format-number';

import { Iconify } from '../../iconify';
import { uploadClasses } from '../classes';
import { fileData, FileThumbnail } from '../../file-thumbnail';

// ----------------------------------------------------------------------

export function MultiFilePreview({
  sx,
  onRemove,
  lastNode,
  thumbnail,
  slotProps,
  firstNode,
  files = [],
  className,
  uploadProgress = {},
  uploadStatus = {}, // 파일별 상태 추가
  ...other
}) {
  return (
    <ListRoot
      thumbnail={thumbnail}
      className={mergeClasses([uploadClasses.uploadMultiPreview, className])}
      sx={sx}
      {...other}
    >
      {firstNode && <ItemNode thumbnail={thumbnail}>{firstNode}</ItemNode>}

      {files.map((file) => {
        const { name, size } = fileData(file);
        const progress = uploadProgress[name] ?? 0; // 진행률 없으면 0

        const status = uploadStatus[name] ?? 'waiting'; // 기본 상태

        // 상태별 텍스트를 정리하는 함수
        const getStatusText = (status, progress) => {
          switch (status) {
            case 'uploading':
              return `업로드 중`;
            case 'processing':
              return '서버 처리 중';
            case 'done':
              return '완료';
            case 'error':
              return '오류 발생';
            case 'waiting':
            default:
              return progress === 0 ? '대기 중' : `${progress}%`;
          }
        };

        const statusText = getStatusText(status, progress);

        if (thumbnail) {
          return (
            <ItemThumbnail key={name}>
              <FileThumbnail
                tooltip
                imageView
                file={file}
                onRemove={() => onRemove?.(file)}
                sx={[
                  (theme) => ({
                    width: 80,
                    height: 80,
                    border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                  }),
                ]}
                slotProps={{ icon: { sx: { width: 36, height: 36 } } }}
                {...slotProps?.thumbnail}
              />
            </ItemThumbnail>
          );
        }

        return (
          <ItemRow key={name}>
            <FileThumbnail file={file} {...slotProps?.thumbnail} />

            <ListItemText
              primary={name}
              secondary={fData(size)}
              slotProps={{
                secondary: { sx: { typography: 'caption' } },
              }}
            />

            <StatusText>{statusText}</StatusText>

            {/* 진행률 표시 */}
            <ProgressWrapper>
              <ProgressBar
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
              <ProgressLabel>{progress}%</ProgressLabel>
            </ProgressWrapper>

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify width={16} icon="mingcute:close-line" />
              </IconButton>
            )}
          </ItemRow>
        );
      })}

      {lastNode && <ItemNode thumbnail={thumbnail}>{lastNode}</ItemNode>}
    </ListRoot>
  );
}

// ----------------------------------------------------------------------

const ListRoot = styled('ul', {
  shouldForwardProp: (prop) => !['thumbnail', 'sx'].includes(prop),
})(({ thumbnail, theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'column',
  ...(thumbnail && { flexWrap: 'wrap', flexDirection: 'row' }),
}));

const ItemThumbnail = styled('li')(() => ({ display: 'inline-flex' }));

const ItemRow = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 1, 1, 1.5),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
}));

const ItemNode = styled('li', {
  shouldForwardProp: (prop) => !['thumbnail', 'sx'].includes(prop),
})(({ thumbnail }) => ({
  ...(thumbnail && { width: 'auto', display: 'inline-flex' }),
}));

// 진행률 관련 스타일

const ProgressWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  width: 100,
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[300],
  marginRight: theme.spacing(1),
  alignSelf: 'center',
  flexShrink: 0,
}));

const ProgressBar = styled('div')(({ theme }) => ({
  height: '100%',
  borderRadius: 4,
  backgroundColor: theme.palette.primary.main,
  transition: 'width 0.3s ease',
}));

const ProgressLabel = styled('span')(({ theme }) => ({
  minWidth: 30,
  fontSize: 12,
  textAlign: 'right',
  color: theme.palette.text.secondary,
  alignSelf: 'center',
}));

const StatusText = styled('div')(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.text.secondary,
  alignSelf: 'center',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  whiteSpace: 'nowrap',
}));
