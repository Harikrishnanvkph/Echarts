import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
} from '@mui/material';
import {
  ShowChart as LineIcon,
  BarChart as BarIcon,
  PieChart as PieIcon,
  ScatterPlot as ScatterIcon,
  Timeline as AreaIcon,
  BubbleChart as RadarIcon,
  GridOn as HeatmapIcon,
  AccountTree as TreemapIcon,
  DonutLarge as SunburstIcon,
  Speed as GaugeIcon,
  FilterList as FunnelIcon,
  Hub as SankeyIcon,
  ShowChart as CandlestickIcon,
  ViewWeek as BoxplotIcon,
  Layers as ParallelIcon,
  ThreeDRotation as ThreeDIcon,
  TrendingUp as AdvancedIcon,
} from '@mui/icons-material';
import { ChartType } from '../../types/chart';
import { useChartStore } from '../../store/chartStore';

interface ChartTypeOption {
  type: ChartType | 'advanced';
  label: string;
  icon: React.ReactElement;
  description: string;
  category?: 'basic' | 'statistical' | 'hierarchical' | 'flow' | 'specialized';
}

const chartTypes: ChartTypeOption[] = [
  // Basic Charts
  { type: 'line', label: 'Line Chart', icon: <LineIcon />, description: 'Show trends over time', category: 'basic' },
  { type: 'bar', label: 'Bar Chart', icon: <BarIcon />, description: 'Compare values across categories', category: 'basic' },
  { type: 'pie', label: 'Pie Chart', icon: <PieIcon />, description: 'Show proportions of a whole', category: 'basic' },
  { type: 'scatter', label: 'Scatter Plot', icon: <ScatterIcon />, description: 'Show correlations between variables', category: 'basic' },
  { type: 'area', label: 'Area Chart', icon: <AreaIcon />, description: 'Show cumulative totals over time', category: 'basic' },
  
  // Statistical Charts
  { type: 'boxplot', label: 'Box Plot', icon: <BoxplotIcon />, description: 'Show data distribution & outliers', category: 'statistical' },
  { type: 'candlestick', label: 'Candlestick', icon: <CandlestickIcon />, description: 'Financial OHLC data visualization', category: 'statistical' },
  { type: 'radar', label: 'Radar Chart', icon: <RadarIcon />, description: 'Compare multiple variables', category: 'statistical' },
  
  // Hierarchical Charts
  { type: 'treemap', label: 'Treemap', icon: <TreemapIcon />, description: 'Hierarchical data with rectangles', category: 'hierarchical' },
  { type: 'sunburst', label: 'Sunburst', icon: <SunburstIcon />, description: 'Hierarchical data in circles', category: 'hierarchical' },
  
  // Flow Charts
  { type: 'sankey', label: 'Sankey Diagram', icon: <SankeyIcon />, description: 'Flow between nodes', category: 'flow' },
  { type: 'funnel', label: 'Funnel Chart', icon: <FunnelIcon />, description: 'Process stages & conversion', category: 'flow' },
  
  // Specialized Charts
  { type: 'heatmap', label: 'Heatmap', icon: <HeatmapIcon />, description: 'Data density with colors', category: 'specialized' },
  { type: 'gauge', label: 'Gauge Chart', icon: <GaugeIcon />, description: 'KPIs & progress metrics', category: 'specialized' },
  { type: 'parallel', label: 'Parallel Coords', icon: <ParallelIcon />, description: 'Multi-dimensional data', category: 'specialized' },
];

const advancedChartTypes = [
  '3D Bar', '3D Line', '3D Scatter', 'Surface 3D', 'Globe',
  'Force Graph', 'Calendar Heatmap', 'Stream Graph', 'Violin Plot',
  'Correlation Matrix', 'Density Plot', 'Contour Plot'
];

export const ChartTypeSelector: React.FC = () => {
  const { selectedChartType, setChartType } = useChartStore();
  const [showAll, setShowAll] = React.useState(true); // Changed to show all by default

  const handleChartTypeSelect = (type: ChartType) => {
    setChartType(type);
  };

  const selectedChart = chartTypes.find(c => c.type === selectedChartType);

  const categories = [
    { name: 'basic', label: 'Basic Charts', color: 'primary' },
    { name: 'statistical', label: 'Statistical', color: 'success' },
    { name: 'hierarchical', label: 'Hierarchical', color: 'warning' },
    { name: 'flow', label: 'Flow', color: 'info' },
    { name: 'specialized', label: 'Specialized', color: 'secondary' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2">
          Chart Type
        </Typography>
        <Button 
          size="small" 
          onClick={() => setShowAll(!showAll)}
          variant={showAll ? "contained" : "outlined"}
        >
          {showAll ? 'Hide Options' : 'Show All'}
        </Button>
      </Box>
      
      {!showAll && selectedChart && (
        <Card 
          sx={{ mb: 2, cursor: 'pointer', border: 2, borderColor: 'primary.main' }}
          onClick={() => setShowAll(true)}
        >
          <CardActionArea>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: 'primary.main' }}>{selectedChart.icon}</Box>
              <Box>
                <Typography variant="subtitle1">{selectedChart.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedChart.description}
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      )}

      {showAll && (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">
              <strong>15+ Chart Types Available!</strong> Plus advanced 3D charts, statistical plots, and more.
            </Typography>
          </Alert>

          {categories.map(category => (
            <Box key={category.name} sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                {category.label}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {chartTypes
                  .filter(chart => chart.category === category.name)
                  .map((chartType) => (
                    <Box key={chartType.type} sx={{ width: 'calc(50% - 4px)' }}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedChartType === chartType.type ? 2 : 1,
                          borderColor: selectedChartType === chartType.type ? 'primary.main' : 'divider',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 2,
                            borderColor: 'primary.main',
                          },
                        }}
                        onClick={() => chartType.type !== 'advanced' && handleChartTypeSelect(chartType.type as ChartType)}
                      >
                        <CardActionArea>
                          <CardContent sx={{ py: 1, px: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ 
                                color: selectedChartType === chartType.type ? 'primary.main' : 'text.secondary',
                                fontSize: '1.2rem'
                              }}>
                                {chartType.icon}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" display="block" fontWeight="bold">
                                  {chartType.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                  {chartType.description}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Box>
                  ))}
              </Box>
            </Box>
          ))}

          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Advanced Chart Types (Coming Soon)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {advancedChartTypes.map(type => (
                <Chip
                  key={type}
                  label={type}
                  size="small"
                  icon={<ThreeDIcon />}
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};