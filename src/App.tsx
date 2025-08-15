import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Box, Container, Grid, useMediaQuery, Fab, Tooltip } from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ChartPreview } from './components/ChartPreview/ChartPreview';
import { ChartOptionsDebugger } from './components/Debug/ChartOptionsDebugger';
import { useChartStore } from './store/chartStore';
import './App.css';

function App() {
  const { isDarkMode, sidebarOpen, isPreviewMode } = useChartStore();
  const [activeView, setActiveView] = useState<'chart' | 'tools'>('chart');
  const [showDebugger, setShowDebugger] = useState(false);
  
  // Responsive breakpoints
  const isLaptop = useMediaQuery('(min-width:1024px) and (max-width:1440px)');
  const isDesktop = useMediaQuery('(min-width:1441px)');
  const isTablet = useMediaQuery('(min-width:768px) and (max-width:1023px)');
  const isMobile = useMediaQuery('(max-width:767px)');

  // Adjust sidebar width based on screen size
  const getSidebarWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '280px';
    if (isLaptop) return '320px';
    return '360px';
  };

  // Adjust padding based on screen size
  const getContentPadding = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isLaptop) return 2.5;
    return 3;
  };

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
          fontSize: isLaptop ? 13 : 14,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontSize: isLaptop ? '0.875rem' : '0.9375rem',
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                padding: isLaptop ? 6 : 8,
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              size: isLaptop ? 'small' : 'medium',
            },
          },
          MuiSelect: {
            defaultProps: {
              size: isLaptop ? 'small' : 'medium',
            },
          },
        },
        spacing: isLaptop ? 6 : 8,
      }),
    [isDarkMode, isLaptop]
  );

  // Auto-hide sidebar on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      useChartStore.getState().toggleSidebar();
    }
  }, [isMobile]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Header onViewChange={setActiveView} activeView={activeView} />
        <Sidebar width={getSidebarWidth()} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: getContentPadding(),
            pt: { xs: 7, sm: 8, md: 9 },
            ml: {
              xs: 0,
              sm: sidebarOpen && !isPreviewMode ? getSidebarWidth() : 0,
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: 'background.default',
            height: '100vh',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              height: '100%',
              px: { xs: 0, sm: 1, md: 2 },
              maxWidth: isLaptop ? '100%' : isDesktop ? '1920px' : '100%',
            }}
          >
            {showDebugger ? (
              <ChartOptionsDebugger />
            ) : (
              <Grid
                container
                spacing={isLaptop ? 2 : 3}
                sx={{
                  height: '100%',
                  margin: 0,
                  width: '100%',
                }}
              >
                <Grid
                  size={12}
                  sx={{
                    height: '100%',
                    paddingTop: '0 !important',
                    paddingLeft: '0 !important',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: theme.shadows[1],
                      overflow: 'hidden',
                    }}
                  >
                    {activeView === 'chart' ? (
                      <ChartPreview
                        compact={isLaptop || isTablet}
                        fullHeight={true}
                      />
                    ) : (
                      <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
                        {/* Tools view content will be added here */}
                        <div>Tools Panel - Coming Soon</div>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>
        
        {/* Floating Help Button */}
        <Tooltip title={showDebugger ? "Hide Help" : "Show Help & Options Guide"}>
          <Fab
            color="primary"
            aria-label="help"
            onClick={() => setShowDebugger(!showDebugger)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1200,
            }}
          >
            <HelpIcon />
          </Fab>
        </Tooltip>
      </Box>
    </ThemeProvider>
  );
}

export default App;
