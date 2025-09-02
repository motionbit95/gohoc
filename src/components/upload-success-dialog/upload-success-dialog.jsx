'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

export default function UploadSuccessDialog({
  open,
  onClose,
  title = '업로드 완료',
  message = '업로드가 완료되었습니다.',
  buttonText = '확인',
  children,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="upload-success-dialog-title"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          minWidth: { xs: 280, sm: 360, md: 420 },
          boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)',
          border: '1px solid rgba(0,0,0,0.04)',
          position: 'relative',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 2,
          mt: 1,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #111 0%, #333 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            boxShadow: '0 8px 20px rgba(17,17,17,0.15)',
            position: 'relative',
            '&::after': {
              content: '"✓"',
              color: 'white',
              fontSize: 28,
              fontWeight: 'bold',
            },
          }}
        />
        <DialogTitle
          id="upload-success-dialog-title"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 22, sm: 24, md: 26 },
            textAlign: 'center',
            letterSpacing: 0.5,
            mt: 0,
            mb: 0,
            p: 0,
            color: '#111',
            background: 'linear-gradient(145deg, #111 0%, #333 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </DialogTitle>
      </Box>
      <DialogContent sx={{ pt: 0, pb: 1 }}>
        {children || (
          <Typography
            sx={{
              fontSize: { xs: 16, sm: 17, md: 18 },
              mt: 0,
              mb: 3,
              textAlign: 'center',
              fontWeight: 400,
              lineHeight: 1.8,
              color: '#444',
              letterSpacing: 0.2,
            }}
          >
            {message}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: 'linear-gradient(145deg, #111 0%, #333 100%)',
            color: '#fff',
            fontWeight: 600,
            minWidth: 140,
            fontSize: { xs: 16, sm: 17 },
            py: 1.5,
            px: 3,
            borderRadius: 0,
            textTransform: 'none',
            letterSpacing: 0.5,
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,255,255,0.1)',
            '&:hover': {
              background: 'linear-gradient(145deg, #222 0%, #444 100%)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
          }}
          size="large"
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
