import { useDropzone } from 'react-dropzone';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';

import { Iconify } from '../iconify';
import { uploadClasses } from './classes';
import { UploadPlaceholder } from './components/placeholder';
import { RejectionFiles } from './components/rejection-files';
import { MultiFilePreview } from './components/preview-multi-file';
import { DeleteButton, SingleFilePreview } from './components/preview-single-file';
import { Typography } from '@mui/material';
import { themeConfig } from 'src/theme';

// ----------------------------------------------------------------------

export function Upload({
  sx,
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  thumbnail,
  helperText,
  onRemoveAll,
  className,
  uploadProgress,
  uploadStatus,
  multiple = false,
  maxFiles,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    maxFiles,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/x-raw': ['.raw'], // 일부 브라우저에서는 인식 못할 수 있음
      'image/x-canon-cr2': ['.cr2'],
      'image/x-canon-cr3': ['.cr3'],
      'text/plain': ['.txt'], // 텍스트 파일 허용
    },
    ...other,
  });

  const isArray = Array.isArray(value) && multiple;

  const hasFile = !isArray && !!value;
  const hasFiles = isArray && !!value.length;

  const hasError = isDragReject || !!error;

  const renderMultiPreview = () =>
    hasFiles && (
      <>
        <MultiFilePreview
          uploadProgress={uploadProgress}
          files={value}
          thumbnail={thumbnail}
          onRemove={onRemove}
          sx={{ my: 3 }}
          uploadStatus={uploadStatus}
        />

        {(onRemoveAll || onUpload) && (
          <Box sx={{ gap: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
            {onRemoveAll && (
              <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
                전체 삭제
              </Button>
            )}

            {onUpload && (
              <Button
                size="small"
                variant="contained"
                onClick={onUpload}
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              >
                업로드 진행
              </Button>
            )}
          </Box>
        )}
      </>
    );

  return (
    <Box
      className={mergeClasses([uploadClasses.upload, className])}
      sx={[{ width: 1, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Box
        {...getRootProps()}
        sx={[
          (theme) => ({
            p: 5,
            outline: 'none',
            borderRadius: 1,
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            border: `1px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
            transition: theme.transitions.create(['opacity', 'padding']),
            '&:hover': { opacity: 0.72 },
            ...(isDragActive && { opacity: 0.72 }),
            ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
            ...(hasError && {
              color: 'error.main',
              borderColor: 'error.main',
              bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
            }),
            ...(hasFile && { padding: '28% 0' }),
          }),
        ]}
      >
        <input {...getInputProps()} />

        {/* Single file */}
        {hasFile ? <SingleFilePreview file={value} /> : <UploadPlaceholder />}
      </Box>

      {/* Single file */}
      {hasFile && <DeleteButton onClick={onDelete} />}

      {helperText && (
        <FormHelperText error={!!error} sx={{ mx: 1.75 }}>
          {helperText}
        </FormHelperText>
      )}

      {/* {!!fileRejections.length && <RejectionFiles files={fileRejections} />} */}
      {maxFiles < fileRejections.length && (
        <Typography variant="caption" color={themeConfig.palette.error.main}>
          파일 개수를 초과했습니다. 다시 업로드해주세요.
        </Typography>
      )}

      {/* Multi files */}
      {renderMultiPreview()}
    </Box>
  );
}
