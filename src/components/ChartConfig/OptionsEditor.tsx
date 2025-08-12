import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Slider,
  Button,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useChartStore } from '../../store/chartStore';

export const OptionsEditor: React.FC = () => {
  const { currentChart, updateChartOptions } = useChartStore();
  const [expandedPanel, setExpandedPanel] = React.useState<string | false>('axis');
  const [customOptions, setCustomOptions] = React.useState('');
  const [customError, setCustomError] = React.useState('');

  const handlePanelChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const handleAxisChange = (axis: 'xAxis' | 'yAxis', field: string, value: any) => {
    updateChartOptions({
      [axis]: {
        ...currentChart?.options[axis],
        [field]: value,
      },
    });
  };

  const handleToolboxChange = (field: string, value: any) => {
    updateChartOptions({
      toolbox: {
        ...currentChart?.options.toolbox,
        [field]: value,
      },
    });
  };

  const handleDataZoomChange = (enabled: boolean) => {
    if (enabled) {
      updateChartOptions({
        dataZoom: [
          {
            type: 'slider',
            show: true,
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            start: 0,
            end: 100,
          },
        ],
      });
    } else {
      updateChartOptions({ dataZoom: undefined });
    }
  };

  const applyCustomOptions = () => {
    try {
      const options = JSON.parse(customOptions);
      updateChartOptions(options);
      setCustomError('');
    } catch (error) {
      setCustomError('Invalid JSON format');
    }
  };

  if (!currentChart) return null;

  const hasAxis = ['line', 'bar', 'area', 'scatter', 'candlestick', 'boxplot'].includes(currentChart.type);

  return (
    <Box>
      {hasAxis && (
        <Accordion expanded={expandedPanel === 'axis'} onChange={handlePanelChange('axis')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Axis Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2">X-Axis</Typography>
              <TextField
                label="X-Axis Name"
                size="small"
                fullWidth
                value={currentChart.options.xAxis?.name || ''}
                onChange={(e) => handleAxisChange('xAxis', 'name', e.target.value)}
              />
              <FormControl size="small">
                <InputLabel>X-Axis Type</InputLabel>
                <Select
                  value={currentChart.options.xAxis?.type || 'category'}
                  label="X-Axis Type"
                  onChange={(e) => handleAxisChange('xAxis', 'type', e.target.value)}
                >
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="value">Value</MenuItem>
                  <MenuItem value="time">Time</MenuItem>
                  <MenuItem value="log">Log</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentChart.options.xAxis?.show !== false}
                    onChange={(e) => handleAxisChange('xAxis', 'show', e.target.checked)}
                  />
                }
                label="Show X-Axis"
              />

              <Typography variant="subtitle2" sx={{ mt: 2 }}>Y-Axis</Typography>
              <TextField
                label="Y-Axis Name"
                size="small"
                fullWidth
                value={currentChart.options.yAxis?.name || ''}
                onChange={(e) => handleAxisChange('yAxis', 'name', e.target.value)}
              />
              <FormControl size="small">
                <InputLabel>Y-Axis Type</InputLabel>
                <Select
                  value={currentChart.options.yAxis?.type || 'value'}
                  label="Y-Axis Type"
                  onChange={(e) => handleAxisChange('yAxis', 'type', e.target.value)}
                >
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="value">Value</MenuItem>
                  <MenuItem value="time">Time</MenuItem>
                  <MenuItem value="log">Log</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentChart.options.yAxis?.show !== false}
                    onChange={(e) => handleAxisChange('yAxis', 'show', e.target.checked)}
                  />
                }
                label="Show Y-Axis"
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion expanded={expandedPanel === 'toolbox'} onChange={handlePanelChange('toolbox')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Toolbox</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentChart.options.toolbox?.show || false}
                  onChange={(e) => handleToolboxChange('show', e.target.checked)}
                />
              }
              label="Show Toolbox"
            />
            {currentChart.options.toolbox?.show && (
              <>
                <Typography variant="subtitle2">Features</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentChart.options.toolbox?.feature?.saveAsImage || false}
                      onChange={(e) => handleToolboxChange('feature', {
                        ...currentChart.options.toolbox?.feature,
                        saveAsImage: e.target.checked ? {} : undefined,
                      })}
                    />
                  }
                  label="Save as Image"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentChart.options.toolbox?.feature?.restore || false}
                      onChange={(e) => handleToolboxChange('feature', {
                        ...currentChart.options.toolbox?.feature,
                        restore: e.target.checked ? {} : undefined,
                      })}
                    />
                  }
                  label="Restore"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentChart.options.toolbox?.feature?.dataView || false}
                      onChange={(e) => handleToolboxChange('feature', {
                        ...currentChart.options.toolbox?.feature,
                        dataView: e.target.checked ? { readOnly: false } : undefined,
                      })}
                    />
                  }
                  label="Data View"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentChart.options.toolbox?.feature?.dataZoom || false}
                      onChange={(e) => handleToolboxChange('feature', {
                        ...currentChart.options.toolbox?.feature,
                        dataZoom: e.target.checked ? {} : undefined,
                      })}
                    />
                  }
                  label="Data Zoom"
                />
              </>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      {hasAxis && (
        <Accordion expanded={expandedPanel === 'dataZoom'} onChange={handlePanelChange('dataZoom')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Data Zoom</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!currentChart.options.dataZoom}
                    onChange={(e) => handleDataZoomChange(e.target.checked)}
                  />
                }
                label="Enable Data Zoom"
              />
              {currentChart.options.dataZoom && (
                <>
                  <Typography variant="subtitle2">Zoom Range</Typography>
                  <Box>
                    <Typography gutterBottom>Start Position (%)</Typography>
                    <Slider
                      value={currentChart.options.dataZoom?.[0]?.start || 0}
                      onChange={(e, value) => {
                        const dataZoom = [...(currentChart.options.dataZoom || [])];
                        if (dataZoom[0]) dataZoom[0].start = value as number;
                        updateChartOptions({ dataZoom });
                      }}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <Box>
                    <Typography gutterBottom>End Position (%)</Typography>
                    <Slider
                      value={currentChart.options.dataZoom?.[0]?.end || 100}
                      onChange={(e, value) => {
                        const dataZoom = [...(currentChart.options.dataZoom || [])];
                        if (dataZoom[0]) dataZoom[0].end = value as number;
                        updateChartOptions({ dataZoom });
                      }}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion expanded={expandedPanel === 'responsive'} onChange={handlePanelChange('responsive')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Responsive Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentChart.options.darkMode || false}
                  onChange={(e) => updateChartOptions({ darkMode: e.target.checked })}
                />
              }
              label="Dark Mode"
            />
            <Alert severity="info">
              Charts automatically resize when the container size changes.
            </Alert>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'custom'} onChange={handlePanelChange('custom')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Custom Options (Advanced)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="warning">
              Advanced users only: Directly edit chart options as JSON.
              This will merge with existing options.
            </Alert>
            <TextField
              multiline
              rows={10}
              fullWidth
              placeholder={JSON.stringify({ title: { text: 'Custom Title' } }, null, 2)}
              value={customOptions}
              onChange={(e) => setCustomOptions(e.target.value)}
              variant="outlined"
              error={!!customError}
              helperText={customError}
            />
            <Button
              startIcon={<CodeIcon />}
              onClick={applyCustomOptions}
              variant="contained"
              disabled={!customOptions.trim()}
            >
              Apply Custom Options
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};