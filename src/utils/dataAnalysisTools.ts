// Advanced Data Analysis Tools Implementation
// Comprehensive statistical and analytical functions

import * as math from 'mathjs';
import { ChartData, SeriesData } from '../types/chart';

// ============= OUTLIER DETECTION =============
export interface OutlierResult {
  outliers: number[];
  indices: number[];
  method: string;
  threshold: number;
  statistics: {
    mean: number;
    median: number;
    std: number;
    q1: number;
    q3: number;
    iqr: number;
  };
}

export function detectOutliersIQR(data: number[], threshold: number = 1.5): OutlierResult {
  const sorted = [...data].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lowerBound = q1 - threshold * iqr;
  const upperBound = q3 + threshold * iqr;
  
  const outliers: number[] = [];
  const indices: number[] = [];
  
  data.forEach((value, index) => {
    if (value < lowerBound || value > upperBound) {
      outliers.push(value);
      indices.push(index);
    }
  });
  
  return {
    outliers,
    indices,
    method: 'IQR',
    threshold,
    statistics: {
      mean: mean(data),
      median: median(data),
      std: standardDeviation(data),
      q1,
      q3,
      iqr
    }
  };
}

export function detectOutliersZScore(data: number[], threshold: number = 3): OutlierResult {
  const meanVal = mean(data);
  const stdVal = standardDeviation(data);
  
  const outliers: number[] = [];
  const indices: number[] = [];
  
  data.forEach((value, index) => {
    const zScore = Math.abs((value - meanVal) / stdVal);
    if (zScore > threshold) {
      outliers.push(value);
      indices.push(index);
    }
  });
  
  const sorted = [...data].sort((a, b) => a - b);
  
  return {
    outliers,
    indices,
    method: 'Z-Score',
    threshold,
    statistics: {
      mean: meanVal,
      median: median(data),
      std: stdVal,
      q1: quantile(sorted, 0.25),
      q3: quantile(sorted, 0.75),
      iqr: quantile(sorted, 0.75) - quantile(sorted, 0.25)
    }
  };
}

export function detectOutliersIsolationForest(data: number[][], numTrees: number = 100): any[] {
  // Simplified Isolation Forest implementation
  class IsolationTree {
    root: any;
    heightLimit: number;
    
    constructor(heightLimit: number) {
      this.heightLimit = heightLimit;
    }
    
    fit(X: number[][]) {
      this.root = this.buildTree(X, 0);
    }
    
    buildTree(X: number[][], currentHeight: number): any {
      if (currentHeight >= this.heightLimit || X.length <= 1) {
        return { type: 'leaf', size: X.length };
      }
      
      const featureIndex = Math.floor(Math.random() * X[0].length);
      const values = X.map(row => row[featureIndex]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      if (min === max) {
        return { type: 'leaf', size: X.length };
      }
      
      const splitValue = min + Math.random() * (max - min);
      const leftX = X.filter(row => row[featureIndex] < splitValue);
      const rightX = X.filter(row => row[featureIndex] >= splitValue);
      
      return {
        type: 'node',
        featureIndex,
        splitValue,
        left: this.buildTree(leftX, currentHeight + 1),
        right: this.buildTree(rightX, currentHeight + 1)
      };
    }
    
    pathLength(x: number[], node: any = this.root, currentHeight: number = 0): number {
      if (node.type === 'leaf') {
        return currentHeight + this.c(node.size);
      }
      
      if (x[node.featureIndex] < node.splitValue) {
        return this.pathLength(x, node.left, currentHeight + 1);
      } else {
        return this.pathLength(x, node.right, currentHeight + 1);
      }
    }
    
    c(n: number): number {
      if (n <= 1) return 0;
      return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1) / n);
    }
  }
  
  const heightLimit = Math.ceil(Math.log2(data.length));
  const trees: IsolationTree[] = [];
  
  for (let i = 0; i < numTrees; i++) {
    const tree = new IsolationTree(heightLimit);
    const sampleSize = Math.min(256, data.length);
    const sample = data.sort(() => 0.5 - Math.random()).slice(0, sampleSize);
    tree.fit(sample);
    trees.push(tree);
  }
  
  const anomalyScores = data.map(point => {
    const avgPathLength = trees.reduce((sum, tree) => sum + tree.pathLength(point), 0) / numTrees;
    const c = 2 * (Math.log(data.length - 1) + 0.5772156649) - (2 * (data.length - 1) / data.length);
    return Math.pow(2, -avgPathLength / c);
  });
  
  return anomalyScores;
}

// ============= TREND ANALYSIS =============
export interface TrendAnalysisResult {
  trend: 'upward' | 'downward' | 'stable';
  strength: number;
  slope: number;
  intercept: number;
  r2: number;
  forecast: number[];
  seasonality?: {
    period: number;
    amplitude: number;
  };
  changePoints?: number[];
}

export function analyzeTrend(data: number[], periods: number = 5): TrendAnalysisResult {
  const x = Array.from({ length: data.length }, (_, i) => i);
  const regression = linearRegression(x, data);
  
  // Calculate R-squared
  const yMean = mean(data);
  const ssTotal = data.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssResidual = data.reduce((sum, y, i) => {
    const predicted = regression.slope * i + regression.intercept;
    return sum + Math.pow(y - predicted, 2);
  }, 0);
  const r2 = 1 - (ssResidual / ssTotal);
  
  // Determine trend direction
  let trend: 'upward' | 'downward' | 'stable';
  if (Math.abs(regression.slope) < 0.01) {
    trend = 'stable';
  } else if (regression.slope > 0) {
    trend = 'upward';
  } else {
    trend = 'downward';
  }
  
  // Calculate trend strength
  const strength = Math.min(Math.abs(r2), 1);
  
  // Generate forecast
  const forecast = Array.from({ length: periods }, (_, i) => {
    const x = data.length + i;
    return regression.slope * x + regression.intercept;
  });
  
  // Detect seasonality
  const seasonality = detectSeasonality(data);
  
  // Detect change points
  const changePoints = detectChangePoints(data);
  
  return {
    trend,
    strength,
    slope: regression.slope,
    intercept: regression.intercept,
    r2,
    forecast,
    seasonality,
    changePoints
  };
}

// ============= CORRELATION ANALYSIS =============
export interface CorrelationResult {
  matrix: number[][];
  labels: string[];
  significantPairs: Array<{
    var1: string;
    var2: string;
    correlation: number;
    pValue: number;
  }>;
  heatmapData: any;
}

export function calculateCorrelationMatrix(data: Record<string, number[]>): CorrelationResult {
  const labels = Object.keys(data);
  const matrix: number[][] = [];
  const significantPairs: any[] = [];
  
  for (let i = 0; i < labels.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < labels.length; j++) {
      const correlation = pearsonCorrelation(data[labels[i]], data[labels[j]]);
      matrix[i][j] = correlation;
      
      if (i < j && Math.abs(correlation) > 0.5) {
        const pValue = correlationPValue(correlation, data[labels[i]].length);
        significantPairs.push({
          var1: labels[i],
          var2: labels[j],
          correlation,
          pValue
        });
      }
    }
  }
  
  // Generate heatmap data
  const heatmapData = labels.map((label1, i) =>
    labels.map((label2, j) => [i, j, matrix[i][j]])
  ).flat();
  
  return {
    matrix,
    labels,
    significantPairs: significantPairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)),
    heatmapData
  };
}

// ============= TIME SERIES DECOMPOSITION =============
export interface TimeSeriesDecomposition {
  trend: number[];
  seasonal: number[];
  residual: number[];
  period: number;
  method: string;
  metrics: {
    trendStrength: number;
    seasonalStrength: number;
    noise: number;
  };
}

export function decomposeTimeSeries(
  data: number[],
  period: number = 12,
  method: 'additive' | 'multiplicative' = 'additive'
): TimeSeriesDecomposition {
  // Moving average for trend
  const trend = movingAverage(data, period);
  
  // Detrend the data
  const detrended = data.map((value, i) => {
    if (trend[i] !== null) {
      return method === 'additive' ? value - trend[i] : value / trend[i];
    }
    return null;
  }).filter(v => v !== null) as number[];
  
  // Calculate seasonal component
  const seasonal = calculateSeasonalComponent(detrended, period);
  
  // Calculate residual
  const residual = data.map((value, i) => {
    if (trend[i] !== null && seasonal[i % period] !== undefined) {
      if (method === 'additive') {
        return value - trend[i] - seasonal[i % period];
      } else {
        return value / (trend[i] * seasonal[i % period]);
      }
    }
    return 0;
  });
  
  // Calculate metrics
  const trendStrength = calculateTrendStrength(data, trend);
  const seasonalStrength = calculateSeasonalStrength(data, seasonal);
  const noise = standardDeviation(residual.filter(v => v !== 0));
  
  return {
    trend,
    seasonal,
    residual,
    period,
    method,
    metrics: {
      trendStrength,
      seasonalStrength,
      noise
    }
  };
}

// ============= ANOMALY DETECTION =============
export interface AnomalyDetectionResult {
  anomalies: Array<{
    index: number;
    value: number;
    score: number;
    type: 'point' | 'contextual' | 'collective';
  }>;
  threshold: number;
  method: string;
  statistics: {
    totalAnomalies: number;
    anomalyRate: number;
    severity: 'low' | 'medium' | 'high';
  };
}

export function detectAnomalies(
  data: number[],
  method: 'statistical' | 'isolation' | 'lstm' = 'statistical',
  sensitivity: number = 0.95
): AnomalyDetectionResult {
  let anomalies: any[] = [];
  let threshold: number;
  
  switch (method) {
    case 'statistical':
      // Use modified Z-score for robust anomaly detection
      const medianVal = median(data);
      const mad = medianAbsoluteDeviation(data);
      threshold = 3.5;
      
      data.forEach((value, index) => {
        const modifiedZScore = 0.6745 * (value - medianVal) / mad;
        if (Math.abs(modifiedZScore) > threshold) {
          anomalies.push({
            index,
            value,
            score: Math.abs(modifiedZScore),
            type: 'point' as const
          });
        }
      });
      break;
      
    case 'isolation':
      // Use Isolation Forest
      const dataMatrix = data.map(v => [v]);
      const scores = detectOutliersIsolationForest(dataMatrix);
      threshold = quantile(scores, sensitivity);
      
      scores.forEach((score, index) => {
        if (score > threshold) {
          anomalies.push({
            index,
            value: data[index],
            score,
            type: 'contextual' as const
          });
        }
      });
      break;
      
    case 'lstm':
      // Simplified LSTM-based anomaly detection
      // In a real implementation, this would use a trained LSTM model
      const predictions = data.map((_, i) => {
        if (i < 3) return data[i];
        return (data[i-1] + data[i-2] + data[i-3]) / 3;
      });
      
      const errors = data.map((value, i) => Math.abs(value - predictions[i]));
      threshold = quantile(errors, sensitivity);
      
      errors.forEach((error, index) => {
        if (error > threshold) {
          anomalies.push({
            index,
            value: data[index],
            score: error / threshold,
            type: 'collective' as const
          });
        }
      });
      break;
  }
  
  const anomalyRate = anomalies.length / data.length;
  let severity: 'low' | 'medium' | 'high';
  if (anomalyRate < 0.01) severity = 'low';
  else if (anomalyRate < 0.05) severity = 'medium';
  else severity = 'high';
  
  return {
    anomalies: anomalies.sort((a, b) => b.score - a.score),
    threshold,
    method,
    statistics: {
      totalAnomalies: anomalies.length,
      anomalyRate,
      severity
    }
  };
}

// ============= COHORT ANALYSIS =============
export interface CohortAnalysisResult {
  cohorts: Array<{
    name: string;
    size: number;
    periods: number[];
    retention: number[];
    churn: number[];
    ltv: number;
  }>;
  averageRetention: number[];
  bestCohort: string;
  worstCohort: string;
  insights: string[];
}

export function analyzeCohorts(
  data: Array<{
    userId: string;
    cohortDate: Date;
    activityDates: Date[];
    revenue?: number[];
  }>,
  periodType: 'day' | 'week' | 'month' = 'month'
): CohortAnalysisResult {
  // Group users by cohort
  const cohortMap = new Map<string, typeof data>();
  
  data.forEach(user => {
    const cohortKey = formatDateByCohort(user.cohortDate, periodType);
    if (!cohortMap.has(cohortKey)) {
      cohortMap.set(cohortKey, []);
    }
    cohortMap.get(cohortKey)!.push(user);
  });
  
  const cohorts: any[] = [];
  
  cohortMap.forEach((users, cohortName) => {
    const size = users.length;
    const maxPeriods = 12; // Analyze up to 12 periods
    const retention: number[] = [100]; // Period 0 is always 100%
    const churn: number[] = [0];
    
    for (let period = 1; period < maxPeriods; period++) {
      const activeUsers = users.filter(user => {
        const periodEnd = addPeriods(new Date(cohortName), period, periodType);
        return user.activityDates.some(date => date <= periodEnd && date >= addPeriods(new Date(cohortName), period - 1, periodType));
      });
      
      const retentionRate = (activeUsers.length / size) * 100;
      retention.push(retentionRate);
      churn.push(100 - retentionRate);
    }
    
    // Calculate LTV
    const ltv = users.reduce((sum, user) => {
      return sum + (user.revenue?.reduce((a, b) => a + b, 0) || 0);
    }, 0) / size;
    
    cohorts.push({
      name: cohortName,
      size,
      periods: Array.from({ length: maxPeriods }, (_, i) => i),
      retention,
      churn,
      ltv
    });
  });
  
  // Calculate average retention across all cohorts
  const maxPeriods = Math.max(...cohorts.map(c => c.retention.length));
  const averageRetention = Array.from({ length: maxPeriods }, (_, period) => {
    const validCohorts = cohorts.filter(c => c.retention[period] !== undefined);
    return validCohorts.reduce((sum, c) => sum + c.retention[period], 0) / validCohorts.length;
  });
  
  // Find best and worst cohorts
  const cohortsByRetention = cohorts.sort((a, b) => {
    const aAvg = mean(a.retention.slice(1)); // Exclude period 0
    const bAvg = mean(b.retention.slice(1));
    return bAvg - aAvg;
  });
  
  const bestCohort = cohortsByRetention[0]?.name || '';
  const worstCohort = cohortsByRetention[cohortsByRetention.length - 1]?.name || '';
  
  // Generate insights
  const insights: string[] = [];
  
  if (averageRetention[1] < 50) {
    insights.push('High initial churn detected. Consider improving onboarding.');
  }
  
  if (averageRetention[averageRetention.length - 1] < 10) {
    insights.push('Long-term retention is low. Focus on engagement strategies.');
  }
  
  const retentionTrend = linearRegression(
    Array.from({ length: averageRetention.length }, (_, i) => i),
    averageRetention
  );
  
  if (retentionTrend.slope < -5) {
    insights.push('Retention is declining rapidly over time.');
  }
  
  return {
    cohorts,
    averageRetention,
    bestCohort,
    worstCohort,
    insights
  };
}

// ============= FUNNEL ANALYSIS =============
export interface FunnelAnalysisResult {
  stages: Array<{
    name: string;
    users: number;
    conversionRate: number;
    dropoffRate: number;
    averageTime: number;
  }>;
  overallConversion: number;
  bottlenecks: string[];
  recommendations: string[];
}

export function analyzeFunnel(
  data: Array<{
    userId: string;
    stages: Array<{
      name: string;
      timestamp: Date;
      completed: boolean;
    }>;
  }>,
  stageOrder: string[]
): FunnelAnalysisResult {
  const stages: any[] = [];
  let previousUsers = data.length;
  
  stageOrder.forEach((stageName, index) => {
    const usersAtStage = data.filter(user => 
      user.stages.some(s => s.name === stageName && s.completed)
    );
    
    const users = usersAtStage.length;
    const conversionRate = index === 0 ? 100 : (users / previousUsers) * 100;
    const dropoffRate = 100 - conversionRate;
    
    // Calculate average time to complete stage
    const times = usersAtStage.map(user => {
      const stage = user.stages.find(s => s.name === stageName);
      if (stage && index > 0) {
        const prevStage = user.stages.find(s => s.name === stageOrder[index - 1]);
        if (prevStage) {
          return stage.timestamp.getTime() - prevStage.timestamp.getTime();
        }
      }
      return 0;
    }).filter(t => t > 0);
    
    const averageTime = times.length > 0 ? mean(times) / 1000 / 60 : 0; // Convert to minutes
    
    stages.push({
      name: stageName,
      users,
      conversionRate,
      dropoffRate,
      averageTime
    });
    
    previousUsers = users;
  });
  
  const overallConversion = stages.length > 0 
    ? (stages[stages.length - 1].users / data.length) * 100 
    : 0;
  
  // Identify bottlenecks
  const bottlenecks: string[] = [];
  stages.forEach((stage, index) => {
    if (stage.dropoffRate > 50) {
      bottlenecks.push(`${stage.name} (${stage.dropoffRate.toFixed(1)}% drop-off)`);
    }
  });
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (overallConversion < 10) {
    recommendations.push('Overall conversion is very low. Review the entire funnel flow.');
  }
  
  const highTimeStages = stages.filter(s => s.averageTime > 60);
  if (highTimeStages.length > 0) {
    recommendations.push(`Optimize ${highTimeStages[0].name} - users spend too much time here.`);
  }
  
  if (bottlenecks.length > 0) {
    recommendations.push(`Focus on improving conversion at ${bottlenecks[0]}`);
  }
  
  return {
    stages,
    overallConversion,
    bottlenecks,
    recommendations
  };
}

// ============= HELPER FUNCTIONS =============
function mean(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function standardDeviation(values: number[]): number {
  const avg = mean(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}

function linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return den === 0 ? 0 : num / den;
}

function correlationPValue(r: number, n: number): number {
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  // Simplified p-value calculation
  return 2 * (1 - normalCDF(Math.abs(t)));
}

function normalCDF(x: number): number {
  // Approximation of the normal CDF
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1 + sign * y);
}

function movingAverage(data: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(null as any);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
  }
  return result;
}

function detectSeasonality(data: number[]): { period: number; amplitude: number } | undefined {
  // Simplified seasonality detection using autocorrelation
  const maxLag = Math.min(data.length / 2, 50);
  const autocorrelations: number[] = [];
  
  for (let lag = 1; lag <= maxLag; lag++) {
    const correlation = calculateAutocorrelation(data, lag);
    autocorrelations.push(correlation);
  }
  
  // Find peaks in autocorrelation
  const peaks = findPeaks(autocorrelations);
  if (peaks.length > 0) {
    const period = peaks[0] + 1;
    const amplitude = Math.max(...data) - Math.min(...data);
    return { period, amplitude };
  }
  
  return undefined;
}

function calculateAutocorrelation(data: number[], lag: number): number {
  const n = data.length;
  const mean1 = mean(data.slice(0, n - lag));
  const mean2 = mean(data.slice(lag));
  
  let num = 0;
  let den1 = 0;
  let den2 = 0;
  
  for (let i = 0; i < n - lag; i++) {
    const diff1 = data[i] - mean1;
    const diff2 = data[i + lag] - mean2;
    num += diff1 * diff2;
    den1 += diff1 * diff1;
    den2 += diff2 * diff2;
  }
  
  return num / Math.sqrt(den1 * den2);
}

function findPeaks(data: number[]): number[] {
  const peaks: number[] = [];
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
      peaks.push(i);
    }
  }
  return peaks;
}

function detectChangePoints(data: number[], threshold: number = 2): number[] {
  // Simplified change point detection using CUSUM
  const changePoints: number[] = [];
  const windowSize = Math.max(10, Math.floor(data.length / 10));
  
  for (let i = windowSize; i < data.length - windowSize; i++) {
    const before = data.slice(i - windowSize, i);
    const after = data.slice(i, i + windowSize);
    
    const meanBefore = mean(before);
    const meanAfter = mean(after);
    const stdBefore = standardDeviation(before);
    
    if (Math.abs(meanAfter - meanBefore) > threshold * stdBefore) {
      changePoints.push(i);
    }
  }
  
  return changePoints;
}

function calculateSeasonalComponent(data: number[], period: number): number[] {
  const seasonal: number[] = [];
  for (let i = 0; i < period; i++) {
    const values: number[] = [];
    for (let j = i; j < data.length; j += period) {
      values.push(data[j]);
    }
    seasonal.push(mean(values));
  }
  
  // Normalize seasonal component
  const seasonalMean = mean(seasonal);
  return seasonal.map(v => v - seasonalMean);
}

function calculateTrendStrength(data: number[], trend: number[]): number {
  const validTrend = trend.filter(v => v !== null);
  if (validTrend.length === 0) return 0;
  
  const variance = standardDeviation(data) ** 2;
  const trendVariance = standardDeviation(validTrend) ** 2;
  
  return Math.min(trendVariance / variance, 1);
}

function calculateSeasonalStrength(data: number[], seasonal: number[]): number {
  if (seasonal.length === 0) return 0;
  
  const variance = standardDeviation(data) ** 2;
  const seasonalVariance = standardDeviation(seasonal) ** 2;
  
  return Math.min(seasonalVariance / variance, 1);
}

function medianAbsoluteDeviation(data: number[]): number {
  const medianVal = median(data);
  const deviations = data.map(v => Math.abs(v - medianVal));
  return median(deviations);
}

function formatDateByCohort(date: Date, periodType: 'day' | 'week' | 'month'): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  switch (periodType) {
    case 'day':
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    case 'week':
      const week = Math.floor(day / 7) + 1;
      return `${year}-W${String(week).padStart(2, '0')}`;
    case 'month':
      return `${year}-${String(month + 1).padStart(2, '0')}`;
  }
}

function addPeriods(date: Date, periods: number, periodType: 'day' | 'week' | 'month'): Date {
  const result = new Date(date);
  switch (periodType) {
    case 'day':
      result.setDate(result.getDate() + periods);
      break;
    case 'week':
      result.setDate(result.getDate() + periods * 7);
      break;
    case 'month':
      result.setMonth(result.getMonth() + periods);
      break;
  }
  return result;
}

// ============= EXPORT ALL FUNCTIONS =============
export const dataAnalysisTools = {
  detectOutliersIQR,
  detectOutliersZScore,
  detectOutliersIsolationForest,
  analyzeTrend,
  calculateCorrelationMatrix,
  decomposeTimeSeries,
  detectAnomalies,
  analyzeCohorts,
  analyzeFunnel,
  // Helper functions
  mean,
  median,
  standardDeviation,
  quantile,
  linearRegression,
  pearsonCorrelation,
  movingAverage
};