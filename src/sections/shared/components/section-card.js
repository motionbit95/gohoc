import { Box, Card, Typography, Divider } from '@mui/material';

export default function SectionCard({ title, children, sx = {} }) {
  return (
    <Card sx={{ p: 3, mb: 3, ...sx }}>
      {title && (
        <>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {title}
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{children}</Box>
    </Card>
  );
}
