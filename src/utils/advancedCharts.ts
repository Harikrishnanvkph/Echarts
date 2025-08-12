import * as echarts from 'echarts';
import 'echarts-gl';
import { ChartConfig } from '../types/chart';

// Advanced 3D Chart Types
export type Advanced3DChartType = 
  | 'bar3D'
  | 'line3D'
  | 'scatter3D'
  | 'surface3D'
  | 'globe'
  | 'map3D'
  | 'graphGL'
  | 'flowGL';

// Statistical Chart Types
export type StatisticalChartType =
  | 'histogram'
  | 'densityPlot'
  | 'violinPlot'
  | 'ridgePlot'
  | 'correlationMatrix'
  | 'regressionPlot'
  | 'qqPlot'
  | 'contourPlot';

// Financial Chart Types
export type FinancialChartType =
  | 'kline'
  | 'volumeProfile'
  | 'marketDepth'
  | 'heikinAshi'
  | 'renko'
  | 'pointFigure';

// Network and Graph Types
export type NetworkChartType =
  | 'forceGraph'
  | 'chord'
  | 'hierarchicalEdge'
  | 'circularGraph'
  | 'bipartiteGraph';

// Geographic Chart Types
export type GeographicChartType =
  | 'choropleth'
  | 'bubbleMap'
  | 'flowMap'
  | 'heatMap'
  | 'densityMap'
  | 'trajectoryMap';

// Time Series Advanced Types
export type TimeSeriesAdvancedType =
  | 'streamGraph'
  | 'horizonChart'
  | 'calendarHeatmap'
  | 'spiralChart'
  | 'connectedScatter';

// Generate 3D Bar Chart
export const generate3DBarChart = (config: ChartConfig): echarts.EChartsOption => {
  const { data, options } = config;
  
  // Prepare 3D data
  const data3D: number[][] = [];
  data.series.forEach((series, seriesIndex) => {
    series.data.forEach((value, categoryIndex) => {
      data3D.push([categoryIndex, seriesIndex, value]);
    });
  });

  return {
    ...options,
    tooltip: {},
    visualMap: {
      max: Math.max(...data3D.map(d => d[2])),
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D: {
      type: 'category',
      data: data.categories,
      name: 'Categories',
      nameTextStyle: { fontSize: 16 }
    },
    yAxis3D: {
      type: 'category',
      data: data.series.map(s => s.name),
      name: 'Series',
      nameTextStyle: { fontSize: 16 }
    },
    zAxis3D: {
      type: 'value',
      name: 'Value',
      nameTextStyle: { fontSize: 16 }
    },
    grid3D: {
      boxWidth: 200,
      boxDepth: 80,
      viewControl: {
        projection: 'perspective',
        autoRotate: options.autoRotate || false,
        autoRotateSpeed: 10
      },
      light: {
        main: {
          intensity: 1.2,
          shadow: true
        },
        ambient: {
          intensity: 0.3
        }
      }
    },
    series: [{
      type: 'bar3D',
      data: data3D,
      shading: 'lambert',
      label: {
        show: false,
        textStyle: {
          fontSize: 16,
          borderWidth: 1
        }
      },
      emphasis: {
        label: {
          show: true,
          textStyle: {
            fontSize: 20,
            color: '#900'
          }
        },
        itemStyle: {
          color: '#900'
        }
      }
    }]
  };
};

// Generate 3D Scatter Plot
export const generate3DScatterPlot = (config: ChartConfig): echarts.EChartsOption => {
  const { data, options } = config;
  
  // Generate 3D scatter data with additional dimension
  const scatter3DData = data.series.map(series => ({
    name: series.name,
    type: 'scatter3D',
    symbol: series.itemStyle?.symbol || 'circle',
    symbolSize: series.itemStyle?.symbolSize || 10,
    data: series.data.map((value, index) => {
      // Create 3D coordinates [x, y, z, value]
      const x = index;
      const y = value;
      const z = Math.sin(index / 2) * value; // Example z calculation
      return [x, y, z, value];
    }),
    itemStyle: {
      color: series.color,
      opacity: 0.8
    },
    emphasis: {
      itemStyle: {
        color: series.color || '#c23531',
        opacity: 1,
        borderWidth: 2,
        borderColor: '#fff'
      }
    }
  }));

  return {
    ...options,
    tooltip: {
      formatter: (params: any) => {
        return `${params.seriesName}<br/>
                X: ${params.data[0]}<br/>
                Y: ${params.data[1]}<br/>
                Z: ${params.data[2]}<br/>
                Value: ${params.data[3]}`;
      }
    },
    xAxis3D: {
      type: 'value',
      name: 'X Axis',
      nameTextStyle: { fontSize: 14 }
    },
    yAxis3D: {
      type: 'value',
      name: 'Y Axis',
      nameTextStyle: { fontSize: 14 }
    },
    zAxis3D: {
      type: 'value',
      name: 'Z Axis',
      nameTextStyle: { fontSize: 14 }
    },
    grid3D: {
      viewControl: {
        projection: 'perspective',
        autoRotate: options.autoRotate || false,
        distance: 150
      },
      postEffect: {
        enable: true,
        bloom: {
          enable: true,
          intensity: 0.1
        },
        SSAO: {
          enable: true,
          radius: 4,
          intensity: 1.5
        }
      }
    },
    series: scatter3DData
  };
};

// Generate 3D Surface Plot
export const generate3DSurfacePlot = (config: ChartConfig): echarts.EChartsOption => {
  const { data, options } = config;
  
  // Generate surface data
  const generateSurfaceData = () => {
    const result = [];
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        const x = i / 5;
        const y = j / 5;
        const z = Math.sin(x) * Math.cos(y) * 2;
        result.push([x, y, z]);
      }
    }
    return result;
  };

  return {
    ...options,
    tooltip: {},
    backgroundColor: '#fff',
    visualMap: {
      show: true,
      dimension: 2,
      min: -2,
      max: 2,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D: {
      type: 'value',
      name: 'X'
    },
    yAxis3D: {
      type: 'value',
      name: 'Y'
    },
    zAxis3D: {
      type: 'value',
      name: 'Z'
    },
    grid3D: {
      viewControl: {
        projection: 'perspective',
        autoRotate: true
      },
      postEffect: {
        enable: true,
        SSAO: {
          enable: true,
          radius: 3
        }
      }
    },
    series: [{
      type: 'surface',
      wireframe: {
        show: false
      },
      data: generateSurfaceData(),
      shading: 'color'
    }]
  };
};

// Generate Globe Visualization
export const generateGlobeVisualization = (config: ChartConfig): echarts.EChartsOption => {
  const { data, options } = config;
  
  // Generate random global data points
  const generateGlobalData = () => {
    const result = [];
    for (let i = 0; i < 100; i++) {
      result.push({
        name: `Location ${i}`,
        value: [
          (Math.random() - 0.5) * 360,  // longitude
          (Math.random() - 0.5) * 180,  // latitude
          Math.random() * 100            // value
        ]
      });
    }
    return result;
  };

  return {
    ...options,
    backgroundColor: '#000',
    globe: {
      baseTexture: '/assets/world.topo.bathy.200401.jpg',
      heightTexture: '/assets/world.topo.bathy.200401.jpg',
      displacementScale: 0.04,
      shading: 'realistic',
      environment: '/assets/starfield.jpg',
      realisticMaterial: {
        roughness: 0.9
      },
      postEffect: {
        enable: true
      },
      light: {
        main: {
          intensity: 5,
          shadow: true
        },
        ambientCubemap: {
          texture: '/assets/pisa.hdr',
          diffuseIntensity: 0.2
        }
      },
      viewControl: {
        autoRotate: true,
        autoRotateSpeed: 1
      }
    },
    series: [{
      type: 'scatter3D',
      coordinateSystem: 'globe',
      symbol: 'circle',
      symbolSize: 10,
      data: generateGlobalData(),
      itemStyle: {
        color: '#ffeb3b',
        opacity: 1
      },
      emphasis: {
        itemStyle: {
          color: '#ff5722'
        }
      }
    }]
  };
};

// Generate Statistical Histogram
export const generateHistogram = (data: number[], bins: number = 20): echarts.EChartsOption => {
  // Calculate histogram bins
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;
  const histogram: number[] = new Array(bins).fill(0);
  const binEdges: number[] = [];

  for (let i = 0; i <= bins; i++) {
    binEdges.push(min + i * binWidth);
  }

  // Count frequencies
  data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    histogram[binIndex]++;
  });

  // Calculate statistics
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  // Generate normal distribution overlay
  const normalCurve = binEdges.slice(0, -1).map(x => {
    const z = (x + binWidth / 2 - mean) / stdDev;
    const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
    return pdf * data.length * binWidth;
  });

  return {
    title: {
      text: 'Histogram with Normal Distribution',
      subtext: `Mean: ${mean.toFixed(2)}, Std Dev: ${stdDev.toFixed(2)}`,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Frequency', 'Normal Distribution'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: binEdges.slice(0, -1).map((edge, i) => 
        `${edge.toFixed(1)}-${binEdges[i + 1].toFixed(1)}`
      ),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: 'Frequency'
    },
    series: [
      {
        name: 'Frequency',
        type: 'bar',
        data: histogram,
        itemStyle: {
          color: '#5470c6',
          opacity: 0.7
        }
      },
      {
        name: 'Normal Distribution',
        type: 'line',
        data: normalCurve,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#ee6666',
          width: 3
        }
      }
    ]
  };
};

// Generate Correlation Matrix
export const generateCorrelationMatrix = (data: number[][], labels: string[]): echarts.EChartsOption => {
  const n = data.length;
  const correlationMatrix: number[][] = [];

  // Calculate correlation coefficients
  for (let i = 0; i < n; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        correlationMatrix[i][j] = 1;
      } else {
        const correlation = calculateCorrelation(data[i], data[j]);
        correlationMatrix[i][j] = correlation;
      }
    }
  }

  // Prepare heatmap data
  const heatmapData: any[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      heatmapData.push([i, j, correlationMatrix[i][j]]);
    }
  }

  return {
    title: {
      text: 'Correlation Matrix',
      left: 'center'
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `${labels[params.data[0]]} vs ${labels[params.data[1]]}<br/>
                Correlation: ${params.data[2].toFixed(3)}`;
      }
    },
    grid: {
      height: '70%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: labels,
      splitArea: {
        show: true
      },
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'category',
      data: labels,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    series: [{
      name: 'Correlation',
      type: 'heatmap',
      data: heatmapData,
      label: {
        show: true,
        formatter: (params: any) => params.data[2].toFixed(2)
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
};

// Helper function to calculate correlation
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
  const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
  const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

// Generate Violin Plot
export const generateViolinPlot = (data: number[][], labels: string[]): echarts.EChartsOption => {
  // Calculate violin plot data
  const violinData = data.map((group, index) => {
    const sorted = [...group].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    // Calculate kernel density estimation for violin shape
    const kde = kernelDensityEstimation(group);
    
    return {
      name: labels[index],
      boxData: [min, q1, median, q3, max],
      outliers: [],
      kde: kde
    };
  });

  // Create series for box plots and violin shapes
  const series: any[] = [];
  
  // Add box plots
  series.push({
    name: 'boxplot',
    type: 'boxplot',
    data: violinData.map(d => d.boxData),
    itemStyle: {
      color: '#5470c6',
      borderWidth: 2
    }
  });

  // Add violin shapes (using custom series)
  violinData.forEach((violin, index) => {
    series.push({
      name: `violin-${index}`,
      type: 'line',
      data: violin.kde.map((point: any) => [index - point.density * 0.3, point.value]),
      smooth: true,
      showSymbol: false,
      lineStyle: {
        color: '#91cc75',
        width: 2
      },
      areaStyle: {
        color: '#91cc75',
        opacity: 0.3
      },
      z: 0
    });
    
    series.push({
      name: `violin-mirror-${index}`,
      type: 'line',
      data: violin.kde.map((point: any) => [index + point.density * 0.3, point.value]),
      smooth: true,
      showSymbol: false,
      lineStyle: {
        color: '#91cc75',
        width: 2
      },
      areaStyle: {
        color: '#91cc75',
        opacity: 0.3
      },
      z: 0
    });
  });

  return {
    title: {
      text: 'Violin Plot',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: 'Value',
      splitArea: {
        show: true
      }
    },
    series: series
  };
};

// Kernel Density Estimation helper
function kernelDensityEstimation(data: number[], bandwidth?: number): any[] {
  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;
  const h = bandwidth || range / 20; // Bandwidth
  
  const points = [];
  const steps = 50;
  
  for (let i = 0; i <= steps; i++) {
    const x = min + (range * i / steps);
    let density = 0;
    
    for (const value of data) {
      const u = (x - value) / h;
      // Gaussian kernel
      density += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
    }
    
    density = density / (data.length * h);
    points.push({ value: x, density });
  }
  
  return points;
}

// Generate Ridge Plot (Joy Plot)
export const generateRidgePlot = (data: number[][], labels: string[]): echarts.EChartsOption => {
  const series: any[] = [];
  const offset = 0.5;
  
  data.forEach((group, index) => {
    const kde = kernelDensityEstimation(group);
    const maxDensity = Math.max(...kde.map(p => p.density));
    
    series.push({
      name: labels[index],
      type: 'line',
      data: kde.map(point => [point.value, index + point.density / maxDensity * offset]),
      smooth: true,
      areaStyle: {
        opacity: 0.6,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: `hsl(${index * 30}, 70%, 50%)` },
          { offset: 1, color: `hsl(${index * 30}, 70%, 70%)` }
        ])
      },
      lineStyle: {
        width: 2,
        color: `hsl(${index * 30}, 70%, 40%)`
      },
      z: data.length - index
    });
  });

  return {
    title: {
      text: 'Ridge Plot',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '10%',
      top: '10%'
    },
    xAxis: {
      type: 'value',
      name: 'Value'
    },
    yAxis: {
      type: 'value',
      data: labels,
      inverse: true,
      axisLabel: {
        formatter: (value: any, index: number) => labels[index] || ''
      }
    },
    series: series
  };
};

// Generate Regression Plot
export const generateRegressionPlot = (xData: number[], yData: number[]): echarts.EChartsOption => {
  // Calculate linear regression
  const n = xData.length;
  const sumX = xData.reduce((a, b) => a + b, 0);
  const sumY = yData.reduce((a, b) => a + b, 0);
  const sumXY = xData.reduce((total, xi, i) => total + xi * yData[i], 0);
  const sumX2 = xData.reduce((total, xi) => total + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R-squared
  const yMean = sumY / n;
  const ssTotal = yData.reduce((total, yi) => total + Math.pow(yi - yMean, 2), 0);
  const ssResidual = yData.reduce((total, yi, i) => {
    const predicted = slope * xData[i] + intercept;
    return total + Math.pow(yi - predicted, 2);
  }, 0);
  const rSquared = 1 - (ssResidual / ssTotal);
  
  // Generate regression line
  const minX = Math.min(...xData);
  const maxX = Math.max(...xData);
  const regressionLine = [
    [minX, slope * minX + intercept],
    [maxX, slope * maxX + intercept]
  ];
  
  // Calculate confidence intervals
  const standardError = Math.sqrt(ssResidual / (n - 2));
  const confidenceInterval = 1.96 * standardError; // 95% confidence
  
  const upperBound = regressionLine.map(point => [point[0], point[1] + confidenceInterval]);
  const lowerBound = regressionLine.map(point => [point[0], point[1] - confidenceInterval]);

  return {
    title: {
      text: 'Linear Regression Analysis',
      subtext: `y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)} | R² = ${rSquared.toFixed(3)}`,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.seriesName === 'Data Points') {
          return `X: ${params.data[0].toFixed(2)}<br/>Y: ${params.data[1].toFixed(2)}`;
        }
        return params.seriesName;
      }
    },
    legend: {
      data: ['Data Points', 'Regression Line', 'Confidence Interval'],
      top: 50
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'X Variable'
    },
    yAxis: {
      type: 'value',
      name: 'Y Variable'
    },
    series: [
      {
        name: 'Data Points',
        type: 'scatter',
        data: xData.map((x, i) => [x, yData[i]]),
        symbolSize: 8,
        itemStyle: {
          color: '#5470c6'
        }
      },
      {
        name: 'Regression Line',
        type: 'line',
        data: regressionLine,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: '#ee6666',
          width: 3
        }
      },
      {
        name: 'Confidence Interval',
        type: 'line',
        data: upperBound,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: '#91cc75',
          width: 1,
          type: 'dashed'
        },
        areaStyle: {
          color: '#91cc75',
          opacity: 0.1
        },
        stack: 'confidence'
      },
      {
        name: 'Confidence Interval',
        type: 'line',
        data: lowerBound,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: '#91cc75',
          width: 1,
          type: 'dashed'
        },
        areaStyle: {
          color: '#91cc75',
          opacity: 0.1
        },
        stack: 'confidence'
      }
    ]
  };
};

// Generate Q-Q Plot
export const generateQQPlot = (data: number[]): echarts.EChartsOption => {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  
  // Calculate theoretical quantiles (normal distribution)
  const theoreticalQuantiles: number[] = [];
  const sampleQuantiles = sorted;
  
  for (let i = 0; i < n; i++) {
    const p = (i + 0.5) / n;
    const z = inverseNormalCDF(p);
    theoreticalQuantiles.push(z);
  }
  
  // Normalize sample quantiles
  const mean = data.reduce((a, b) => a + b, 0) / n;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  const normalizedTheoretical = theoreticalQuantiles.map(q => q * stdDev + mean);
  
  // Create Q-Q plot data
  const qqData = sampleQuantiles.map((q, i) => [normalizedTheoretical[i], q]);
  
  // Reference line (y = x)
  const min = Math.min(...sampleQuantiles.concat(normalizedTheoretical));
  const max = Math.max(...sampleQuantiles.concat(normalizedTheoretical));
  const referenceLine = [[min, min], [max, max]];

  return {
    title: {
      text: 'Q-Q Plot (Normal Distribution)',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `Theoretical: ${params.data[0].toFixed(2)}<br/>Sample: ${params.data[1].toFixed(2)}`;
      }
    },
    legend: {
      data: ['Sample Quantiles', 'Reference Line'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'Theoretical Quantiles'
    },
    yAxis: {
      type: 'value',
      name: 'Sample Quantiles'
    },
    series: [
      {
        name: 'Sample Quantiles',
        type: 'scatter',
        data: qqData,
        symbolSize: 6,
        itemStyle: {
          color: '#5470c6'
        }
      },
      {
        name: 'Reference Line',
        type: 'line',
        data: referenceLine,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: '#ee6666',
          width: 2,
          type: 'dashed'
        }
      }
    ]
  };
};

// Inverse Normal CDF (for Q-Q plot)
function inverseNormalCDF(p: number): number {
  // Approximation using inverse error function
  const a = 8 * (Math.PI - 3) / (3 * Math.PI * (4 - Math.PI));
  const inv = Math.sqrt(
    Math.sqrt(
      Math.pow(2 / (Math.PI * a) + Math.log(1 - Math.pow(2 * p - 1, 2)) / 2, 2) -
      Math.log(1 - Math.pow(2 * p - 1, 2)) / a
    ) -
    (2 / (Math.PI * a) + Math.log(1 - Math.pow(2 * p - 1, 2)) / 2)
  );
  return p > 0.5 ? inv : -inv;
}

// Generate Contour Plot
export const generateContourPlot = (config: ChartConfig): echarts.EChartsOption => {
  // Generate 2D function data for contouring
  const generateContourData = () => {
    const data = [];
    const step = 0.1;
    for (let x = -3; x <= 3; x += step) {
      for (let y = -3; y <= 3; y += step) {
        // Example: Gaussian function
        const z = Math.exp(-(x * x + y * y) / 2) / (2 * Math.PI);
        data.push([x, y, z]);
      }
    }
    return data;
  };

  const contourData = generateContourData();
  const maxZ = Math.max(...contourData.map(d => d[2]));
  const minZ = Math.min(...contourData.map(d => d[2]));

  return {
    title: {
      text: 'Contour Plot',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `X: ${params.data[0].toFixed(2)}<br/>
                Y: ${params.data[1].toFixed(2)}<br/>
                Z: ${params.data[2].toFixed(4)}`;
      }
    },
    visualMap: {
      min: minZ,
      max: maxZ,
      dimension: 2,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      },
      calculable: true,
      realtime: false,
      orient: 'vertical',
      right: 0
    },
    xAxis: {
      type: 'value',
      name: 'X Axis'
    },
    yAxis: {
      type: 'value',
      name: 'Y Axis'
    },
    series: [{
      type: 'heatmap',
      data: contourData,
      emphasis: {
        itemStyle: {
          borderColor: '#333',
          borderWidth: 1
        }
      },
      progressive: 1000,
      animation: false
    }]
  };
};

// Export all advanced chart generators
export const advancedChartGenerators = {
  // 3D Charts
  bar3D: generate3DBarChart,
  scatter3D: generate3DScatterPlot,
  surface3D: generate3DSurfacePlot,
  globe: generateGlobeVisualization,
  
  // Statistical Charts
  histogram: generateHistogram,
  correlationMatrix: generateCorrelationMatrix,
  violinPlot: generateViolinPlot,
  ridgePlot: generateRidgePlot,
  regressionPlot: generateRegressionPlot,
  qqPlot: generateQQPlot,
  contourPlot: generateContourPlot
};