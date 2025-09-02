import { Checkbox, FormControlLabel } from '@mui/material';
import { checkboxStyle, checkboxLabelStyle, allAgreeLabelStyle } from '../styles/utils';

export function OrderCheckbox({ label, ...props }) {
  return (
    <FormControlLabel
      control={<Checkbox sx={checkboxStyle} {...props} />}
      label={label}
      sx={checkboxLabelStyle}
    />
  );
}

export function OrderAllAgreeCheckbox({ label, ...props }) {
  return (
    <FormControlLabel
      control={<Checkbox sx={checkboxStyle} {...props} />}
      label={label}
      sx={allAgreeLabelStyle}
    />
  );
}
