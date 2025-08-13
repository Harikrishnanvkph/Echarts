// Advanced Tools Panel Component
// Comprehensive tool management and execution interface

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Tooltip,
  Badge,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  CircularProgress,
  LinearProgress,
  Collapse,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Drawer,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
  styled
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  PlayArrow as PlayIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Category as CategoryIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Code as CodeIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share as ShareIcon,
  Help as HelpIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Functions as FunctionsIcon,
  Timeline as TimelineIcon,
  BubbleChart as BubbleChartIcon,
  Storage as StorageIcon,
  CloudUpload as CloudUploadIcon,
  Psychology as PsychologyIcon,
  AccountBalance as AccountBalanceIcon,
  Transform as TransformIcon,
  AutoFixHigh as AutoFixHighIcon,
  Palette as PaletteIcon,
  Group as GroupIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  DataUsage as DataUsageIcon,
  Analytics as AnalyticsIcon,
  InsertChart as InsertChartIcon,
  Dashboard as DashboardIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  Insights as InsightsIcon,
  AutoGraph as AutoGraphIcon,
  ModelTraining as ModelTrainingIcon,
  CleaningServices as CleaningServicesIcon
} from '@mui/icons-material';
import { 
  tools, 
  toolCategories, 
  getToolsByCategory, 
  searchTools, 
  getToolById,
  Tool,
  ToolCategory,
  ToolParameter
} from '../../data/tools';
import { useChartStore } from '../../store/chartStore';

// Styled Components
const StyledToolsPanel = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden'
}));

const StyledSearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: (theme.shape.borderRadius as number) * 2,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08)
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper
    }
  }
}));

const StyledCategoryTab = styled(Tab)(({ theme }) => ({
  minHeight: 48,
  textTransform: 'none',
  fontWeight: 500,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600
  }
}));

const StyledToolCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main
  },
  '&.selected': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05)
  },
  '&.premium': {
    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
    borderColor: theme.palette.warning.main
  }
}));

const StyledExecutionPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
}));

// Category Icons Mapping
const categoryIcons: Record<ToolCategory, React.ReactElement> = {
  [ToolCategory.DATA_ANALYSIS]: <AnalyticsIcon />,
  [ToolCategory.VISUALIZATION]: <InsertChartIcon />,
  [ToolCategory.EXPORT_SHARING]: <ShareIcon />,
  [ToolCategory.STATISTICAL]: <ScienceIcon />,
  [ToolCategory.FINANCIAL]: <AccountBalanceIcon />,
  [ToolCategory.MACHINE_LEARNING]: <PsychologyIcon />,
  [ToolCategory.DATA_PROCESSING]: <TransformIcon />,
  [ToolCategory.FORMATTING]: <PaletteIcon />,
  [ToolCategory.COLLABORATION]: <GroupIcon />,
  [ToolCategory.AUTOMATION]: <AutoFixHighIcon />
};

// Tool Icons Mapping
const toolIcons: Record<string, React.ReactElement> = {
  'summarize': <AssessmentIcon />,
  'scatter_plot': <BubbleChartIcon />,
  'trending_up': <TrendingUpIcon />,
  'grid_on': <ViewModuleIcon />,
  'assessment': <AssessmentIcon />,
  'error_outline': <ErrorIcon />,
  'bar_chart': <InsertChartIcon />,
  'show_chart': <TimelineIcon />,
  'warning': <WarningIcon />,
  'group': <GroupIcon />,
  'filter_list': <FilterIcon />,
  'person_pin': <FavoriteIcon />,
  'category': <CategoryIcon />,
  'compare': <CompareIcon />,
  'troubleshoot': <SettingsIcon />,
  'auto_graph': <AutoGraphIcon />,
  '3d_rotation': <ThreeDRotationIcon />,
  'map': <MapIcon />,
  'hub': <HubIcon />,
  'dashboard': <DashboardIcon />,
  'animation': <AnimationIcon />,
  'image': <ImageIcon />,
  'palette': <PaletteIcon />,
  'color_lens': <ColorLensIcon />,
  'transform': <TransformIcon />,
  'auto_stories': <AutoStoriesIcon />,
  'grid_view': <ViewModuleIcon />,
  'edit_note': <EditNoteIcon />,
  'devices': <DevicesIcon />,
  'file_download': <DownloadIcon />,
  'cloud_upload': <CloudUploadIcon />,
  'code': <CodeIcon />,
  'share': <ShareIcon />,
  'description': <DescriptionIcon />,
  'api': <ApiIcon />,
  'present_to_all': <PresentToAllIcon />,
  'print': <PrintIcon />,
  'history': <HistoryIcon />,
  'group_work': <GroupWorkIcon />,
  'timeline': <TimelineIcon />,
  'science': <ScienceIcon />,
  'equalizer': <EqualizerIcon />,
  'vertical_align_center': <VerticalAlignCenterIcon />,
  'casino': <CasinoIcon />,
  'psychology': <PsychologyIcon />,
  'timer': <TimerIcon />,
  'link': <LinkIcon />,
  'analytics': <AnalyticsIcon />,
  'refresh': <RefreshIcon />,
  'bolt': <BoltIcon />,
  'calculate': <CalculateIcon />,
  'account_balance': <AccountBalanceIcon />,
  'payments': <PaymentIcon />,
  'balance': <BalanceIcon />,
  'percent': <PercentIcon />,
  'compare_arrows': <CompareArrowsIcon />,
  'attach_money': <AttachMoneyIcon />,
  'tune': <TuneIcon />,
  'bubble_chart': <BubbleChartIcon />,
  'model_training': <ModelTrainingIcon />,
  'star': <StarIcon />,
  'account_tree': <AccountTreeIcon />,
  'forest': <NatureIcon />,
  'auto_mode': <AutoModeIcon />,
  'cleaning_services': <CleaningServicesIcon />,
  'functions': <FunctionsIcon />,
  'merge_type': <MergeTypeIcon />,
  'pivot_table_chart': <PivotTableChartIcon />,
  'filter_alt': <FilterAltIcon />,
  'straighten': <StraightenIcon />,
  'qr_code': <QrCodeIcon />,
  'verified': <VerifiedIcon />,
  'auto_fix_high': <AutoFixHighIcon />
};

// Missing icon imports (for completeness)
import {
  Compare as CompareIcon,
  ThreeDRotation as ThreeDRotationIcon,
  Map as MapIcon,
  Hub as HubIcon,
  Animation as AnimationIcon,
  Image as ImageIcon,
  ColorLens as ColorLensIcon,
  AutoStories as AutoStoriesIcon,
  EditNote as EditNoteIcon,
  Devices as DevicesIcon,
  Description as DescriptionIcon,
  Api as ApiIcon,
  PresentToAll as PresentToAllIcon,
  Print as PrintIcon,
  GroupWork as GroupWorkIcon,
  Equalizer as EqualizerIcon,
  VerticalAlignCenter as VerticalAlignCenterIcon,
  Casino as CasinoIcon,
  Timer as TimerIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon,
  Bolt as BoltIcon,
  Payment as PaymentIcon,
  Balance as BalanceIcon,
  Percent as PercentIcon,
  CompareArrows as CompareArrowsIcon,
  AttachMoney as AttachMoneyIcon,
  Tune as TuneIcon,
  AccountTree as AccountTreeIcon,
  Nature as NatureIcon,
  AutoMode as AutoModeIcon,
  MergeType as MergeTypeIcon,
  PivotTableChart as PivotTableChartIcon,
  FilterAlt as FilterAltIcon,
  Straighten as StraightenIcon,
  QrCode as QrCodeIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

// Tool Execution Result Interface
interface ToolExecutionResult {
  toolId: string;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: any;
  error?: string;
  duration?: number;
  timestamp: Date;
}

// Tool History Interface
interface ToolHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  category: ToolCategory;
  params: any;
  result: ToolExecutionResult;
  timestamp: Date;
}

// Main Component
export const ToolsPanel: React.FC = () => {
  const theme = useTheme();
  const { currentChart, updateChartOptions } = useChartStore();
  
  // State Management
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'recent'>('name');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [executionDialog, setExecutionDialog] = useState(false);
  const [executionParams, setExecutionParams] = useState<Record<string, any>>({});
  const [executionResult, setExecutionResult] = useState<ToolExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [history, setHistory] = useState<ToolHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Filtered and Sorted Tools
  const filteredTools = useMemo(() => {
    let filtered = selectedCategory === 'all' 
      ? tools 
      : getToolsByCategory(selectedCategory as ToolCategory);
    
    // Apply search filter
    if (searchQuery) {
      filtered = searchTools(searchQuery);
    }
    
    // Apply premium filter
    if (showPremiumOnly) {
      filtered = filtered.filter(tool => tool.premium);
    }
    
    // Apply favorites filter
    if (favorites.size > 0 && sortBy === 'recent') {
      filtered = filtered.filter(tool => favorites.has(tool.id));
    }
    
    // Sort tools
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'recent':
          // Sort by favorites first, then by name
          const aFav = favorites.has(a.id) ? 0 : 1;
          const bFav = favorites.has(b.id) ? 0 : 1;
          return aFav - bFav || a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [selectedCategory, searchQuery, showPremiumOnly, favorites, sortBy]);
  
  // Tool Categories with Counts
  const categoriesWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    counts.set('all', tools.length);
    
    toolCategories.forEach(category => {
      counts.set(category, getToolsByCategory(category as ToolCategory).length);
    });
    
    return counts;
  }, []);
  
  // Handlers
  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue as ToolCategory | 'all');
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setExecutionDialog(true);
    
    // Initialize default parameters
    const defaultParams: Record<string, any> = {};
    tool.params?.forEach(param => {
      defaultParams[param.name] = param.defaultValue;
    });
    setExecutionParams(defaultParams);
  };
  
  const handleToggleFavorite = (toolId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(toolId)) {
      newFavorites.delete(toolId);
    } else {
      newFavorites.add(toolId);
    }
    setFavorites(newFavorites);
  };
  
  const handleExecuteTool = async () => {
    if (!selectedTool || !currentChart) return;
    
    setIsExecuting(true);
    const startTime = Date.now();
    
    try {
      // Execute the tool with current chart data and parameters
      const result = await selectedTool.execute(currentChart.data, executionParams);
      
      const executionResult: ToolExecutionResult = {
        toolId: selectedTool.id,
        status: 'success',
        result,
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
      
      setExecutionResult(executionResult);
      
      // Add to history
      const historyItem: ToolHistoryItem = {
        id: `history-${Date.now()}`,
        toolId: selectedTool.id,
        toolName: selectedTool.name,
        category: selectedTool.category,
        params: executionParams,
        result: executionResult,
        timestamp: new Date()
      };
      
      setHistory(prev => [historyItem, ...prev].slice(0, 50)); // Keep last 50 items
      
      // Apply result to chart if applicable
      if (result.chartUpdate) {
        updateChartOptions(result.chartUpdate);
      }
      
    } catch (error) {
      const executionResult: ToolExecutionResult = {
        toolId: selectedTool.id,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
      
      setExecutionResult(executionResult);
    } finally {
      setIsExecuting(false);
    }
  };
  
  const handleParamChange = (paramName: string, value: any) => {
    setExecutionParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };
  
  const handleCloseExecutionDialog = () => {
    setExecutionDialog(false);
    setSelectedTool(null);
    setExecutionParams({});
    setExecutionResult(null);
  };
  
  const handleExportResults = () => {
    if (!executionResult?.result) return;
    
    const dataStr = JSON.stringify(executionResult.result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${selectedTool?.name.replace(/\s+/g, '_')}_results_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Render Parameter Input
  const renderParameterInput = (param: ToolParameter) => {
    const value = executionParams[param.name] ?? param.defaultValue;
    
    switch (param.type) {
      case 'string':
        return (
          <TextField
            fullWidth
            label={param.label}
            value={value || ''}
            onChange={(e) => handleParamChange(param.name, e.target.value)}
            required={param.required}
            margin="normal"
          />
        );
        
      case 'number':
        return (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography gutterBottom>{param.label}</Typography>
            <Slider
              value={value || param.min || 0}
              onChange={(_, newValue) => handleParamChange(param.name, newValue)}
              min={param.min}
              max={param.max}
              step={param.step}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        );
        
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value || false}
                onChange={(e) => handleParamChange(param.name, e.target.checked)}
              />
            }
            label={param.label}
            sx={{ mt: 1, mb: 1 }}
          />
        );
        
      case 'select':
        return (
          <FormControl fullWidth margin="normal">
            <FormLabel>{param.label}</FormLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleParamChange(param.name, e.target.value)}
              required={param.required}
            >
              {param.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        
      case 'multiselect':
        return (
          <Autocomplete
            multiple
            options={param.options?.map(o => o.value) || []}
            value={value || []}
            onChange={(_, newValue) => handleParamChange(param.name, newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={param.label}
                margin="normal"
                required={param.required}
              />
            )}
          />
        );
        
      case 'color':
        return (
          <Box sx={{ mt: 2, mb: 1 }}>
            <FormLabel>{param.label}</FormLabel>
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleParamChange(param.name, e.target.value)}
              style={{ 
                width: '100%', 
                height: 40, 
                marginTop: 8,
                border: '1px solid #ccc',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            />
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  // Render Tool Card
  const renderToolCard = (tool: Tool) => {
    const isFavorite = favorites.has(tool.id);
    const icon = toolIcons[tool.icon] || <FunctionsIcon />;
    
    return (
      <StyledToolCard
        key={tool.id}
        className={tool.premium ? 'premium' : ''}
        onClick={() => handleToolSelect(tool)}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box display="flex" alignItems="center" gap={1}>
              {React.cloneElement(icon as React.ReactElement<any>, { fontSize: 'small', color: 'primary' })}
              <Typography variant="subtitle1" fontWeight={600}>
                {tool.name}
              </Typography>
            </Box>
            <Box display="flex" gap={0.5}>
              {tool.premium && (
                <Tooltip title="Premium Tool">
                  <LockIcon fontSize="small" color="warning" />
                </Tooltip>
              )}
              <IconButton
                size="small"
                onClick={(e) => handleToggleFavorite(tool.id, e)}
              >
                {isFavorite ? (
                  <StarIcon fontSize="small" color="primary" />
                ) : (
                  <StarBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {tool.description}
          </Typography>
          
          <Box display="flex" gap={0.5} mt={2}>
            <Chip
              label={tool.category}
              size="small"
              variant="outlined"
              color="primary"
            />
            {tool.shortcut && (
              <Chip
                label={tool.shortcut}
                size="small"
                variant="filled"
                sx={{ bgcolor: 'action.selected' }}
              />
            )}
          </Box>
        </CardContent>
        
        <CardActions>
          <Button
            size="small"
            startIcon={<PlayIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleToolSelect(tool);
            }}
          >
            Execute
          </Button>
          <Button
            size="small"
            startIcon={<InfoIcon />}
            onClick={(e) => {
              e.stopPropagation();
              // Show tool details
            }}
          >
            Details
          </Button>
        </CardActions>
      </StyledToolCard>
    );
  };
  
  return (
    <StyledToolsPanel>
      {/* Header */}
      <Box p={2} borderBottom={1} borderColor="divider">
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Analysis Tools
        </Typography>
        
        {/* Search Bar */}
        <StyledSearchBar
          fullWidth
          placeholder="Search tools..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        {/* Toolbar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Box display="flex" gap={1}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="grid">
                <ViewModuleIcon />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Button
              size="small"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? 'contained' : 'outlined'}
            >
              Filters
            </Button>
            
            <Button
              size="small"
              startIcon={<HistoryIcon />}
              onClick={() => setShowHistory(true)}
            >
              History
            </Button>
          </Box>
          
          <Box display="flex" gap={1}>
            <FormControl size="small">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="category">Category</MenuItem>
                <MenuItem value="recent">Recent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        {/* Filters */}
        <Collapse in={showFilters}>
          <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                />
              }
              label="Premium Tools Only"
            />
          </Box>
        </Collapse>
      </Box>
      
      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <StyledCategoryTab
          value="all"
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <CategoryIcon fontSize="small" />
              <span>All</span>
              <Chip label={categoriesWithCounts.get('all')} size="small" />
            </Box>
          }
        />
        {toolCategories.map(category => (
          <StyledCategoryTab
            key={category}
            value={category}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                {React.cloneElement(categoryIcons[category as ToolCategory] as React.ReactElement<any>, { fontSize: 'small' })}
                <span>{category}</span>
                <Chip label={categoriesWithCounts.get(category)} size="small" />
              </Box>
            }
          />
        ))}
      </Tabs>
      
      {/* Tools Grid/List */}
      <Box flex={1} overflow="auto" p={2}>
        {filteredTools.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <SearchIcon sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No tools found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
          >
            {filteredTools.map(tool => (
              <Box
                key={tool.id}
                sx={{
                  width: {
                    xs: '100%',
                    sm: viewMode === 'grid' ? 'calc(50% - 8px)' : '100%',
                    md: viewMode === 'grid' ? 'calc(33.333% - 10.667px)' : '100%'
                  }
                }}
              >
                {renderToolCard(tool)}
              </Box>
            ))}
          </Box>
        )}
      </Box>
      
      {/* Tool Execution Dialog */}
      <Dialog
        open={executionDialog}
        onClose={handleCloseExecutionDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedTool && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                {React.cloneElement((toolIcons[selectedTool.icon] || <FunctionsIcon />) as React.ReactElement<any>, { color: 'primary' })}
                <Typography variant="h6">{selectedTool.name}</Typography>
                {selectedTool.premium && (
                  <Chip label="Premium" color="warning" size="small" />
                )}
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedTool.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Parameters */}
              {selectedTool.params && selectedTool.params.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Parameters
                  </Typography>
                  {selectedTool.params.map(param => (
                    <Box key={param.name}>
                      {renderParameterInput(param)}
                    </Box>
                  ))}
                </Box>
              )}
              
              {/* Execution Status */}
              {isExecuting && (
                <Box mt={3}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" align="center" mt={1}>
                    Executing tool...
                  </Typography>
                </Box>
              )}
              
              {/* Execution Results */}
              {executionResult && (
                <StyledExecutionPanel sx={{ mt: 3 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    {executionResult.status === 'success' ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                    <Typography variant="subtitle1" fontWeight={600}>
                      {executionResult.status === 'success' ? 'Execution Successful' : 'Execution Failed'}
                    </Typography>
                    {executionResult.duration && (
                      <Chip
                        label={`${executionResult.duration}ms`}
                        size="small"
                        icon={<ScheduleIcon />}
                      />
                    )}
                  </Box>
                  
                  {executionResult.error ? (
                    <Alert severity="error">{executionResult.error}</Alert>
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Results:
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                        <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                          {JSON.stringify(executionResult.result, null, 2)}
                        </pre>
                      </Paper>
                    </Box>
                  )}
                </StyledExecutionPanel>
              )}
            </DialogContent>
            
            <DialogActions>
              {executionResult?.status === 'success' && (
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={handleExportResults}
                >
                  Export Results
                </Button>
              )}
              <Button onClick={handleCloseExecutionDialog}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleExecuteTool}
                disabled={isExecuting}
              >
                {isExecuting ? 'Executing...' : 'Execute'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* History Drawer */}
      <Drawer
        anchor="right"
        open={showHistory}
        onClose={() => setShowHistory(false)}
      >
        <Box width={400} p={2}>
          <Typography variant="h6" gutterBottom>
            Execution History
          </Typography>
          
          {history.length === 0 ? (
            <Box textAlign="center" py={4}>
              <HistoryIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
              <Typography color="text.secondary">
                No execution history yet
              </Typography>
            </Box>
          ) : (
            <List>
              {history.map(item => (
                <ListItem key={item.id}>
                  <ListItemIcon>
                    {React.cloneElement(
                      categoryIcons[item.category] as React.ReactElement<any>,
                      { fontSize: 'small' }
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.toolName}
                    secondary={new Date(item.timestamp).toLocaleString()}
                  />
                  <ListItemSecondaryAction>
                    {item.result.status === 'success' ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <ErrorIcon color="error" fontSize="small" />
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
      
      {/* Speed Dial for Quick Actions */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<FavoriteIcon />}
          tooltipTitle="Favorite Tools"
          onClick={() => setSortBy('recent')}
        />
        <SpeedDialAction
          icon={<HistoryIcon />}
          tooltipTitle="History"
          onClick={() => setShowHistory(true)}
        />
        <SpeedDialAction
          icon={<HelpIcon />}
          tooltipTitle="Help"
          onClick={() => setShowHelp(true)}
        />
      </SpeedDial>
    </StyledToolsPanel>
  );
};