import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

// 기존 order-form.js에서 사용되는 공통 스타일
const UNIFIED_RADIUS = 0;
const UNIFIED_HEIGHT = 48;

const unifiedInputSx = {
  borderRadius: UNIFIED_RADIUS,
  minHeight: UNIFIED_HEIGHT,
  height: UNIFIED_HEIGHT,
  mb: 2,
  '& .MuiOutlinedInput-root': {
    borderRadius: UNIFIED_RADIUS,
    minHeight: UNIFIED_HEIGHT,
    height: UNIFIED_HEIGHT,
  },
};

export function FormTextField({ label, ...props }) {
  return <TextField label={label} fullWidth sx={unifiedInputSx} {...props} />;
}

export function FormSelect({ label, options, ...props }) {
  return (
    <FormControl fullWidth sx={unifiedInputSx}>
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

export function FormCheckbox({ label, ...props }) {
  return <FormControlLabel control={<Checkbox {...props} />} label={label} sx={{ mb: 2 }} />;
}
