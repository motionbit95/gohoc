import { Box, TextField } from '@mui/material';
import { labelStyle, inputFieldStyle, inputPropsStyle } from '../styles/utils';

export default function AuthInputField({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  error = false,
  helperText = '',
  isMobile = false,
  ...props
}) {
  return (
    <Box>
      <Box
        component="label"
        htmlFor={id}
        sx={labelStyle(isMobile)}
      >
        {label}
      </Box>
      <TextField
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        fullWidth
        variant="standard"
        error={error}
        helperText={helperText}
        InputProps={inputPropsStyle(isMobile)}
        InputLabelProps={{ shrink: true }}
        sx={inputFieldStyle(isMobile)}
        {...props}
      />
    </Box>
  );
}
