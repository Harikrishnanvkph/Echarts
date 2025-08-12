import * as echarts from 'echarts';
import { ChartConfig } from '../types/chart';

// Animation Types
export type AnimationType = 
  | 'fadeIn'
  | 'fadeOut'
  | 'slideIn'
  | 'slideOut'
  | 'zoomIn'
  | 'zoomOut'
  | 'rotate'
  | 'bounce'
  | 'elastic'
  | 'wave'
  | 'morph'
  | 'ripple'
  | 'spiral'
  | 'explode'
  | 'implode'
  | 'typewriter'
  | 'stagger'
  | 'cascade'
  | 'pulse'
  | 'shake';

export type EasingFunction = 
  | 'linear'
  | 'quadraticIn'
  | 'quadraticOut'
  | 'quadraticInOut'
  | 'cubicIn'
  | 'cubicOut'
  | 'cubicInOut'
  | 'quarticIn'
  | 'quarticOut'
  | 'quarticInOut'
  | 'quinticIn'
  | 'quinticOut'
  | 'quinticInOut'
  | 'sinusoidalIn'
  | 'sinusoidalOut'
  | 'sinusoidalInOut'
  | 'exponentialIn'
  | 'exponentialOut'
  | 'exponentialInOut'
  | 'circularIn'
  | 'circularOut'
  | 'circularInOut'
  | 'elasticIn'
  | 'elasticOut'
  | 'elasticInOut'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'bounceIn'
  | 'bounceOut'
  | 'bounceInOut';

// Animation Configuration
export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: EasingFunction;
  loop?: boolean;
  reverse?: boolean;
  stagger?: number;
  amplitude?: number;
  frequency?: number;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: (progress: number) => void;
}

// Keyframe Animation
export interface KeyframeAnimation {
  keyframes: Keyframe[];
  duration: number;
  loop?: boolean;
  pingPong?: boolean;
  easing?: EasingFunction;
}

export interface Keyframe {
  time: number; // 0 to 1
  properties: any;
  easing?: EasingFunction;
}

// Transition Configuration
export interface TransitionConfig {
  from: ChartConfig;
  to: ChartConfig;
  duration: number;
  type?: 'morph' | 'fade' | 'slide' | 'zoom' | 'custom';
  easing?: EasingFunction;
  onProgress?: (progress: number) => void;
}

// Particle Effect Configuration
export interface ParticleEffect {
  type: 'explosion' | 'implosion' | 'rain' | 'snow' | 'stars' | 'confetti';
  particles: number;
  duration: number;
  colors?: string[];
  size?: number;
  speed?: number;
  gravity?: number;
  wind?: number;
}

// Animation Engine Class
export class AnimationEngine {
  private animations: Map<string, any> = new Map();
  private rafId: number | null = null;
  
  /**
   * Create entrance animation for chart
   */
  createEntranceAnimation(config: AnimationConfig): echarts.EChartsOption {
    const baseAnimation = {
      animation: true,
      animationDuration: config.duration,
      animationDelay: config.delay || 0,
      animationEasing: this.mapEasing(config.easing || 'cubicOut'),
    };

    switch (config.type) {
      case 'fadeIn':
        return {
          ...baseAnimation,
          animationDurationUpdate: config.duration,
          series: [{
            animationDelay: (idx: number) => idx * (config.stagger || 50),
          }]
        };
        
      case 'slideIn':
        return {
          ...baseAnimation,
          series: [{
            animationDelay: (idx: number) => idx * (config.stagger || 50),
            animationDurationUpdate: config.duration,
          }]
        };
        
      case 'zoomIn':
        return {
          ...baseAnimation,
          series: [{
            animationDelay: (idx: number) => idx * (config.stagger || 30),
            animationDurationUpdate: config.duration,
            emphasis: {
              scale: 1.2
            }
          }]
        };
        
      case 'bounce':
        return {
          ...baseAnimation,
          animationEasing: 'bounceOut',
          series: [{
            animationDelay: (idx: number) => idx * (config.stagger || 100),
          }]
        };
        
      case 'elastic':
        return {
          ...baseAnimation,
          animationEasing: 'elasticOut',
          series: [{
            animationDelay: (idx: number) => idx * (config.stagger || 80),
          }]
        };
        
      case 'wave':
        return {
          ...baseAnimation,
          series: [{
            animationDelay: (idx: number) => {
              const wave = Math.sin(idx * 0.5) * 100;
              return idx * 50 + wave;
            },
          }]
        };
        
      case 'spiral':
        return {
          ...baseAnimation,
          series: [{
            animationDelay: (idx: number) => {
              const angle = idx * 0.2;
              const radius = idx * 20;
              return radius + Math.sin(angle) * 50;
            },
          }]
        };
        
      case 'stagger':
        return {
          ...baseAnimation,
          series: [{
            animationDelay: (idx: number) => idx * (config.stagger || 100),
            animationDurationUpdate: config.duration,
          }]
        };
        
      case 'cascade':
        return {
          ...baseAnimation,
          series: [{
            animationDelay: (idx: number) => {
              const row = Math.floor(idx / 10);
              const col = idx % 10;
              return (row + col) * 50;
            },
          }]
        };
        
      default:
        return baseAnimation;
    }
  }

  /**
   * Create morphing animation between two chart states
   */
  createMorphAnimation(transition: TransitionConfig): any {
    const steps = 60; // 60 FPS
    const stepDuration = transition.duration / steps;
    let currentStep = 0;
    
    const animate = () => {
      if (currentStep >= steps) {
        if (transition.onProgress) {
          transition.onProgress(1);
        }
        return;
      }
      
      const progress = currentStep / steps;
      const easedProgress = this.applyEasing(progress, transition.easing || 'cubicInOut');
      
      // Interpolate between configurations
      const interpolated = this.interpolateConfigs(
        transition.from,
        transition.to,
        easedProgress
      );
      
      if (transition.onProgress) {
        transition.onProgress(easedProgress);
      }
      
      currentStep++;
      setTimeout(animate, stepDuration);
    };
    
    animate();
  }

  /**
   * Create keyframe animation
   */
  createKeyframeAnimation(animation: KeyframeAnimation): any {
    const { keyframes, duration, loop, pingPong, easing } = animation;
    let currentTime = 0;
    let direction = 1;
    
    const animate = (timestamp: number) => {
      const progress = (currentTime % duration) / duration;
      
      // Find current keyframe segment
      let fromKeyframe: Keyframe | null = null;
      let toKeyframe: Keyframe | null = null;
      
      for (let i = 0; i < keyframes.length - 1; i++) {
        if (progress >= keyframes[i].time && progress <= keyframes[i + 1].time) {
          fromKeyframe = keyframes[i];
          toKeyframe = keyframes[i + 1];
          break;
        }
      }
      
      if (fromKeyframe && toKeyframe) {
        const segmentProgress = (progress - fromKeyframe.time) / 
                              (toKeyframe.time - fromKeyframe.time);
        const easedProgress = this.applyEasing(
          segmentProgress,
          toKeyframe.easing || easing || 'linear'
        );
        
        // Interpolate properties
        const interpolated = this.interpolateProperties(
          fromKeyframe.properties,
          toKeyframe.properties,
          easedProgress
        );
        
        // Apply interpolated properties
        this.applyProperties(interpolated);
      }
      
      currentTime += 16.67; // ~60 FPS
      
      if (pingPong && progress >= 1) {
        direction *= -1;
      }
      
      if (loop || (pingPong && direction === -1)) {
        this.rafId = requestAnimationFrame(animate);
      }
    };
    
    this.rafId = requestAnimationFrame(animate);
  }

  /**
   * Create particle effects
   */
  createParticleEffect(effect: ParticleEffect, container: HTMLElement): void {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles: Particle[] = [];
    
    // Initialize particles
    for (let i = 0; i < effect.particles; i++) {
      particles.push(this.createParticle(effect, canvas));
    }
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > effect.duration) {
        container.removeChild(canvas);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        this.updateParticle(particle, effect);
        this.drawParticle(ctx, particle);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  /**
   * Create path animation
   */
  createPathAnimation(
    path: string,
    duration: number,
    options?: {
      strokeWidth?: number;
      strokeColor?: string;
      fill?: boolean;
      easing?: EasingFunction;
    }
  ): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    pathElement.setAttribute('d', path);
    pathElement.setAttribute('stroke', options?.strokeColor || '#000');
    pathElement.setAttribute('stroke-width', String(options?.strokeWidth || 2));
    pathElement.setAttribute('fill', options?.fill ? options.strokeColor || '#000' : 'none');
    
    const length = pathElement.getTotalLength();
    pathElement.style.strokeDasharray = String(length);
    pathElement.style.strokeDashoffset = String(length);
    
    // Create CSS animation
    const animationName = `path-animation-${Date.now()}`;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${animationName} {
        to {
          stroke-dashoffset: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    pathElement.style.animation = `${animationName} ${duration}ms ${this.mapEasing(options?.easing || 'linear')} forwards`;
    
    svg.appendChild(pathElement);
    return svg;
  }

  /**
   * Create text animation (typewriter effect)
   */
  createTextAnimation(
    text: string,
    duration: number,
    options?: {
      cursor?: boolean;
      cursorChar?: string;
      onChar?: (char: string, index: number) => void;
    }
  ): HTMLElement {
    const container = document.createElement('span');
    const chars = text.split('');
    const charDuration = duration / chars.length;
    
    let currentIndex = 0;
    
    const typeChar = () => {
      if (currentIndex >= chars.length) {
        if (options?.cursor) {
          const cursor = document.createElement('span');
          cursor.textContent = options.cursorChar || '|';
          cursor.style.animation = 'blink 1s infinite';
          container.appendChild(cursor);
        }
        return;
      }
      
      const char = chars[currentIndex];
      const charSpan = document.createElement('span');
      charSpan.textContent = char;
      charSpan.style.opacity = '0';
      charSpan.style.animation = 'fadeIn 200ms forwards';
      container.appendChild(charSpan);
      
      if (options?.onChar) {
        options.onChar(char, currentIndex);
      }
      
      currentIndex++;
      setTimeout(typeChar, charDuration);
    };
    
    typeChar();
    return container;
  }

  /**
   * Create complex transition sequences
   */
  createSequence(sequences: AnimationConfig[]): Promise<void> {
    return sequences.reduce((promise, config) => {
      return promise.then(() => this.runAnimation(config));
    }, Promise.resolve());
  }

  /**
   * Create parallax scrolling effect
   */
  createParallaxEffect(
    elements: HTMLElement[],
    speeds: number[],
    container: HTMLElement
  ): void {
    const handleScroll = () => {
      const scrollY = container.scrollTop;
      
      elements.forEach((element, index) => {
        const speed = speeds[index] || 1;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };
    
    container.addEventListener('scroll', handleScroll);
  }

  /**
   * Create hover effects
   */
  createHoverEffect(
    element: HTMLElement,
    effect: {
      scale?: number;
      rotate?: number;
      shadow?: string;
      color?: string;
      duration?: number;
    }
  ): void {
    const originalTransform = element.style.transform;
    const originalShadow = element.style.boxShadow;
    const originalColor = element.style.color;
    
    element.style.transition = `all ${effect.duration || 300}ms ease`;
    
    element.addEventListener('mouseenter', () => {
      if (effect.scale) {
        element.style.transform = `${originalTransform} scale(${effect.scale})`;
      }
      if (effect.rotate) {
        element.style.transform = `${originalTransform} rotate(${effect.rotate}deg)`;
      }
      if (effect.shadow) {
        element.style.boxShadow = effect.shadow;
      }
      if (effect.color) {
        element.style.color = effect.color;
      }
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = originalTransform;
      element.style.boxShadow = originalShadow;
      element.style.color = originalColor;
    });
  }

  /**
   * Create loading animations
   */
  createLoadingAnimation(type: 'spinner' | 'dots' | 'bars' | 'pulse'): HTMLElement {
    const container = document.createElement('div');
    container.className = `loading-animation loading-${type}`;
    
    switch (type) {
      case 'spinner':
        container.innerHTML = `
          <div class="spinner">
            <div class="spinner-circle"></div>
          </div>
        `;
        break;
        
      case 'dots':
        container.innerHTML = `
          <div class="dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        `;
        break;
        
      case 'bars':
        container.innerHTML = `
          <div class="bars">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
        `;
        break;
        
      case 'pulse':
        container.innerHTML = `
          <div class="pulse">
            <div class="pulse-ring"></div>
            <div class="pulse-ring"></div>
            <div class="pulse-ring"></div>
          </div>
        `;
        break;
    }
    
    this.addLoadingStyles();
    return container;
  }

  /**
   * Create scroll-triggered animations
   */
  createScrollAnimation(
    element: HTMLElement,
    animation: AnimationConfig,
    options?: {
      threshold?: number;
      rootMargin?: string;
      once?: boolean;
    }
  ): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.applyAnimation(element, animation);
            
            if (options?.once) {
              observer.unobserve(element);
            }
          }
        });
      },
      {
        threshold: options?.threshold || 0.5,
        rootMargin: options?.rootMargin || '0px'
      }
    );
    
    observer.observe(element);
  }

  // Helper Methods

  private mapEasing(easing: EasingFunction): string {
    const easingMap: { [key: string]: string } = {
      linear: 'linear',
      quadraticIn: 'quadraticIn',
      quadraticOut: 'quadraticOut',
      quadraticInOut: 'quadraticInOut',
      cubicIn: 'cubicIn',
      cubicOut: 'cubicOut',
      cubicInOut: 'cubicInOut',
      elasticIn: 'elasticIn',
      elasticOut: 'elasticOut',
      elasticInOut: 'elasticInOut',
      bounceIn: 'bounceIn',
      bounceOut: 'bounceOut',
      bounceInOut: 'bounceInOut',
    };
    
    return easingMap[easing] || 'linear';
  }

  private applyEasing(t: number, easing: EasingFunction): number {
    switch (easing) {
      case 'linear':
        return t;
      case 'quadraticIn':
        return t * t;
      case 'quadraticOut':
        return t * (2 - t);
      case 'quadraticInOut':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'cubicIn':
        return t * t * t;
      case 'cubicOut':
        return (--t) * t * t + 1;
      case 'cubicInOut':
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      case 'elasticOut':
        return Math.sin(-13 * Math.PI / 2 * (t + 1)) * Math.pow(2, -10 * t) + 1;
      case 'bounceOut':
        if (t < 1 / 2.75) {
          return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
          return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
          return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
          return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
      default:
        return t;
    }
  }

  private interpolateConfigs(from: ChartConfig, to: ChartConfig, progress: number): ChartConfig {
    // Simplified interpolation - would need more complex logic for real implementation
    return {
      ...to,
      data: {
        ...to.data,
        series: to.data.series.map((series, i) => ({
          ...series,
          data: series.data.map((value, j) => {
            const fromValue = from.data.series[i]?.data[j] || 0;
            return fromValue + (value - fromValue) * progress;
          })
        }))
      }
    };
  }

  private interpolateProperties(from: any, to: any, progress: number): any {
    const result: any = {};
    
    for (const key in to) {
      if (typeof to[key] === 'number' && typeof from[key] === 'number') {
        result[key] = from[key] + (to[key] - from[key]) * progress;
      } else if (typeof to[key] === 'object' && typeof from[key] === 'object') {
        result[key] = this.interpolateProperties(from[key], to[key], progress);
      } else {
        result[key] = progress < 0.5 ? from[key] : to[key];
      }
    }
    
    return result;
  }

  private applyProperties(properties: any): void {
    // Apply properties to chart or element
    // Implementation depends on the specific use case
  }

  private runAnimation(config: AnimationConfig): Promise<void> {
    return new Promise((resolve) => {
      if (config.onStart) {
        config.onStart();
      }
      
      setTimeout(() => {
        if (config.onComplete) {
          config.onComplete();
        }
        resolve();
      }, config.duration);
    });
  }

  private applyAnimation(element: HTMLElement, animation: AnimationConfig): void {
    element.style.animation = `${animation.type} ${animation.duration}ms ${this.mapEasing(animation.easing || 'linear')}`;
  }

  private createParticle(effect: ParticleEffect, canvas: HTMLCanvasElement): Particle {
    return {
      x: Math.random() * canvas.width,
      y: effect.type === 'rain' || effect.type === 'snow' ? -10 : canvas.height / 2,
      vx: (Math.random() - 0.5) * (effect.speed || 2),
      vy: effect.type === 'rain' ? effect.speed || 5 : (Math.random() - 0.5) * (effect.speed || 2),
      size: Math.random() * (effect.size || 5) + 1,
      color: effect.colors ? effect.colors[Math.floor(Math.random() * effect.colors.length)] : '#fff',
      life: 1,
      decay: 1 / (effect.duration / 16.67)
    };
  }

  private updateParticle(particle: Particle, effect: ParticleEffect): void {
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    if (effect.gravity) {
      particle.vy += effect.gravity;
    }
    
    if (effect.wind) {
      particle.vx += effect.wind;
    }
    
    particle.life -= particle.decay;
  }

  private drawParticle(ctx: CanvasRenderingContext2D, particle: Particle): void {
    if (particle.life <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = particle.life;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private addLoadingStyles(): void {
    if (document.getElementById('animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      .loading-spinner .spinner-circle {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top-color: #333;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      .loading-dots .dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin: 0 5px;
        background: #333;
        border-radius: 50%;
        animation: bounce 1.4s ease-in-out infinite both;
      }
      
      .loading-dots .dot:nth-child(1) { animation-delay: -0.32s; }
      .loading-dots .dot:nth-child(2) { animation-delay: -0.16s; }
      
      .loading-bars .bar {
        display: inline-block;
        width: 4px;
        height: 20px;
        margin: 0 2px;
        background: #333;
        animation: pulse 1.2s ease-in-out infinite;
      }
      
      .loading-bars .bar:nth-child(1) { animation-delay: -0.5s; }
      .loading-bars .bar:nth-child(2) { animation-delay: -0.4s; }
      .loading-bars .bar:nth-child(3) { animation-delay: -0.3s; }
      .loading-bars .bar:nth-child(4) { animation-delay: -0.2s; }
      .loading-bars .bar:nth-child(5) { animation-delay: -0.1s; }
      
      .loading-pulse .pulse-ring {
        display: inline-block;
        width: 40px;
        height: 40px;
        border: 4px solid #333;
        border-radius: 50%;
        animation: pulse 1.5s ease-out infinite;
      }
      
      .loading-pulse .pulse-ring:nth-child(2) { animation-delay: 0.5s; }
      .loading-pulse .pulse-ring:nth-child(3) { animation-delay: 1s; }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Cleanup animations
   */
  destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.animations.clear();
  }
}

// Particle interface
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  decay: number;
}

// Export singleton instance
export const animationEngine = new AnimationEngine();

// Animation presets
export const animationPresets = {
  fadeIn: {
    type: 'fadeIn' as AnimationType,
    duration: 1000,
    easing: 'cubicOut' as EasingFunction
  },
  slideUp: {
    type: 'slideIn' as AnimationType,
    duration: 800,
    easing: 'cubicOut' as EasingFunction
  },
  bounceIn: {
    type: 'bounce' as AnimationType,
    duration: 1200,
    easing: 'bounceOut' as EasingFunction
  },
  staggeredEntrance: {
    type: 'stagger' as AnimationType,
    duration: 1500,
    stagger: 100,
    easing: 'cubicOut' as EasingFunction
  },
  waveEffect: {
    type: 'wave' as AnimationType,
    duration: 2000,
    easing: 'sinusoidalInOut' as EasingFunction
  },
  spiralIn: {
    type: 'spiral' as AnimationType,
    duration: 2500,
    easing: 'cubicInOut' as EasingFunction
  }
};