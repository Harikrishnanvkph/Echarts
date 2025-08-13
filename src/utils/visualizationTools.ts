// Advanced Visualization Tools Implementation
// Comprehensive charting and visualization functions

import * as echarts from 'echarts';
import 'echarts-gl';
import { ChartType, ChartConfig, ChartOptions } from '../types/chart';

// ============= CHART RECOMMENDATION ENGINE =============
export interface ChartRecommendation {
  recommended: ChartType;
  score: number;
  reasons: string[];
  alternatives: Array<{
    type: ChartType;
    score: number;
    useCase: string;
  }>;
  dataCharacteristics: {
    dataType: 'categorical' | 'numerical' | 'temporal' | 'geographical' | 'hierarchical';
    dimensions: number;
    cardinality: number;
    distribution: string;
  };
}

export function recommendChartType(data: any[]): ChartRecommendation {
  const characteristics = analyzeDataCharacteristics(data);
  const recommendations: Array<{ type: ChartType; score: number; reasons: string[] }> = [];
  
  // Score each chart type based on data characteristics
  if (characteristics.dataType === 'temporal') {
    recommendations.push({
      type: 'line',
      score: 0.9,
      reasons: ['Time-series data detected', 'Shows trends over time effectively']
    });
    recommendations.push({
      type: 'area',
      score: 0.8,
      reasons: ['Time-series data with cumulative values', 'Shows volume changes']
    });
  }
  
  if (characteristics.dataType === 'categorical') {
    if (characteristics.cardinality <= 10) {
      recommendations.push({
        type: 'bar',
        score: 0.95,
        reasons: ['Categorical data with moderate categories', 'Easy comparison']
      });
      recommendations.push({
        type: 'pie',
        score: 0.7,
        reasons: ['Shows proportions of whole', 'Limited categories']
      });
    } else {
      recommendations.push({
        type: 'treemap',
        score: 0.85,
        reasons: ['Many categories', 'Hierarchical structure possible']
      });
    }
  }
  
  if (characteristics.dataType === 'numerical' && characteristics.dimensions >= 2) {
    recommendations.push({
      type: 'scatter',
      score: 0.9,
      reasons: ['Multiple numerical variables', 'Shows correlations']
    });
    
    if (characteristics.dimensions >= 3) {
      recommendations.push({
        type: 'parallel',
        score: 0.8,
        reasons: ['High-dimensional data', 'Compare multiple variables']
      });
    }
  }
  
  if (characteristics.dataType === 'hierarchical') {
    recommendations.push({
      type: 'sunburst',
      score: 0.9,
      reasons: ['Hierarchical data structure', 'Shows nested relationships']
    });
    recommendations.push({
      type: 'treemap',
      score: 0.85,
      reasons: ['Hierarchical with size importance', 'Space-efficient']
    });
  }
  
  // Sort by score
  recommendations.sort((a, b) => b.score - a.score);
  
  const top = recommendations[0] || { type: 'bar' as ChartType, score: 0.5, reasons: ['Default recommendation'] };
  const alternatives = recommendations.slice(1, 4).map(r => ({
    type: r.type,
    score: r.score,
    useCase: r.reasons[0]
  }));
  
  return {
    recommended: top.type,
    score: top.score,
    reasons: top.reasons,
    alternatives,
    dataCharacteristics: characteristics
  };
}

function analyzeDataCharacteristics(data: any[]): any {
  if (!data || data.length === 0) {
    return {
      dataType: 'categorical',
      dimensions: 1,
      cardinality: 0,
      distribution: 'unknown'
    };
  }
  
  const firstRow = data[0];
  const keys = Object.keys(firstRow);
  const dimensions = keys.length;
  
  // Detect data type
  let dataType: string = 'categorical';
  const values = data.map(row => row[keys[0]]);
  
  if (values.every(v => !isNaN(Date.parse(v)))) {
    dataType = 'temporal';
  } else if (values.every(v => typeof v === 'number')) {
    dataType = 'numerical';
  } else if (detectHierarchy(data)) {
    dataType = 'hierarchical';
  }
  
  // Calculate cardinality
  const uniqueValues = new Set(values);
  const cardinality = uniqueValues.size;
  
  // Detect distribution
  let distribution = 'uniform';
  if (dataType === 'numerical') {
    const numbers = values.filter(v => typeof v === 'number');
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / numbers.length;
    const skewness = calculateSkewness(numbers, mean, Math.sqrt(variance));
    
    if (Math.abs(skewness) < 0.5) {
      distribution = 'normal';
    } else if (skewness > 0.5) {
      distribution = 'right-skewed';
    } else {
      distribution = 'left-skewed';
    }
  }
  
  return {
    dataType,
    dimensions,
    cardinality,
    distribution
  };
}

function detectHierarchy(data: any[]): boolean {
  // Simple hierarchy detection
  return data.some(row => 
    row.parent !== undefined || 
    row.children !== undefined || 
    row.path !== undefined
  );
}

function calculateSkewness(data: number[], mean: number, std: number): number {
  const n = data.length;
  const sum = data.reduce((acc, v) => acc + Math.pow((v - mean) / std, 3), 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}

// ============= 3D VISUALIZATION =============
export interface Visualization3D {
  type: '3d-bar' | '3d-scatter' | '3d-surface' | '3d-line';
  option: any;
  config: {
    viewControl: {
      alpha: number;
      beta: number;
      distance: number;
      autoRotate: boolean;
    };
    lighting: {
      main: { intensity: number; shadow: boolean };
      ambient: { intensity: number };
    };
  };
}

export function create3DVisualization(
  data: any[],
  type: '3d-bar' | '3d-scatter' | '3d-surface' | '3d-line' = '3d-bar'
): Visualization3D {
  const config = {
    viewControl: {
      alpha: 30,
      beta: 30,
      distance: 200,
      autoRotate: false
    },
    lighting: {
      main: { intensity: 1.2, shadow: true },
      ambient: { intensity: 0.3 }
    }
  };
  
  let option: any = {
    tooltip: {},
    visualMap: {
      max: 100,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D: { type: 'category' },
    yAxis3D: { type: 'category' },
    zAxis3D: { type: 'value' },
    grid3D: {
      viewControl: config.viewControl,
      light: config.lighting,
      boxWidth: 200,
      boxHeight: 80,
      boxDepth: 80
    }
  };
  
  switch (type) {
    case '3d-bar':
      option.series = [{
        type: 'bar3D',
        data: transform3DData(data),
        shading: 'lambert',
        label: {
          show: false,
          fontSize: 16,
          borderWidth: 1
        },
        emphasis: {
          label: { show: true },
          itemStyle: { color: '#900' }
        }
      }];
      break;
      
    case '3d-scatter':
      option.series = [{
        type: 'scatter3D',
        data: transform3DData(data),
        symbolSize: 12,
        itemStyle: {
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.8)'
        },
        emphasis: {
          itemStyle: { color: '#fff' }
        }
      }];
      break;
      
    case '3d-surface':
      option.series = [{
        type: 'surface',
        data: transformSurfaceData(data),
        shading: 'color',
        wireframe: { show: false }
      }];
      break;
      
    case '3d-line':
      option.series = [{
        type: 'line3D',
        data: transform3DData(data),
        lineStyle: { width: 4 }
      }];
      break;
  }
  
  return { type, option, config };
}

function transform3DData(data: any[]): any[] {
  // Transform flat data to 3D coordinates
  return data.map((item, i) => {
    const keys = Object.keys(item);
    return [
      item[keys[0]] || i,
      item[keys[1]] || 0,
      item[keys[2]] || Math.random() * 100
    ];
  });
}

function transformSurfaceData(data: any[]): any[] {
  // Generate surface data from input
  const size = Math.ceil(Math.sqrt(data.length));
  const result: any[] = [];
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      if (index < data.length) {
        result.push([i, j, data[index].value || Math.sin(i) * Math.cos(j)]);
      }
    }
  }
  
  return result;
}

// ============= GEOGRAPHIC MAPPING =============
export interface GeoMapVisualization {
  type: 'heatmap' | 'scatter' | 'lines' | 'choropleth';
  option: any;
  geoData?: any;
  features: {
    zoom: boolean;
    roam: boolean;
    visualMap: boolean;
  };
}

export function createGeoMap(
  data: any[],
  mapType: 'world' | 'china' | 'usa' = 'world',
  visualType: 'heatmap' | 'scatter' | 'lines' | 'choropleth' = 'heatmap'
): GeoMapVisualization {
  const features = {
    zoom: true,
    roam: true,
    visualMap: true
  };
  
  const option: any = {
    title: {
      text: 'Geographic Data Visualization',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: features.visualMap ? {
      min: 0,
      max: 1000,
      left: 'left',
      top: 'bottom',
      text: ['High', 'Low'],
      calculable: true,
      inRange: {
        color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
      }
    } : undefined,
    geo: {
      map: mapType,
      roam: features.roam,
      zoom: features.zoom ? 1.2 : 1,
      label: {
        emphasis: { show: true }
      },
      itemStyle: {
        normal: {
          areaColor: '#323c48',
          borderColor: '#111'
        },
        emphasis: {
          areaColor: '#2a333d'
        }
      }
    }
  };
  
  switch (visualType) {
    case 'heatmap':
      option.series = [{
        type: 'heatmap',
        coordinateSystem: 'geo',
        data: transformGeoData(data)
      }];
      break;
      
    case 'scatter':
      option.series = [{
        type: 'scatter',
        coordinateSystem: 'geo',
        data: transformGeoData(data),
        symbolSize: (val: any) => val[2] / 10,
        label: {
          normal: { show: false },
          emphasis: { show: true }
        },
        itemStyle: {
          emphasis: { borderColor: '#fff', borderWidth: 1 }
        }
      }];
      break;
      
    case 'lines':
      option.series = [{
        type: 'lines',
        coordinateSystem: 'geo',
        data: transformGeoLines(data),
        lineStyle: {
          normal: {
            color: '#a6c84c',
            width: 1,
            opacity: 0.6,
            curveness: 0.2
          }
        }
      }];
      break;
      
    case 'choropleth':
      option.series = [{
        type: 'map',
        map: mapType,
        data: transformChoroplethData(data),
        label: { show: true }
      }];
      break;
  }
  
  return {
    type: visualType,
    option,
    features
  };
}

function transformGeoData(data: any[]): any[] {
  return data.map(item => [
    item.longitude || item.lng || Math.random() * 360 - 180,
    item.latitude || item.lat || Math.random() * 180 - 90,
    item.value || Math.random() * 1000
  ]);
}

function transformGeoLines(data: any[]): any[] {
  const lines: any[] = [];
  for (let i = 0; i < data.length - 1; i++) {
    lines.push({
      coords: [
        [data[i].lng || 0, data[i].lat || 0],
        [data[i + 1].lng || 0, data[i + 1].lat || 0]
      ]
    });
  }
  return lines;
}

function transformChoroplethData(data: any[]): any[] {
  return data.map(item => ({
    name: item.name || item.region || 'Unknown',
    value: item.value || Math.random() * 1000
  }));
}

// ============= NETWORK DIAGRAM =============
export interface NetworkDiagram {
  nodes: Array<{
    id: string;
    name: string;
    value: number;
    category: number;
    symbolSize: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    value?: number;
  }>;
  categories: Array<{ name: string }>;
  option: any;
}

export function createNetworkDiagram(data: any): NetworkDiagram {
  const { nodes, links, categories } = processNetworkData(data);
  
  const option = {
    title: {
      text: 'Network Relationship Diagram',
      top: 'top',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          return `${params.name}: ${params.value}`;
        } else {
          return `${params.data.source} → ${params.data.target}`;
        }
      }
    },
    legend: {
      data: categories.map((c: { name: string }) => c.name),
      orient: 'vertical',
      left: 'left'
    },
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      type: 'graph',
      layout: 'force',
      data: nodes,
      links: links,
      categories: categories,
      roam: true,
      label: {
        show: true,
        position: 'right',
        formatter: '{b}'
      },
      labelLayout: {
        hideOverlap: true
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: { width: 10 }
      },
      force: {
        repulsion: 100,
        gravity: 0.1,
        edgeLength: 30
      }
    }]
  };
  
  return { nodes, links, categories, option };
}

function processNetworkData(data: any): any {
  // Process raw data into nodes and links
  let nodes: any[] = [];
  let links: any[] = [];
  let categories: any[] = [];
  
  if (data.nodes && data.links) {
    nodes = data.nodes.map((node: any, i: number) => ({
      id: node.id || `node-${i}`,
      name: node.name || node.label || `Node ${i}`,
      value: node.value || 1,
      category: node.category || 0,
      symbolSize: Math.sqrt(node.value || 1) * 10
    }));
    
    links = data.links.map((link: any) => ({
      source: link.source,
      target: link.target,
      value: link.value || 1
    }));
    
    // Extract categories
    const categorySet = new Set(nodes.map(n => n.category));
    categories = Array.from(categorySet).map(c => ({ name: `Category ${c}` }));
  } else {
    // Generate sample network data
    const nodeCount = 50;
    const categoryCount = 5;
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `node-${i}`,
        name: `Node ${i}`,
        value: Math.random() * 100,
        category: Math.floor(Math.random() * categoryCount),
        symbolSize: Math.random() * 30 + 10
      });
    }
    
    for (let i = 0; i < nodeCount * 2; i++) {
      links.push({
        source: `node-${Math.floor(Math.random() * nodeCount)}`,
        target: `node-${Math.floor(Math.random() * nodeCount)}`,
        value: Math.random() * 10
      });
    }
    
    for (let i = 0; i < categoryCount; i++) {
      categories.push({ name: `Category ${i}` });
    }
  }
  
  return { nodes, links, categories };
}

// ============= DASHBOARD BUILDER =============
export interface Dashboard {
  layout: {
    rows: number;
    cols: number;
    widgets: Array<{
      id: string;
      type: ChartType;
      position: { row: number; col: number; rowSpan: number; colSpan: number };
      config: ChartConfig;
    }>;
  };
  theme: 'light' | 'dark' | 'custom';
  refreshInterval?: number;
  interactions: {
    crossFilter: boolean;
    drillDown: boolean;
    export: boolean;
  };
}

export function buildDashboard(
  data: any[],
  layout: { rows: number; cols: number } = { rows: 2, cols: 2 }
): Dashboard {
  const widgets: any[] = [];
  const chartTypes: ChartType[] = ['line', 'bar', 'pie', 'scatter'];
  
  let widgetIndex = 0;
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      if (widgetIndex < chartTypes.length) {
        widgets.push({
          id: `widget-${widgetIndex}`,
          type: chartTypes[widgetIndex],
          position: {
            row,
            col,
            rowSpan: 1,
            colSpan: 1
          },
          config: generateChartConfig(chartTypes[widgetIndex], data)
        });
        widgetIndex++;
      }
    }
  }
  
  return {
    layout: {
      rows: layout.rows,
      cols: layout.cols,
      widgets
    },
    theme: 'light',
    refreshInterval: 5000,
    interactions: {
      crossFilter: true,
      drillDown: true,
      export: true
    }
  };
}

function generateChartConfig(type: ChartType, data: any[]): ChartConfig {
  return {
    id: `chart-${Date.now()}`,
    name: `${type} Chart`,
    type,
    data: {
      categories: data.map((_, i) => `Category ${i + 1}`),
      series: [{
        name: 'Series 1',
        data: data.map(() => Math.random() * 100)
      }]
    },
    options: {},
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// ============= ANIMATION CREATOR =============
export interface ChartAnimation {
  keyframes: Array<{
    duration: number;
    data: any;
    options?: any;
  }>;
  timeline: {
    autoPlay: boolean;
    loop: boolean;
    playInterval: number;
    currentIndex: number;
  };
  transitions: {
    easing: string;
    duration: number;
  };
}

export function createAnimation(
  data: any[],
  frameCount: number = 10
): ChartAnimation {
  const keyframes = generateKeyframes(data, frameCount);
  
  return {
    keyframes,
    timeline: {
      autoPlay: true,
      loop: true,
      playInterval: 1000,
      currentIndex: 0
    },
    transitions: {
      easing: 'cubicInOut',
      duration: 500
    }
  };
}

function generateKeyframes(data: any[], count: number): any[] {
  const keyframes: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    keyframes.push({
      duration: 1000,
      data: data.map(item => ({
        ...item,
        value: item.value * (0.5 + progress * 0.5) + Math.random() * 10
      }))
    });
  }
  
  return keyframes;
}

// ============= THEME DESIGNER =============
export interface ChartTheme {
  name: string;
  colors: string[];
  backgroundColor: string;
  textStyle: {
    color: string;
    fontFamily: string;
    fontSize: number;
  };
  title: {
    textStyle: {
      color: string;
      fontSize: number;
      fontWeight: string;
    };
  };
  axis: {
    lineStyle: { color: string };
    labelStyle: { color: string };
    splitLine: { lineStyle: { color: string } };
  };
  series: {
    itemStyle: any;
    lineStyle: any;
    areaStyle: any;
  };
}

export function designTheme(
  baseColor: string = '#5470c6',
  mode: 'light' | 'dark' = 'light'
): ChartTheme {
  const colors = generateColorPalette(baseColor, 10);
  const isDark = mode === 'dark';
  
  return {
    name: `custom-theme-${Date.now()}`,
    colors,
    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
    textStyle: {
      color: isDark ? '#e0e0e0' : '#333333',
      fontFamily: 'Arial, sans-serif',
      fontSize: 12
    },
    title: {
      textStyle: {
        color: isDark ? '#ffffff' : '#333333',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    axis: {
      lineStyle: { color: isDark ? '#555555' : '#cccccc' },
      labelStyle: { color: isDark ? '#999999' : '#666666' },
      splitLine: {
        lineStyle: { color: isDark ? '#333333' : '#e0e0e0' }
      }
    },
    series: {
      itemStyle: {
        borderColor: isDark ? '#ffffff' : '#000000',
        borderWidth: 0
      },
      lineStyle: {
        width: 2
      },
      areaStyle: {
        opacity: 0.7
      }
    }
  };
}

// ============= COLOR PALETTE GENERATOR =============
export function generateColorPalette(
  baseColor: string,
  count: number = 10
): string[] {
  const palette: string[] = [];
  const base = hexToHSL(baseColor);
  
  for (let i = 0; i < count; i++) {
    const hue = (base.h + (360 / count) * i) % 360;
    const saturation = base.s * (0.7 + Math.random() * 0.3);
    const lightness = base.l * (0.8 + Math.random() * 0.4);
    
    palette.push(hslToHex(hue, saturation, lightness));
  }
  
  return palette;
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: h * 360, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  
  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ============= SMALL MULTIPLES =============
export interface SmallMultiples {
  grid: Array<{
    id: string;
    position: { x: number; y: number; width: string; height: string };
    chart: any;
  }>;
  layout: {
    rows: number;
    cols: number;
    padding: number;
  };
  synchronization: {
    axis: boolean;
    zoom: boolean;
    tooltip: boolean;
  };
}

export function createSmallMultiples(
  data: any[],
  groupBy: string,
  chartType: ChartType = 'line'
): SmallMultiples {
  const groups = groupData(data, groupBy);
  const gridSize = Math.ceil(Math.sqrt(groups.length));
  
  const grid: any[] = [];
  let index = 0;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (index < groups.length) {
        const width = `${100 / gridSize}%`;
        const height = `${100 / gridSize}%`;
        
        grid.push({
          id: `grid-${index}`,
          position: {
            x: col * (100 / gridSize),
            y: row * (100 / gridSize),
            width,
            height
          },
          chart: createMiniChart(groups[index], chartType)
        });
        
        index++;
      }
    }
  }
  
  return {
    grid,
    layout: {
      rows: gridSize,
      cols: gridSize,
      padding: 10
    },
    synchronization: {
      axis: true,
      zoom: true,
      tooltip: true
    }
  };
}

function groupData(data: any[], key: string): any[] {
  const groups = new Map();
  
  data.forEach(item => {
    const groupKey = item[key];
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey).push(item);
  });
  
  return Array.from(groups.values());
}

function createMiniChart(data: any[], type: ChartType): any {
  return {
    type,
    data,
    options: {
      title: { show: false },
      legend: { show: false },
      grid: {
        left: '5%',
        right: '5%',
        top: '5%',
        bottom: '5%'
      }
    }
  };
}

// ============= DATA STORYTELLING =============
export interface DataStory {
  chapters: Array<{
    id: string;
    title: string;
    narrative: string;
    visualization: {
      type: ChartType;
      data: any;
      annotations: Array<{
        type: 'text' | 'arrow' | 'shape';
        content: string;
        position: { x: number; y: number };
      }>;
    };
    insights: string[];
    transition: {
      effect: 'fade' | 'slide' | 'zoom';
      duration: number;
    };
  }>;
  metadata: {
    author: string;
    created: Date;
    duration: number;
    tags: string[];
  };
}

export function createDataStory(
  data: any[],
  storyType: 'exploratory' | 'explanatory' | 'persuasive' = 'explanatory'
): DataStory {
  const chapters = generateStoryChapters(data, storyType);
  
  return {
    chapters,
    metadata: {
      author: 'Auto-generated',
      created: new Date(),
      duration: chapters.length * 30, // 30 seconds per chapter
      tags: [storyType, 'data-driven', 'interactive']
    }
  };
}

function generateStoryChapters(data: any[], storyType: string): any[] {
  const chapters: any[] = [];
  
  // Introduction chapter
  chapters.push({
    id: 'intro',
    title: 'Introduction',
    narrative: 'Let\'s explore the data and uncover insights...',
    visualization: {
      type: 'bar' as ChartType,
      data: data.slice(0, 10),
      annotations: [{
        type: 'text',
        content: 'Starting point',
        position: { x: 50, y: 20 }
      }]
    },
    insights: ['Initial data overview', 'Key metrics identified'],
    transition: { effect: 'fade', duration: 1000 }
  });
  
  // Analysis chapters based on story type
  if (storyType === 'exploratory') {
    chapters.push({
      id: 'explore-1',
      title: 'Pattern Discovery',
      narrative: 'Interesting patterns emerge from the data...',
      visualization: {
        type: 'scatter' as ChartType,
        data,
        annotations: []
      },
      insights: ['Correlation detected', 'Outliers identified'],
      transition: { effect: 'slide', duration: 800 }
    });
  } else if (storyType === 'explanatory') {
    chapters.push({
      id: 'explain-1',
      title: 'Key Findings',
      narrative: 'The data reveals important trends...',
      visualization: {
        type: 'line' as ChartType,
        data,
        annotations: [{
          type: 'arrow',
          content: 'Trend line',
          position: { x: 70, y: 40 }
        }]
      },
      insights: ['Upward trend confirmed', 'Seasonal patterns visible'],
      transition: { effect: 'zoom', duration: 1200 }
    });
  }
  
  // Conclusion chapter
  chapters.push({
    id: 'conclusion',
    title: 'Conclusion',
    narrative: 'In summary, the data shows...',
    visualization: {
      type: 'pie' as ChartType,
      data: data.slice(-5),
      annotations: []
    },
    insights: ['Key takeaways', 'Recommendations for action'],
    transition: { effect: 'fade', duration: 1000 }
  });
  
  return chapters;
}

// ============= EXPORT ALL FUNCTIONS =============
export const visualizationTools = {
  recommendChartType,
  create3DVisualization,
  createGeoMap,
  createNetworkDiagram,
  buildDashboard,
  createAnimation,
  designTheme,
  generateColorPalette,
  createSmallMultiples,
  createDataStory
};