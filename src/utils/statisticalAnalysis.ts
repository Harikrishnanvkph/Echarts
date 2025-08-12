import * as echarts from 'echarts';

// Advanced Statistical Analysis Tools

// ============== Types and Interfaces ==============
export interface RegressionResult {
  coefficients: number[];
  rSquared: number;
  adjustedRSquared: number;
  standardError: number;
  fStatistic: number;
  pValue: number;
  residuals: number[];
  predictions: number[];
  confidenceIntervals: { lower: number[]; upper: number[] };
}

export interface HypothesisTestResult {
  testStatistic: number;
  pValue: number;
  degreesOfFreedom: number;
  criticalValue: number;
  rejectNull: boolean;
  confidenceInterval: [number, number];
  effectSize: number;
  power: number;
}

export interface DistributionParameters {
  mean?: number;
  standardDeviation?: number;
  lambda?: number;
  alpha?: number;
  beta?: number;
  degreesOfFreedom?: number;
  shape?: number;
  scale?: number;
}

export interface ANOVAResult {
  fStatistic: number;
  pValue: number;
  sumOfSquaresBetween: number;
  sumOfSquaresWithin: number;
  meanSquaresBetween: number;
  meanSquaresWithin: number;
  degreesOfFreedomBetween: number;
  degreesOfFreedomWithin: number;
  groups: GroupStatistics[];
}

export interface GroupStatistics {
  name: string;
  mean: number;
  variance: number;
  standardDeviation: number;
  standardError: number;
  count: number;
  confidenceInterval: [number, number];
}

// ============== Linear Regression ==============
export class LinearRegression {
  private coefficients: number[] = [];
  private rSquared: number = 0;
  private predictions: number[] = [];
  
  fit(X: number[][], y: number[]): RegressionResult {
    const n = X.length;
    const p = X[0].length + 1; // +1 for intercept
    
    // Add intercept column
    const XWithIntercept = X.map(row => [1, ...row]);
    
    // Calculate coefficients using normal equation: β = (X'X)^(-1)X'y
    const XTranspose = this.transpose(XWithIntercept);
    const XTX = this.matrixMultiply(XTranspose, XWithIntercept);
    const XTXInverse = this.matrixInverse(XTX);
    const XTy = this.matrixVectorMultiply(XTranspose, y);
    this.coefficients = this.matrixVectorMultiply(XTXInverse, XTy);
    
    // Calculate predictions
    this.predictions = XWithIntercept.map(row => 
      row.reduce((sum, val, idx) => sum + val * this.coefficients[idx], 0)
    );
    
    // Calculate residuals
    const residuals = y.map((val, idx) => val - this.predictions[idx]);
    
    // Calculate R-squared
    const yMean = y.reduce((sum, val) => sum + val, 0) / n;
    const totalSS = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
    const residualSS = residuals.reduce((sum, val) => sum + Math.pow(val, 2), 0);
    this.rSquared = 1 - (residualSS / totalSS);
    
    // Calculate adjusted R-squared
    const adjustedRSquared = 1 - ((1 - this.rSquared) * (n - 1) / (n - p));
    
    // Calculate standard error
    const standardError = Math.sqrt(residualSS / (n - p));
    
    // Calculate F-statistic
    const regressionSS = totalSS - residualSS;
    const fStatistic = (regressionSS / (p - 1)) / (residualSS / (n - p));
    
    // Calculate p-value for F-statistic
    const pValue = this.calculateFPValue(fStatistic, p - 1, n - p);
    
    // Calculate confidence intervals
    const tValue = this.getTValue(0.975, n - p); // 95% confidence
    const standardErrors = this.calculateStandardErrors(XWithIntercept, residualSS, n - p);
    const confidenceIntervals = {
      lower: this.coefficients.map((coef, idx) => coef - tValue * standardErrors[idx]),
      upper: this.coefficients.map((coef, idx) => coef + tValue * standardErrors[idx])
    };
    
    return {
      coefficients: this.coefficients,
      rSquared: this.rSquared,
      adjustedRSquared,
      standardError,
      fStatistic,
      pValue,
      residuals,
      predictions: this.predictions,
      confidenceIntervals
    };
  }
  
  predict(X: number[][]): number[] {
    const XWithIntercept = X.map(row => [1, ...row]);
    return XWithIntercept.map(row => 
      row.reduce((sum, val, idx) => sum + val * this.coefficients[idx], 0)
    );
  }
  
  private transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, colIdx) => matrix.map(row => row[colIdx]));
  }
  
  private matrixMultiply(A: number[][], B: number[][]): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < B.length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }
  
  private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
    return matrix.map(row => 
      row.reduce((sum, val, idx) => sum + val * vector[idx], 0)
    );
  }
  
  private matrixInverse(matrix: number[][]): number[][] {
    const n = matrix.length;
    const identity = Array(n).fill(null).map((_, i) => 
      Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
    );
    
    // Augment matrix with identity
    const augmented = matrix.map((row, i) => [...row, ...identity[i]]);
    
    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      
      // Swap rows
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      
      // Scale pivot row
      const pivot = augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }
      
      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }
    
    // Extract inverse from augmented matrix
    return augmented.map(row => row.slice(n));
  }
  
  private calculateStandardErrors(X: number[][], residualSS: number, df: number): number[] {
    const XTX = this.matrixMultiply(this.transpose(X), X);
    const XTXInverse = this.matrixInverse(XTX);
    const mse = residualSS / df;
    return XTXInverse.map((row, i) => Math.sqrt(mse * row[i]));
  }
  
  private calculateFPValue(fStat: number, df1: number, df2: number): number {
    // Approximate p-value using beta distribution
    const x = df2 / (df2 + df1 * fStat);
    return this.incompleteBeta(x, df2 / 2, df1 / 2);
  }
  
  private incompleteBeta(x: number, a: number, b: number): number {
    // Numerical approximation of incomplete beta function
    const bt = x === 0 || x === 1 ? 0 :
      Math.exp(this.logGamma(a + b) - this.logGamma(a) - this.logGamma(b) +
        a * Math.log(x) + b * Math.log(1 - x));
    
    if (x < (a + 1) / (a + b + 2)) {
      return bt * this.betaContinuedFraction(x, a, b) / a;
    } else {
      return 1 - bt * this.betaContinuedFraction(1 - x, b, a) / b;
    }
  }
  
  private betaContinuedFraction(x: number, a: number, b: number): number {
    const maxIterations = 100;
    const epsilon = 1e-10;
    
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    
    if (Math.abs(d) < epsilon) d = epsilon;
    d = 1 / d;
    let h = d;
    
    for (let m = 1; m <= maxIterations; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      h *= d * c;
      
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      const del = d * c;
      h *= del;
      
      if (Math.abs(del - 1) < epsilon) break;
    }
    
    return h;
  }
  
  private logGamma(x: number): number {
    // Stirling's approximation
    const coefficients = [
      76.18009172947146, -86.50532032941677,
      24.01409824083091, -1.231739572450155,
      0.1208650973866179e-2, -0.5395239384953e-5
    ];
    
    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    
    for (let j = 0; j < 6; j++) {
      ser += coefficients[j] / ++y;
    }
    
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
  
  private getTValue(probability: number, df: number): number {
    // Approximate t-value using inverse t-distribution
    const a = 1 / (df - 0.5);
    const b = 48 / (a * a);
    const c = ((20700 * a / b - 98) * a - 16) * a + 96.36;
    const d = ((94.5 / (b + c) - 3) / b + 1) * Math.sqrt(a * Math.PI / 2) * df;
    let x = d * probability;
    let y = Math.pow(x, 2 / df);
    
    if (y > 0.05 + a) {
      x = this.inverseNormal(probability * 0.5);
      y = x * x;
      if (df < 5) {
        c = c + 0.3 * (df - 4.5) * (x + 0.6);
      }
      c = (((0.05 * d * x - 5) * x - 7) * x - 2) * x + b + c;
      y = (((((0.4 * y + 6.3) * y + 36) * y + 94.5) / c - y - 3) / b + 1) * x;
      y = a * y * y;
      if (y > 0.002) {
        y = Math.exp(y) - 1;
      } else {
        y = 0.5 * y * y + y;
      }
    } else {
      y = ((1 / (((df + 6) / (df * y) - 0.089 * d - 0.822) *
        (df + 2) * 3) + 0.5 / (df + 4)) * y - 1) *
        (df + 1) / (df + 2) + 1 / y;
    }
    
    return Math.sqrt(df * y);
  }
  
  private inverseNormal(p: number): number {
    // Inverse normal distribution using Beasley-Springer-Moro algorithm
    const a = [
      2.50662823884, -18.61500062529, 41.39119773534,
      -25.44106049637
    ];
    const b = [
      -8.47351093090, 23.08336743743, -21.06224101826,
      3.13082909833
    ];
    const c = [
      0.3374754822726147, 0.9761690190917186, 0.1607979714918209,
      0.0276438810333863, 0.0038405729373609, 0.0003951896511919,
      0.0000321767881768, 0.0000002888167364, 0.0000003960315187
    ];
    
    const y = p - 0.5;
    if (Math.abs(y) < 0.42) {
      const r = y * y;
      return y * (((a[3] * r + a[2]) * r + a[1]) * r + a[0]) /
        ((((b[3] * r + b[2]) * r + b[1]) * r + b[0]) * r + 1);
    } else {
      let r = p;
      if (y > 0) r = 1 - p;
      r = Math.log(-Math.log(r));
      let x = c[0];
      for (let i = 1; i < 9; i++) {
        x += c[i] * Math.pow(r, i);
      }
      if (y < 0) x = -x;
      return x;
    }
  }
}

// ============== Polynomial Regression ==============
export class PolynomialRegression extends LinearRegression {
  private degree: number;
  
  constructor(degree: number = 2) {
    super();
    this.degree = degree;
  }
  
  fit(X: number[][], y: number[]): RegressionResult {
    // Transform features to polynomial features
    const polyX = this.createPolynomialFeatures(X);
    return super.fit(polyX, y);
  }
  
  predict(X: number[][]): number[] {
    const polyX = this.createPolynomialFeatures(X);
    return super.predict(polyX);
  }
  
  private createPolynomialFeatures(X: number[][]): number[][] {
    const result: number[][] = [];
    
    for (const row of X) {
      const polyRow: number[] = [];
      
      // Add original features
      polyRow.push(...row);
      
      // Add polynomial terms
      for (let d = 2; d <= this.degree; d++) {
        for (const feature of row) {
          polyRow.push(Math.pow(feature, d));
        }
        
        // Add interaction terms for degree 2
        if (d === 2 && row.length > 1) {
          for (let i = 0; i < row.length; i++) {
            for (let j = i + 1; j < row.length; j++) {
              polyRow.push(row[i] * row[j]);
            }
          }
        }
      }
      
      result.push(polyRow);
    }
    
    return result;
  }
}

// ============== Logistic Regression ==============
export class LogisticRegression {
  private coefficients: number[] = [];
  private threshold: number = 0.5;
  
  fit(X: number[][], y: number[], maxIterations: number = 1000, learningRate: number = 0.01): void {
    const n = X.length;
    const m = X[0].length + 1; // +1 for intercept
    
    // Initialize coefficients
    this.coefficients = new Array(m).fill(0);
    
    // Add intercept column
    const XWithIntercept = X.map(row => [1, ...row]);
    
    // Gradient descent
    for (let iter = 0; iter < maxIterations; iter++) {
      const predictions = this.sigmoid(
        XWithIntercept.map(row => 
          row.reduce((sum, val, idx) => sum + val * this.coefficients[idx], 0)
        )
      );
      
      // Calculate gradients
      const gradients = new Array(m).fill(0);
      for (let j = 0; j < m; j++) {
        for (let i = 0; i < n; i++) {
          gradients[j] += (predictions[i] - y[i]) * XWithIntercept[i][j];
        }
        gradients[j] /= n;
      }
      
      // Update coefficients
      for (let j = 0; j < m; j++) {
        this.coefficients[j] -= learningRate * gradients[j];
      }
      
      // Check for convergence
      const maxGradient = Math.max(...gradients.map(Math.abs));
      if (maxGradient < 1e-6) break;
    }
  }
  
  predict(X: number[][]): number[] {
    const XWithIntercept = X.map(row => [1, ...row]);
    const probabilities = this.predictProbability(X);
    return probabilities.map(p => p >= this.threshold ? 1 : 0);
  }
  
  predictProbability(X: number[][]): number[] {
    const XWithIntercept = X.map(row => [1, ...row]);
    return this.sigmoid(
      XWithIntercept.map(row => 
        row.reduce((sum, val, idx) => sum + val * this.coefficients[idx], 0)
      )
    );
  }
  
  setThreshold(threshold: number): void {
    this.threshold = threshold;
  }
  
  private sigmoid(z: number[]): number[] {
    return z.map(val => 1 / (1 + Math.exp(-val)));
  }
  
  getCoefficients(): number[] {
    return [...this.coefficients];
  }
}

// ============== Hypothesis Testing ==============
export class HypothesisTesting {
  // T-Test for one sample
  static oneSampleTTest(
    sample: number[],
    populationMean: number,
    alternative: 'two-sided' | 'less' | 'greater' = 'two-sided'
  ): HypothesisTestResult {
    const n = sample.length;
    const sampleMean = sample.reduce((sum, val) => sum + val, 0) / n;
    const sampleStd = Math.sqrt(
      sample.reduce((sum, val) => sum + Math.pow(val - sampleMean, 2), 0) / (n - 1)
    );
    const standardError = sampleStd / Math.sqrt(n);
    const tStatistic = (sampleMean - populationMean) / standardError;
    const df = n - 1;
    
    // Calculate p-value
    let pValue: number;
    const tDist = new TDistribution(df);
    
    if (alternative === 'two-sided') {
      pValue = 2 * (1 - tDist.cdf(Math.abs(tStatistic)));
    } else if (alternative === 'less') {
      pValue = tDist.cdf(tStatistic);
    } else {
      pValue = 1 - tDist.cdf(tStatistic);
    }
    
    // Critical value for 95% confidence
    const alpha = 0.05;
    let criticalValue: number;
    if (alternative === 'two-sided') {
      criticalValue = tDist.inverseCdf(1 - alpha / 2);
    } else {
      criticalValue = tDist.inverseCdf(1 - alpha);
    }
    
    // Confidence interval
    const marginOfError = criticalValue * standardError;
    const confidenceInterval: [number, number] = [
      sampleMean - marginOfError,
      sampleMean + marginOfError
    ];
    
    // Effect size (Cohen's d)
    const effectSize = Math.abs(sampleMean - populationMean) / sampleStd;
    
    // Statistical power (approximate)
    const power = this.calculatePower(effectSize, n, alpha);
    
    return {
      testStatistic: tStatistic,
      pValue,
      degreesOfFreedom: df,
      criticalValue,
      rejectNull: pValue < alpha,
      confidenceInterval,
      effectSize,
      power
    };
  }
  
  // Two-sample t-test
  static twoSampleTTest(
    sample1: number[],
    sample2: number[],
    equalVariance: boolean = true,
    alternative: 'two-sided' | 'less' | 'greater' = 'two-sided'
  ): HypothesisTestResult {
    const n1 = sample1.length;
    const n2 = sample2.length;
    const mean1 = sample1.reduce((sum, val) => sum + val, 0) / n1;
    const mean2 = sample2.reduce((sum, val) => sum + val, 0) / n2;
    const var1 = sample1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1);
    const var2 = sample2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1);
    
    let tStatistic: number;
    let df: number;
    let standardError: number;
    
    if (equalVariance) {
      // Pooled variance
      const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
      standardError = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
      tStatistic = (mean1 - mean2) / standardError;
      df = n1 + n2 - 2;
    } else {
      // Welch's t-test
      standardError = Math.sqrt(var1 / n1 + var2 / n2);
      tStatistic = (mean1 - mean2) / standardError;
      // Welch-Satterthwaite equation for degrees of freedom
      df = Math.pow(var1 / n1 + var2 / n2, 2) /
        (Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1));
    }
    
    // Calculate p-value
    const tDist = new TDistribution(df);
    let pValue: number;
    
    if (alternative === 'two-sided') {
      pValue = 2 * (1 - tDist.cdf(Math.abs(tStatistic)));
    } else if (alternative === 'less') {
      pValue = tDist.cdf(tStatistic);
    } else {
      pValue = 1 - tDist.cdf(tStatistic);
    }
    
    // Critical value and confidence interval
    const alpha = 0.05;
    const criticalValue = alternative === 'two-sided' ?
      tDist.inverseCdf(1 - alpha / 2) :
      tDist.inverseCdf(1 - alpha);
    
    const marginOfError = criticalValue * standardError;
    const confidenceInterval: [number, number] = [
      (mean1 - mean2) - marginOfError,
      (mean1 - mean2) + marginOfError
    ];
    
    // Effect size (Cohen's d)
    const pooledStd = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2));
    const effectSize = Math.abs(mean1 - mean2) / pooledStd;
    
    // Power
    const power = this.calculatePower(effectSize, (n1 + n2) / 2, alpha);
    
    return {
      testStatistic: tStatistic,
      pValue,
      degreesOfFreedom: df,
      criticalValue,
      rejectNull: pValue < alpha,
      confidenceInterval,
      effectSize,
      power
    };
  }
  
  // Chi-square test for independence
  static chiSquareTest(observed: number[][]): HypothesisTestResult {
    const rows = observed.length;
    const cols = observed[0].length;
    const total = observed.reduce((sum, row) => 
      sum + row.reduce((rowSum, val) => rowSum + val, 0), 0
    );
    
    // Calculate row and column totals
    const rowTotals = observed.map(row => row.reduce((sum, val) => sum + val, 0));
    const colTotals = observed[0].map((_, colIdx) => 
      observed.reduce((sum, row) => sum + row[colIdx], 0)
    );
    
    // Calculate expected frequencies
    const expected: number[][] = [];
    for (let i = 0; i < rows; i++) {
      expected[i] = [];
      for (let j = 0; j < cols; j++) {
        expected[i][j] = (rowTotals[i] * colTotals[j]) / total;
      }
    }
    
    // Calculate chi-square statistic
    let chiSquare = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        chiSquare += Math.pow(observed[i][j] - expected[i][j], 2) / expected[i][j];
      }
    }
    
    // Degrees of freedom
    const df = (rows - 1) * (cols - 1);
    
    // P-value
    const chiDist = new ChiSquareDistribution(df);
    const pValue = 1 - chiDist.cdf(chiSquare);
    
    // Critical value at 95% confidence
    const alpha = 0.05;
    const criticalValue = chiDist.inverseCdf(1 - alpha);
    
    // Effect size (Cramér's V)
    const minDim = Math.min(rows - 1, cols - 1);
    const effectSize = Math.sqrt(chiSquare / (total * minDim));
    
    // Power (approximate)
    const power = this.calculateChiSquarePower(effectSize, total, df, alpha);
    
    return {
      testStatistic: chiSquare,
      pValue,
      degreesOfFreedom: df,
      criticalValue,
      rejectNull: pValue < alpha,
      confidenceInterval: [0, 0], // Not applicable for chi-square
      effectSize,
      power
    };
  }
  
  // ANOVA (Analysis of Variance)
  static anova(groups: number[][]): ANOVAResult {
    const k = groups.length; // Number of groups
    const N = groups.reduce((sum, group) => sum + group.length, 0); // Total observations
    
    // Calculate group statistics
    const groupStats: GroupStatistics[] = groups.map((group, idx) => {
      const n = group.length;
      const mean = group.reduce((sum, val) => sum + val, 0) / n;
      const variance = group.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
      const std = Math.sqrt(variance);
      const se = std / Math.sqrt(n);
      
      // 95% confidence interval
      const tDist = new TDistribution(n - 1);
      const tValue = tDist.inverseCdf(0.975);
      const margin = tValue * se;
      
      return {
        name: `Group ${idx + 1}`,
        mean,
        variance,
        standardDeviation: std,
        standardError: se,
        count: n,
        confidenceInterval: [mean - margin, mean + margin]
      };
    });
    
    // Grand mean
    const grandMean = groups.flat().reduce((sum, val) => sum + val, 0) / N;
    
    // Sum of squares between groups
    const SSB = groupStats.reduce((sum, stat) => 
      sum + stat.count * Math.pow(stat.mean - grandMean, 2), 0
    );
    
    // Sum of squares within groups
    const SSW = groups.reduce((sum, group, idx) => {
      const groupMean = groupStats[idx].mean;
      return sum + group.reduce((groupSum, val) => 
        groupSum + Math.pow(val - groupMean, 2), 0
      );
    }, 0);
    
    // Degrees of freedom
    const dfBetween = k - 1;
    const dfWithin = N - k;
    
    // Mean squares
    const MSB = SSB / dfBetween;
    const MSW = SSW / dfWithin;
    
    // F-statistic
    const fStatistic = MSB / MSW;
    
    // P-value
    const fDist = new FDistribution(dfBetween, dfWithin);
    const pValue = 1 - fDist.cdf(fStatistic);
    
    return {
      fStatistic,
      pValue,
      sumOfSquaresBetween: SSB,
      sumOfSquaresWithin: SSW,
      meanSquaresBetween: MSB,
      meanSquaresWithin: MSW,
      degreesOfFreedomBetween: dfBetween,
      degreesOfFreedomWithin: dfWithin,
      groups: groupStats
    };
  }
  
  // Mann-Whitney U test (non-parametric)
  static mannWhitneyUTest(
    sample1: number[],
    sample2: number[],
    alternative: 'two-sided' | 'less' | 'greater' = 'two-sided'
  ): HypothesisTestResult {
    const n1 = sample1.length;
    const n2 = sample2.length;
    
    // Combine and rank
    const combined = [
      ...sample1.map(val => ({ val, group: 1 })),
      ...sample2.map(val => ({ val, group: 2 }))
    ];
    combined.sort((a, b) => a.val - b.val);
    
    // Assign ranks
    const ranks: number[] = [];
    let i = 0;
    while (i < combined.length) {
      let j = i;
      while (j < combined.length && combined[j].val === combined[i].val) j++;
      const avgRank = (i + 1 + j) / 2;
      for (let k = i; k < j; k++) {
        ranks[k] = avgRank;
      }
      i = j;
    }
    
    // Calculate U statistics
    const R1 = combined.reduce((sum, item, idx) => 
      item.group === 1 ? sum + ranks[idx] : sum, 0
    );
    const R2 = combined.reduce((sum, item, idx) => 
      item.group === 2 ? sum + ranks[idx] : sum, 0
    );
    
    const U1 = R1 - n1 * (n1 + 1) / 2;
    const U2 = R2 - n2 * (n2 + 1) / 2;
    const U = Math.min(U1, U2);
    
    // For large samples, use normal approximation
    const meanU = n1 * n2 / 2;
    const stdU = Math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12);
    const zStatistic = (U - meanU) / stdU;
    
    // P-value
    const normalDist = new NormalDistribution(0, 1);
    let pValue: number;
    
    if (alternative === 'two-sided') {
      pValue = 2 * normalDist.cdf(-Math.abs(zStatistic));
    } else if (alternative === 'less') {
      pValue = normalDist.cdf(zStatistic);
    } else {
      pValue = 1 - normalDist.cdf(zStatistic);
    }
    
    // Effect size (rank-biserial correlation)
    const effectSize = 1 - (2 * U) / (n1 * n2);
    
    return {
      testStatistic: U,
      pValue,
      degreesOfFreedom: 0, // Not applicable
      criticalValue: 1.96, // Normal approximation
      rejectNull: pValue < 0.05,
      confidenceInterval: [0, 0], // Not directly applicable
      effectSize,
      power: 0.8 // Approximate
    };
  }
  
  private static calculatePower(effectSize: number, n: number, alpha: number): number {
    // Cohen's power approximation
    const delta = effectSize * Math.sqrt(n);
    const normalDist = new NormalDistribution(0, 1);
    const criticalValue = normalDist.inverseCdf(1 - alpha / 2);
    return 1 - normalDist.cdf(criticalValue - delta) + normalDist.cdf(-criticalValue - delta);
  }
  
  private static calculateChiSquarePower(effectSize: number, n: number, df: number, alpha: number): number {
    // Approximate power for chi-square test
    const lambda = n * Math.pow(effectSize, 2);
    const chiDist = new ChiSquareDistribution(df);
    const criticalValue = chiDist.inverseCdf(1 - alpha);
    const ncChiDist = new NonCentralChiSquareDistribution(df, lambda);
    return 1 - ncChiDist.cdf(criticalValue);
  }
}

// ============== Probability Distributions ==============
export class NormalDistribution {
  constructor(private mean: number = 0, private stdDev: number = 1) {}
  
  pdf(x: number): number {
    const coefficient = 1 / (this.stdDev * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - this.mean, 2) / (2 * Math.pow(this.stdDev, 2));
    return coefficient * Math.exp(exponent);
  }
  
  cdf(x: number): number {
    const z = (x - this.mean) / this.stdDev;
    return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
  }
  
  inverseCdf(p: number): number {
    if (p <= 0 || p >= 1) {
      throw new Error('Probability must be between 0 and 1');
    }
    return this.mean + this.stdDev * this.inverseNormalStandard(p);
  }
  
  random(): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return this.mean + this.stdDev * z0;
  }
  
  private erf(x: number): number {
    // Error function approximation
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    
    const t = 1 / (1 + p * x);
    const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  }
  
  private inverseNormalStandard(p: number): number {
    // Inverse normal CDF using Beasley-Springer-Moro algorithm
    const a = [
      2.50662823884, -18.61500062529, 41.39119773534, -25.44106049637
    ];
    const b = [
      -8.47351093090, 23.08336743743, -21.06224101826, 3.13082909833
    ];
    const c = [
      0.3374754822726147, 0.9761690190917186, 0.1607979714918209,
      0.0276438810333863, 0.0038405729373609, 0.0003951896511919,
      0.0000321767881768, 0.0000002888167364, 0.0000003960315187
    ];
    
    const y = p - 0.5;
    if (Math.abs(y) < 0.42) {
      const r = y * y;
      return y * (((a[3] * r + a[2]) * r + a[1]) * r + a[0]) /
        ((((b[3] * r + b[2]) * r + b[1]) * r + b[0]) * r + 1);
    } else {
      let r = p;
      if (y > 0) r = 1 - p;
      r = Math.log(-Math.log(r));
      let x = c[0];
      for (let i = 1; i < 9; i++) {
        x += c[i] * Math.pow(r, i);
      }
      if (y < 0) x = -x;
      return x;
    }
  }
}

export class TDistribution {
  constructor(private df: number) {}
  
  pdf(x: number): number {
    const coefficient = this.gamma((this.df + 1) / 2) /
      (Math.sqrt(this.df * Math.PI) * this.gamma(this.df / 2));
    return coefficient * Math.pow(1 + x * x / this.df, -(this.df + 1) / 2);
  }
  
  cdf(x: number): number {
    const t = x / Math.sqrt(this.df);
    const z = this.df / (this.df + x * x);
    return 0.5 + 0.5 * (1 - this.incompleteBeta(z, this.df / 2, 0.5)) * (x > 0 ? 1 : -1);
  }
  
  inverseCdf(p: number): number {
    // Newton-Raphson method
    let x = 0;
    for (let i = 0; i < 100; i++) {
      const fx = this.cdf(x) - p;
      const fpx = this.pdf(x);
      const newX = x - fx / fpx;
      if (Math.abs(newX - x) < 1e-10) break;
      x = newX;
    }
    return x;
  }
  
  private gamma(x: number): number {
    return Math.exp(this.logGamma(x));
  }
  
  private logGamma(x: number): number {
    const coefficients = [
      76.18009172947146, -86.50532032941677,
      24.01409824083091, -1.231739572450155,
      0.1208650973866179e-2, -0.5395239384953e-5
    ];
    
    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    
    for (let j = 0; j < 6; j++) {
      ser += coefficients[j] / ++y;
    }
    
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
  
  private incompleteBeta(x: number, a: number, b: number): number {
    if (x < 0 || x > 1) return 0;
    
    const bt = x === 0 || x === 1 ? 0 :
      Math.exp(this.logGamma(a + b) - this.logGamma(a) - this.logGamma(b) +
        a * Math.log(x) + b * Math.log(1 - x));
    
    if (x < (a + 1) / (a + b + 2)) {
      return bt * this.betaContinuedFraction(x, a, b) / a;
    } else {
      return 1 - bt * this.betaContinuedFraction(1 - x, b, a) / b;
    }
  }
  
  private betaContinuedFraction(x: number, a: number, b: number): number {
    const maxIterations = 100;
    const epsilon = 1e-10;
    
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    
    if (Math.abs(d) < epsilon) d = epsilon;
    d = 1 / d;
    let h = d;
    
    for (let m = 1; m <= maxIterations; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      h *= d * c;
      
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      const del = d * c;
      h *= del;
      
      if (Math.abs(del - 1) < epsilon) break;
    }
    
    return h;
  }
}

export class ChiSquareDistribution {
  constructor(private df: number) {}
  
  pdf(x: number): number {
    if (x <= 0) return 0;
    return Math.pow(x, this.df / 2 - 1) * Math.exp(-x / 2) /
      (Math.pow(2, this.df / 2) * this.gamma(this.df / 2));
  }
  
  cdf(x: number): number {
    if (x <= 0) return 0;
    return this.lowerIncompleteGamma(this.df / 2, x / 2) / this.gamma(this.df / 2);
  }
  
  inverseCdf(p: number): number {
    // Newton-Raphson method
    let x = this.df; // Initial guess
    for (let i = 0; i < 100; i++) {
      const fx = this.cdf(x) - p;
      const fpx = this.pdf(x);
      const newX = x - fx / fpx;
      if (Math.abs(newX - x) < 1e-10) break;
      x = newX;
    }
    return x;
  }
  
  private gamma(x: number): number {
    return Math.exp(this.logGamma(x));
  }
  
  private logGamma(x: number): number {
    const coefficients = [
      76.18009172947146, -86.50532032941677,
      24.01409824083091, -1.231739572450155,
      0.1208650973866179e-2, -0.5395239384953e-5
    ];
    
    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    
    for (let j = 0; j < 6; j++) {
      ser += coefficients[j] / ++y;
    }
    
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
  
  private lowerIncompleteGamma(a: number, x: number): number {
    // Series representation for small x
    if (x < a + 1) {
      let sum = 1 / a;
      let term = 1 / a;
      for (let n = 1; n < 100; n++) {
        term *= x / (a + n);
        sum += term;
        if (Math.abs(term) < 1e-10) break;
      }
      return sum * Math.exp(-x + a * Math.log(x) - this.logGamma(a));
    } else {
      // Continued fraction for large x
      return this.gamma(a) - this.upperIncompleteGamma(a, x);
    }
  }
  
  private upperIncompleteGamma(a: number, x: number): number {
    // Continued fraction representation
    const epsilon = 1e-10;
    let b = x + 1 - a;
    let c = 1 / epsilon;
    let d = 1 / b;
    let h = d;
    
    for (let i = 1; i < 100; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = b + an / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < epsilon) break;
    }
    
    return Math.exp(-x + a * Math.log(x) - this.logGamma(a)) * h;
  }
}

export class FDistribution {
  constructor(private df1: number, private df2: number) {}
  
  pdf(x: number): number {
    if (x <= 0) return 0;
    
    const numerator = Math.sqrt(
      Math.pow(this.df1 * x, this.df1) * Math.pow(this.df2, this.df2) /
      Math.pow(this.df1 * x + this.df2, this.df1 + this.df2)
    );
    const denominator = x * this.beta(this.df1 / 2, this.df2 / 2);
    
    return numerator / denominator;
  }
  
  cdf(x: number): number {
    if (x <= 0) return 0;
    const z = this.df1 * x / (this.df1 * x + this.df2);
    return this.incompleteBeta(z, this.df1 / 2, this.df2 / 2);
  }
  
  inverseCdf(p: number): number {
    // Newton-Raphson method
    let x = (this.df1 - 2) / this.df1; // Initial guess
    for (let i = 0; i < 100; i++) {
      const fx = this.cdf(x) - p;
      const fpx = this.pdf(x);
      if (fpx === 0) break;
      const newX = x - fx / fpx;
      if (Math.abs(newX - x) < 1e-10) break;
      x = newX;
    }
    return x;
  }
  
  private beta(a: number, b: number): number {
    return Math.exp(this.logGamma(a) + this.logGamma(b) - this.logGamma(a + b));
  }
  
  private logGamma(x: number): number {
    const coefficients = [
      76.18009172947146, -86.50532032941677,
      24.01409824083091, -1.231739572450155,
      0.1208650973866179e-2, -0.5395239384953e-5
    ];
    
    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    
    for (let j = 0; j < 6; j++) {
      ser += coefficients[j] / ++y;
    }
    
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
  
  private incompleteBeta(x: number, a: number, b: number): number {
    if (x < 0 || x > 1) return 0;
    
    const bt = x === 0 || x === 1 ? 0 :
      Math.exp(this.logGamma(a + b) - this.logGamma(a) - this.logGamma(b) +
        a * Math.log(x) + b * Math.log(1 - x));
    
    if (x < (a + 1) / (a + b + 2)) {
      return bt * this.betaContinuedFraction(x, a, b) / a;
    } else {
      return 1 - bt * this.betaContinuedFraction(1 - x, b, a) / b;
    }
  }
  
  private betaContinuedFraction(x: number, a: number, b: number): number {
    const maxIterations = 100;
    const epsilon = 1e-10;
    
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    
    if (Math.abs(d) < epsilon) d = epsilon;
    d = 1 / d;
    let h = d;
    
    for (let m = 1; m <= maxIterations; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      h *= d * c;
      
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      const del = d * c;
      h *= del;
      
      if (Math.abs(del - 1) < epsilon) break;
    }
    
    return h;
  }
}

export class NonCentralChiSquareDistribution {
  constructor(private df: number, private lambda: number) {}
  
  cdf(x: number): number {
    // Approximate using series expansion
    let sum = 0;
    const maxTerms = 100;
    
    for (let j = 0; j < maxTerms; j++) {
      const poissonWeight = Math.exp(-this.lambda / 2) * Math.pow(this.lambda / 2, j) / this.factorial(j);
      const chiDist = new ChiSquareDistribution(this.df + 2 * j);
      sum += poissonWeight * chiDist.cdf(x);
      
      if (poissonWeight < 1e-10) break;
    }
    
    return sum;
  }
  
  private factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
}

// Export all classes and functions
export default {
  LinearRegression,
  PolynomialRegression,
  LogisticRegression,
  HypothesisTesting,
  NormalDistribution,
  TDistribution,
  ChiSquareDistribution,
  FDistribution,
  NonCentralChiSquareDistribution
};