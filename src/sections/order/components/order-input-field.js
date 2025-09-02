import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { unifiedInputStyle } from '../styles/utils';

export function OrderTextField({ label, ...props }) {
  return <TextField label={label} fullWidth sx={unifiedInputStyle} {...props} />;
}

export function OrderSelect({ label, options, ...props }) {
  return (
    <FormControl fullWidth sx={unifiedInputStyle}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} {...props}>
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
