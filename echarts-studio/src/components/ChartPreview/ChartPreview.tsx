import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import { useChartStore } from '../../store/chartStore';
import { generateChartOption } from '../../utils/chartGenerator';

export const ChartPreview: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { currentChart, isDarkMode } = useChartStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

    try {
      // Generate chart options based on current configuration
      const option = generateChartOption(currentChart);
      
      // Set the option to the chart
      chartInstance.current.setOption(option, true);
      setLoading(false);
    } catch (err) {
      console.error('Error rendering chart:', err);
      setError('Failed to render chart. Please check your configuration.');
      setLoading(false);
    }
  }, [currentChart]);

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
          }}
        >
          <Typography color="error" variant="h6">
            Error
          </Typography>
          <Typography color="text.secondary">
            {error}
          </Typography>
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