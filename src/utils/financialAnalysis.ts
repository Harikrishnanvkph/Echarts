import * as echarts from 'echarts';

// Financial Analysis Tools

// ============== Types and Interfaces ==============
export interface PriceData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;
}

export interface TechnicalIndicator {
  name: string;
  values: number[];
  signals?: Signal[];
  parameters: Record<string, any>;
}

export interface Signal {
  date: Date;
  type: 'buy' | 'sell' | 'hold';
  strength: number;
  indicator: string;
  price: number;
}

export interface PortfolioAsset {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  weight: number;
  sector?: string;
  assetClass?: string;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
  treynorRatio: number;
  calmarRatio: number;
  informationRatio: number;
  var95: number;
  cvar95: number;
}

export interface BacktestResult {
  strategy: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  finalValue: number;
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  trades: Trade[];
  equityCurve: number[];
}

export interface Trade {
  entryDate: Date;
  exitDate: Date;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  type: 'long' | 'short';
  profit: number;
  returnPercent: number;
}

// ============== Technical Indicators ==============
export class TechnicalAnalysis {
  
  // Simple Moving Average
  static sma(prices: number[], period: number): number[] {
    const sma: number[] = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        sma.push(NaN);
      } else {
        const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
      }
    }
    
    return sma;
  }
  
  // Exponential Moving Average
  static ema(prices: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // Start with SMA for first value
    const firstSMA = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    ema.push(firstSMA);
    
    for (let i = period; i < prices.length; i++) {
      const currentEMA = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
      ema.push(currentEMA);
    }
    
    // Pad beginning with NaN
    return new Array(period - 1).fill(NaN).concat(ema);
  }
  
  // Weighted Moving Average
  static wma(prices: number[], period: number): number[] {
    const wma: number[] = [];
    const weights = Array.from({ length: period }, (_, i) => i + 1);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        wma.push(NaN);
      } else {
        const windowPrices = prices.slice(i - period + 1, i + 1);
        const weightedSum = windowPrices.reduce((sum, price, idx) => 
          sum + price * weights[idx], 0
        );
        wma.push(weightedSum / weightSum);
      }
    }
    
    return wma;
  }
  
  // Bollinger Bands
  static bollingerBands(prices: number[], period: number = 20, stdDev: number = 2): {
    upper: number[];
    middle: number[];
    lower: number[];
  } {
    const middle = this.sma(prices, period);
    const upper: number[] = [];
    const lower: number[] = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        upper.push(NaN);
        lower.push(NaN);
      } else {
        const windowPrices = prices.slice(i - period + 1, i + 1);
        const mean = middle[i];
        const variance = windowPrices.reduce((sum, price) => 
          sum + Math.pow(price - mean, 2), 0
        ) / period;
        const std = Math.sqrt(variance);
        
        upper.push(mean + stdDev * std);
        lower.push(mean - stdDev * std);
      }
    }
    
    return { upper, middle, lower };
  }
  
  // Relative Strength Index (RSI)
  static rsi(prices: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];
    
    // Calculate price changes
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }
    
    // Calculate initial average gain and loss
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    // Calculate RSI
    for (let i = 0; i < prices.length; i++) {
      if (i < period) {
        rsi.push(NaN);
      } else if (i === period) {
        const rs = avgGain / (avgLoss || 0.0001);
        rsi.push(100 - (100 / (1 + rs)));
      } else {
        avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
        const rs = avgGain / (avgLoss || 0.0001);
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  }
  
  // MACD (Moving Average Convergence Divergence)
  static macd(
    prices: number[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
  ): {
    macd: number[];
    signal: number[];
    histogram: number[];
  } {
    const emaFast = this.ema(prices, fastPeriod);
    const emaSlow = this.ema(prices, slowPeriod);
    
    const macd: number[] = [];
    for (let i = 0; i < prices.length; i++) {
      if (isNaN(emaFast[i]) || isNaN(emaSlow[i])) {
        macd.push(NaN);
      } else {
        macd.push(emaFast[i] - emaSlow[i]);
      }
    }
    
    // Calculate signal line (EMA of MACD)
    const validMacd = macd.filter(v => !isNaN(v));
    const signalEma = this.ema(validMacd, signalPeriod);
    
    // Align signal with original length
    const signal: number[] = new Array(macd.length - validMacd.length).fill(NaN).concat(signalEma);
    
    // Calculate histogram
    const histogram: number[] = [];
    for (let i = 0; i < macd.length; i++) {
      if (isNaN(macd[i]) || isNaN(signal[i])) {
        histogram.push(NaN);
      } else {
        histogram.push(macd[i] - signal[i]);
      }
    }
    
    return { macd, signal, histogram };
  }
  
  // Stochastic Oscillator
  static stochastic(
    high: number[],
    low: number[],
    close: number[],
    kPeriod: number = 14,
    dPeriod: number = 3
  ): {
    k: number[];
    d: number[];
  } {
    const k: number[] = [];
    
    for (let i = 0; i < close.length; i++) {
      if (i < kPeriod - 1) {
        k.push(NaN);
      } else {
        const windowHigh = high.slice(i - kPeriod + 1, i + 1);
        const windowLow = low.slice(i - kPeriod + 1, i + 1);
        const highestHigh = Math.max(...windowHigh);
        const lowestLow = Math.min(...windowLow);
        
        const currentK = ((close[i] - lowestLow) / (highestHigh - lowestLow || 0.0001)) * 100;
        k.push(currentK);
      }
    }
    
    // Calculate %D (SMA of %K)
    const d = this.sma(k.filter(v => !isNaN(v)), dPeriod);
    const alignedD = new Array(k.length - d.length).fill(NaN).concat(d);
    
    return { k, d: alignedD };
  }
  
  // Average True Range (ATR)
  static atr(high: number[], low: number[], close: number[], period: number = 14): number[] {
    const tr: number[] = [];
    
    // Calculate True Range
    for (let i = 0; i < high.length; i++) {
      if (i === 0) {
        tr.push(high[i] - low[i]);
      } else {
        const highLow = high[i] - low[i];
        const highClose = Math.abs(high[i] - close[i - 1]);
        const lowClose = Math.abs(low[i] - close[i - 1]);
        tr.push(Math.max(highLow, highClose, lowClose));
      }
    }
    
    // Calculate ATR (EMA of TR)
    return this.ema(tr, period);
  }
  
  // Commodity Channel Index (CCI)
  static cci(high: number[], low: number[], close: number[], period: number = 20): number[] {
    const cci: number[] = [];
    const typicalPrices: number[] = [];
    
    // Calculate typical price
    for (let i = 0; i < high.length; i++) {
      typicalPrices.push((high[i] + low[i] + close[i]) / 3);
    }
    
    const sma = this.sma(typicalPrices, period);
    
    for (let i = 0; i < typicalPrices.length; i++) {
      if (i < period - 1) {
        cci.push(NaN);
      } else {
        const windowPrices = typicalPrices.slice(i - period + 1, i + 1);
        const mean = sma[i];
        const meanDeviation = windowPrices.reduce((sum, price) => 
          sum + Math.abs(price - mean), 0
        ) / period;
        
        cci.push((typicalPrices[i] - mean) / (0.015 * meanDeviation || 0.0001));
      }
    }
    
    return cci;
  }
  
  // Williams %R
  static williamsR(high: number[], low: number[], close: number[], period: number = 14): number[] {
    const wr: number[] = [];
    
    for (let i = 0; i < close.length; i++) {
      if (i < period - 1) {
        wr.push(NaN);
      } else {
        const windowHigh = high.slice(i - period + 1, i + 1);
        const windowLow = low.slice(i - period + 1, i + 1);
        const highestHigh = Math.max(...windowHigh);
        const lowestLow = Math.min(...windowLow);
        
        wr.push(((highestHigh - close[i]) / (highestHigh - lowestLow || 0.0001)) * -100);
      }
    }
    
    return wr;
  }
  
  // On-Balance Volume (OBV)
  static obv(close: number[], volume: number[]): number[] {
    const obv: number[] = [volume[0]];
    
    for (let i = 1; i < close.length; i++) {
      if (close[i] > close[i - 1]) {
        obv.push(obv[obv.length - 1] + volume[i]);
      } else if (close[i] < close[i - 1]) {
        obv.push(obv[obv.length - 1] - volume[i]);
      } else {
        obv.push(obv[obv.length - 1]);
      }
    }
    
    return obv;
  }
  
  // Accumulation/Distribution Line
  static adl(high: number[], low: number[], close: number[], volume: number[]): number[] {
    const adl: number[] = [];
    let cumulativeAdl = 0;
    
    for (let i = 0; i < close.length; i++) {
      const mfm = ((close[i] - low[i]) - (high[i] - close[i])) / (high[i] - low[i] || 0.0001);
      const mfv = mfm * volume[i];
      cumulativeAdl += mfv;
      adl.push(cumulativeAdl);
    }
    
    return adl;
  }
  
  // Money Flow Index (MFI)
  static mfi(
    high: number[],
    low: number[],
    close: number[],
    volume: number[],
    period: number = 14
  ): number[] {
    const mfi: number[] = [];
    const typicalPrices: number[] = [];
    const moneyFlow: number[] = [];
    
    // Calculate typical price and money flow
    for (let i = 0; i < high.length; i++) {
      const tp = (high[i] + low[i] + close[i]) / 3;
      typicalPrices.push(tp);
      moneyFlow.push(tp * volume[i]);
    }
    
    for (let i = 0; i < typicalPrices.length; i++) {
      if (i < period) {
        mfi.push(NaN);
      } else {
        let positiveFlow = 0;
        let negativeFlow = 0;
        
        for (let j = i - period + 1; j <= i; j++) {
          if (typicalPrices[j] > typicalPrices[j - 1]) {
            positiveFlow += moneyFlow[j];
          } else if (typicalPrices[j] < typicalPrices[j - 1]) {
            negativeFlow += moneyFlow[j];
          }
        }
        
        const moneyRatio = positiveFlow / (negativeFlow || 0.0001);
        mfi.push(100 - (100 / (1 + moneyRatio)));
      }
    }
    
    return mfi;
  }
  
  // Ichimoku Cloud
  static ichimoku(
    high: number[],
    low: number[],
    close: number[],
    conversionPeriod: number = 9,
    basePeriod: number = 26,
    spanBPeriod: number = 52,
    displacement: number = 26
  ): {
    tenkanSen: number[];
    kijunSen: number[];
    senkouSpanA: number[];
    senkouSpanB: number[];
    chikouSpan: number[];
  } {
    const tenkanSen: number[] = [];
    const kijunSen: number[] = [];
    const senkouSpanA: number[] = [];
    const senkouSpanB: number[] = [];
    
    // Calculate Tenkan-sen (Conversion Line)
    for (let i = 0; i < high.length; i++) {
      if (i < conversionPeriod - 1) {
        tenkanSen.push(NaN);
      } else {
        const windowHigh = high.slice(i - conversionPeriod + 1, i + 1);
        const windowLow = low.slice(i - conversionPeriod + 1, i + 1);
        tenkanSen.push((Math.max(...windowHigh) + Math.min(...windowLow)) / 2);
      }
    }
    
    // Calculate Kijun-sen (Base Line)
    for (let i = 0; i < high.length; i++) {
      if (i < basePeriod - 1) {
        kijunSen.push(NaN);
      } else {
        const windowHigh = high.slice(i - basePeriod + 1, i + 1);
        const windowLow = low.slice(i - basePeriod + 1, i + 1);
        kijunSen.push((Math.max(...windowHigh) + Math.min(...windowLow)) / 2);
      }
    }
    
    // Calculate Senkou Span A (Leading Span A)
    for (let i = 0; i < high.length + displacement; i++) {
      if (i < displacement) {
        senkouSpanA.push(NaN);
      } else {
        const idx = i - displacement;
        if (isNaN(tenkanSen[idx]) || isNaN(kijunSen[idx])) {
          senkouSpanA.push(NaN);
        } else {
          senkouSpanA.push((tenkanSen[idx] + kijunSen[idx]) / 2);
        }
      }
    }
    
    // Calculate Senkou Span B (Leading Span B)
    for (let i = 0; i < high.length + displacement; i++) {
      if (i < displacement + spanBPeriod - 1) {
        senkouSpanB.push(NaN);
      } else {
        const idx = i - displacement;
        const windowHigh = high.slice(Math.max(0, idx - spanBPeriod + 1), idx + 1);
        const windowLow = low.slice(Math.max(0, idx - spanBPeriod + 1), idx + 1);
        senkouSpanB.push((Math.max(...windowHigh) + Math.min(...windowLow)) / 2);
      }
    }
    
    // Calculate Chikou Span (Lagging Span)
    const chikouSpan = new Array(displacement).fill(NaN).concat(close);
    
    return {
      tenkanSen,
      kijunSen,
      senkouSpanA: senkouSpanA.slice(0, high.length),
      senkouSpanB: senkouSpanB.slice(0, high.length),
      chikouSpan: chikouSpan.slice(0, high.length)
    };
  }
  
  // Parabolic SAR
  static parabolicSAR(
    high: number[],
    low: number[],
    accelerationFactor: number = 0.02,
    maxAcceleration: number = 0.2
  ): number[] {
    const sar: number[] = [];
    let isUpTrend = true;
    let af = accelerationFactor;
    let ep = high[0]; // Extreme point
    let sarValue = low[0];
    
    sar.push(sarValue);
    
    for (let i = 1; i < high.length; i++) {
      if (isUpTrend) {
        sarValue = sarValue + af * (ep - sarValue);
        
        if (low[i] <= sarValue) {
          isUpTrend = false;
          sarValue = ep;
          ep = low[i];
          af = accelerationFactor;
        } else {
          if (high[i] > ep) {
            ep = high[i];
            af = Math.min(af + accelerationFactor, maxAcceleration);
          }
          sarValue = Math.min(sarValue, low[i - 1], i > 1 ? low[i - 2] : low[i - 1]);
        }
      } else {
        sarValue = sarValue + af * (ep - sarValue);
        
        if (high[i] >= sarValue) {
          isUpTrend = true;
          sarValue = ep;
          ep = high[i];
          af = accelerationFactor;
        } else {
          if (low[i] < ep) {
            ep = low[i];
            af = Math.min(af + accelerationFactor, maxAcceleration);
          }
          sarValue = Math.max(sarValue, high[i - 1], i > 1 ? high[i - 2] : high[i - 1]);
        }
      }
      
      sar.push(sarValue);
    }
    
    return sar;
  }
  
  // Fibonacci Retracement Levels
  static fibonacciRetracement(high: number, low: number): {
    level0: number;
    level236: number;
    level382: number;
    level500: number;
    level618: number;
    level786: number;
    level1000: number;
  } {
    const diff = high - low;
    
    return {
      level0: high,
      level236: high - diff * 0.236,
      level382: high - diff * 0.382,
      level500: high - diff * 0.500,
      level618: high - diff * 0.618,
      level786: high - diff * 0.786,
      level1000: low
    };
  }
  
  // Pivot Points
  static pivotPoints(high: number, low: number, close: number): {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
  } {
    const pivot = (high + low + close) / 3;
    const r1 = 2 * pivot - low;
    const s1 = 2 * pivot - high;
    const r2 = pivot + (high - low);
    const s2 = pivot - (high - low);
    const r3 = high + 2 * (pivot - low);
    const s3 = low - 2 * (high - pivot);
    
    return { pivot, r1, r2, r3, s1, s2, s3 };
  }
}

// ============== Portfolio Analytics ==============
export class PortfolioAnalytics {
  
  // Calculate portfolio returns
  static calculateReturns(prices: number[][]): number[] {
    const returns: number[] = [];
    
    for (let i = 1; i < prices[0].length; i++) {
      let portfolioReturn = 0;
      for (let j = 0; j < prices.length; j++) {
        portfolioReturn += (prices[j][i] - prices[j][i - 1]) / prices[j][i - 1];
      }
      returns.push(portfolioReturn / prices.length);
    }
    
    return returns;
  }
  
  // Calculate portfolio volatility
  static calculateVolatility(returns: number[], annualizationFactor: number = 252): number {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance * annualizationFactor);
  }
  
  // Calculate Sharpe Ratio
  static sharpeRatio(
    returns: number[],
    riskFreeRate: number = 0.02,
    annualizationFactor: number = 252
  ): number {
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const annualizedReturn = meanReturn * annualizationFactor;
    const volatility = this.calculateVolatility(returns, annualizationFactor);
    
    return (annualizedReturn - riskFreeRate) / volatility;
  }
  
  // Calculate Sortino Ratio
  static sortinoRatio(
    returns: number[],
    targetReturn: number = 0,
    annualizationFactor: number = 252
  ): number {
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const annualizedReturn = meanReturn * annualizationFactor;
    
    // Calculate downside deviation
    const downsideReturns = returns.filter(r => r < targetReturn);
    const downsideVariance = downsideReturns.reduce((sum, r) => 
      sum + Math.pow(r - targetReturn, 2), 0
    ) / returns.length;
    const downsideDeviation = Math.sqrt(downsideVariance * annualizationFactor);
    
    return (annualizedReturn - targetReturn) / downsideDeviation;
  }
  
  // Calculate Maximum Drawdown
  static maxDrawdown(prices: number[]): number {
    let maxDrawdown = 0;
    let peak = prices[0];
    
    for (const price of prices) {
      if (price > peak) {
        peak = price;
      }
      const drawdown = (peak - price) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown;
  }
  
  // Calculate Beta
  static beta(assetReturns: number[], marketReturns: number[]): number {
    const n = assetReturns.length;
    const assetMean = assetReturns.reduce((sum, r) => sum + r, 0) / n;
    const marketMean = marketReturns.reduce((sum, r) => sum + r, 0) / n;
    
    let covariance = 0;
    let marketVariance = 0;
    
    for (let i = 0; i < n; i++) {
      covariance += (assetReturns[i] - assetMean) * (marketReturns[i] - marketMean);
      marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
    }
    
    return covariance / marketVariance;
  }
  
  // Calculate Alpha (Jensen's Alpha)
  static alpha(
    assetReturns: number[],
    marketReturns: number[],
    riskFreeRate: number = 0.02,
    annualizationFactor: number = 252
  ): number {
    const beta = this.beta(assetReturns, marketReturns);
    const assetMean = assetReturns.reduce((sum, r) => sum + r, 0) / assetReturns.length;
    const marketMean = marketReturns.reduce((sum, r) => sum + r, 0) / marketReturns.length;
    
    const annualizedAssetReturn = assetMean * annualizationFactor;
    const annualizedMarketReturn = marketMean * annualizationFactor;
    
    return annualizedAssetReturn - (riskFreeRate + beta * (annualizedMarketReturn - riskFreeRate));
  }
  
  // Calculate Treynor Ratio
  static treynorRatio(
    returns: number[],
    marketReturns: number[],
    riskFreeRate: number = 0.02,
    annualizationFactor: number = 252
  ): number {
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const annualizedReturn = meanReturn * annualizationFactor;
    const beta = this.beta(returns, marketReturns);
    
    return (annualizedReturn - riskFreeRate) / beta;
  }
  
  // Calculate Calmar Ratio
  static calmarRatio(
    returns: number[],
    prices: number[],
    annualizationFactor: number = 252
  ): number {
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const annualizedReturn = meanReturn * annualizationFactor;
    const maxDrawdown = this.maxDrawdown(prices);
    
    return annualizedReturn / maxDrawdown;
  }
  
  // Calculate Information Ratio
  static informationRatio(
    portfolioReturns: number[],
    benchmarkReturns: number[],
    annualizationFactor: number = 252
  ): number {
    const activeReturns = portfolioReturns.map((r, i) => r - benchmarkReturns[i]);
    const meanActiveReturn = activeReturns.reduce((sum, r) => sum + r, 0) / activeReturns.length;
    const annualizedActiveReturn = meanActiveReturn * annualizationFactor;
    
    const trackingError = this.calculateVolatility(activeReturns, annualizationFactor);
    
    return annualizedActiveReturn / trackingError;
  }
  
  // Calculate Value at Risk (VaR)
  static valueAtRisk(returns: number[], confidenceLevel: number = 0.95): number {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
    return -sortedReturns[index];
  }
  
  // Calculate Conditional Value at Risk (CVaR)
  static conditionalValueAtRisk(returns: number[], confidenceLevel: number = 0.95): number {
    const var95 = this.valueAtRisk(returns, confidenceLevel);
    const tailReturns = returns.filter(r => r <= -var95);
    
    if (tailReturns.length === 0) return var95;
    
    return -tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
  }
  
  // Efficient Frontier Calculation
  static efficientFrontier(
    returns: number[][],
    numPortfolios: number = 100
  ): {
    returns: number[];
    risks: number[];
    weights: number[][];
    sharpeRatios: number[];
  } {
    const numAssets = returns.length;
    const portfolioReturns: number[] = [];
    const portfolioRisks: number[] = [];
    const portfolioWeights: number[][] = [];
    const sharpeRatios: number[] = [];
    
    // Calculate mean returns and covariance matrix
    const meanReturns = returns.map(assetReturns => 
      assetReturns.reduce((sum, r) => sum + r, 0) / assetReturns.length
    );
    
    const covMatrix = this.calculateCovarianceMatrix(returns);
    
    // Generate random portfolios
    for (let i = 0; i < numPortfolios; i++) {
      // Generate random weights
      const weights = new Array(numAssets).fill(0).map(() => Math.random());
      const weightSum = weights.reduce((sum, w) => sum + w, 0);
      const normalizedWeights = weights.map(w => w / weightSum);
      
      // Calculate portfolio return
      const portfolioReturn = normalizedWeights.reduce((sum, w, idx) => 
        sum + w * meanReturns[idx], 0
      );
      
      // Calculate portfolio variance
      let portfolioVariance = 0;
      for (let j = 0; j < numAssets; j++) {
        for (let k = 0; k < numAssets; k++) {
          portfolioVariance += normalizedWeights[j] * normalizedWeights[k] * covMatrix[j][k];
        }
      }
      const portfolioRisk = Math.sqrt(portfolioVariance);
      
      // Calculate Sharpe ratio
      const sharpe = (portfolioReturn * 252 - 0.02) / (portfolioRisk * Math.sqrt(252));
      
      portfolioReturns.push(portfolioReturn * 252);
      portfolioRisks.push(portfolioRisk * Math.sqrt(252));
      portfolioWeights.push(normalizedWeights);
      sharpeRatios.push(sharpe);
    }
    
    return {
      returns: portfolioReturns,
      risks: portfolioRisks,
      weights: portfolioWeights,
      sharpeRatios
    };
  }
  
  private static calculateCovarianceMatrix(returns: number[][]): number[][] {
    const numAssets = returns.length;
    const numReturns = returns[0].length;
    const covMatrix: number[][] = [];
    
    // Calculate mean returns
    const meanReturns = returns.map(assetReturns => 
      assetReturns.reduce((sum, r) => sum + r, 0) / numReturns
    );
    
    // Calculate covariance matrix
    for (let i = 0; i < numAssets; i++) {
      covMatrix[i] = [];
      for (let j = 0; j < numAssets; j++) {
        let covariance = 0;
        for (let k = 0; k < numReturns; k++) {
          covariance += (returns[i][k] - meanReturns[i]) * (returns[j][k] - meanReturns[j]);
        }
        covMatrix[i][j] = covariance / (numReturns - 1);
      }
    }
    
    return covMatrix;
  }
  
  // Kelly Criterion
  static kellyCriterion(winProbability: number, winAmount: number, lossAmount: number): number {
    const b = winAmount / lossAmount;
    const p = winProbability;
    const q = 1 - p;
    
    return (p * b - q) / b;
  }
  
  // Position Sizing
  static positionSize(
    accountValue: number,
    riskPercent: number,
    entryPrice: number,
    stopLoss: number
  ): number {
    const riskAmount = accountValue * (riskPercent / 100);
    const riskPerShare = Math.abs(entryPrice - stopLoss);
    
    return Math.floor(riskAmount / riskPerShare);
  }
}

// ============== Backtesting Engine ==============
export class BacktestingEngine {
  private capital: number;
  private position: number = 0;
  private trades: Trade[] = [];
  private equityCurve: number[] = [];
  private currentTrade: Partial<Trade> | null = null;
  
  constructor(initialCapital: number = 10000) {
    this.capital = initialCapital;
    this.equityCurve.push(initialCapital);
  }
  
  // Simple Moving Average Crossover Strategy
  static smaStrategy(
    prices: PriceData[],
    shortPeriod: number = 50,
    longPeriod: number = 200
  ): Signal[] {
    const closes = prices.map(p => p.close);
    const shortSMA = TechnicalAnalysis.sma(closes, shortPeriod);
    const longSMA = TechnicalAnalysis.sma(closes, longPeriod);
    
    const signals: Signal[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      if (isNaN(shortSMA[i]) || isNaN(longSMA[i])) continue;
      
      const prevShortAboveLong = shortSMA[i - 1] > longSMA[i - 1];
      const currentShortAboveLong = shortSMA[i] > longSMA[i];
      
      if (!prevShortAboveLong && currentShortAboveLong) {
        signals.push({
          date: prices[i].date,
          type: 'buy',
          strength: Math.abs(shortSMA[i] - longSMA[i]) / longSMA[i],
          indicator: 'SMA Crossover',
          price: prices[i].close
        });
      } else if (prevShortAboveLong && !currentShortAboveLong) {
        signals.push({
          date: prices[i].date,
          type: 'sell',
          strength: Math.abs(shortSMA[i] - longSMA[i]) / longSMA[i],
          indicator: 'SMA Crossover',
          price: prices[i].close
        });
      }
    }
    
    return signals;
  }
  
  // RSI Strategy
  static rsiStrategy(
    prices: PriceData[],
    period: number = 14,
    oversoldLevel: number = 30,
    overboughtLevel: number = 70
  ): Signal[] {
    const closes = prices.map(p => p.close);
    const rsi = TechnicalAnalysis.rsi(closes, period);
    
    const signals: Signal[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      if (isNaN(rsi[i]) || isNaN(rsi[i - 1])) continue;
      
      if (rsi[i - 1] <= oversoldLevel && rsi[i] > oversoldLevel) {
        signals.push({
          date: prices[i].date,
          type: 'buy',
          strength: (rsi[i] - oversoldLevel) / oversoldLevel,
          indicator: 'RSI',
          price: prices[i].close
        });
      } else if (rsi[i - 1] >= overboughtLevel && rsi[i] < overboughtLevel) {
        signals.push({
          date: prices[i].date,
          type: 'sell',
          strength: (overboughtLevel - rsi[i]) / (100 - overboughtLevel),
          indicator: 'RSI',
          price: prices[i].close
        });
      }
    }
    
    return signals;
  }
  
  // MACD Strategy
  static macdStrategy(
    prices: PriceData[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
  ): Signal[] {
    const closes = prices.map(p => p.close);
    const { macd, signal } = TechnicalAnalysis.macd(closes, fastPeriod, slowPeriod, signalPeriod);
    
    const signals: Signal[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      if (isNaN(macd[i]) || isNaN(signal[i]) || isNaN(macd[i - 1]) || isNaN(signal[i - 1])) continue;
      
      const prevMacdAboveSignal = macd[i - 1] > signal[i - 1];
      const currentMacdAboveSignal = macd[i] > signal[i];
      
      if (!prevMacdAboveSignal && currentMacdAboveSignal) {
        signals.push({
          date: prices[i].date,
          type: 'buy',
          strength: Math.abs(macd[i] - signal[i]) / Math.abs(signal[i]),
          indicator: 'MACD',
          price: prices[i].close
        });
      } else if (prevMacdAboveSignal && !currentMacdAboveSignal) {
        signals.push({
          date: prices[i].date,
          type: 'sell',
          strength: Math.abs(macd[i] - signal[i]) / Math.abs(signal[i]),
          indicator: 'MACD',
          price: prices[i].close
        });
      }
    }
    
    return signals;
  }
  
  // Bollinger Bands Strategy
  static bollingerBandsStrategy(
    prices: PriceData[],
    period: number = 20,
    stdDev: number = 2
  ): Signal[] {
    const closes = prices.map(p => p.close);
    const { upper, middle, lower } = TechnicalAnalysis.bollingerBands(closes, period, stdDev);
    
    const signals: Signal[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      if (isNaN(upper[i]) || isNaN(lower[i])) continue;
      
      const price = closes[i];
      const prevPrice = closes[i - 1];
      
      if (prevPrice <= lower[i - 1] && price > lower[i]) {
        signals.push({
          date: prices[i].date,
          type: 'buy',
          strength: (price - lower[i]) / (middle[i] - lower[i]),
          indicator: 'Bollinger Bands',
          price: prices[i].close
        });
      } else if (prevPrice >= upper[i - 1] && price < upper[i]) {
        signals.push({
          date: prices[i].date,
          type: 'sell',
          strength: (upper[i] - price) / (upper[i] - middle[i]),
          indicator: 'Bollinger Bands',
          price: prices[i].close
        });
      }
    }
    
    return signals;
  }
  
  // Run backtest
  runBacktest(prices: PriceData[], signals: Signal[]): BacktestResult {
    this.reset();
    let signalIndex = 0;
    
    for (let i = 0; i < prices.length; i++) {
      const currentPrice = prices[i].close;
      const currentDate = prices[i].date;
      
      // Check for signals
      while (signalIndex < signals.length && 
             signals[signalIndex].date <= currentDate) {
        const signal = signals[signalIndex];
        
        if (signal.type === 'buy' && this.position === 0) {
          this.enterLong(signal.date, signal.price);
        } else if (signal.type === 'sell' && this.position > 0) {
          this.exitPosition(signal.date, signal.price);
        }
        
        signalIndex++;
      }
      
      // Update equity curve
      const currentEquity = this.capital + this.position * currentPrice;
      this.equityCurve.push(currentEquity);
    }
    
    // Close any open position at the end
    if (this.position > 0) {
      this.exitPosition(prices[prices.length - 1].date, prices[prices.length - 1].close);
    }
    
    return this.generateReport(prices[0].date, prices[prices.length - 1].date);
  }
  
  private enterLong(date: Date, price: number): void {
    const quantity = Math.floor(this.capital / price);
    this.position = quantity;
    this.capital -= quantity * price;
    
    this.currentTrade = {
      entryDate: date,
      entryPrice: price,
      quantity,
      type: 'long'
    };
  }
  
  private exitPosition(date: Date, price: number): void {
    if (!this.currentTrade) return;
    
    const profit = this.position * price - this.currentTrade.quantity! * this.currentTrade.entryPrice!;
    const returnPercent = profit / (this.currentTrade.quantity! * this.currentTrade.entryPrice!) * 100;
    
    this.trades.push({
      ...this.currentTrade as Trade,
      exitDate: date,
      exitPrice: price,
      profit,
      returnPercent
    });
    
    this.capital += this.position * price;
    this.position = 0;
    this.currentTrade = null;
  }
  
  private generateReport(startDate: Date, endDate: Date): BacktestResult {
    const initialCapital = this.equityCurve[0];
    const finalValue = this.equityCurve[this.equityCurve.length - 1];
    const totalReturn = (finalValue - initialCapital) / initialCapital * 100;
    
    // Calculate annualized return
    const years = (endDate.getTime() - startDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
    const annualizedReturn = Math.pow(1 + totalReturn / 100, 1 / years) - 1;
    
    // Calculate returns for Sharpe ratio
    const returns: number[] = [];
    for (let i = 1; i < this.equityCurve.length; i++) {
      returns.push((this.equityCurve[i] - this.equityCurve[i - 1]) / this.equityCurve[i - 1]);
    }
    
    const sharpeRatio = PortfolioAnalytics.sharpeRatio(returns);
    const maxDrawdown = PortfolioAnalytics.maxDrawdown(this.equityCurve);
    
    // Calculate win rate and profit factor
    const winningTrades = this.trades.filter(t => t.profit > 0);
    const losingTrades = this.trades.filter(t => t.profit <= 0);
    const winRate = winningTrades.length / this.trades.length * 100;
    
    const totalWins = winningTrades.reduce((sum, t) => sum + t.profit, 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins;
    
    return {
      strategy: 'Custom Strategy',
      startDate,
      endDate,
      initialCapital,
      finalValue,
      totalReturn,
      annualizedReturn: annualizedReturn * 100,
      sharpeRatio,
      maxDrawdown,
      winRate,
      profitFactor,
      trades: this.trades,
      equityCurve: this.equityCurve
    };
  }
  
  private reset(): void {
    this.capital = this.equityCurve[0];
    this.position = 0;
    this.trades = [];
    this.equityCurve = [this.capital];
    this.currentTrade = null;
  }
}

// ============== Option Pricing Models ==============
export class OptionPricing {
  
  // Black-Scholes Model for European Options
  static blackScholes(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    volatility: number,
    optionType: 'call' | 'put'
  ): {
    price: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
  } {
    const d1 = (Math.log(spotPrice / strikePrice) + 
      (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) /
      (volatility * Math.sqrt(timeToExpiry));
    
    const d2 = d1 - volatility * Math.sqrt(timeToExpiry);
    
    const nd1 = this.normalCDF(d1);
    const nd2 = this.normalCDF(d2);
    const nMinusD1 = this.normalCDF(-d1);
    const nMinusD2 = this.normalCDF(-d2);
    const pd1 = this.normalPDF(d1);
    
    let price: number;
    let delta: number;
    let rho: number;
    
    if (optionType === 'call') {
      price = spotPrice * nd1 - strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * nd2;
      delta = nd1;
      rho = strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * nd2 / 100;
    } else {
      price = strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * nMinusD2 - spotPrice * nMinusD1;
      delta = -nMinusD1;
      rho = -strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * nMinusD2 / 100;
    }
    
    const gamma = pd1 / (spotPrice * volatility * Math.sqrt(timeToExpiry));
    const theta = optionType === 'call' ?
      (-spotPrice * pd1 * volatility / (2 * Math.sqrt(timeToExpiry)) -
        riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * nd2) / 365 :
      (-spotPrice * pd1 * volatility / (2 * Math.sqrt(timeToExpiry)) +
        riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * nMinusD2) / 365;
    const vega = spotPrice * pd1 * Math.sqrt(timeToExpiry) / 100;
    
    return { price, delta, gamma, theta, vega, rho };
  }
  
  // Binomial Option Pricing Model
  static binomial(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    volatility: number,
    steps: number,
    optionType: 'call' | 'put',
    exerciseType: 'european' | 'american' = 'european'
  ): number {
    const dt = timeToExpiry / steps;
    const u = Math.exp(volatility * Math.sqrt(dt));
    const d = 1 / u;
    const p = (Math.exp(riskFreeRate * dt) - d) / (u - d);
    
    // Build price tree
    const priceTree: number[][] = [];
    for (let i = 0; i <= steps; i++) {
      priceTree[i] = [];
      for (let j = 0; j <= i; j++) {
        priceTree[i][j] = spotPrice * Math.pow(u, i - j) * Math.pow(d, j);
      }
    }
    
    // Calculate option values at expiry
    const optionTree: number[][] = [];
    for (let i = 0; i <= steps; i++) {
      optionTree[i] = [];
    }
    
    for (let j = 0; j <= steps; j++) {
      const payoff = optionType === 'call' ?
        Math.max(priceTree[steps][j] - strikePrice, 0) :
        Math.max(strikePrice - priceTree[steps][j], 0);
      optionTree[steps][j] = payoff;
    }
    
    // Work backwards through the tree
    for (let i = steps - 1; i >= 0; i--) {
      for (let j = 0; j <= i; j++) {
        const discountedValue = Math.exp(-riskFreeRate * dt) *
          (p * optionTree[i + 1][j] + (1 - p) * optionTree[i + 1][j + 1]);
        
        if (exerciseType === 'american') {
          const exerciseValue = optionType === 'call' ?
            Math.max(priceTree[i][j] - strikePrice, 0) :
            Math.max(strikePrice - priceTree[i][j], 0);
          optionTree[i][j] = Math.max(discountedValue, exerciseValue);
        } else {
          optionTree[i][j] = discountedValue;
        }
      }
    }
    
    return optionTree[0][0];
  }
  
  // Monte Carlo Option Pricing
  static monteCarlo(
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    volatility: number,
    simulations: number,
    optionType: 'call' | 'put'
  ): { price: number; standardError: number } {
    const payoffs: number[] = [];
    
    for (let i = 0; i < simulations; i++) {
      // Generate random price path
      const z = this.randomNormal();
      const finalPrice = spotPrice * Math.exp(
        (riskFreeRate - 0.5 * volatility * volatility) * timeToExpiry +
        volatility * Math.sqrt(timeToExpiry) * z
      );
      
      // Calculate payoff
      const payoff = optionType === 'call' ?
        Math.max(finalPrice - strikePrice, 0) :
        Math.max(strikePrice - finalPrice, 0);
      
      payoffs.push(payoff);
    }
    
    // Calculate option price
    const meanPayoff = payoffs.reduce((sum, p) => sum + p, 0) / simulations;
    const price = Math.exp(-riskFreeRate * timeToExpiry) * meanPayoff;
    
    // Calculate standard error
    const variance = payoffs.reduce((sum, p) => 
      sum + Math.pow(p - meanPayoff, 2), 0
    ) / (simulations - 1);
    const standardError = Math.sqrt(variance / simulations) * Math.exp(-riskFreeRate * timeToExpiry);
    
    return { price, standardError };
  }
  
  // Implied Volatility using Newton-Raphson method
  static impliedVolatility(
    optionPrice: number,
    spotPrice: number,
    strikePrice: number,
    timeToExpiry: number,
    riskFreeRate: number,
    optionType: 'call' | 'put',
    initialGuess: number = 0.2
  ): number {
    let volatility = initialGuess;
    const tolerance = 1e-6;
    const maxIterations = 100;
    
    for (let i = 0; i < maxIterations; i++) {
      const { price, vega } = this.blackScholes(
        spotPrice,
        strikePrice,
        timeToExpiry,
        riskFreeRate,
        volatility,
        optionType
      );
      
      const diff = price - optionPrice;
      
      if (Math.abs(diff) < tolerance) {
        return volatility;
      }
      
      volatility = volatility - diff / (vega * 100);
      
      // Ensure volatility stays positive
      if (volatility <= 0) {
        volatility = 0.01;
      }
    }
    
    return volatility;
  }
  
  private static normalCDF(x: number): number {
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
  
  private static normalPDF(x: number): number {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  }
  
  private static randomNormal(): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}

// Export all classes
export default {
  TechnicalAnalysis,
  PortfolioAnalytics,
  BacktestingEngine,
  OptionPricing
};