import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  InputLabel,
  Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import { useChartStore } from '../../store/chartStore';

export const StyleEditor: React.FC = () => {
  const { currentChart, updateChartOptions } = useChartStore();
  const [colorPickerOpen, setColorPickerOpen] = React.useState<string | null>(null);
  const [expandedPanel, setExpandedPanel] = React.useState<string | false>('title');

  const handlePanelChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const handleTitleChange = (field: string, value: any) => {
    updateChartOptions({
      title: {
        ...currentChart?.options.title,
        [field]: value,
      },
    });
  };

  const handleLegendChange = (field: string, value: any) => {
    updateChartOptions({
      legend: {
        ...currentChart?.options.legend,
        [field]: value,
      },
    });
  };

  const handleGridChange = (field: string, value: any) => {
    updateChartOptions({
      grid: {
        ...currentChart?.options.grid,
        [field]: value,
      },
    });
  };

  const handleTooltipChange = (field: string, value: any) => {
    updateChartOptions({
      tooltip: {
        ...currentChart?.options.tooltip,
        [field]: value,
      },
    });
  };

  const handleColorThemeChange = (colors: string[]) => {
    updateChartOptions({ color: colors });
  };

  const handleBackgroundColorChange = (color: string) => {
    updateChartOptions({ backgroundColor: color });
  };

  if (!currentChart) return null;

  const defaultColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
  ];

  return (
    <Box>
      <Accordion expanded={expandedPanel === 'title'} onChange={handlePanelChange('title')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Title & Subtitle</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              size="small"
              value={currentChart.options.title?.text || ''}
              onChange={(e) => handleTitleChange('text', e.target.value)}
            />
            <TextField
              label="Subtitle"
              fullWidth
              size="small"
              value={currentChart.options.title?.subtext || ''}
              onChange={(e) => handleTitleChange('subtext', e.target.value)}
            />
            <FormControl size="small">
              <InputLabel>Title Position</InputLabel>
              <Select
                value={currentChart.options.title?.left || 'center'}
                label="Title Position"
                onChange={(e) => handleTitleChange('left', e.target.value)}
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'legend'} onChange={handlePanelChange('legend')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Legend</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentChart.options.legend?.show !== false}
                  onChange={(e) => handleLegendChange('show', e.target.checked)}
                />
              }
              label="Show Legend"
            />
            <FormControl size="small">
              <InputLabel>Orientation</InputLabel>
              <Select
                value={currentChart.options.legend?.orient || 'horizontal'}
                label="Orientation"
                onChange={(e) => handleLegendChange('orient', e.target.value)}
              >
                <MenuItem value="horizontal">Horizontal</MenuItem>
                <MenuItem value="vertical">Vertical</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Position</InputLabel>
              <Select
                value={currentChart.options.legend?.top || 'bottom'}
                label="Position"
                onChange={(e) => handleLegendChange('top', e.target.value)}
              >
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="middle">Middle</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'grid'} onChange={handlePanelChange('grid')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Grid & Spacing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Left Margin"
              size="small"
              value={currentChart.options.grid?.left || '3%'}
              onChange={(e) => handleGridChange('left', e.target.value)}
            />
            <TextField
              label="Right Margin"
              size="small"
              value={currentChart.options.grid?.right || '4%'}
              onChange={(e) => handleGridChange('right', e.target.value)}
            />
            <TextField
              label="Top Margin"
              size="small"
              value={currentChart.options.grid?.top || '3%'}
              onChange={(e) => handleGridChange('top', e.target.value)}
            />
            <TextField
              label="Bottom Margin"
              size="small"
              value={currentChart.options.grid?.bottom || '10%'}
              onChange={(e) => handleGridChange('bottom', e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={currentChart.options.grid?.containLabel !== false}
                  onChange={(e) => handleGridChange('containLabel', e.target.checked)}
                />
              }
              label="Contain Label"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'colors'} onChange={handlePanelChange('colors')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Colors & Theme</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2">Color Palette</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {(currentChart.options.color || defaultColors).map((color, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: color,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => setColorPickerOpen(`color-${index}`)}
                  />
                  {colorPickerOpen === `color-${index}` && (
                    <Box sx={{ position: 'absolute', zIndex: 2, top: 40 }}>
                      <Box
                        sx={{ position: 'fixed', inset: 0 }}
                        onClick={() => setColorPickerOpen(null)}
                      />
                      <SketchPicker
                        color={color}
                        onChange={(newColor) => {
                          const colors = [...(currentChart.options.color || defaultColors)];
                          colors[index] = newColor.hex;
                          handleColorThemeChange(colors);
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            <Typography variant="subtitle2">Background Color</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 32,
                  backgroundColor: currentChart.options.backgroundColor || 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
                onClick={() => setColorPickerOpen('background')}
              />
              <Typography variant="body2">
                {currentChart.options.backgroundColor || 'Transparent'}
              </Typography>
            </Box>
            {colorPickerOpen === 'background' && (
              <Box sx={{ position: 'absolute', zIndex: 2 }}>
                <Box
                  sx={{ position: 'fixed', inset: 0 }}
                  onClick={() => setColorPickerOpen(null)}
                />
                <SketchPicker
                  color={currentChart.options.backgroundColor || '#ffffff'}
                  onChange={(color) => handleBackgroundColorChange(color.hex)}
                />
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'tooltip'} onChange={handlePanelChange('tooltip')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Tooltip</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl size="small">
              <InputLabel>Trigger</InputLabel>
              <Select
                value={currentChart.options.tooltip?.trigger || 'axis'}
                label="Trigger"
                onChange={(e) => handleTooltipChange('trigger', e.target.value)}
              >
                <MenuItem value="item">Item</MenuItem>
                <MenuItem value="axis">Axis</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expandedPanel === 'animation'} onChange={handlePanelChange('animation')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Animation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentChart.options.animation !== false}
                  onChange={(e) => updateChartOptions({ animation: e.target.checked })}
                />
              }
              label="Enable Animation"
            />
            <Box>
              <Typography gutterBottom>Animation Duration (ms)</Typography>
              <Slider
                value={currentChart.options.animationDuration || 1000}
                onChange={(e, value) => updateChartOptions({ animationDuration: value as number })}
                min={0}
                max={5000}
                step={100}
                valueLabelDisplay="auto"
                disabled={currentChart.options.animation === false}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};