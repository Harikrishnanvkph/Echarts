import { ChartConfig } from '../types/chart';
import * as echarts from 'echarts';

export const generateChartOption = (config: ChartConfig): echarts.EChartsOption => {
  const { type, data, options } = config;
  
  // Base option structure
  const baseOption: echarts.EChartsOption = {
    ...options,
    title: options.title,
    tooltip: options.tooltip || { trigger: 'axis' },
    legend: options.legend,
    grid: options.grid,
    xAxis: options.xAxis,
    yAxis: options.yAxis,
    color: options.color,
    backgroundColor: options.backgroundColor,
    animation: options.animation !== false,
    animationDuration: options.animationDuration,
    toolbox: options.toolbox,
    dataZoom: options.dataZoom,
    darkMode: options.darkMode,
  };

  // Generate series based on chart type
  switch (type) {
    case 'line':
    case 'area':
      baseOption.xAxis = {
        type: 'category',
        data: data.categories,
        ...options.xAxis,
      };
      baseOption.yAxis = {
        type: 'value',
        ...options.yAxis,
      };
      baseOption.series = data.series.map(s => ({
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: s.smooth,
        areaStyle: type === 'area' || s.areaStyle ? s.areaStyle || {} : undefined,
        color: s.color,
        label: s.label,
        emphasis: s.emphasis,
        symbol: s.itemStyle?.symbol,
        symbolSize: s.itemStyle?.symbolSize,
        stack: s.stack,
        ...s.itemStyle,
      }));
      break;

    case 'bar':
      baseOption.xAxis = {
        type: 'category',
        data: data.categories,
        ...options.xAxis,
      };
      baseOption.yAxis = {
        type: 'value',
        ...options.yAxis,
      };
      baseOption.series = data.series.map(s => ({
        name: s.name,
        type: 'bar',
        data: s.data,
        color: s.color,
        label: s.label,
        emphasis: s.emphasis,
        stack: s.stack,
        ...s.itemStyle,
      }));
      break;

    case 'pie':
      baseOption.series = [{
        name: data.series[0]?.name || 'Pie Chart',
        type: 'pie',
        radius: '50%',
        data: data.categories?.map((cat, i) => ({
          value: data.series[0]?.data[i] || 0,
          name: cat,
        })) || [],
        label: data.series[0]?.label || { show: true },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }];
      delete baseOption.xAxis;
      delete baseOption.yAxis;
      break;

    case 'scatter':
      baseOption.xAxis = {
        type: 'value',
        ...options.xAxis,
      };
      baseOption.yAxis = {
        type: 'value',
        ...options.yAxis,
      };
      baseOption.series = data.series.map(s => ({
        name: s.name,
        type: 'scatter',
        data: s.data.map((v, i) => [i, v]),
        color: s.color,
        label: s.label,
        emphasis: s.emphasis,
        symbolSize: s.itemStyle?.symbolSize || 10,
        ...s.itemStyle,
      }));
      break;

    case 'radar':
      const maxValue = Math.max(...data.series.flatMap(s => s.data));
      baseOption.radar = {
        indicator: data.categories?.map(cat => ({
          name: cat,
          max: maxValue * 1.2,
        })) || [],
      };
      baseOption.series = data.series.map(s => ({
        name: s.name,
        type: 'radar',
        data: [{
          value: s.data,
          name: s.name,
        }],
        color: s.color,
        label: s.label,
        emphasis: s.emphasis,
        ...s.itemStyle,
      }));
      delete baseOption.xAxis;
      delete baseOption.yAxis;
      break;

    case 'heatmap':
      const heatmapData: any[] = [];
      data.categories?.forEach((cat, x) => {
        data.series.forEach((series, y) => {
          heatmapData.push([x, y, series.data[x] || 0]);
        });
      });
      baseOption.xAxis = {
        type: 'category',
        data: data.categories,
        ...options.xAxis,
      };
      baseOption.yAxis = {
        type: 'category',
        data: data.series.map(s => s.name),
        ...options.yAxis,
      };
      baseOption.visualMap = {
        min: 0,
        max: Math.max(...heatmapData.map(d => d[2])),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
      };
      baseOption.series = [{
        name: 'Heatmap',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
        },
      }];
      break;

    case 'gauge':
      const gaugeValue = data.series[0]?.data[0] || 0;
      baseOption.series = [{
        name: data.series[0]?.name || 'Gauge',
        type: 'gauge',
        detail: { formatter: '{value}' },
        data: [{ value: gaugeValue, name: data.series[0]?.name || 'Score' }],
      }];
      delete baseOption.xAxis;
      delete baseOption.yAxis;
      break;

    case 'funnel':
      const funnelData = data.categories?.map((cat, i) => ({
        value: data.series[0]?.data[i] || 0,
        name: cat,
      })) || [];
      baseOption.series = [{
        name: data.series[0]?.name || 'Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: Math.max(...(data.series[0]?.data || [0])),
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 20,
          },
        },
        data: funnelData,
      }];
      delete baseOption.xAxis;
      delete baseOption.yAxis;
      break;

    case 'treemap':
      const treemapData = data.categories?.map((cat, i) => ({
        name: cat,
        value: data.series[0]?.data[i] || 0,
      })) || [];
      baseOption.series = [{
        name: data.series[0]?.name || 'Treemap',
        type: 'treemap',
        data: treemapData,
        label: {
          show: true,
          formatter: '{b}',
        },
        upperLabel: {
          show: true,
          height: 30,
        },
        itemStyle: {
          borderColor: '#fff',
        },
        levels: [
          {
            itemStyle: {
              borderColor: '#777',
              borderWidth: 0,
              gapWidth: 1,
            },
            upperLabel: {
              show: false,
            },
          },
        ],
      }];
      delete baseOption.xAxis;
      delete baseOption.yAxis;
      break;

    case 'sunburst':
      const sunburstData = data.categories?.map((cat, i) => ({
        name: cat,
        value: data.series[0]?.data[i] || 0,
      })) || [];
      baseOption.series = [{
        name: data.series[0]?.name || 'Sunburst',
        type: 'sunburst',
        radius: [0, '90%'],
        label: {
          rotate: 'radial',
        },
        data: sunburstData,
      }];
      delete baseOption.xAxis;
      delete baseOption.yAxis;
      break;

    case 'sankey':
      // For sankey, we need special data format
      const nodes = data.categories?.map(cat => ({ name: cat })) || [];
      const links = data.series[0]?.data.map((value, i) => ({
        source: data.categories?.[i] || `Node ${i}`,
        target: data.categories?.[i + 1] || `Node ${i + 1}`,
        value: value,
      })).filter((_, i) => i < (data.categories?.length || 0) - 1) || [];
      
      baseOption.series = [{
        name: data.series[0]?.name || 'Sankey',
        type: 'sankey',
        emphasis: {
          focus: 'adjacency',
        },
        data: nodes,
        links: links,
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
        },
      }] as any;
      delete baseOption.xAxis;
      delete baseOption.yAxis;
      break;

    case 'boxplot':
      // For boxplot, we need to prepare data in [min, Q1, median, Q3, max] format
      const boxplotData = data.series.map(s => {
        const sorted = [...s.data].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const median = sorted[Math.floor(sorted.length * 0.5)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        return [min, q1, median, q3, max];
      });
      
      baseOption.xAxis = {
        type: 'category',
        data: data.series.map(s => s.name),
        ...options.xAxis,
      };
      baseOption.yAxis = {
        type: 'value',
        ...options.yAxis,
      };
      baseOption.series = [{
        name: 'Boxplot',
        type: 'boxplot',
        data: boxplotData,
      }];
      break;

    case 'candlestick':
      // For candlestick, data should be [open, close, low, high]
      const candlestickData = data.series[0]?.data.map((v, i) => {
        // Simulate OHLC data
        const base = v;
        const open = base + (Math.random() - 0.5) * 10;
        const close = base + (Math.random() - 0.5) * 10;
        const low = Math.min(open, close) - Math.random() * 5;
        const high = Math.max(open, close) + Math.random() * 5;
        return [open, close, low, high];
      }) || [];
      
      baseOption.xAxis = {
        type: 'category',
        data: data.categories,
        ...options.xAxis,
      };
      baseOption.yAxis = {
        type: 'value',
        ...options.yAxis,
      };
      baseOption.series = [{
        name: data.series[0]?.name || 'Candlestick',
        type: 'candlestick',
        data: candlestickData,
      }];
      break;

    case 'parallel':
      // For parallel coordinates
      const parallelData = data.series.map(s => ({
        name: s.name,
        type: 'parallel' as const,
        lineStyle: {
          width: 2,
          opacity: 0.5,
        },
        data: [s.data],
      }));
      
      baseOption.parallelAxis = data.categories?.map((cat, i) => ({
        dim: i,
        name: cat,
      })) || [];
      baseOption.parallel = {
        left: '5%',
        right: '18%',
        bottom: 100,
        parallelAxisDefault: {
          type: 'value',
          name: 'parallel',
          nameLocation: 'end',
          nameGap: 20,
          nameTextStyle: {
            fontSize: 12,
          },
        },
      };
      baseOption.series = parallelData as any;
      delete baseOption.xAxis;
      delete baseOption.yAxis;
      break;

    default:
      // Default to line chart
      baseOption.xAxis = {
        type: 'category',
        data: data.categories,
        ...options.xAxis,
      };
      baseOption.yAxis = {
        type: 'value',
        ...options.yAxis,
      };
      baseOption.series = data.series.map(s => ({
        name: s.name,
        type: 'line',
        data: s.data,
        ...s.itemStyle,
      }));
  }

  return baseOption;
};