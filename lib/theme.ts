import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1B5E20',
      light: '#2E7D32',
      dark: '#145214',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFD600',
      light: '#FFEE58',
      dark: '#F9A825',
      contrastText: '#1B5E20',
    },
    background: {
      default: '#f9f9f7',
      paper: '#FFFFFF',
    },
  },

  typography: {
    fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif",
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1B5E20',
          color: '#FFFFFF',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
        },
      },
    },
  },
});

export default theme;
