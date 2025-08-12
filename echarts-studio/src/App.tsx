import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Box } from '@mui/material';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ChartPreview } from './components/ChartPreview/ChartPreview';
import { useChartStore } from './store/chartStore';
import './App.css';

function App() {
  const { isDarkMode, sidebarOpen, isPreviewMode } = useChartStore();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#5470c6',
          },
          secondary: {
            main: '#91cc75',
          },
          background: {
            default: isDarkMode ? '#121212' : '#f5f5f5',
            paper: isDarkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            ml: sidebarOpen && !isPreviewMode ? '360px' : 0,
            transition: 'margin-left 0.3s',
            backgroundColor: 'background.default',
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ChartPreview />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
