import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Button,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Stack,
  InputAdornment,
  Popover,
  // ColorPicker, // Not a MUI component
  Tab,
  Tabs,
} from '@mui/material';
import {
  ExpandMore,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatSize,
  FontDownload,
  Palette,
  FormatColorText,
  FormatColorFill,
  BorderColor,
  BorderStyle,
  Opacity,
  Height,
  // Width, // Not available in MUI v7
  WidthFull as Width,
  Padding,
  Margin,
  // Shadow, // Not available in MUI v7
  LightMode as Shadow,
  Gradient,
  TextFields,
  Title,
  Subtitles,
  Link,
  LinkOff,
  Visibility,
  VisibilityOff,
  VerticalAlignTop,
  VerticalAlignCenter,
  VerticalAlignBottom,
  RotateLeft,
  RotateRight,
  Transform,
  AutoFixHigh,
  Tune,
  Settings,
  RestartAlt,
  ContentCopy,
  ContentPaste,
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { useChartStore } from '../../store/chartStore';

interface FontStyleEditorProps {
  element: 'title' | 'subtitle' | 'legend' | 'xAxis' | 'yAxis' | 'series' | 'tooltip' | 'label' | 'markPoint' | 'markLine';
  onChange?: (styles: any) => void;
}

interface TextStyle {
  color?: string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  fontFamily?: string;
  fontSize?: number;
  align?: 'left' | 'center' | 'right' | 'auto';
  verticalAlign?: 'top' | 'middle' | 'bottom' | 'auto';
  baseline?: 'top' | 'middle' | 'bottom' | 'alphabetic' | 'hanging';
  lineHeight?: number;
  width?: number | string;
  height?: number | string;
  textBorderColor?: string;
  textBorderWidth?: number;
  textBorderType?: 'solid' | 'dashed' | 'dotted';
  textBorderDashOffset?: number;
  textShadowColor?: string;
  textShadowBlur?: number;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
  overflow?: 'truncate' | 'break' | 'breakAll' | 'none';
  ellipsis?: string;
  rich?: Record<string, any>;
}

interface ElementConfig {
  show?: boolean;
  text?: string;
  link?: string;
  target?: 'self' | 'blank';
  textStyle?: TextStyle;
  subtext?: string;
  sublink?: string;
  subtarget?: 'self' | 'blank';
  subtextStyle?: TextStyle;
  textAlign?: 'auto' | 'left' | 'right' | 'center';
  textVerticalAlign?: 'auto' | 'top' | 'bottom' | 'middle';
  triggerEvent?: boolean;
  padding?: number | number[];
  itemGap?: number;
  zlevel?: number;
  z?: number;
  left?: string | number;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number | number[];
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

const fontFamilies = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Comic Sans MS',
  'Impact',
  'Lucida Console',
  'Tahoma',
  'Palatino',
  'Garamond',
  'Bookman',
  'Avant Garde',
  'Arial Black',
  'Arial Narrow',
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Fira Sans',
  'Droid Sans',
  'Helvetica Neue',
  'Microsoft YaHei',
  'SimHei',
  'SimSun',
  'PingFang SC',
  'Hiragino Sans GB',
  'Noto Sans CJK SC',
  'Source Han Sans CN',
];

const fontWeights = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: 'bolder', label: 'Bolder' },
  { value: 'lighter', label: 'Lighter' },
  { value: 100, label: '100 - Thin' },
  { value: 200, label: '200 - Extra Light' },
  { value: 300, label: '300 - Light' },
  { value: 400, label: '400 - Normal' },
  { value: 500, label: '500 - Medium' },
  { value: 600, label: '600 - Semi Bold' },
  { value: 700, label: '700 - Bold' },
  { value: 800, label: '800 - Extra Bold' },
  { value: 900, label: '900 - Black' },
];

const borderStyles = [
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
];

const alignments = [
  { value: 'left', icon: <FormatAlignLeft /> },
  { value: 'center', icon: <FormatAlignCenter /> },
  { value: 'right', icon: <FormatAlignRight /> },
  { value: 'auto', icon: <FormatAlignJustify /> },
];

const verticalAlignments = [
  { value: 'top', icon: <VerticalAlignTop /> },
  { value: 'middle', icon: <VerticalAlignCenter /> },
  { value: 'bottom', icon: <VerticalAlignBottom /> },
];

export const FontStyleEditor: React.FC<FontStyleEditorProps> = ({
  element,
  onChange,
}) => {
  const { currentChart, updateChartConfig } = useChartStore();
  const [activeTab, setActiveTab] = useState(0);
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  const [activeColorField, setActiveColorField] = useState<string>('');
  const [copiedStyles, setCopiedStyles] = useState<any>(null);

  // Get current element configuration
  const getElementConfig = useCallback((): ElementConfig => {
    switch (element) {
      case 'title':
        return currentChart?.config?.title || {};
      case 'subtitle':
        return {
          text: currentChart?.config?.title?.subtext,
          link: currentChart?.config?.title?.sublink,
          target: currentChart?.config?.title?.subtarget,
          textStyle: currentChart?.config?.title?.subtextStyle,
        };
      case 'legend':
        return currentChart?.config?.legend || {};
      case 'xAxis':
        return currentChart?.config?.xAxis || {};
      case 'yAxis':
        return currentChart?.config?.yAxis || {};
      case 'tooltip':
        return currentChart?.config?.tooltip || {};
      case 'series':
        return currentChart?.config?.series?.[0] || {};
      default:
        return {};
    }
  }, [currentChart, element]);

  const [config, setConfig] = useState<ElementConfig>(getElementConfig());

  // Update local config when chart changes
  React.useEffect(() => {
    setConfig(getElementConfig());
  }, [getElementConfig]);

  // Handle style changes
  const handleStyleChange = (field: string, value: any, isTextStyle = true) => {
    const newConfig = { ...config };
    
    if (isTextStyle) {
      if (!newConfig.textStyle) {
        newConfig.textStyle = {};
      }
      
      if (field.includes('.')) {
        const fields = field.split('.');
        let obj: any = newConfig.textStyle;
        for (let i = 0; i < fields.length - 1; i++) {
          if (!obj[fields[i]]) {
            obj[fields[i]] = {};
          }
          obj = obj[fields[i]];
        }
        obj[fields[fields.length - 1]] = value;
      } else {
        newConfig.textStyle[field] = value;
      }
    } else {
      if (field.includes('.')) {
        const fields = field.split('.');
        let obj: any = newConfig;
        for (let i = 0; i < fields.length - 1; i++) {
          if (!obj[fields[i]]) {
            obj[fields[i]] = {};
          }
          obj = obj[fields[i]];
        }
        obj[fields[fields.length - 1]] = value;
      } else {
        (newConfig as any)[field] = value;
      }
    }
    
    setConfig(newConfig);
    
    // Update chart configuration
    updateChartConfig(element, newConfig);
    
    if (onChange) {
      onChange(newConfig);
    }
  };

  // Handle color picker
  const handleColorClick = (event: React.MouseEvent<HTMLElement>, field: string) => {
    setColorPickerAnchor(event.currentTarget);
    setActiveColorField(field);
  };

  const handleColorChange = (color: any) => {
    if (activeColorField) {
      handleStyleChange(activeColorField, color.hex, activeColorField.includes('textStyle'));
    }
  };

  // Copy and paste styles
  const handleCopyStyles = () => {
    setCopiedStyles(config.textStyle);
  };

  const handlePasteStyles = () => {
    if (copiedStyles) {
      const newConfig = { ...config, textStyle: { ...copiedStyles } };
      setConfig(newConfig);
      updateChartConfig(element, newConfig);
    }
  };

  // Reset styles
  const handleResetStyles = () => {
    const newConfig = { ...config, textStyle: {} };
    setConfig(newConfig);
    updateChartConfig(element, newConfig);
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {element.charAt(0).toUpperCase() + element.slice(1)} Font & Style Editor
        </Typography>
        <ButtonGroup size="small">
          <Tooltip title="Copy Styles">
            <IconButton onClick={handleCopyStyles}>
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Paste Styles">
            <IconButton onClick={handlePasteStyles} disabled={!copiedStyles}>
              <ContentPaste />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Styles">
            <IconButton onClick={handleResetStyles}>
              <RestartAlt />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </Box>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 2 }}>
        <Tab label="Text" />
        <Tab label="Font" />
        <Tab label="Colors" />
        <Tab label="Layout" />
        <Tab label="Effects" />
        <Tab label="Advanced" />
      </Tabs>

      {/* Text Tab */}
      {activeTab === 0 && (
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Text Content"
              value={config.text || ''}
              onChange={(e) => handleStyleChange('text', e.target.value, false)}
              multiline
              rows={2}
            />
          </Grid>
          
          {element === 'title' && (
            <>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Subtitle"
                  value={config.subtext || ''}
                  onChange={(e) => handleStyleChange('subtext', e.target.value, false)}
                />
              </Grid>
              <Grid size={8}>
                <TextField
                  fullWidth
                  label="Link URL"
                  value={config.link || ''}
                  onChange={(e) => handleStyleChange('link', e.target.value, false)}
                  InputProps={{
                    startAdornment: <Link sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid size={4}>
                <FormControl fullWidth>
                  <InputLabel>Target</InputLabel>
                  <Select
                    value={config.target || 'self'}
                    onChange={(e) => handleStyleChange('target', e.target.value, false)}
                  >
                    <MenuItem value="self">Same Window</MenuItem>
                    <MenuItem value="blank">New Window</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.show !== false}
                  onChange={(e) => handleStyleChange('show', e.target.checked, false)}
                />
              }
              label="Show Element"
            />
          </Grid>
        </Grid>
      )}

      {/* Font Tab */}
      {activeTab === 1 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Font Family</InputLabel>
              <Select
                value={config.textStyle?.fontFamily || 'Arial'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
              >
                {fontFamilies.map((font) => (
                  <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Font Weight</InputLabel>
              <Select
                value={config.textStyle?.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
              >
                {fontWeights.map((weight) => (
                  <MenuItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography gutterBottom>Font Size: {config.textStyle?.fontSize || 14}px</Typography>
            <Slider
              value={config.textStyle?.fontSize || 14}
              onChange={(e, value) => handleStyleChange('fontSize', value)}
              min={8}
              max={72}
              marks={[
                { value: 8, label: '8' },
                { value: 14, label: '14' },
                { value: 24, label: '24' },
                { value: 36, label: '36' },
                { value: 48, label: '48' },
                { value: 72, label: '72' },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography gutterBottom>Line Height: {config.textStyle?.lineHeight || 1.5}</Typography>
            <Slider
              value={config.textStyle?.lineHeight || 1.5}
              onChange={(e, value) => handleStyleChange('lineHeight', value)}
              min={0.5}
              max={3}
              step={0.1}
              marks={[
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1' },
                { value: 1.5, label: '1.5' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
              ]}
            />
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ToggleButtonGroup
                value={config.textStyle?.fontStyle || 'normal'}
                exclusive
                onChange={(e, value) => value && handleStyleChange('fontStyle', value)}
              >
                <ToggleButton value="normal">
                  Normal
                </ToggleButton>
                <ToggleButton value="italic">
                  <FormatItalic />
                </ToggleButton>
                <ToggleButton value="oblique">
                  Oblique
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Colors Tab */}
      {activeTab === 2 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Text Color:</Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: config.textStyle?.color || '#333',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
                onClick={(e) => handleColorClick(e, 'color')}
              />
              <TextField
                value={config.textStyle?.color || '#333'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                size="small"
                sx={{ width: 120 }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Background:</Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: config.backgroundColor || 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
                onClick={(e) => handleColorClick(e, 'backgroundColor')}
              />
              <TextField
                value={config.backgroundColor || 'transparent'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value, false)}
                size="small"
                sx={{ width: 120 }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Border Color:</Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: config.borderColor || '#ccc',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
                onClick={(e) => handleColorClick(e, 'borderColor')}
              />
              <TextField
                value={config.borderColor || '#ccc'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value, false)}
                size="small"
                sx={{ width: 120 }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Border Width"
              type="number"
              value={config.borderWidth || 0}
              onChange={(e) => handleStyleChange('borderWidth', Number(e.target.value), false)}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }}>Text Border & Shadow</Divider>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Text Border:</Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: config.textStyle?.textBorderColor || 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
                onClick={(e) => handleColorClick(e, 'textBorderColor')}
              />
              <TextField
                value={config.textStyle?.textBorderColor || 'transparent'}
                onChange={(e) => handleStyleChange('textBorderColor', e.target.value)}
                size="small"
                sx={{ width: 120 }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Text Border Width"
              type="number"
              value={config.textStyle?.textBorderWidth || 0}
              onChange={(e) => handleStyleChange('textBorderWidth', Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Shadow Color:</Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: config.textStyle?.textShadowColor || 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
                onClick={(e) => handleColorClick(e, 'textShadowColor')}
              />
              <TextField
                value={config.textStyle?.textShadowColor || 'transparent'}
                onChange={(e) => handleStyleChange('textShadowColor', e.target.value)}
                size="small"
                sx={{ width: 120 }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Shadow Blur"
              type="number"
              value={config.textStyle?.textShadowBlur || 0}
              onChange={(e) => handleStyleChange('textShadowBlur', Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      )}

      {/* Layout Tab */}
      {activeTab === 3 && (
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography gutterBottom>Text Alignment</Typography>
            <ToggleButtonGroup
              value={config.textStyle?.align || 'auto'}
              exclusive
              onChange={(e, value) => value && handleStyleChange('align', value)}
            >
              {alignments.map((align) => (
                <ToggleButton key={align.value} value={align.value}>
                  {align.icon}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          <Grid size={12}>
            <Typography gutterBottom>Vertical Alignment</Typography>
            <ToggleButtonGroup
              value={config.textStyle?.verticalAlign || 'auto'}
              exclusive
              onChange={(e, value) => value && handleStyleChange('verticalAlign', value)}
            >
              {verticalAlignments.map((align) => (
                <ToggleButton key={align.value} value={align.value}>
                  {align.icon}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>

          <Grid size={12}>
            <Typography gutterBottom>Baseline</Typography>
            <FormControl fullWidth>
              <Select
                value={config.textStyle?.baseline || 'alphabetic'}
                onChange={(e) => handleStyleChange('baseline', e.target.value)}
              >
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="middle">Middle</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
                <MenuItem value="alphabetic">Alphabetic</MenuItem>
                <MenuItem value="hanging">Hanging</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Width"
              value={config.textStyle?.width || 'auto'}
              onChange={(e) => handleStyleChange('width', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Height"
              value={config.textStyle?.height || 'auto'}
              onChange={(e) => handleStyleChange('height', e.target.value)}
            />
          </Grid>

          <Grid size={12}>
            <Typography gutterBottom>Padding</Typography>
            <Grid container spacing={1}>
              <Grid size={3}>
                <TextField
                  label="Top"
                  type="number"
                  value={Array.isArray(config.padding) ? config.padding[0] : config.padding || 5}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const padding = Array.isArray(config.padding) ? [...config.padding] : [5, 5, 5, 5];
                    padding[0] = value;
                    handleStyleChange('padding', padding, false);
                  }}
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Right"
                  type="number"
                  value={Array.isArray(config.padding) ? config.padding[1] : config.padding || 5}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const padding = Array.isArray(config.padding) ? [...config.padding] : [5, 5, 5, 5];
                    padding[1] = value;
                    handleStyleChange('padding', padding, false);
                  }}
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Bottom"
                  type="number"
                  value={Array.isArray(config.padding) ? config.padding[2] : config.padding || 5}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const padding = Array.isArray(config.padding) ? [...config.padding] : [5, 5, 5, 5];
                    padding[2] = value;
                    handleStyleChange('padding', padding, false);
                  }}
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Left"
                  type="number"
                  value={Array.isArray(config.padding) ? config.padding[3] : config.padding || 5}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const padding = Array.isArray(config.padding) ? [...config.padding] : [5, 5, 5, 5];
                    padding[3] = value;
                    handleStyleChange('padding', padding, false);
                  }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Item Gap"
              type="number"
              value={config.itemGap || 10}
              onChange={(e) => handleStyleChange('itemGap', Number(e.target.value), false)}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={12}>
            <Typography gutterBottom>Position</Typography>
            <Grid container spacing={1}>
              <Grid size={3}>
                <TextField
                  label="Left"
                  value={config.left || 'auto'}
                  onChange={(e) => handleStyleChange('left', e.target.value, false)}
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Top"
                  value={config.top || 'auto'}
                  onChange={(e) => handleStyleChange('top', e.target.value, false)}
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Right"
                  value={config.right || 'auto'}
                  onChange={(e) => handleStyleChange('right', e.target.value, false)}
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Bottom"
                  value={config.bottom || 'auto'}
                  onChange={(e) => handleStyleChange('bottom', e.target.value, false)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Effects Tab */}
      {activeTab === 4 && (
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="subtitle2" gutterBottom>
              Shadow Effects
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Shadow Color:</Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: config.shadowColor || 'rgba(0,0,0,0)',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
                onClick={(e) => handleColorClick(e, 'shadowColor')}
              />
              <TextField
                value={config.shadowColor || 'rgba(0,0,0,0)'}
                onChange={(e) => handleStyleChange('shadowColor', e.target.value, false)}
                size="small"
                sx={{ width: 150 }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography gutterBottom>Shadow Blur: {config.shadowBlur || 0}px</Typography>
            <Slider
              value={config.shadowBlur || 0}
              onChange={(e, value) => handleStyleChange('shadowBlur', value, false)}
              min={0}
              max={50}
              marks={[
                { value: 0, label: '0' },
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Shadow Offset X"
              type="number"
              value={config.shadowOffsetX || 0}
              onChange={(e) => handleStyleChange('shadowOffsetX', Number(e.target.value), false)}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Shadow Offset Y"
              type="number"
              value={config.shadowOffsetY || 0}
              onChange={(e) => handleStyleChange('shadowOffsetY', Number(e.target.value), false)}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }}>Text Shadow</Divider>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Text Shadow Offset X"
              type="number"
              value={config.textStyle?.textShadowOffsetX || 0}
              onChange={(e) => handleStyleChange('textShadowOffsetX', Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Text Shadow Offset Y"
              type="number"
              value={config.textStyle?.textShadowOffsetY || 0}
              onChange={(e) => handleStyleChange('textShadowOffsetY', Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }}>Border Radius</Divider>
          </Grid>

          <Grid size={12}>
            <Typography gutterBottom>Border Radius</Typography>
            <Grid container spacing={1}>
              <Grid size={3}>
                <TextField
                  label="Top-Left"
                  type="number"
                  value={Array.isArray(config.borderRadius) ? config.borderRadius[0] : config.borderRadius || 0}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const radius = Array.isArray(config.borderRadius) ? [...config.borderRadius] : [0, 0, 0, 0];
                    radius[0] = value;
                    handleStyleChange('borderRadius', radius, false);
                  }}
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Top-Right"
                  type="number"
                  value={Array.isArray(config.borderRadius) ? config.borderRadius[1] : config.borderRadius || 0}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const radius = Array.isArray(config.borderRadius) ? [...config.borderRadius] : [0, 0, 0, 0];
                    radius[1] = value;
                    handleStyleChange('borderRadius', radius, false);
                  }}
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Bottom-Right"
                  type="number"
                  value={Array.isArray(config.borderRadius) ? config.borderRadius[2] : config.borderRadius || 0}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const radius = Array.isArray(config.borderRadius) ? [...config.borderRadius] : [0, 0, 0, 0];
                    radius[2] = value;
                    handleStyleChange('borderRadius', radius, false);
                  }}
                  size="small"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Bottom-Left"
                  type="number"
                  value={Array.isArray(config.borderRadius) ? config.borderRadius[3] : config.borderRadius || 0}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const radius = Array.isArray(config.borderRadius) ? [...config.borderRadius] : [0, 0, 0, 0];
                    radius[3] = value;
                    handleStyleChange('borderRadius', radius, false);
                  }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Advanced Tab */}
      {activeTab === 5 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Text Border Type</InputLabel>
              <Select
                value={config.textStyle?.textBorderType || 'solid'}
                onChange={(e) => handleStyleChange('textBorderType', e.target.value)}
              >
                {borderStyles.map((style) => (
                  <MenuItem key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Border Dash Offset"
              type="number"
              value={config.textStyle?.textBorderDashOffset || 0}
              onChange={(e) => handleStyleChange('textBorderDashOffset', Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Text Overflow</InputLabel>
              <Select
                value={config.textStyle?.overflow || 'none'}
                onChange={(e) => handleStyleChange('overflow', e.target.value)}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="truncate">Truncate</MenuItem>
                <MenuItem value="break">Break</MenuItem>
                <MenuItem value="breakAll">Break All</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Ellipsis"
              value={config.textStyle?.ellipsis || '...'}
              onChange={(e) => handleStyleChange('ellipsis', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Z-Level"
              type="number"
              value={config.zlevel || 0}
              onChange={(e) => handleStyleChange('zlevel', Number(e.target.value), false)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Z-Index"
              type="number"
              value={config.z || 0}
              onChange={(e) => handleStyleChange('z', Number(e.target.value), false)}
            />
          </Grid>

          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.triggerEvent || false}
                  onChange={(e) => handleStyleChange('triggerEvent', e.target.checked, false)}
                />
              }
              label="Trigger Events"
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" gutterBottom>
              Rich Text Styles (Advanced)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Rich Text JSON"
              value={JSON.stringify(config.textStyle?.rich || {}, null, 2)}
              onChange={(e) => {
                try {
                  const rich = JSON.parse(e.target.value);
                  handleStyleChange('rich', rich);
                } catch (error) {
                  // Invalid JSON, ignore
                }
              }}
              helperText="Advanced rich text styling in JSON format"
            />
          </Grid>
        </Grid>
      )}

      {/* Color Picker Popover */}
      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={() => setColorPickerAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <ChromePicker
          color={
            activeColorField.includes('.')
              ? (config.textStyle as any)?.[activeColorField.split('.')[1]] || '#000'
              : activeColorField.includes('textStyle')
              ? (config.textStyle as any)?.[activeColorField] || '#000'
              : (config as any)[activeColorField] || '#000'
          }
          onChange={handleColorChange}
        />
      </Popover>
    </Paper>
  );
};