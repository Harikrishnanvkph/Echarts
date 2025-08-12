export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'scatter' 
  | 'area'
  | 'radar'
  | 'heatmap'
  | 'treemap'
  | 'sunburst'
  | 'gauge'
  | 'funnel'
  | 'sankey'
  | 'boxplot'
  | 'candlestick'
  | 'parallel';

export interface ChartData {
  categories?: string[];
  series: SeriesData[];
}

export interface SeriesData {
  name: string;
  type?: string;
  data: any[];
  color?: string;
  smooth?: boolean;
  stack?: string;
  areaStyle?: any;
  emphasis?: any;
  label?: any;
  itemStyle?: any;
}

export interface ChartConfig {
  id: string;
  name: string;
  type: ChartType;
  data: ChartData;
  options: ChartOptions;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChartOptions {
  title?: {
    text?: string;
    subtext?: string;
    left?: string | number;
    top?: string | number;
    textStyle?: any;
  };
  tooltip?: {
    trigger?: 'item' | 'axis' | 'none';
    formatter?: string | ((params: any) => string);
    axisPointer?: any;
  };
  legend?: {
    show?: boolean;
    orient?: 'horizontal' | 'vertical';
    left?: string | number;
    top?: string | number;
    data?: string[];
    selected?: Record<string, boolean>;
  };
  grid?: {
    left?: string | number;
    right?: string | number;
    top?: string | number;
    bottom?: string | number;
    containLabel?: boolean;
  };
  xAxis?: any;
  yAxis?: any;
  series?: any[];
  color?: string[];
  backgroundColor?: string;
  animation?: boolean;
  animationDuration?: number;
  toolbox?: {
    show?: boolean;
    feature?: any;
  };
  dataZoom?: any[];
  visualMap?: any;
  polar?: any;
  radiusAxis?: any;
  angleAxis?: any;
  radar?: any;
  geo?: any;
  parallel?: any;
  parallelAxis?: any[];
  calendar?: any;
  graphic?: any[];
  dataset?: any;
  aria?: any;
  darkMode?: boolean;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'json';
  filename?: string;
  quality?: number;
  backgroundColor?: string;
}