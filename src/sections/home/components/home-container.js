import { Container } from '@mui/material';
import { containerStyle } from '../styles/utils';

export default function HomeContainer({ children, maxWidth = 'xs', sx = {} }) {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{ ...containerStyle, ...sx }}
    >
      {children}
    </Container>
  );
}
