import React from 'react';
import { Box, Paper, Typography, Alert, Button, Chip, Grid } from '@mui/material';
import { useChartStore } from '../../store/chartStore';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

export const ChartOptionsDebugger: React.FC = () => {
  const store = useChartStore();
  const { 
    sidebarOpen, 
    isPreviewMode, 
    currentChart,
    toggleSidebar,
    togglePreviewMode 
  } = store;

  const diagnostics = [
    {
      label: 'Sidebar Status',
      value: sidebarOpen ? 'Open' : 'Closed',
      status: sidebarOpen ? 'success' : 'warning',
      action: () => toggleSidebar(),
      actionLabel: sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'
    },
    {
      label: 'Preview Mode',
      value: isPreviewMode ? 'Active' : 'Inactive',
      status: isPreviewMode ? 'warning' : 'success',
      action: () => togglePreviewMode(),
      actionLabel: isPreviewMode ? 'Exit Preview' : 'Enter Preview'
    },
    {
      label: 'Chart Loaded',
      value: currentChart ? `${currentChart.type} chart` : 'No chart',
      status: currentChart ? 'success' : 'error',
      action: null,
      actionLabel: null
    },
    {
      label: 'Available Options',
      value: currentChart ? 'All options available' : 'Load a chart first',
      status: currentChart ? 'success' : 'info',
      action: null,
      actionLabel: null
    }
  ];

  const availableFeatures = [
    { name: 'Chart Type Selector', available: true },
    { name: 'Data Editor', available: true },
    { name: 'Series Configuration', available: true },
    { name: 'Style Editor', available: true },
    { name: 'Advanced Options', available: true },
    { name: '3D Charts', available: true },
    { name: 'Export Functions', available: true },
    { name: 'Real-time Updates', available: true },
  ];

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Chart Options Debugger
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          This debugger helps identify why chart editing options might not be visible.
        </Typography>
      </Alert>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {diagnostics.map((diag, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: `${diag.status}.main`,
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {diag.status === 'success' && <CheckIcon color="success" />}
                {diag.status === 'warning' && <ErrorIcon color="warning" />}
                {diag.status === 'error' && <ErrorIcon color="error" />}
                {diag.status === 'info' && <InfoIcon color="info" />}
                <Typography variant="subtitle2">{diag.label}</Typography>
              </Box>
              <Typography variant="body1" fontWeight="bold">
                {diag.value}
              </Typography>
              {diag.action && (
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={diag.action}
                  sx={{ mt: 1 }}
                >
                  {diag.actionLabel}
                </Button>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Available Features
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {availableFeatures.map((feature) => (
          <Chip
            key={feature.name}
            label={feature.name}
            color={feature.available ? 'success' : 'default'}
            icon={feature.available ? <CheckIcon /> : <ErrorIcon />}
          />
        ))}
      </Box>

      <Alert severity="success">
        <Typography variant="subtitle2" gutterBottom>
          Quick Actions to Access Chart Options:
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
          <li>Click the menu icon (☰) in the header to toggle the sidebar</li>
          <li>Use the tabs in the sidebar to switch between Data, Series, Style, and Options</li>
          <li>Click on the chart type card to see all 15+ available chart types</li>
          <li>Import data using CSV, JSON, or manual entry in the Data tab</li>
          <li>Customize colors, fonts, and themes in the Style tab</li>
          <li>Add advanced features like 3D effects, animations, and interactions in Options</li>
        </Box>
      </Alert>

      {!sidebarOpen && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            The sidebar is currently closed! Open it to access all chart editing options.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={toggleSidebar}
            sx={{ mt: 1 }}
            startIcon={<VisibilityIcon />}
          >
            Open Chart Editor Sidebar
          </Button>
        </Alert>
      )}

      {isPreviewMode && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            Preview mode is active! Exit preview mode to access editing options.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={togglePreviewMode}
            sx={{ mt: 1 }}
            startIcon={<VisibilityOffIcon />}
          >
            Exit Preview Mode
          </Button>
        </Alert>
      )}
    </Paper>
  );
};