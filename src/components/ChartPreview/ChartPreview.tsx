import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Box, Paper, CircularProgress, Typography, Button, Alert } from '@mui/material';
import { useChartStore } from '../../store/chartStore';
import { generateChartOption } from '../../utils/chartGenerator';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ChartPreviewProps {
  compact?: boolean;
  fullHeight?: boolean;
}

export const ChartPreview: React.FC<ChartPreviewProps> = ({ compact = false, fullHeight = false }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { currentChart, isDarkMode, resetChart } = useChartStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, isDarkMode ? 'dark' : undefined);
    }

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || !currentChart) return;

    setLoading(true);
    setError(null);

    const renderChart = () => {
      try {
        // Validate chart data before rendering
        if (!currentChart.data || !currentChart.data.series || currentChart.data.series.length === 0) {
          throw new Error('No data available for chart rendering');
        }

        // Generate chart options based on current configuration
        const option = generateChartOption(currentChart);
        
        // Validate generated options
        if (!option || Object.keys(option).length === 0) {
          throw new Error('Failed to generate valid chart options');
        }
        
        // Set the option to the chart with error recovery
        chartInstance.current?.setOption(option, true);
        setLoading(false);
        setRetryCount(0);
      } catch (err) {
        console.error('Error rendering chart:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to render chart';
        setError(errorMessage);
        setLoading(false);
        
        // Auto-retry logic for transient errors
        if (retryCount < 3 && err instanceof Error && !err.message.includes('No data')) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            renderChart();
          }, 1000);
        }
      }
    };

    renderChart();
  }, [currentChart, retryCount]);

  // Handle theme change
  useEffect(() => {
    if (chartInstance.current && chartRef.current) {
      chartInstance.current.dispose();
      chartInstance.current = echarts.init(chartRef.current, isDarkMode ? 'dark' : undefined);
      if (currentChart) {
        try {
          const option = generateChartOption(currentChart);
          chartInstance.current.setOption(option, true);
        } catch (err) {
          console.error('Error re-rendering chart:', err);
        }
      }
    }
  }, [isDarkMode]);

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    if (currentChart && chartInstance.current) {
      try {
        const option = generateChartOption(currentChart);
        chartInstance.current.setOption(option, true);
      } catch (err) {
        console.error('Retry failed:', err);
      }
    }
  };

  const handleReset = () => {
    resetChart();
    setError(null);
    setRetryCount(0);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? 'grey.900' : 'background.paper',
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
            padding: 2,
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Error</Typography>
            <Typography>{error}</Typography>
          </Alert>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
            >
              Retry
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
            >
              Reset Chart
            </Button>
          </Box>
        </Box>
      )}

      <Box
        ref={chartRef}
        id="chart-container"
        className="chart-container"
        sx={{
          width: '100%',
          height: '100%',
          opacity: loading || error ? 0.3 : 1,
          transition: 'opacity 0.3s',
        }}
      />
    </Paper>
  );
};