import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
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
} from '@mui/icons-material';
import { ChartType } from '../../types/chart';
import { useChartStore } from '../../store/chartStore';

interface ChartTypeOption {
  type: ChartType;
  label: string;
  icon: React.ReactElement;
  description: string;
}

const chartTypes: ChartTypeOption[] = [
  { type: 'line', label: 'Line Chart', icon: <LineIcon />, description: 'Show trends over time' },
  { type: 'bar', label: 'Bar Chart', icon: <BarIcon />, description: 'Compare values across categories' },
  { type: 'pie', label: 'Pie Chart', icon: <PieIcon />, description: 'Show proportions of a whole' },
  { type: 'scatter', label: 'Scatter Plot', icon: <ScatterIcon />, description: 'Show correlations between variables' },
  { type: 'area', label: 'Area Chart', icon: <AreaIcon />, description: 'Show cumulative totals over time' },
  { type: 'radar', label: 'Radar Chart', icon: <RadarIcon />, description: 'Compare multiple variables' },
  { type: 'heatmap', label: 'Heatmap', icon: <HeatmapIcon />, description: 'Show data density with colors' },
  { type: 'treemap', label: 'Treemap', icon: <TreemapIcon />, description: 'Show hierarchical data' },
  { type: 'sunburst', label: 'Sunburst', icon: <SunburstIcon />, description: 'Show hierarchical data in circles' },
  { type: 'gauge', label: 'Gauge Chart', icon: <GaugeIcon />, description: 'Show progress or metrics' },
  { type: 'funnel', label: 'Funnel Chart', icon: <FunnelIcon />, description: 'Show process stages' },
  { type: 'sankey', label: 'Sankey Diagram', icon: <SankeyIcon />, description: 'Show flow between nodes' },
  { type: 'candlestick', label: 'Candlestick', icon: <CandlestickIcon />, description: 'Show financial data' },
  { type: 'boxplot', label: 'Box Plot', icon: <BoxplotIcon />, description: 'Show data distribution' },
  { type: 'parallel', label: 'Parallel Coordinates', icon: <ParallelIcon />, description: 'Show multi-dimensional data' },
];

export const ChartTypeSelector: React.FC = () => {
  const { selectedChartType, setChartType } = useChartStore();
  const [expanded, setExpanded] = React.useState(false);

  const handleChartTypeSelect = (type: ChartType) => {
    setChartType(type);
    setExpanded(false);
  };

  const selectedChart = chartTypes.find(c => c.type === selectedChartType);

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
        Chart Type
      </Typography>
      
      {!expanded && selectedChart && (
        <Card 
          sx={{ mb: 2, cursor: 'pointer' }}
          onClick={() => setExpanded(true)}
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

      {expanded && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {chartTypes.map((chartType) => (
            <Box key={chartType.type} sx={{ width: 'calc(50% - 4px)' }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedChartType === chartType.type ? 2 : 0,
                  borderColor: 'primary.main',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
                onClick={() => handleChartTypeSelect(chartType.type)}
              >
                <CardActionArea>
                  <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                    <Box sx={{ color: selectedChartType === chartType.type ? 'primary.main' : 'text.secondary', mb: 0.5 }}>
                      {chartType.icon}
                    </Box>
                    <Typography variant="caption" display="block">
                      {chartType.label}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};