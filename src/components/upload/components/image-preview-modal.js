import { Portal, Backdrop, IconButton } from '@mui/material';
import { useEffect } from 'react';
import { CloseIcon } from 'yet-another-react-lightbox';
import { CarouselThumbsY } from './carousel-thumbs-y';

const ImagePreviewModal = ({ order, showImage, onClose, items }) => {
  if (!showImage) return null;

  useEffect(() => {
    console.log(items);
  }, []);

  return (
    <Portal>
      <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal - 1 }}>
        <CarouselThumbsY order={order} data={items} />
        {/* <div style={{ position: 'absolute', top: 0, left: 0, color: 'yellow' }}>{showImage}</div> */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Backdrop>
    </Portal>
  );
};

export default ImagePreviewModal;
