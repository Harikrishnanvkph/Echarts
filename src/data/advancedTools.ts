// Advanced Tools Data Structure for ECharts Studio
// 150+ Tools across 25+ categories with extensive functionality

import * as math from 'mathjs';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
  enabled: boolean;
  premium?: boolean;
  shortcut?: string;
  tags?: string[];
  complexity?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  params?: ToolParameter[];
  execute: (data: any, params?: any) => Promise<any>;
  documentation?: string;
  examples?: ToolExample[];
  version?: string;
  dependencies?: string[];
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date' | 'color' | 'file' | 'range' | 'json' | 'formula';
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: { value: any; label: string; icon?: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  validation?: (value: any) => boolean | string;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
}

export interface ToolExample {
  title: string;
  description: string;
  input: any;
  output: any;
  params?: any;
}

export enum ToolCategory {
  // Basic Categories (Enhanced)
  DATA_ANALYSIS = 'Data Analysis',
  VISUALIZATION = 'Visualization',
  EXPORT_SHARING = 'Export & Sharing',
  STATISTICAL = 'Statistical Analysis',
  FINANCIAL = 'Financial Analysis',
  
  // Advanced Categories (New)
  MACHINE_LEARNING = 'Machine Learning',
  DEEP_LEARNING = 'Deep Learning',
  DATA_PROCESSING = 'Data Processing',
  FORMATTING = 'Formatting & Styling',
  COLLABORATION = 'Collaboration',
  AUTOMATION = 'Automation',
  TIME_SERIES = 'Time Series Analysis',
  GEOSPATIAL = 'Geospatial Analysis',
  TEXT_ANALYTICS = 'Text Analytics',
  IMAGE_PROCESSING = 'Image Processing',
  PREDICTIVE_ANALYTICS = 'Predictive Analytics',
  BUSINESS_INTELLIGENCE = 'Business Intelligence',
  DATA_QUALITY = 'Data Quality',
  DATA_TRANSFORMATION = 'Data Transformation',
  REAL_TIME = 'Real-Time Analytics',
  CLOUD_INTEGRATION = 'Cloud Integration',
  SECURITY_PRIVACY = 'Security & Privacy',
  PERFORMANCE = 'Performance Optimization',
  CUSTOM_SCRIPTING = 'Custom Scripting',
  WORKFLOW = 'Workflow Management',
  REPORTING = 'Reporting & Documentation',
  MONITORING = 'Monitoring & Alerts',
  API_INTEGRATION = 'API Integration',
  DATABASE = 'Database Operations',
  ETL = 'ETL Operations'
}

// Utility Functions for Tools
const countNullValues = (data: any[]): Record<string, number> => {
  const nullCounts: Record<string, number> = {};
  if (!data || data.length === 0) return nullCounts;
  
  const keys = Object.keys(data[0]);
  keys.forEach(key => {
    nullCounts[key] = data.filter(row => 
      row[key] === null || row[key] === undefined || row[key] === ''
    ).length;
  });
  
  return nullCounts;
};

const detectDataTypes = (data: any[]): Record<string, string> => {
  const types: Record<string, string> = {};
  if (!data || data.length === 0) return types;
  
  const keys = Object.keys(data[0]);
  keys.forEach(key => {
    const samples = data.slice(0, 100).map(row => row[key]).filter(v => v != null);
    if (samples.length === 0) {
      types[key] = 'unknown';
    } else if (samples.every(v => typeof v === 'number')) {
      types[key] = 'number';
    } else if (samples.every(v => typeof v === 'boolean')) {
      types[key] = 'boolean';
    } else if (samples.every(v => !isNaN(Date.parse(v)))) {
      types[key] = 'date';
    } else {
      types[key] = 'string';
    }
  });
  
  return types;
};

const countUniqueValues = (data: any[]): Record<string, number> => {
  const uniqueCounts: Record<string, number> = {};
  if (!data || data.length === 0) return uniqueCounts;
  
  const keys = Object.keys(data[0]);
  keys.forEach(key => {
    const uniqueSet = new Set(data.map(row => row[key]));
    uniqueCounts[key] = uniqueSet.size;
  });
  
  return uniqueCounts;
};

const calculateMemoryUsage = (data: any): number => {
  const jsonString = JSON.stringify(data);
  return new Blob([jsonString]).size;
};

const detectOutliers = (data: any[], method: string, threshold: number) => {
  // Implementation for outlier detection
  const numericColumns = Object.keys(data[0] || {}).filter(key => 
    typeof data[0][key] === 'number'
  );
  
  const outliers: any[] = [];
  
  numericColumns.forEach(column => {
    const values = data.map(row => row[column]).filter(v => v != null);
    const sorted = [...values].sort((a, b) => a - b);
    
    if (method === 'iqr') {
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - threshold * iqr;
      const upperBound = q3 + threshold * iqr;
      
      data.forEach((row, index) => {
        if (row[column] < lowerBound || row[column] > upperBound) {
          outliers.push({ rowIndex: index, column, value: row[column], method: 'IQR' });
        }
      });
    } else if (method === 'zscore') {
      const mean = Number(math.mean(values));
      const std = Number(math.std(values));
      
      data.forEach((row, index) => {
        const zScore = Math.abs((row[column] - mean) / std);
        if (zScore > threshold) {
          outliers.push({ rowIndex: index, column, value: row[column], zScore, method: 'Z-Score' });
        }
      });
    }
  });
  
  return outliers;
};

// Advanced utility functions
const performRegression = (data: any[], xColumn: string, yColumn: string, type: string) => {
  const xValues = data.map(row => row[xColumn]).filter(v => v != null);
  const yValues = data.map(row => row[yColumn]).filter(v => v != null);
  
  if (type === 'linear') {
    // Simple linear regression
    const n = xValues.length;
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const predictions = xValues.map(x => slope * x + intercept);
    const residuals = yValues.map((y, i) => y - predictions[i]);
    
    // Calculate R-squared
    const yMean = sumY / n;
    const ssTotal = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const ssResidual = residuals.reduce((sum, r) => sum + r * r, 0);
    const rSquared = 1 - (ssResidual / ssTotal);
    
    return {
      type: 'linear',
      equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
      slope,
      intercept,
      rSquared,
      predictions,
      residuals
    };
  }
  
  // Add more regression types as needed
  return null;
};

const performClustering = (data: any[], numClusters: number, features: string[]) => {
  // K-means clustering implementation
  const points = data.map(row => features.map(f => row[f] || 0));
  
  // Initialize centroids randomly
  const centroids: number[][] = [];
  for (let i = 0; i < numClusters; i++) {
    const randomIndex = Math.floor(Math.random() * points.length);
    centroids.push([...points[randomIndex]]);
  }
  
  // Iterate until convergence
  const maxIterations = 100;
  let iterations = 0;
  let assignments: number[] = new Array(points.length).fill(0);
  
  while (iterations < maxIterations) {
    // Assign points to nearest centroid
    const newAssignments = points.map(point => {
      let minDistance = Infinity;
      let closestCentroid = 0;
      
      centroids.forEach((centroid, i) => {
        const distance = Math.sqrt(
          centroid.reduce((sum, c, j) => sum + Math.pow(c - point[j], 2), 0)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = i;
        }
      });
      
      return closestCentroid;
    });
    
    // Check for convergence
    if (JSON.stringify(newAssignments) === JSON.stringify(assignments)) {
      break;
    }
    
    assignments = newAssignments;
    
    // Update centroids
    for (let i = 0; i < numClusters; i++) {
      const clusterPoints = points.filter((_, j) => assignments[j] === i);
      if (clusterPoints.length > 0) {
        centroids[i] = features.map((_, j) => 
          clusterPoints.reduce((sum, p) => sum + p[j], 0) / clusterPoints.length
        );
      }
    }
    
    iterations++;
  }
  
  return {
    clusters: assignments,
    centroids,
    iterations,
    silhouetteScore: calculateSilhouetteScore(points, assignments)
  };
};

const calculateSilhouetteScore = (points: number[][], assignments: number[]): number => {
  // Simplified silhouette score calculation
  let totalScore = 0;
  
  points.forEach((point, i) => {
    const cluster = assignments[i];
    const clusterPoints = points.filter((_, j) => assignments[j] === cluster && j !== i);
    
    if (clusterPoints.length === 0) {
      totalScore += 0;
      return;
    }
    
    // Average distance to points in same cluster
    const a = clusterPoints.reduce((sum, p) => {
      return sum + Math.sqrt(p.reduce((s, v, j) => s + Math.pow(v - point[j], 2), 0));
    }, 0) / clusterPoints.length;
    
    // Minimum average distance to points in other clusters
    const otherClusters = [...new Set(assignments)].filter(c => c !== cluster);
    let b = Infinity;
    
    otherClusters.forEach(otherCluster => {
      const otherPoints = points.filter((_, j) => assignments[j] === otherCluster);
      if (otherPoints.length > 0) {
        const avgDistance = otherPoints.reduce((sum, p) => {
          return sum + Math.sqrt(p.reduce((s, v, j) => s + Math.pow(v - point[j], 2), 0));
        }, 0) / otherPoints.length;
        b = Math.min(b, avgDistance);
      }
    });
    
    const s = (b - a) / Math.max(a, b);
    totalScore += s;
  });
  
  return totalScore / points.length;
};

// Text analysis utilities
const performSentimentAnalysis = (text: string): { score: number; sentiment: string } => {
  // Simple sentiment analysis based on word lists
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'happy', 'beautiful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'ugly', 'disgusting', 'poor', 'sad'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  const normalizedScore = score / words.length;
  let sentiment = 'neutral';
  
  if (normalizedScore > 0.1) sentiment = 'positive';
  else if (normalizedScore < -0.1) sentiment = 'negative';
  
  return { score: normalizedScore, sentiment };
};

const extractKeywords = (text: string, numKeywords: number = 10): string[] => {
  // Simple keyword extraction using word frequency
  const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'shall', 'to', 'of', 'in', 'for', 'with', 'by', 'from', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'over']);
  
  const words = text.toLowerCase().split(/\W+/).filter(word => 
    word.length > 2 && !stopWords.has(word)
  );
  
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, numKeywords)
    .map(([word]) => word);
};

// Time series utilities
const detectSeasonality = (data: number[], period?: number): any => {
  if (!period) {
    // Auto-detect period using autocorrelation
    const maxLag = Math.min(data.length / 2, 100);
    const autocorrelations: number[] = [];
    
    for (let lag = 1; lag <= maxLag; lag++) {
      let sum = 0;
      let count = 0;
      
      for (let i = lag; i < data.length; i++) {
        sum += data[i] * data[i - lag];
        count++;
      }
      
      autocorrelations.push(sum / count);
    }
    
    // Find peaks in autocorrelation
    const peaks: number[] = [];
    for (let i = 1; i < autocorrelations.length - 1; i++) {
      if (autocorrelations[i] > autocorrelations[i - 1] && 
          autocorrelations[i] > autocorrelations[i + 1]) {
        peaks.push(i + 1);
      }
    }
    
    period = peaks[0] || 12; // Default to 12 if no peaks found
  }
  
  // Decompose time series
  const trend: number[] = [];
  const seasonal: number[] = [];
  const residual: number[] = [];
  
  // Calculate moving average for trend
  const halfPeriod = Math.floor(period / 2);
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - halfPeriod);
    const end = Math.min(data.length, i + halfPeriod + 1);
    const window = data.slice(start, end);
    trend.push(window.reduce((a, b) => a + b, 0) / window.length);
  }
  
  // Calculate seasonal component
  const detrended = data.map((v, i) => v - trend[i]);
  const seasonalPattern: number[] = [];
  
  for (let i = 0; i < period; i++) {
    const values: number[] = [];
    for (let j = i; j < detrended.length; j += period) {
      values.push(detrended[j]);
    }
    seasonalPattern.push(values.reduce((a, b) => a + b, 0) / values.length);
  }
  
  for (let i = 0; i < data.length; i++) {
    seasonal.push(seasonalPattern[i % period]);
    residual.push(data[i] - trend[i] - seasonal[i]);
  }
  
  return {
    period,
    trend,
    seasonal,
    residual,
    seasonalStrength: calculateSeasonalStrength(seasonal, residual)
  };
};

const calculateSeasonalStrength = (seasonal: number[], residual: number[]): number => {
  const varSeasonal = Number(math.variance(seasonal));
  const varResidual = Number(math.variance(residual));
  return 1 - varResidual / (varSeasonal + varResidual);
};

const forecastTimeSeries = (data: number[], periods: number, method: string = 'exponential'): number[] => {
  const forecast: number[] = [];
  
  if (method === 'exponential') {
    // Simple exponential smoothing
    const alpha = 0.3;
    let level = data[0];
    
    for (let i = 1; i < data.length; i++) {
      level = alpha * data[i] + (1 - alpha) * level;
    }
    
    for (let i = 0; i < periods; i++) {
      forecast.push(level);
    }
  } else if (method === 'linear') {
    // Linear trend forecast
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * data[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    for (let i = 0; i < periods; i++) {
      forecast.push(slope * (n + i) + intercept);
    }
  } else if (method === 'moving_average') {
    // Moving average forecast
    const windowSize = Math.min(5, data.length);
    const lastValues = data.slice(-windowSize);
    const avg = lastValues.reduce((a, b) => a + b, 0) / windowSize;
    
    for (let i = 0; i < periods; i++) {
      forecast.push(avg);
    }
  }
  
  return forecast;
};

// Export to continue in next part...
export { 
  countNullValues, 
  detectDataTypes, 
  countUniqueValues, 
  calculateMemoryUsage,
  detectOutliers,
  performRegression,
  performClustering,
  performSentimentAnalysis,
  extractKeywords,
  detectSeasonality,
  forecastTimeSeries
};