import { Box, Typography, useTheme, useMediaQuery, Stack } from '@mui/material';

const PageTitle = () => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: '5vh', lg: '8vh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        textAlign: 'center',
        gap: { xs: 1.5, lg: 2.5 },
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography
          sx={{
            fontFamily: 'Linden Hill',
            fontSize: { xs: '13vw', lg: 'min(140px, 9vw)' },
            whiteSpace: 'nowrap',
            width: { xs: '100%', lg: 'auto' },
            display: 'block',
            textAlign: 'center',
            position: { xs: 'relative', lg: 'static' },
            marginBottom: { xs: '-3vw', lg: '-48px' },
            mx: 'auto',
          }}
        >
          Order Information
        </Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography
          sx={{
            fontFamily: 'Linden Hill',
            whiteSpace: 'nowrap',
            fontWeight: 300,
            fontSize: { xs: '5vw', lg: 'min(64px, 4vw)' },
            color: { xs: 'inherit', lg: 'transparent' },
            WebkitTextStroke: { xs: 'none', lg: '0.5px black' },
            textAlign: 'center',
            mx: 'auto',
          }}
        >
          {'[Remodification]'}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 4,
          height: { xs: 32, lg: 40 },
          border: '0.5px solid black',
          my: { xs: 2, lg: 0 },
          mx: 'auto',
        }}
      />
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Linden Hill',
            textAlign: 'center',
            m: 0,
            mx: 'auto',
          }}
        >
          TAILITY
        </Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            m: 0,
            mx: 'auto',
          }}
        >
          재수정
        </Typography>
      </Box>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Aboreto&family=Baskervville:ital@0;1&family=Castoro+Titling&family=Linden+Hill:ital@0;1&display=swap');
        `}
      </style>
    </Box>
  );
};

export default PageTitle;
