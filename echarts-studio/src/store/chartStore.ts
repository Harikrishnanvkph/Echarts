import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChartConfig, ChartType, ChartData, ChartOptions } from '../types/chart';

interface ChartState {
  // Current chart being edited
  currentChart: ChartConfig | null;
  
  // All saved charts
  savedCharts: ChartConfig[];
  
  // UI state
  selectedChartType: ChartType;
  isPreviewMode: boolean;
  isDarkMode: boolean;
  sidebarOpen: boolean;
  
  // Actions
  setCurrentChart: (chart: ChartConfig | null) => void;
  updateChartData: (data: Partial<ChartData>) => void;
  updateChartOptions: (options: Partial<ChartOptions>) => void;
  setChartType: (type: ChartType) => void;
  saveChart: (chart: ChartConfig) => void;
  deleteChart: (id: string) => void;
  loadChart: (id: string) => void;
  resetChart: () => void;
  togglePreviewMode: () => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  importChartConfig: (config: string) => void;
  exportChartConfig: () => string;
}

const defaultChartConfig: ChartConfig = {
  id: 'new-chart',
  name: 'Untitled Chart',
  type: 'line',
  data: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      {
        name: 'Series 1',
        data: [120, 200, 150, 80, 70, 110, 130],
      },
    ],
  },
  options: {
    title: {
      text: 'Chart Title',
      subtext: 'Chart Subtitle',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: true,
      orient: 'horizontal',
      top: 'bottom',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    animation: true,
    animationDuration: 1000,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useChartStore = create<ChartState>()(
  devtools(
    persist(
      (set, get) => ({
        currentChart: defaultChartConfig,
        savedCharts: [],
        selectedChartType: 'line',
        isPreviewMode: false,
        isDarkMode: false,
        sidebarOpen: true,

        setCurrentChart: (chart) =>
          set({ currentChart: chart }, false, 'setCurrentChart'),

        updateChartData: (data) =>
          set(
            (state) => ({
              currentChart: state.currentChart
                ? {
                    ...state.currentChart,
                    data: { ...state.currentChart.data, ...data },
                    updatedAt: new Date(),
                  }
                : null,
            }),
            false,
            'updateChartData'
          ),

        updateChartOptions: (options) =>
          set(
            (state) => ({
              currentChart: state.currentChart
                ? {
                    ...state.currentChart,
                    options: { ...state.currentChart.options, ...options },
                    updatedAt: new Date(),
                  }
                : null,
            }),
            false,
            'updateChartOptions'
          ),

        setChartType: (type) =>
          set(
            (state) => ({
              selectedChartType: type,
              currentChart: state.currentChart
                ? { ...state.currentChart, type, updatedAt: new Date() }
                : null,
            }),
            false,
            'setChartType'
          ),

        saveChart: (chart) =>
          set(
            (state) => {
              const existingIndex = state.savedCharts.findIndex(
                (c) => c.id === chart.id
              );
              const updatedCharts = [...state.savedCharts];
              
              if (existingIndex >= 0) {
                updatedCharts[existingIndex] = chart;
              } else {
                updatedCharts.push(chart);
              }
              
              return { savedCharts: updatedCharts };
            },
            false,
            'saveChart'
          ),

        deleteChart: (id) =>
          set(
            (state) => ({
              savedCharts: state.savedCharts.filter((c) => c.id !== id),
              currentChart:
                state.currentChart?.id === id ? null : state.currentChart,
            }),
            false,
            'deleteChart'
          ),

        loadChart: (id) =>
          set(
            (state) => {
              const chart = state.savedCharts.find((c) => c.id === id);
              return {
                currentChart: chart || state.currentChart,
                selectedChartType: chart?.type || state.selectedChartType,
              };
            },
            false,
            'loadChart'
          ),

        resetChart: () =>
          set(
            {
              currentChart: {
                ...defaultChartConfig,
                id: `chart-${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
            false,
            'resetChart'
          ),

        togglePreviewMode: () =>
          set(
            (state) => ({ isPreviewMode: !state.isPreviewMode }),
            false,
            'togglePreviewMode'
          ),

        toggleDarkMode: () =>
          set(
            (state) => ({ isDarkMode: !state.isDarkMode }),
            false,
            'toggleDarkMode'
          ),

        toggleSidebar: () =>
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }),
            false,
            'toggleSidebar'
          ),

        importChartConfig: (configString) => {
          try {
            const config = JSON.parse(configString);
            set(
              {
                currentChart: {
                  ...config,
                  id: `imported-${Date.now()}`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              },
              false,
              'importChartConfig'
            );
          } catch (error) {
            console.error('Failed to import chart configuration:', error);
          }
        },

        exportChartConfig: () => {
          const state = get();
          return JSON.stringify(state.currentChart, null, 2);
        },
      }),
      {
        name: 'echarts-studio-storage',
        partialize: (state) => ({
          savedCharts: state.savedCharts,
          isDarkMode: state.isDarkMode,
        }),
      }
    )
  )
);