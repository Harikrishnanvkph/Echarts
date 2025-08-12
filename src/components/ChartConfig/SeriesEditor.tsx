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
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import { useChartStore } from '../../store/chartStore';

export const SeriesEditor: React.FC = () => {
  const { currentChart, updateChartData } = useChartStore();
  const [expandedSeries, setExpandedSeries] = React.useState<number | false>(0);
  const [colorPickerOpen, setColorPickerOpen] = React.useState<number | null>(null);

  const handleSeriesChange = (index: number, field: string, value: any) => {
    if (!currentChart) return;
    const newSeries = [...currentChart.data.series];
    newSeries[index] = { ...newSeries[index], [field]: value };
    updateChartData({ series: newSeries });
  };

  const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSeries(isExpanded ? panel : false);
  };

  if (!currentChart) return null;

  const chartType = currentChart.type;
  const isLineOrArea = chartType === 'line' || chartType === 'area';
  const isBar = chartType === 'bar';
  const isPie = chartType === 'pie';

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Series Configuration
      </Typography>
      
      {currentChart.data.series.map((series, index) => (
        <Accordion
          key={index}
          expanded={expandedSeries === index}
          onChange={handleAccordionChange(index)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Typography>{series.name}</Typography>
              {series.color && (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: series.color,
                    border: '1px solid #ccc',
                    borderRadius: '50%',
                  }}
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Series Name"
                size="small"
                fullWidth
                value={series.name}
                onChange={(e) => handleSeriesChange(index, 'name', e.target.value)}
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Series Color
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 32,
                      backgroundColor: series.color || '#5470c6',
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => setColorPickerOpen(index)}
                  />
                  <Typography variant="body2">
                    {series.color || 'Default'}
                  </Typography>
                </Box>
                {colorPickerOpen === index && (
                  <Box sx={{ position: 'absolute', zIndex: 2 }}>
                    <Box
                      sx={{ position: 'fixed', inset: 0 }}
                      onClick={() => setColorPickerOpen(null)}
                    />
                    <SketchPicker
                      color={series.color || '#5470c6'}
                      onChange={(color) => {
                        handleSeriesChange(index, 'color', color.hex);
                      }}
                    />
                  </Box>
                )}
              </Box>

              {isLineOrArea && (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={series.smooth || false}
                        onChange={(e) => handleSeriesChange(index, 'smooth', e.target.checked)}
                      />
                    }
                    label="Smooth Line"
                  />
                  
                  {chartType === 'area' && (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!series.areaStyle}
                          onChange={(e) => handleSeriesChange(index, 'areaStyle', e.target.checked ? {} : undefined)}
                        />
                      }
                      label="Fill Area"
                    />
                  )}
                </>
              )}

              {isBar && (
                <>
                  <TextField
                    label="Stack Group"
                    size="small"
                    fullWidth
                    value={series.stack || ''}
                    onChange={(e) => handleSeriesChange(index, 'stack', e.target.value)}
                    helperText="Use same value to stack series"
                  />
                </>
              )}

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Label Settings
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!series.label?.show}
                      onChange={(e) => handleSeriesChange(index, 'label', { 
                        ...series.label, 
                        show: e.target.checked 
                      })}
                    />
                  }
                  label="Show Labels"
                />
                {series.label?.show && (
                  <FormControl size="small" fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Label Position</InputLabel>
                    <Select
                      value={series.label?.position || 'top'}
                      label="Label Position"
                      onChange={(e) => handleSeriesChange(index, 'label', {
                        ...series.label,
                        position: e.target.value,
                      })}
                    >
                      <MenuItem value="top">Top</MenuItem>
                      <MenuItem value="bottom">Bottom</MenuItem>
                      <MenuItem value="left">Left</MenuItem>
                      <MenuItem value="right">Right</MenuItem>
                      <MenuItem value="inside">Inside</MenuItem>
                      <MenuItem value="insideLeft">Inside Left</MenuItem>
                      <MenuItem value="insideRight">Inside Right</MenuItem>
                      <MenuItem value="insideTop">Inside Top</MenuItem>
                      <MenuItem value="insideBottom">Inside Bottom</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Emphasis Effect
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={series.emphasis?.focus === 'series'}
                      onChange={(e) => handleSeriesChange(index, 'emphasis', {
                        ...series.emphasis,
                        focus: e.target.checked ? 'series' : undefined,
                      })}
                    />
                  }
                  label="Focus on Hover"
                />
              </Box>

              {(chartType === 'line' || chartType === 'scatter') && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Symbol Settings
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Symbol Type</InputLabel>
                    <Select
                      value={series.itemStyle?.symbol || 'circle'}
                      label="Symbol Type"
                      onChange={(e) => handleSeriesChange(index, 'symbol', e.target.value)}
                    >
                      <MenuItem value="circle">Circle</MenuItem>
                      <MenuItem value="rect">Rectangle</MenuItem>
                      <MenuItem value="roundRect">Rounded Rectangle</MenuItem>
                      <MenuItem value="triangle">Triangle</MenuItem>
                      <MenuItem value="diamond">Diamond</MenuItem>
                      <MenuItem value="pin">Pin</MenuItem>
                      <MenuItem value="arrow">Arrow</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography gutterBottom>Symbol Size</Typography>
                    <Slider
                      value={series.itemStyle?.symbolSize || 4}
                      onChange={(e, value) => handleSeriesChange(index, 'symbolSize', value)}
                      min={0}
                      max={20}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      
      {currentChart.data.series.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No series available. Add series in the Data tab.
        </Typography>
      )}
    </Box>
  );
};