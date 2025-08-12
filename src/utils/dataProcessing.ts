import { ChartData, SeriesData } from '../types/chart';

// Data Processing Types
export interface DataProcessingOptions {
  method: DataProcessingMethod;
  params?: any;
}

export type DataProcessingMethod =
  | 'normalize'
  | 'standardize'
  | 'logarithmic'
  | 'exponential'
  | 'movingAverage'
  | 'exponentialSmoothing'
  | 'differencing'
  | 'cumulative'
  | 'percentChange'
  | 'zScore'
  | 'minMaxScale'
  | 'robustScale'
  | 'boxCox'
  | 'yeoJohnson';

// Statistical Analysis Types
export interface StatisticalAnalysis {
  mean: number;
  median: number;
  mode: number;
  variance: number;
  standardDeviation: number;
  skewness: number;
  kurtosis: number;
  min: number;
  max: number;
  range: number;
  quartiles: [number, number, number];
  iqr: number;
  outliers: number[];
  cv: number; // Coefficient of variation
}

// Time Series Analysis
export interface TimeSeriesAnalysis {
  trend: number[];
  seasonal: number[];
  residual: number[];
  autocorrelation: number[];
  partialAutocorrelation: number[];
  stationarity: boolean;
  seasonalPeriod?: number;
}

// Forecasting Models
export interface ForecastResult {
  forecast: number[];
  confidence: {
    lower: number[];
    upper: number[];
  };
  mape: number; // Mean Absolute Percentage Error
  rmse: number; // Root Mean Square Error
}

// Data Transformation Functions

/**
 * Normalize data to [0, 1] range
 */
export function normalizeData(data: number[]): number[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  if (range === 0) return data.map(() => 0.5);
  
  return data.map(value => (value - min) / range);
}

/**
 * Standardize data (z-score normalization)
 */
export function standardizeData(data: number[]): number[] {
  const mean = calculateMean(data);
  const stdDev = calculateStandardDeviation(data);
  
  if (stdDev === 0) return data.map(() => 0);
  
  return data.map(value => (value - mean) / stdDev);
}

/**
 * Apply logarithmic transformation
 */
export function logarithmicTransform(data: number[], base: number = Math.E): number[] {
  return data.map(value => {
    if (value <= 0) return 0;
    return Math.log(value) / Math.log(base);
  });
}

/**
 * Apply exponential transformation
 */
export function exponentialTransform(data: number[], base: number = Math.E): number[] {
  return data.map(value => Math.pow(base, value));
}

/**
 * Calculate moving average
 */
export function movingAverage(data: number[], window: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(data[i]);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
  }
  
  return result;
}

/**
 * Apply exponential smoothing
 */
export function exponentialSmoothing(data: number[], alpha: number = 0.3): number[] {
  const result: number[] = [data[0]];
  
  for (let i = 1; i < data.length; i++) {
    result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
  }
  
  return result;
}

/**
 * Calculate differences (for time series)
 */
export function differencing(data: number[], lag: number = 1): number[] {
  const result: number[] = [];
  
  for (let i = lag; i < data.length; i++) {
    result.push(data[i] - data[i - lag]);
  }
  
  return result;
}

/**
 * Calculate cumulative sum
 */
export function cumulativeSum(data: number[]): number[] {
  const result: number[] = [];
  let sum = 0;
  
  for (const value of data) {
    sum += value;
    result.push(sum);
  }
  
  return result;
}

/**
 * Calculate percent change
 */
export function percentChange(data: number[]): number[] {
  const result: number[] = [0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i - 1] === 0) {
      result.push(0);
    } else {
      result.push(((data[i] - data[i - 1]) / data[i - 1]) * 100);
    }
  }
  
  return result;
}

/**
 * Apply Box-Cox transformation
 */
export function boxCoxTransform(data: number[], lambda: number = 0): number[] {
  return data.map(value => {
    if (value <= 0) return 0;
    
    if (lambda === 0) {
      return Math.log(value);
    } else {
      return (Math.pow(value, lambda) - 1) / lambda;
    }
  });
}

/**
 * Apply Yeo-Johnson transformation
 */
export function yeoJohnsonTransform(data: number[], lambda: number = 0): number[] {
  return data.map(value => {
    if (value >= 0) {
      if (lambda === 0) {
        return Math.log(value + 1);
      } else {
        return (Math.pow(value + 1, lambda) - 1) / lambda;
      }
    } else {
      if (lambda === 2) {
        return -Math.log(-value + 1);
      } else {
        return -(Math.pow(-value + 1, 2 - lambda) - 1) / (2 - lambda);
      }
    }
  });
}

// Statistical Analysis Functions

/**
 * Perform comprehensive statistical analysis
 */
export function performStatisticalAnalysis(data: number[]): StatisticalAnalysis {
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  
  const mean = calculateMean(data);
  const median = calculateMedian(sorted);
  const mode = calculateMode(data);
  const variance = calculateVariance(data, mean);
  const standardDeviation = Math.sqrt(variance);
  const skewness = calculateSkewness(data, mean, standardDeviation);
  const kurtosis = calculateKurtosis(data, mean, standardDeviation);
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;
  const quartiles = calculateQuartiles(sorted);
  const iqr = quartiles[2] - quartiles[0];
  const outliers = detectOutliers(data, quartiles[0], quartiles[2]);
  const cv = standardDeviation / mean;
  
  return {
    mean,
    median,
    mode,
    variance,
    standardDeviation,
    skewness,
    kurtosis,
    min,
    max,
    range,
    quartiles,
    iqr,
    outliers,
    cv
  };
}

/**
 * Calculate mean
 */
export function calculateMean(data: number[]): number {
  return data.reduce((a, b) => a + b, 0) / data.length;
}

/**
 * Calculate median
 */
export function calculateMedian(sortedData: number[]): number {
  const n = sortedData.length;
  if (n % 2 === 0) {
    return (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
  } else {
    return sortedData[Math.floor(n / 2)];
  }
}

/**
 * Calculate mode
 */
export function calculateMode(data: number[]): number {
  const frequency: { [key: number]: number } = {};
  let maxFreq = 0;
  let mode = data[0];
  
  for (const value of data) {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value];
      mode = value;
    }
  }
  
  return mode;
}

/**
 * Calculate variance
 */
export function calculateVariance(data: number[], mean?: number): number {
  const m = mean || calculateMean(data);
  return data.reduce((sum, value) => sum + Math.pow(value - m, 2), 0) / data.length;
}

/**
 * Calculate standard deviation
 */
export function calculateStandardDeviation(data: number[]): number {
  return Math.sqrt(calculateVariance(data));
}

/**
 * Calculate skewness
 */
export function calculateSkewness(data: number[], mean: number, stdDev: number): number {
  const n = data.length;
  const sum = data.reduce((acc, value) => acc + Math.pow((value - mean) / stdDev, 3), 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}

/**
 * Calculate kurtosis
 */
export function calculateKurtosis(data: number[], mean: number, stdDev: number): number {
  const n = data.length;
  const sum = data.reduce((acc, value) => acc + Math.pow((value - mean) / stdDev, 4), 0);
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - 
         (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
}

/**
 * Calculate quartiles
 */
export function calculateQuartiles(sortedData: number[]): [number, number, number] {
  const n = sortedData.length;
  const q1Index = Math.floor(n * 0.25);
  const q2Index = Math.floor(n * 0.5);
  const q3Index = Math.floor(n * 0.75);
  
  return [sortedData[q1Index], sortedData[q2Index], sortedData[q3Index]];
}

/**
 * Detect outliers using IQR method
 */
export function detectOutliers(data: number[], q1: number, q3: number): number[] {
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return data.filter(value => value < lowerBound || value > upperBound);
}

// Time Series Analysis Functions

/**
 * Decompose time series into trend, seasonal, and residual components
 */
export function decomposeTimeSeries(data: number[], period: number = 12): TimeSeriesAnalysis {
  const n = data.length;
  
  // Calculate trend using moving average
  const trend = movingAverage(data, period);
  
  // Calculate detrended series
  const detrended = data.map((value, i) => value - trend[i]);
  
  // Calculate seasonal component
  const seasonal: number[] = [];
  for (let i = 0; i < period; i++) {
    const seasonalValues = [];
    for (let j = i; j < n; j += period) {
      seasonalValues.push(detrended[j]);
    }
    const avgSeasonal = calculateMean(seasonalValues.filter(v => !isNaN(v)));
    seasonal.push(avgSeasonal);
  }
  
  // Extend seasonal pattern to match data length
  const fullSeasonal: number[] = [];
  for (let i = 0; i < n; i++) {
    fullSeasonal.push(seasonal[i % period]);
  }
  
  // Calculate residual
  const residual = data.map((value, i) => value - trend[i] - fullSeasonal[i]);
  
  // Calculate autocorrelation
  const autocorrelation = calculateAutocorrelation(data);
  
  // Calculate partial autocorrelation
  const partialAutocorrelation = calculatePartialAutocorrelation(data);
  
  // Test for stationarity (simplified)
  const stationarity = testStationarity(data);
  
  return {
    trend,
    seasonal: fullSeasonal,
    residual,
    autocorrelation,
    partialAutocorrelation,
    stationarity,
    seasonalPeriod: period
  };
}

/**
 * Calculate autocorrelation function
 */
export function calculateAutocorrelation(data: number[], maxLag: number = 20): number[] {
  const n = data.length;
  const mean = calculateMean(data);
  const variance = calculateVariance(data, mean);
  const acf: number[] = [];
  
  for (let lag = 0; lag <= Math.min(maxLag, n - 1); lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) {
      sum += (data[i] - mean) * (data[i + lag] - mean);
    }
    acf.push(sum / (n * variance));
  }
  
  return acf;
}

/**
 * Calculate partial autocorrelation function
 */
export function calculatePartialAutocorrelation(data: number[], maxLag: number = 20): number[] {
  const pacf: number[] = [1];
  const acf = calculateAutocorrelation(data, maxLag);
  
  for (let k = 1; k <= maxLag; k++) {
    // Yule-Walker equations (simplified implementation)
    let numerator = acf[k];
    for (let j = 1; j < k; j++) {
      numerator -= pacf[j] * acf[k - j];
    }
    
    let denominator = 1;
    for (let j = 1; j < k; j++) {
      denominator -= pacf[j] * acf[j];
    }
    
    pacf.push(numerator / denominator);
  }
  
  return pacf;
}

/**
 * Test for stationarity (simplified Augmented Dickey-Fuller test)
 */
export function testStationarity(data: number[]): boolean {
  // Simplified stationarity test based on variance stability
  const halfLength = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, halfLength);
  const secondHalf = data.slice(halfLength);
  
  const var1 = calculateVariance(firstHalf);
  const var2 = calculateVariance(secondHalf);
  
  // If variance ratio is close to 1, consider stationary
  const varianceRatio = var1 / var2;
  return varianceRatio > 0.5 && varianceRatio < 2;
}

// Forecasting Functions

/**
 * Simple exponential smoothing forecast
 */
export function exponentialSmoothingForecast(
  data: number[],
  periods: number,
  alpha: number = 0.3
): ForecastResult {
  const smoothed = exponentialSmoothing(data, alpha);
  const lastValue = smoothed[smoothed.length - 1];
  
  // Generate forecast
  const forecast: number[] = [];
  for (let i = 0; i < periods; i++) {
    forecast.push(lastValue);
  }
  
  // Calculate confidence intervals (simplified)
  const residuals = data.map((value, i) => value - smoothed[i]);
  const rmse = Math.sqrt(calculateMean(residuals.map(r => r * r)));
  
  const confidence = {
    lower: forecast.map(f => f - 1.96 * rmse),
    upper: forecast.map(f => f + 1.96 * rmse)
  };
  
  // Calculate error metrics
  const mape = calculateMAPE(data.slice(-periods), forecast.slice(0, Math.min(periods, data.length)));
  
  return {
    forecast,
    confidence,
    mape,
    rmse
  };
}

/**
 * Holt-Winters forecast (with trend and seasonality)
 */
export function holtWintersForecast(
  data: number[],
  periods: number,
  seasonalPeriod: number = 12,
  alpha: number = 0.3,
  beta: number = 0.1,
  gamma: number = 0.1
): ForecastResult {
  const n = data.length;
  
  // Initialize components
  let level = data[0];
  let trend = (data[1] - data[0]) / seasonalPeriod;
  const seasonal: number[] = [];
  
  // Initialize seasonal factors
  for (let i = 0; i < seasonalPeriod; i++) {
    seasonal.push(data[i] / level);
  }
  
  const forecast: number[] = [];
  const fitted: number[] = [];
  
  // Fit model
  for (let i = 0; i < n; i++) {
    const prevLevel = level;
    const prevTrend = trend;
    const seasonalIndex = i % seasonalPeriod;
    
    if (i >= seasonalPeriod) {
      level = alpha * (data[i] / seasonal[seasonalIndex]) + 
              (1 - alpha) * (prevLevel + prevTrend);
      trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
      seasonal[seasonalIndex] = gamma * (data[i] / level) + 
                                (1 - gamma) * seasonal[seasonalIndex];
    }
    
    fitted.push((level + trend) * seasonal[seasonalIndex]);
  }
  
  // Generate forecast
  for (let i = 0; i < periods; i++) {
    const seasonalIndex = (n + i) % seasonalPeriod;
    forecast.push((level + trend * (i + 1)) * seasonal[seasonalIndex]);
  }
  
  // Calculate confidence intervals
  const residuals = data.map((value, i) => value - fitted[i]);
  const rmse = Math.sqrt(calculateMean(residuals.map(r => r * r)));
  
  const confidence = {
    lower: forecast.map((f, i) => f - 1.96 * rmse * Math.sqrt(i + 1)),
    upper: forecast.map((f, i) => f + 1.96 * rmse * Math.sqrt(i + 1))
  };
  
  const mape = calculateMAPE(data.slice(-Math.min(periods, n)), fitted.slice(-Math.min(periods, n)));
  
  return {
    forecast,
    confidence,
    mape,
    rmse
  };
}

/**
 * ARIMA forecast (simplified AR model)
 */
export function arimaForecast(
  data: number[],
  periods: number,
  p: number = 1, // AR order
  d: number = 0, // Differencing order
  q: number = 0  // MA order (simplified, not fully implemented)
): ForecastResult {
  // Apply differencing if needed
  let workingData = [...data];
  for (let i = 0; i < d; i++) {
    workingData = differencing(workingData);
  }
  
  // Fit AR model (simplified)
  const n = workingData.length;
  const coefficients: number[] = [];
  
  // Estimate AR coefficients using least squares (simplified)
  for (let i = 1; i <= p; i++) {
    const correlation = calculateAutocorrelation(workingData, i)[i];
    coefficients.push(correlation * 0.9); // Simplified coefficient estimation
  }
  
  // Generate forecast
  const forecast: number[] = [];
  const extended = [...workingData];
  
  for (let i = 0; i < periods; i++) {
    let nextValue = 0;
    for (let j = 0; j < p; j++) {
      const index = extended.length - 1 - j;
      if (index >= 0) {
        nextValue += coefficients[j] * extended[index];
      }
    }
    extended.push(nextValue);
    forecast.push(nextValue);
  }
  
  // Reverse differencing
  let finalForecast = forecast;
  for (let i = 0; i < d; i++) {
    const lastOriginal = data[data.length - 1];
    finalForecast = finalForecast.map((value, index) => {
      if (index === 0) return lastOriginal + value;
      return finalForecast[index - 1] + value;
    });
  }
  
  // Calculate confidence intervals
  const residuals = workingData.slice(p).map((value, i) => {
    let predicted = 0;
    for (let j = 0; j < p; j++) {
      predicted += coefficients[j] * workingData[i + p - 1 - j];
    }
    return value - predicted;
  });
  
  const rmse = Math.sqrt(calculateMean(residuals.map(r => r * r)));
  
  const confidence = {
    lower: finalForecast.map((f, i) => f - 1.96 * rmse * Math.sqrt(i + 1)),
    upper: finalForecast.map((f, i) => f + 1.96 * rmse * Math.sqrt(i + 1))
  };
  
  const mape = 0; // Simplified, would need actual vs predicted for proper calculation
  
  return {
    forecast: finalForecast,
    confidence,
    mape,
    rmse
  };
}

/**
 * Calculate Mean Absolute Percentage Error
 */
function calculateMAPE(actual: number[], predicted: number[]): number {
  const n = Math.min(actual.length, predicted.length);
  let sum = 0;
  
  for (let i = 0; i < n; i++) {
    if (actual[i] !== 0) {
      sum += Math.abs((actual[i] - predicted[i]) / actual[i]);
    }
  }
  
  return (sum / n) * 100;
}

// Data Aggregation Functions

/**
 * Aggregate data by time period
 */
export function aggregateByPeriod(
  data: number[],
  timestamps: Date[],
  period: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year',
  aggregation: 'sum' | 'mean' | 'median' | 'min' | 'max' = 'sum'
): { dates: Date[], values: number[] } {
  const grouped: { [key: string]: number[] } = {};
  
  timestamps.forEach((date, index) => {
    const key = getDateKey(date, period);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(data[index]);
  });
  
  const dates: Date[] = [];
  const values: number[] = [];
  
  Object.keys(grouped).forEach(key => {
    dates.push(new Date(key));
    
    switch (aggregation) {
      case 'sum':
        values.push(grouped[key].reduce((a, b) => a + b, 0));
        break;
      case 'mean':
        values.push(calculateMean(grouped[key]));
        break;
      case 'median':
        values.push(calculateMedian([...grouped[key]].sort((a, b) => a - b)));
        break;
      case 'min':
        values.push(Math.min(...grouped[key]));
        break;
      case 'max':
        values.push(Math.max(...grouped[key]));
        break;
    }
  });
  
  return { dates, values };
}

/**
 * Get date key for grouping
 */
function getDateKey(date: Date, period: string): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  
  switch (period) {
    case 'hour':
      return `${year}-${month}-${day}-${hour}`;
    case 'day':
      return `${year}-${month}-${day}`;
    case 'week':
      const week = Math.floor(day / 7);
      return `${year}-${month}-W${week}`;
    case 'month':
      return `${year}-${month}`;
    case 'quarter':
      const quarter = Math.floor(month / 3);
      return `${year}-Q${quarter}`;
    case 'year':
      return `${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

// Data Cleaning Functions

/**
 * Handle missing values
 */
export function handleMissingValues(
  data: (number | null | undefined)[],
  method: 'remove' | 'mean' | 'median' | 'forward' | 'backward' | 'interpolate' = 'mean'
): number[] {
  const validData = data.filter(v => v !== null && v !== undefined) as number[];
  
  switch (method) {
    case 'remove':
      return validData;
      
    case 'mean':
      const mean = calculateMean(validData);
      return data.map(v => (v === null || v === undefined) ? mean : v);
      
    case 'median':
      const median = calculateMedian([...validData].sort((a, b) => a - b));
      return data.map(v => (v === null || v === undefined) ? median : v);
      
    case 'forward':
      let lastValid = validData[0];
      return data.map(v => {
        if (v !== null && v !== undefined) {
          lastValid = v;
          return v;
        }
        return lastValid;
      });
      
    case 'backward':
      const reversed = [...data].reverse();
      let lastValidReverse = validData[validData.length - 1];
      const filledReverse = reversed.map(v => {
        if (v !== null && v !== undefined) {
          lastValidReverse = v;
          return v;
        }
        return lastValidReverse;
      });
      return filledReverse.reverse();
      
    case 'interpolate':
      const result: number[] = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== null && data[i] !== undefined) {
          result.push(data[i] as number);
        } else {
          // Find nearest valid values
          let prevValid = null;
          let nextValid = null;
          let prevIndex = -1;
          let nextIndex = -1;
          
          for (let j = i - 1; j >= 0; j--) {
            if (data[j] !== null && data[j] !== undefined) {
              prevValid = data[j] as number;
              prevIndex = j;
              break;
            }
          }
          
          for (let j = i + 1; j < data.length; j++) {
            if (data[j] !== null && data[j] !== undefined) {
              nextValid = data[j] as number;
              nextIndex = j;
              break;
            }
          }
          
          if (prevValid !== null && nextValid !== null) {
            // Linear interpolation
            const ratio = (i - prevIndex) / (nextIndex - prevIndex);
            result.push(prevValid + ratio * (nextValid - prevValid));
          } else if (prevValid !== null) {
            result.push(prevValid);
          } else if (nextValid !== null) {
            result.push(nextValid);
          } else {
            result.push(0);
          }
        }
      }
      return result;
      
    default:
      return validData;
  }
}

/**
 * Remove outliers from data
 */
export function removeOutliers(data: number[], method: 'iqr' | 'zscore' = 'iqr', threshold: number = 1.5): number[] {
  if (method === 'iqr') {
    const sorted = [...data].sort((a, b) => a - b);
    const quartiles = calculateQuartiles(sorted);
    const iqr = quartiles[2] - quartiles[0];
    const lowerBound = quartiles[0] - threshold * iqr;
    const upperBound = quartiles[2] + threshold * iqr;
    
    return data.filter(value => value >= lowerBound && value <= upperBound);
  } else {
    // Z-score method
    const mean = calculateMean(data);
    const stdDev = calculateStandardDeviation(data);
    
    return data.filter(value => {
      const zScore = Math.abs((value - mean) / stdDev);
      return zScore <= threshold;
    });
  }
}

// Data Generation Functions

/**
 * Generate synthetic time series data
 */
export function generateSyntheticTimeSeries(
  length: number,
  options: {
    trend?: 'linear' | 'exponential' | 'logarithmic' | 'none';
    seasonality?: number;
    noise?: number;
    startValue?: number;
  } = {}
): number[] {
  const {
    trend = 'linear',
    seasonality = 0,
    noise = 0.1,
    startValue = 100
  } = options;
  
  const data: number[] = [];
  
  for (let i = 0; i < length; i++) {
    let value = startValue;
    
    // Add trend
    switch (trend) {
      case 'linear':
        value += i * 0.5;
        break;
      case 'exponential':
        value *= Math.pow(1.01, i);
        break;
      case 'logarithmic':
        value += Math.log(i + 1) * 10;
        break;
    }
    
    // Add seasonality
    if (seasonality > 0) {
      value += Math.sin(2 * Math.PI * i / seasonality) * 10;
    }
    
    // Add noise
    value += (Math.random() - 0.5) * noise * value;
    
    data.push(value);
  }
  
  return data;
}

// Export main data processing function
export function processChartData(
  data: ChartData,
  processing: DataProcessingOptions[]
): ChartData {
  const processedSeries = data.series.map(series => {
    let processedData = [...series.data];
    
    for (const option of processing) {
      switch (option.method) {
        case 'normalize':
          processedData = normalizeData(processedData);
          break;
        case 'standardize':
          processedData = standardizeData(processedData);
          break;
        case 'logarithmic':
          processedData = logarithmicTransform(processedData, option.params?.base);
          break;
        case 'exponential':
          processedData = exponentialTransform(processedData, option.params?.base);
          break;
        case 'movingAverage':
          processedData = movingAverage(processedData, option.params?.window || 3);
          break;
        case 'exponentialSmoothing':
          processedData = exponentialSmoothing(processedData, option.params?.alpha || 0.3);
          break;
        case 'differencing':
          processedData = differencing(processedData, option.params?.lag || 1);
          break;
        case 'cumulative':
          processedData = cumulativeSum(processedData);
          break;
        case 'percentChange':
          processedData = percentChange(processedData);
          break;
        case 'boxCox':
          processedData = boxCoxTransform(processedData, option.params?.lambda || 0);
          break;
        case 'yeoJohnson':
          processedData = yeoJohnsonTransform(processedData, option.params?.lambda || 0);
          break;
      }
    }
    
    return {
      ...series,
      data: processedData
    };
  });
  
  return {
    ...data,
    series: processedSeries
  };
}