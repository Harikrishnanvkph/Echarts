import * as echarts from 'echarts';

// Machine Learning Utilities

// ============== Types and Interfaces ==============
export interface DataPoint {
  features: number[];
  label?: any;
  weight?: number;
}

export interface ClusterResult {
  clusters: number[][];
  centroids: number[][];
  labels: number[];
  inertia: number;
  silhouetteScore?: number;
  iterations: number;
}

export interface ClassificationResult {
  predictions: any[];
  probabilities?: number[][];
  accuracy?: number;
  confusionMatrix?: number[][];
  classificationReport?: ClassificationReport;
}

export interface ClassificationReport {
  precision: number[];
  recall: number[];
  f1Score: number[];
  support: number[];
  accuracy: number;
  macroAvg: { precision: number; recall: number; f1Score: number };
  weightedAvg: { precision: number; recall: number; f1Score: number };
}

export interface NeuralNetworkConfig {
  layers: LayerConfig[];
  optimizer: OptimizerConfig;
  loss: LossFunction;
  metrics?: string[];
  batchSize?: number;
  epochs?: number;
  validationSplit?: number;
  callbacks?: CallbackConfig[];
}

export interface LayerConfig {
  type: 'dense' | 'dropout' | 'batch_norm' | 'activation';
  units?: number;
  activation?: ActivationFunction;
  dropoutRate?: number;
  inputShape?: number[];
}

export interface OptimizerConfig {
  type: 'sgd' | 'adam' | 'rmsprop' | 'adagrad';
  learningRate: number;
  momentum?: number;
  beta1?: number;
  beta2?: number;
  epsilon?: number;
  decay?: number;
}

export type ActivationFunction = 'relu' | 'sigmoid' | 'tanh' | 'softmax' | 'linear' | 'elu' | 'selu';
export type LossFunction = 'mse' | 'mae' | 'binary_crossentropy' | 'categorical_crossentropy' | 'huber';

export interface CallbackConfig {
  type: 'early_stopping' | 'reduce_lr' | 'checkpoint';
  monitor?: string;
  patience?: number;
  factor?: number;
  minDelta?: number;
  mode?: 'min' | 'max';
}

export interface PCAResult {
  transformedData: number[][];
  components: number[][];
  explainedVariance: number[];
  explainedVarianceRatio: number[];
  mean: number[];
  singularValues: number[];
}

export interface TimeSeriesForecast {
  predictions: number[];
  confidence: { lower: number[]; upper: number[] };
  model: any;
  metrics: { mse: number; mae: number; mape: number; rmse: number };
}

// ============== K-Means Clustering ==============
export class KMeansClustering {
  private centroids: number[][] = [];
  private labels: number[] = [];
  private maxIterations: number = 300;
  private tolerance: number = 1e-4;
  
  fit(data: number[][], k: number, initMethod: 'random' | 'kmeans++' = 'kmeans++'): ClusterResult {
    const n = data.length;
    const dim = data[0].length;
    
    // Initialize centroids
    if (initMethod === 'kmeans++') {
      this.centroids = this.kMeansPlusPlus(data, k);
    } else {
      this.centroids = this.randomInit(data, k);
    }
    
    let iterations = 0;
    let previousCentroids: number[][] = [];
    
    while (iterations < this.maxIterations) {
      // Assign points to nearest centroid
      this.labels = data.map(point => this.nearestCentroid(point));
      
      // Update centroids
      previousCentroids = this.centroids.map(c => [...c]);
      for (let i = 0; i < k; i++) {
        const clusterPoints = data.filter((_, idx) => this.labels[idx] === i);
        if (clusterPoints.length > 0) {
          this.centroids[i] = this.calculateMean(clusterPoints);
        }
      }
      
      // Check convergence
      if (this.hasConverged(previousCentroids, this.centroids)) {
        break;
      }
      
      iterations++;
    }
    
    // Calculate inertia (within-cluster sum of squares)
    const inertia = this.calculateInertia(data);
    
    // Calculate silhouette score
    const silhouetteScore = this.calculateSilhouetteScore(data);
    
    // Group data points by cluster
    const clusters: number[][] = [];
    for (let i = 0; i < k; i++) {
      clusters[i] = [];
      data.forEach((point, idx) => {
        if (this.labels[idx] === i) {
          clusters[i].push(idx);
        }
      });
    }
    
    return {
      clusters,
      centroids: this.centroids,
      labels: this.labels,
      inertia,
      silhouetteScore,
      iterations
    };
  }
  
  predict(data: number[][]): number[] {
    return data.map(point => this.nearestCentroid(point));
  }
  
  private kMeansPlusPlus(data: number[][], k: number): number[][] {
    const centroids: number[][] = [];
    const n = data.length;
    
    // Choose first centroid randomly
    centroids.push([...data[Math.floor(Math.random() * n)]]);
    
    // Choose remaining centroids
    for (let c = 1; c < k; c++) {
      const distances = data.map(point => {
        const minDist = Math.min(...centroids.map(centroid => 
          this.euclideanDistance(point, centroid)
        ));
        return minDist * minDist;
      });
      
      // Choose next centroid with probability proportional to squared distance
      const totalDist = distances.reduce((sum, d) => sum + d, 0);
      let randomValue = Math.random() * totalDist;
      
      for (let i = 0; i < n; i++) {
        randomValue -= distances[i];
        if (randomValue <= 0) {
          centroids.push([...data[i]]);
          break;
        }
      }
    }
    
    return centroids;
  }
  
  private randomInit(data: number[][], k: number): number[][] {
    const indices = new Set<number>();
    while (indices.size < k) {
      indices.add(Math.floor(Math.random() * data.length));
    }
    return Array.from(indices).map(i => [...data[i]]);
  }
  
  private nearestCentroid(point: number[]): number {
    let minDist = Infinity;
    let nearest = 0;
    
    for (let i = 0; i < this.centroids.length; i++) {
      const dist = this.euclideanDistance(point, this.centroids[i]);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }
    
    return nearest;
  }
  
  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }
  
  private calculateMean(points: number[][]): number[] {
    const dim = points[0].length;
    const mean = new Array(dim).fill(0);
    
    for (const point of points) {
      for (let i = 0; i < dim; i++) {
        mean[i] += point[i];
      }
    }
    
    return mean.map(val => val / points.length);
  }
  
  private hasConverged(old: number[][], current: number[][]): boolean {
    for (let i = 0; i < old.length; i++) {
      if (this.euclideanDistance(old[i], current[i]) > this.tolerance) {
        return false;
      }
    }
    return true;
  }
  
  private calculateInertia(data: number[][]): number {
    return data.reduce((sum, point, idx) => {
      const centroid = this.centroids[this.labels[idx]];
      return sum + Math.pow(this.euclideanDistance(point, centroid), 2);
    }, 0);
  }
  
  private calculateSilhouetteScore(data: number[][]): number {
    const n = data.length;
    const k = this.centroids.length;
    
    if (k === 1) return 0;
    
    let totalScore = 0;
    
    for (let i = 0; i < n; i++) {
      const clusterLabel = this.labels[i];
      
      // Calculate a(i): mean distance to points in same cluster
      const sameClusterPoints = data.filter((_, idx) => 
        this.labels[idx] === clusterLabel && idx !== i
      );
      
      if (sameClusterPoints.length === 0) continue;
      
      const a = sameClusterPoints.reduce((sum, point) => 
        sum + this.euclideanDistance(data[i], point), 0
      ) / sameClusterPoints.length;
      
      // Calculate b(i): min mean distance to points in other clusters
      let b = Infinity;
      for (let c = 0; c < k; c++) {
        if (c === clusterLabel) continue;
        
        const otherClusterPoints = data.filter((_, idx) => this.labels[idx] === c);
        if (otherClusterPoints.length === 0) continue;
        
        const meanDist = otherClusterPoints.reduce((sum, point) => 
          sum + this.euclideanDistance(data[i], point), 0
        ) / otherClusterPoints.length;
        
        b = Math.min(b, meanDist);
      }
      
      // Calculate silhouette coefficient for point i
      const s = (b - a) / Math.max(a, b);
      totalScore += s;
    }
    
    return totalScore / n;
  }
}

// ============== DBSCAN Clustering ==============
export class DBSCANClustering {
  private labels: number[] = [];
  private corePoints: Set<number> = new Set();
  
  fit(data: number[][], eps: number, minPts: number): ClusterResult {
    const n = data.length;
    this.labels = new Array(n).fill(-1); // -1 for noise
    let clusterId = 0;
    
    for (let i = 0; i < n; i++) {
      if (this.labels[i] !== -1) continue; // Already processed
      
      const neighbors = this.regionQuery(data, i, eps);
      
      if (neighbors.length < minPts) {
        // Mark as noise (already -1)
        continue;
      }
      
      // Start new cluster
      this.expandCluster(data, i, neighbors, clusterId, eps, minPts);
      clusterId++;
    }
    
    // Calculate cluster statistics
    const clusters: number[][] = [];
    const centroids: number[][] = [];
    
    for (let c = 0; c < clusterId; c++) {
      const clusterIndices: number[] = [];
      const clusterPoints: number[][] = [];
      
      for (let i = 0; i < n; i++) {
        if (this.labels[i] === c) {
          clusterIndices.push(i);
          clusterPoints.push(data[i]);
        }
      }
      
      clusters.push(clusterIndices);
      
      // Calculate centroid
      if (clusterPoints.length > 0) {
        const centroid = this.calculateMean(clusterPoints);
        centroids.push(centroid);
      }
    }
    
    // Add noise cluster
    const noiseIndices = this.labels
      .map((label, idx) => label === -1 ? idx : -1)
      .filter(idx => idx !== -1);
    
    if (noiseIndices.length > 0) {
      clusters.push(noiseIndices);
    }
    
    // Calculate inertia
    let inertia = 0;
    for (let i = 0; i < n; i++) {
      if (this.labels[i] >= 0) {
        const centroid = centroids[this.labels[i]];
        inertia += Math.pow(this.euclideanDistance(data[i], centroid), 2);
      }
    }
    
    return {
      clusters,
      centroids,
      labels: this.labels,
      inertia,
      iterations: 1
    };
  }
  
  private expandCluster(
    data: number[][],
    pointIdx: number,
    neighbors: number[],
    clusterId: number,
    eps: number,
    minPts: number
  ): void {
    this.labels[pointIdx] = clusterId;
    this.corePoints.add(pointIdx);
    
    let i = 0;
    while (i < neighbors.length) {
      const neighborIdx = neighbors[i];
      
      if (this.labels[neighborIdx] === -1) {
        // Change noise to border point
        this.labels[neighborIdx] = clusterId;
      } else if (this.labels[neighborIdx] === -1 || this.labels[neighborIdx] === undefined) {
        this.labels[neighborIdx] = clusterId;
        
        const neighborNeighbors = this.regionQuery(data, neighborIdx, eps);
        if (neighborNeighbors.length >= minPts) {
          this.corePoints.add(neighborIdx);
          // Add new neighbors to the list
          for (const nn of neighborNeighbors) {
            if (!neighbors.includes(nn)) {
              neighbors.push(nn);
            }
          }
        }
      }
      
      i++;
    }
  }
  
  private regionQuery(data: number[][], pointIdx: number, eps: number): number[] {
    const neighbors: number[] = [];
    const point = data[pointIdx];
    
    for (let i = 0; i < data.length; i++) {
      if (this.euclideanDistance(point, data[i]) <= eps) {
        neighbors.push(i);
      }
    }
    
    return neighbors;
  }
  
  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }
  
  private calculateMean(points: number[][]): number[] {
    const dim = points[0].length;
    const mean = new Array(dim).fill(0);
    
    for (const point of points) {
      for (let i = 0; i < dim; i++) {
        mean[i] += point[i];
      }
    }
    
    return mean.map(val => val / points.length);
  }
}

// ============== Hierarchical Clustering ==============
export class HierarchicalClustering {
  private distanceMatrix: number[][] = [];
  private linkageMatrix: number[][] = [];
  
  fit(
    data: number[][],
    method: 'single' | 'complete' | 'average' | 'ward' = 'average'
  ): { dendrogram: number[][]; clusters: number[][] } {
    const n = data.length;
    
    // Calculate distance matrix
    this.distanceMatrix = this.calculateDistanceMatrix(data);
    
    // Initialize clusters (each point is its own cluster)
    const clusters: Set<number>[] = [];
    for (let i = 0; i < n; i++) {
      clusters.push(new Set([i]));
    }
    
    // Linkage matrix for dendrogram
    this.linkageMatrix = [];
    
    // Perform hierarchical clustering
    let clusterIdx = n;
    while (clusters.length > 1) {
      // Find minimum distance
      let minDist = Infinity;
      let minI = 0, minJ = 1;
      
      for (let i = 0; i < clusters.length - 1; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const dist = this.calculateLinkageDistance(
            clusters[i],
            clusters[j],
            data,
            method
          );
          
          if (dist < minDist) {
            minDist = dist;
            minI = i;
            minJ = j;
          }
        }
      }
      
      // Merge clusters
      const newCluster = new Set([...clusters[minI], ...clusters[minJ]]);
      const size = newCluster.size;
      
      // Add to linkage matrix
      this.linkageMatrix.push([
        Math.min(...Array.from(clusters[minI])),
        Math.min(...Array.from(clusters[minJ])),
        minDist,
        size
      ]);
      
      // Remove old clusters and add new one
      clusters.splice(Math.max(minI, minJ), 1);
      clusters.splice(Math.min(minI, minJ), 1);
      clusters.push(newCluster);
      
      clusterIdx++;
    }
    
    return {
      dendrogram: this.linkageMatrix,
      clusters: this.cutDendrogram(3) // Default to 3 clusters
    };
  }
  
  cutDendrogram(k: number): number[][] {
    // Cut dendrogram to get k clusters
    const n = this.linkageMatrix.length + 1;
    const clusters: number[][] = [];
    
    // Start with each point as its own cluster
    for (let i = 0; i < n; i++) {
      clusters.push([i]);
    }
    
    // Apply merges from linkage matrix until we have k clusters
    const merges = this.linkageMatrix.length - k + 1;
    for (let i = 0; i < merges; i++) {
      const [idx1, idx2] = this.linkageMatrix[i];
      
      // Find clusters containing these indices
      let cluster1Idx = -1, cluster2Idx = -1;
      for (let j = 0; j < clusters.length; j++) {
        if (clusters[j].includes(idx1)) cluster1Idx = j;
        if (clusters[j].includes(idx2)) cluster2Idx = j;
      }
      
      if (cluster1Idx !== -1 && cluster2Idx !== -1 && cluster1Idx !== cluster2Idx) {
        // Merge clusters
        clusters[cluster1Idx] = [...clusters[cluster1Idx], ...clusters[cluster2Idx]];
        clusters.splice(cluster2Idx, 1);
      }
    }
    
    return clusters;
  }
  
  private calculateDistanceMatrix(data: number[][]): number[][] {
    const n = data.length;
    const matrix: number[][] = [];
    
    for (let i = 0; i < n; i++) {
      matrix[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 0;
        } else {
          matrix[i][j] = this.euclideanDistance(data[i], data[j]);
        }
      }
    }
    
    return matrix;
  }
  
  private calculateLinkageDistance(
    cluster1: Set<number>,
    cluster2: Set<number>,
    data: number[][],
    method: string
  ): number {
    const distances: number[] = [];
    
    for (const i of cluster1) {
      for (const j of cluster2) {
        distances.push(this.euclideanDistance(data[i], data[j]));
      }
    }
    
    switch (method) {
      case 'single':
        return Math.min(...distances);
      case 'complete':
        return Math.max(...distances);
      case 'average':
        return distances.reduce((sum, d) => sum + d, 0) / distances.length;
      case 'ward':
        // Ward's method minimizes within-cluster variance
        const allPoints = [...Array.from(cluster1), ...Array.from(cluster2)].map(i => data[i]);
        const centroid1 = this.calculateMean(Array.from(cluster1).map(i => data[i]));
        const centroid2 = this.calculateMean(Array.from(cluster2).map(i => data[i]));
        const mergedCentroid = this.calculateMean(allPoints);
        
        const variance1 = Array.from(cluster1).reduce((sum, i) => 
          sum + Math.pow(this.euclideanDistance(data[i], centroid1), 2), 0
        );
        const variance2 = Array.from(cluster2).reduce((sum, i) => 
          sum + Math.pow(this.euclideanDistance(data[i], centroid2), 2), 0
        );
        const mergedVariance = allPoints.reduce((sum, point) => 
          sum + Math.pow(this.euclideanDistance(point, mergedCentroid), 2), 0
        );
        
        return mergedVariance - variance1 - variance2;
      default:
        return distances.reduce((sum, d) => sum + d, 0) / distances.length;
    }
  }
  
  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }
  
  private calculateMean(points: number[][]): number[] {
    const dim = points[0].length;
    const mean = new Array(dim).fill(0);
    
    for (const point of points) {
      for (let i = 0; i < dim; i++) {
        mean[i] += point[i];
      }
    }
    
    return mean.map(val => val / points.length);
  }
}

// ============== Decision Tree Classifier ==============
export class DecisionTreeClassifier {
  private tree: TreeNode | null = null;
  private maxDepth: number = 10;
  private minSamplesSplit: number = 2;
  private minSamplesLeaf: number = 1;
  private maxFeatures: number | 'sqrt' | 'log2' | null = null;
  
  constructor(config?: {
    maxDepth?: number;
    minSamplesSplit?: number;
    minSamplesLeaf?: number;
    maxFeatures?: number | 'sqrt' | 'log2' | null;
  }) {
    if (config) {
      this.maxDepth = config.maxDepth ?? this.maxDepth;
      this.minSamplesSplit = config.minSamplesSplit ?? this.minSamplesSplit;
      this.minSamplesLeaf = config.minSamplesLeaf ?? this.minSamplesLeaf;
      this.maxFeatures = config.maxFeatures ?? this.maxFeatures;
    }
  }
  
  fit(X: number[][], y: any[]): void {
    this.tree = this.buildTree(X, y, 0);
  }
  
  predict(X: number[][]): any[] {
    if (!this.tree) {
      throw new Error('Model not fitted yet');
    }
    return X.map(sample => this.predictSample(sample, this.tree!));
  }
  
  private buildTree(X: number[][], y: any[], depth: number): TreeNode {
    const nSamples = X.length;
    const nFeatures = X[0].length;
    const classes = [...new Set(y)];
    
    // Check stopping criteria
    if (depth >= this.maxDepth ||
        nSamples < this.minSamplesSplit ||
        classes.length === 1) {
      return this.createLeaf(y);
    }
    
    // Find best split
    const bestSplit = this.findBestSplit(X, y);
    
    if (!bestSplit) {
      return this.createLeaf(y);
    }
    
    // Split data
    const leftIndices: number[] = [];
    const rightIndices: number[] = [];
    
    for (let i = 0; i < nSamples; i++) {
      if (X[i][bestSplit.feature] <= bestSplit.threshold) {
        leftIndices.push(i);
      } else {
        rightIndices.push(i);
      }
    }
    
    // Check minimum samples in leaves
    if (leftIndices.length < this.minSamplesLeaf ||
        rightIndices.length < this.minSamplesLeaf) {
      return this.createLeaf(y);
    }
    
    // Recursively build subtrees
    const leftX = leftIndices.map(i => X[i]);
    const leftY = leftIndices.map(i => y[i]);
    const rightX = rightIndices.map(i => X[i]);
    const rightY = rightIndices.map(i => y[i]);
    
    return {
      feature: bestSplit.feature,
      threshold: bestSplit.threshold,
      left: this.buildTree(leftX, leftY, depth + 1),
      right: this.buildTree(rightX, rightY, depth + 1),
      value: null
    };
  }
  
  private findBestSplit(X: number[][], y: any[]): Split | null {
    const nSamples = X.length;
    const nFeatures = X[0].length;
    
    let bestGain = -Infinity;
    let bestSplit: Split | null = null;
    
    // Calculate current impurity
    const currentImpurity = this.giniImpurity(y);
    
    // Determine features to consider
    const featuresToConsider = this.selectFeatures(nFeatures);
    
    for (const feature of featuresToConsider) {
      const values = X.map(row => row[feature]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
      
      // Try different thresholds
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        
        // Split data
        const leftY: any[] = [];
        const rightY: any[] = [];
        
        for (let j = 0; j < nSamples; j++) {
          if (X[j][feature] <= threshold) {
            leftY.push(y[j]);
          } else {
            rightY.push(y[j]);
          }
        }
        
        if (leftY.length === 0 || rightY.length === 0) continue;
        
        // Calculate information gain
        const leftImpurity = this.giniImpurity(leftY);
        const rightImpurity = this.giniImpurity(rightY);
        const weightedImpurity = (leftY.length * leftImpurity + rightY.length * rightImpurity) / nSamples;
        const gain = currentImpurity - weightedImpurity;
        
        if (gain > bestGain) {
          bestGain = gain;
          bestSplit = { feature, threshold };
        }
      }
    }
    
    return bestSplit;
  }
  
  private selectFeatures(nFeatures: number): number[] {
    if (this.maxFeatures === null) {
      return Array.from({ length: nFeatures }, (_, i) => i);
    }
    
    let nFeaturesToSelect: number;
    
    if (typeof this.maxFeatures === 'number') {
      nFeaturesToSelect = Math.min(this.maxFeatures, nFeatures);
    } else if (this.maxFeatures === 'sqrt') {
      nFeaturesToSelect = Math.floor(Math.sqrt(nFeatures));
    } else if (this.maxFeatures === 'log2') {
      nFeaturesToSelect = Math.floor(Math.log2(nFeatures));
    } else {
      nFeaturesToSelect = nFeatures;
    }
    
    // Random selection without replacement
    const features = Array.from({ length: nFeatures }, (_, i) => i);
    const selected: number[] = [];
    
    for (let i = 0; i < nFeaturesToSelect; i++) {
      const idx = Math.floor(Math.random() * features.length);
      selected.push(features[idx]);
      features.splice(idx, 1);
    }
    
    return selected;
  }
  
  private giniImpurity(y: any[]): number {
    const n = y.length;
    if (n === 0) return 0;
    
    const classCounts = new Map<any, number>();
    for (const label of y) {
      classCounts.set(label, (classCounts.get(label) || 0) + 1);
    }
    
    let impurity = 1;
    for (const count of classCounts.values()) {
      const prob = count / n;
      impurity -= prob * prob;
    }
    
    return impurity;
  }
  
  private createLeaf(y: any[]): TreeNode {
    // Return most common class
    const classCounts = new Map<any, number>();
    for (const label of y) {
      classCounts.set(label, (classCounts.get(label) || 0) + 1);
    }
    
    let maxCount = 0;
    let mostCommon = y[0];
    
    for (const [label, count] of classCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = label;
      }
    }
    
    return {
      feature: null,
      threshold: null,
      left: null,
      right: null,
      value: mostCommon
    };
  }
  
  private predictSample(sample: number[], node: TreeNode): any {
    if (node.value !== null) {
      return node.value;
    }
    
    if (sample[node.feature!] <= node.threshold!) {
      return this.predictSample(sample, node.left!);
    } else {
      return this.predictSample(sample, node.right!);
    }
  }
}

interface TreeNode {
  feature: number | null;
  threshold: number | null;
  left: TreeNode | null;
  right: TreeNode | null;
  value: any;
}

interface Split {
  feature: number;
  threshold: number;
}

// ============== Random Forest Classifier ==============
export class RandomForestClassifier {
  private trees: DecisionTreeClassifier[] = [];
  private nEstimators: number = 100;
  private maxDepth: number = 10;
  private minSamplesSplit: number = 2;
  private minSamplesLeaf: number = 1;
  private maxFeatures: number | 'sqrt' | 'log2' | null = 'sqrt';
  private bootstrapSampleSize: number = 1.0;
  
  constructor(config?: {
    nEstimators?: number;
    maxDepth?: number;
    minSamplesSplit?: number;
    minSamplesLeaf?: number;
    maxFeatures?: number | 'sqrt' | 'log2' | null;
    bootstrapSampleSize?: number;
  }) {
    if (config) {
      this.nEstimators = config.nEstimators ?? this.nEstimators;
      this.maxDepth = config.maxDepth ?? this.maxDepth;
      this.minSamplesSplit = config.minSamplesSplit ?? this.minSamplesSplit;
      this.minSamplesLeaf = config.minSamplesLeaf ?? this.minSamplesLeaf;
      this.maxFeatures = config.maxFeatures ?? this.maxFeatures;
      this.bootstrapSampleSize = config.bootstrapSampleSize ?? this.bootstrapSampleSize;
    }
  }
  
  fit(X: number[][], y: any[]): void {
    const nSamples = X.length;
    const sampleSize = Math.floor(nSamples * this.bootstrapSampleSize);
    
    this.trees = [];
    
    for (let i = 0; i < this.nEstimators; i++) {
      // Bootstrap sampling
      const indices: number[] = [];
      for (let j = 0; j < sampleSize; j++) {
        indices.push(Math.floor(Math.random() * nSamples));
      }
      
      const bootstrapX = indices.map(idx => X[idx]);
      const bootstrapY = indices.map(idx => y[idx]);
      
      // Train tree
      const tree = new DecisionTreeClassifier({
        maxDepth: this.maxDepth,
        minSamplesSplit: this.minSamplesSplit,
        minSamplesLeaf: this.minSamplesLeaf,
        maxFeatures: this.maxFeatures
      });
      
      tree.fit(bootstrapX, bootstrapY);
      this.trees.push(tree);
    }
  }
  
  predict(X: number[][]): any[] {
    const predictions = this.trees.map(tree => tree.predict(X));
    
    // Majority voting
    return X.map((_, sampleIdx) => {
      const votes = new Map<any, number>();
      
      for (const treePredictions of predictions) {
        const prediction = treePredictions[sampleIdx];
        votes.set(prediction, (votes.get(prediction) || 0) + 1);
      }
      
      let maxVotes = 0;
      let finalPrediction = null;
      
      for (const [label, count] of votes.entries()) {
        if (count > maxVotes) {
          maxVotes = count;
          finalPrediction = label;
        }
      }
      
      return finalPrediction;
    });
  }
  
  predictProbability(X: number[][]): number[][] {
    const predictions = this.trees.map(tree => tree.predict(X));
    const classes = [...new Set(predictions.flat())];
    
    return X.map((_, sampleIdx) => {
      const votes = new Map<any, number>();
      
      for (const treePredictions of predictions) {
        const prediction = treePredictions[sampleIdx];
        votes.set(prediction, (votes.get(prediction) || 0) + 1);
      }
      
      return classes.map(cls => (votes.get(cls) || 0) / this.nEstimators);
    });
  }
  
  getFeatureImportance(): number[] {
    // Simplified feature importance based on how often features are used
    // In a real implementation, this would be based on impurity decrease
    return [];
  }
}

// ============== Support Vector Machine ==============
export class SupportVectorMachine {
  private supportVectors: number[][] = [];
  private supportVectorLabels: number[] = [];
  private alphas: number[] = [];
  private b: number = 0;
  private kernel: KernelFunction;
  private C: number = 1.0;
  private tol: number = 1e-3;
  private maxPasses: number = 100;
  
  constructor(
    kernel: 'linear' | 'rbf' | 'poly' = 'rbf',
    C: number = 1.0,
    gamma: number = 0.1,
    degree: number = 3
  ) {
    this.C = C;
    
    switch (kernel) {
      case 'linear':
        this.kernel = (x1, x2) => this.dotProduct(x1, x2);
        break;
      case 'rbf':
        this.kernel = (x1, x2) => Math.exp(-gamma * this.squaredDistance(x1, x2));
        break;
      case 'poly':
        this.kernel = (x1, x2) => Math.pow(this.dotProduct(x1, x2) + 1, degree);
        break;
    }
  }
  
  fit(X: number[][], y: number[]): void {
    const n = X.length;
    
    // Convert labels to -1 and 1
    const uniqueLabels = [...new Set(y)];
    if (uniqueLabels.length !== 2) {
      throw new Error('SVM only supports binary classification');
    }
    
    const labels = y.map(label => label === uniqueLabels[0] ? -1 : 1);
    
    // Initialize alphas
    this.alphas = new Array(n).fill(0);
    this.b = 0;
    
    // SMO algorithm
    let passes = 0;
    
    while (passes < this.maxPasses) {
      let numChangedAlphas = 0;
      
      for (let i = 0; i < n; i++) {
        const Ei = this.calculateError(X[i], labels[i], X, labels);
        
        if ((labels[i] * Ei < -this.tol && this.alphas[i] < this.C) ||
            (labels[i] * Ei > this.tol && this.alphas[i] > 0)) {
          
          // Select j randomly
          let j = i;
          while (j === i) {
            j = Math.floor(Math.random() * n);
          }
          
          const Ej = this.calculateError(X[j], labels[j], X, labels);
          
          // Save old alphas
          const alphaIOld = this.alphas[i];
          const alphaJOld = this.alphas[j];
          
          // Compute bounds
          let L, H;
          if (labels[i] !== labels[j]) {
            L = Math.max(0, this.alphas[j] - this.alphas[i]);
            H = Math.min(this.C, this.C + this.alphas[j] - this.alphas[i]);
          } else {
            L = Math.max(0, this.alphas[i] + this.alphas[j] - this.C);
            H = Math.min(this.C, this.alphas[i] + this.alphas[j]);
          }
          
          if (L === H) continue;
          
          // Calculate eta
          const eta = 2 * this.kernel(X[i], X[j]) - 
                     this.kernel(X[i], X[i]) - 
                     this.kernel(X[j], X[j]);
          
          if (eta >= 0) continue;
          
          // Update alpha j
          this.alphas[j] -= labels[j] * (Ei - Ej) / eta;
          this.alphas[j] = Math.min(H, Math.max(L, this.alphas[j]));
          
          if (Math.abs(this.alphas[j] - alphaJOld) < 1e-5) continue;
          
          // Update alpha i
          this.alphas[i] += labels[i] * labels[j] * (alphaJOld - this.alphas[j]);
          
          // Update b
          const b1 = this.b - Ei - 
                    labels[i] * (this.alphas[i] - alphaIOld) * this.kernel(X[i], X[i]) -
                    labels[j] * (this.alphas[j] - alphaJOld) * this.kernel(X[i], X[j]);
          
          const b2 = this.b - Ej -
                    labels[i] * (this.alphas[i] - alphaIOld) * this.kernel(X[i], X[j]) -
                    labels[j] * (this.alphas[j] - alphaJOld) * this.kernel(X[j], X[j]);
          
          if (0 < this.alphas[i] && this.alphas[i] < this.C) {
            this.b = b1;
          } else if (0 < this.alphas[j] && this.alphas[j] < this.C) {
            this.b = b2;
          } else {
            this.b = (b1 + b2) / 2;
          }
          
          numChangedAlphas++;
        }
      }
      
      if (numChangedAlphas === 0) {
        passes++;
      } else {
        passes = 0;
      }
    }
    
    // Store support vectors
    this.supportVectors = [];
    this.supportVectorLabels = [];
    
    for (let i = 0; i < n; i++) {
      if (this.alphas[i] > 0) {
        this.supportVectors.push(X[i]);
        this.supportVectorLabels.push(labels[i]);
      }
    }
  }
  
  predict(X: number[][]): number[] {
    return X.map(sample => {
      let sum = 0;
      
      for (let i = 0; i < this.supportVectors.length; i++) {
        sum += this.alphas[i] * this.supportVectorLabels[i] * 
               this.kernel(this.supportVectors[i], sample);
      }
      
      return sum + this.b > 0 ? 1 : -1;
    });
  }
  
  private calculateError(
    x: number[],
    y: number,
    X: number[][],
    labels: number[]
  ): number {
    let sum = 0;
    
    for (let i = 0; i < X.length; i++) {
      if (this.alphas[i] > 0) {
        sum += this.alphas[i] * labels[i] * this.kernel(X[i], x);
      }
    }
    
    return sum + this.b - y;
  }
  
  private dotProduct(x1: number[], x2: number[]): number {
    return x1.reduce((sum, val, i) => sum + val * x2[i], 0);
  }
  
  private squaredDistance(x1: number[], x2: number[]): number {
    return x1.reduce((sum, val, i) => sum + Math.pow(val - x2[i], 2), 0);
  }
}

type KernelFunction = (x1: number[], x2: number[]) => number;

// ============== Principal Component Analysis ==============
export class PrincipalComponentAnalysis {
  private components: number[][] = [];
  private mean: number[] = [];
  private explainedVariance: number[] = [];
  private explainedVarianceRatio: number[] = [];
  private singularValues: number[] = [];
  
  fit(X: number[][], nComponents?: number): PCAResult {
    const n = X.length;
    const m = X[0].length;
    
    // Center the data
    this.mean = this.calculateMean(X);
    const centeredX = X.map(row => 
      row.map((val, i) => val - this.mean[i])
    );
    
    // Calculate covariance matrix
    const covMatrix = this.calculateCovarianceMatrix(centeredX);
    
    // Eigenvalue decomposition
    const { eigenvalues, eigenvectors } = this.eigenDecomposition(covMatrix);
    
    // Sort by eigenvalues (descending)
    const indices = eigenvalues
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => b.val - a.val)
      .map(item => item.idx);
    
    const sortedEigenvalues = indices.map(i => eigenvalues[i]);
    const sortedEigenvectors = indices.map(i => eigenvectors[i]);
    
    // Select components
    const k = nComponents || m;
    this.components = sortedEigenvectors.slice(0, k);
    this.explainedVariance = sortedEigenvalues.slice(0, k);
    
    // Calculate explained variance ratio
    const totalVariance = sortedEigenvalues.reduce((sum, val) => sum + val, 0);
    this.explainedVarianceRatio = this.explainedVariance.map(val => val / totalVariance);
    
    // Calculate singular values
    this.singularValues = this.explainedVariance.map(val => Math.sqrt(val * (n - 1)));
    
    // Transform data
    const transformedData = this.transform(X);
    
    return {
      transformedData,
      components: this.components,
      explainedVariance: this.explainedVariance,
      explainedVarianceRatio: this.explainedVarianceRatio,
      mean: this.mean,
      singularValues: this.singularValues
    };
  }
  
  transform(X: number[][]): number[][] {
    // Center the data
    const centeredX = X.map(row => 
      row.map((val, i) => val - this.mean[i])
    );
    
    // Project onto components
    return centeredX.map(row => 
      this.components.map(component => 
        row.reduce((sum, val, i) => sum + val * component[i], 0)
      )
    );
  }
  
  inverseTransform(X: number[][]): number[][] {
    // Reconstruct from components
    return X.map(row => {
      const reconstructed = new Array(this.mean.length).fill(0);
      
      for (let i = 0; i < row.length; i++) {
        for (let j = 0; j < this.mean.length; j++) {
          reconstructed[j] += row[i] * this.components[i][j];
        }
      }
      
      // Add mean back
      return reconstructed.map((val, i) => val + this.mean[i]);
    });
  }
  
  private calculateMean(X: number[][]): number[] {
    const n = X.length;
    const m = X[0].length;
    const mean = new Array(m).fill(0);
    
    for (const row of X) {
      for (let i = 0; i < m; i++) {
        mean[i] += row[i];
      }
    }
    
    return mean.map(val => val / n);
  }
  
  private calculateCovarianceMatrix(X: number[][]): number[][] {
    const n = X.length;
    const m = X[0].length;
    const cov: number[][] = [];
    
    for (let i = 0; i < m; i++) {
      cov[i] = [];
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += X[k][i] * X[k][j];
        }
        cov[i][j] = sum / (n - 1);
      }
    }
    
    return cov;
  }
  
  private eigenDecomposition(matrix: number[][]): {
    eigenvalues: number[];
    eigenvectors: number[][];
  } {
    // Power iteration method for eigendecomposition
    const n = matrix.length;
    const eigenvalues: number[] = [];
    const eigenvectors: number[][] = [];
    
    let A = matrix.map(row => [...row]);
    
    for (let i = 0; i < n; i++) {
      // Random initial vector
      let v = new Array(n).fill(0).map(() => Math.random());
      let eigenvalue = 0;
      
      // Power iteration
      for (let iter = 0; iter < 1000; iter++) {
        // Normalize
        const norm = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
        v = v.map(val => val / norm);
        
        // Multiply by matrix
        const Av = A.map(row => 
          row.reduce((sum, val, j) => sum + val * v[j], 0)
        );
        
        // Calculate eigenvalue
        const newEigenvalue = v.reduce((sum, val, j) => sum + val * Av[j], 0);
        
        if (Math.abs(newEigenvalue - eigenvalue) < 1e-10) break;
        
        eigenvalue = newEigenvalue;
        v = Av;
      }
      
      eigenvalues.push(eigenvalue);
      eigenvectors.push(v);
      
      // Deflate matrix
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          A[j][k] -= eigenvalue * v[j] * v[k];
        }
      }
    }
    
    return { eigenvalues, eigenvectors };
  }
}

// ============== Neural Network ==============
export class NeuralNetwork {
  private layers: Layer[] = [];
  private optimizer: Optimizer;
  private lossFunction: LossFunction;
  
  constructor(config: NeuralNetworkConfig) {
    // Build layers
    for (const layerConfig of config.layers) {
      this.layers.push(this.createLayer(layerConfig));
    }
    
    // Initialize optimizer
    this.optimizer = this.createOptimizer(config.optimizer);
    this.lossFunction = config.loss;
  }
  
  fit(
    X: number[][],
    y: number[][],
    epochs: number = 100,
    batchSize: number = 32,
    validationSplit: number = 0.2
  ): { history: TrainingHistory } {
    const n = X.length;
    const valSize = Math.floor(n * validationSplit);
    const trainSize = n - valSize;
    
    // Split data
    const indices = Array.from({ length: n }, (_, i) => i);
    this.shuffle(indices);
    
    const trainIndices = indices.slice(0, trainSize);
    const valIndices = indices.slice(trainSize);
    
    const trainX = trainIndices.map(i => X[i]);
    const trainY = trainIndices.map(i => y[i]);
    const valX = valIndices.map(i => X[i]);
    const valY = valIndices.map(i => y[i]);
    
    const history: TrainingHistory = {
      loss: [],
      valLoss: [],
      accuracy: [],
      valAccuracy: []
    };
    
    // Training loop
    for (let epoch = 0; epoch < epochs; epoch++) {
      let epochLoss = 0;
      let epochAccuracy = 0;
      let batches = 0;
      
      // Shuffle training data
      const epochIndices = Array.from({ length: trainSize }, (_, i) => i);
      this.shuffle(epochIndices);
      
      // Train on batches
      for (let i = 0; i < trainSize; i += batchSize) {
        const batchX = epochIndices
          .slice(i, Math.min(i + batchSize, trainSize))
          .map(idx => trainX[idx]);
        const batchY = epochIndices
          .slice(i, Math.min(i + batchSize, trainSize))
          .map(idx => trainY[idx]);
        
        // Forward pass
        const predictions = this.forward(batchX);
        
        // Calculate loss
        const loss = this.calculateLoss(predictions, batchY);
        epochLoss += loss;
        
        // Calculate accuracy
        const accuracy = this.calculateAccuracy(predictions, batchY);
        epochAccuracy += accuracy;
        
        // Backward pass
        this.backward(batchX, batchY, predictions);
        
        // Update weights
        this.optimizer.update(this.layers);
        
        batches++;
      }
      
      // Calculate validation metrics
      const valPredictions = this.forward(valX);
      const valLoss = this.calculateLoss(valPredictions, valY);
      const valAccuracy = this.calculateAccuracy(valPredictions, valY);
      
      // Store history
      history.loss.push(epochLoss / batches);
      history.valLoss.push(valLoss);
      history.accuracy.push(epochAccuracy / batches);
      history.valAccuracy.push(valAccuracy);
      
      // Log progress
      if (epoch % 10 === 0) {
        console.log(`Epoch ${epoch}: loss=${(epochLoss / batches).toFixed(4)}, ` +
                   `accuracy=${(epochAccuracy / batches).toFixed(4)}, ` +
                   `val_loss=${valLoss.toFixed(4)}, ` +
                   `val_accuracy=${valAccuracy.toFixed(4)}`);
      }
    }
    
    return { history };
  }
  
  predict(X: number[][]): number[][] {
    return this.forward(X);
  }
  
  private forward(X: number[][]): number[][] {
    let output = X;
    
    for (const layer of this.layers) {
      output = layer.forward(output);
    }
    
    return output;
  }
  
  private backward(X: number[][], y: number[][], predictions: number[][]): void {
    // Calculate initial gradient
    let gradient = this.calculateLossGradient(predictions, y);
    
    // Backpropagate through layers
    for (let i = this.layers.length - 1; i >= 0; i--) {
      gradient = this.layers[i].backward(gradient);
    }
  }
  
  private calculateLoss(predictions: number[][], targets: number[][]): number {
    const n = predictions.length;
    let loss = 0;
    
    switch (this.lossFunction) {
      case 'mse':
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < predictions[i].length; j++) {
            loss += Math.pow(predictions[i][j] - targets[i][j], 2);
          }
        }
        return loss / n;
        
      case 'mae':
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < predictions[i].length; j++) {
            loss += Math.abs(predictions[i][j] - targets[i][j]);
          }
        }
        return loss / n;
        
      case 'binary_crossentropy':
        for (let i = 0; i < n; i++) {
          const p = Math.max(1e-7, Math.min(1 - 1e-7, predictions[i][0]));
          loss -= targets[i][0] * Math.log(p) + (1 - targets[i][0]) * Math.log(1 - p);
        }
        return loss / n;
        
      case 'categorical_crossentropy':
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < predictions[i].length; j++) {
            const p = Math.max(1e-7, predictions[i][j]);
            loss -= targets[i][j] * Math.log(p);
          }
        }
        return loss / n;
        
      default:
        return 0;
    }
  }
  
  private calculateLossGradient(predictions: number[][], targets: number[][]): number[][] {
    const n = predictions.length;
    const gradient: number[][] = [];
    
    switch (this.lossFunction) {
      case 'mse':
        for (let i = 0; i < n; i++) {
          gradient[i] = predictions[i].map((p, j) => 2 * (p - targets[i][j]) / n);
        }
        break;
        
      case 'mae':
        for (let i = 0; i < n; i++) {
          gradient[i] = predictions[i].map((p, j) => 
            p > targets[i][j] ? 1 / n : -1 / n
          );
        }
        break;
        
      case 'binary_crossentropy':
      case 'categorical_crossentropy':
        for (let i = 0; i < n; i++) {
          gradient[i] = predictions[i].map((p, j) => (p - targets[i][j]) / n);
        }
        break;
    }
    
    return gradient;
  }
  
  private calculateAccuracy(predictions: number[][], targets: number[][]): number {
    const n = predictions.length;
    let correct = 0;
    
    for (let i = 0; i < n; i++) {
      if (predictions[i].length === 1) {
        // Binary classification
        const predicted = predictions[i][0] > 0.5 ? 1 : 0;
        const actual = targets[i][0];
        if (predicted === actual) correct++;
      } else {
        // Multi-class classification
        const predictedIdx = predictions[i].indexOf(Math.max(...predictions[i]));
        const actualIdx = targets[i].indexOf(Math.max(...targets[i]));
        if (predictedIdx === actualIdx) correct++;
      }
    }
    
    return correct / n;
  }
  
  private createLayer(config: LayerConfig): Layer {
    switch (config.type) {
      case 'dense':
        return new DenseLayer(config.units!, config.activation);
      case 'dropout':
        return new DropoutLayer(config.dropoutRate!);
      default:
        throw new Error(`Unknown layer type: ${config.type}`);
    }
  }
  
  private createOptimizer(config: OptimizerConfig): Optimizer {
    switch (config.type) {
      case 'sgd':
        return new SGDOptimizer(config.learningRate, config.momentum);
      case 'adam':
        return new AdamOptimizer(config.learningRate, config.beta1, config.beta2, config.epsilon);
      default:
        throw new Error(`Unknown optimizer type: ${config.type}`);
    }
  }
  
  private shuffle(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

// Layer implementations
abstract class Layer {
  abstract forward(input: number[][]): number[][];
  abstract backward(gradient: number[][]): number[][];
  abstract getWeights(): { weights: number[][]; biases: number[] } | null;
  abstract setWeights(weights: number[][], biases: number[]): void;
}

class DenseLayer extends Layer {
  private weights: number[][] = [];
  private biases: number[] = [];
  private lastInput: number[][] = [];
  private lastOutput: number[][] = [];
  private activation?: ActivationFunction;
  
  constructor(units: number, activation?: ActivationFunction) {
    super();
    this.activation = activation;
    // Weights will be initialized on first forward pass
  }
  
  forward(input: number[][]): number[][] {
    this.lastInput = input;
    const batchSize = input.length;
    const inputSize = input[0].length;
    
    // Initialize weights if needed
    if (this.weights.length === 0) {
      const outputSize = this.biases.length || 10; // Default to 10 units
      this.initializeWeights(inputSize, outputSize);
    }
    
    // Linear transformation
    const output: number[][] = [];
    for (let i = 0; i < batchSize; i++) {
      output[i] = [];
      for (let j = 0; j < this.weights[0].length; j++) {
        let sum = this.biases[j];
        for (let k = 0; k < inputSize; k++) {
          sum += input[i][k] * this.weights[k][j];
        }
        output[i][j] = sum;
      }
    }
    
    // Apply activation
    if (this.activation) {
      for (let i = 0; i < batchSize; i++) {
        output[i] = this.applyActivation(output[i]);
      }
    }
    
    this.lastOutput = output;
    return output;
  }
  
  backward(gradient: number[][]): number[][] {
    // Apply activation gradient
    if (this.activation) {
      for (let i = 0; i < gradient.length; i++) {
        gradient[i] = this.applyActivationGradient(gradient[i], this.lastOutput[i]);
      }
    }
    
    // Calculate input gradient
    const inputGradient: number[][] = [];
    for (let i = 0; i < gradient.length; i++) {
      inputGradient[i] = [];
      for (let j = 0; j < this.weights.length; j++) {
        let sum = 0;
        for (let k = 0; k < this.weights[0].length; k++) {
          sum += gradient[i][k] * this.weights[j][k];
        }
        inputGradient[i][j] = sum;
      }
    }
    
    // Calculate weight gradients (stored for optimizer)
    // In a real implementation, these would be stored for the optimizer
    
    return inputGradient;
  }
  
  getWeights(): { weights: number[][]; biases: number[] } {
    return { weights: this.weights, biases: this.biases };
  }
  
  setWeights(weights: number[][], biases: number[]): void {
    this.weights = weights;
    this.biases = biases;
  }
  
  private initializeWeights(inputSize: number, outputSize: number): void {
    // Xavier/Glorot initialization
    const scale = Math.sqrt(2 / (inputSize + outputSize));
    
    this.weights = [];
    for (let i = 0; i < inputSize; i++) {
      this.weights[i] = [];
      for (let j = 0; j < outputSize; j++) {
        this.weights[i][j] = (Math.random() * 2 - 1) * scale;
      }
    }
    
    this.biases = new Array(outputSize).fill(0);
  }
  
  private applyActivation(x: number[]): number[] {
    switch (this.activation) {
      case 'relu':
        return x.map(val => Math.max(0, val));
      case 'sigmoid':
        return x.map(val => 1 / (1 + Math.exp(-val)));
      case 'tanh':
        return x.map(val => Math.tanh(val));
      case 'softmax':
        const maxVal = Math.max(...x);
        const exp = x.map(val => Math.exp(val - maxVal));
        const sum = exp.reduce((s, val) => s + val, 0);
        return exp.map(val => val / sum);
      default:
        return x;
    }
  }
  
  private applyActivationGradient(gradient: number[], output: number[]): number[] {
    switch (this.activation) {
      case 'relu':
        return gradient.map((g, i) => output[i] > 0 ? g : 0);
      case 'sigmoid':
        return gradient.map((g, i) => g * output[i] * (1 - output[i]));
      case 'tanh':
        return gradient.map((g, i) => g * (1 - output[i] * output[i]));
      case 'softmax':
        // Softmax gradient is handled differently in loss calculation
        return gradient;
      default:
        return gradient;
    }
  }
}

class DropoutLayer extends Layer {
  private dropoutRate: number;
  private mask: number[][] = [];
  private training: boolean = true;
  
  constructor(dropoutRate: number) {
    super();
    this.dropoutRate = dropoutRate;
  }
  
  forward(input: number[][]): number[][] {
    if (!this.training) {
      return input;
    }
    
    // Generate dropout mask
    this.mask = input.map(row => 
      row.map(() => Math.random() > this.dropoutRate ? 1 / (1 - this.dropoutRate) : 0)
    );
    
    // Apply dropout
    return input.map((row, i) => 
      row.map((val, j) => val * this.mask[i][j])
    );
  }
  
  backward(gradient: number[][]): number[][] {
    if (!this.training) {
      return gradient;
    }
    
    // Apply dropout mask to gradient
    return gradient.map((row, i) => 
      row.map((val, j) => val * this.mask[i][j])
    );
  }
  
  getWeights(): null {
    return null;
  }
  
  setWeights(): void {
    // No weights to set
  }
  
  setTraining(training: boolean): void {
    this.training = training;
  }
}

// Optimizer implementations
abstract class Optimizer {
  abstract update(layers: Layer[]): void;
}

class SGDOptimizer extends Optimizer {
  constructor(
    private learningRate: number,
    private momentum: number = 0
  ) {
    super();
  }
  
  update(layers: Layer[]): void {
    for (const layer of layers) {
      const weights = layer.getWeights();
      if (!weights) continue;
      
      // Simple gradient descent update
      // In a real implementation, gradients would be calculated and stored
    }
  }
}

class AdamOptimizer extends Optimizer {
  private m: Map<Layer, { weights: number[][]; biases: number[] }> = new Map();
  private v: Map<Layer, { weights: number[][]; biases: number[] }> = new Map();
  private t: number = 0;
  
  constructor(
    private learningRate: number = 0.001,
    private beta1: number = 0.9,
    private beta2: number = 0.999,
    private epsilon: number = 1e-8
  ) {
    super();
  }
  
  update(layers: Layer[]): void {
    this.t++;
    
    for (const layer of layers) {
      const weights = layer.getWeights();
      if (!weights) continue;
      
      // Adam optimizer update
      // In a real implementation, gradients would be calculated and stored
    }
  }
}

interface TrainingHistory {
  loss: number[];
  valLoss: number[];
  accuracy: number[];
  valAccuracy: number[];
}

// Export all classes
export default {
  KMeansClustering,
  DBSCANClustering,
  HierarchicalClustering,
  DecisionTreeClassifier,
  RandomForestClassifier,
  SupportVectorMachine,
  PrincipalComponentAnalysis,
  NeuralNetwork
};