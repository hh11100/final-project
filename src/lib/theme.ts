import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#FF4081',
    }
  },
  typography: {
    fontFamily: "Helvetica, sans-serif",
    fontSize: 16,
    h6: {
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1.125rem',
    },
    button: {
      textTransform: 'none',
    },
  },
});
