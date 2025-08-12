import * as echarts from 'echarts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { ChartConfig, ExportOptions } from '../types/chart';

// Extended Export Formats
export type ExportFormat = 
  | 'png'
  | 'jpg'
  | 'svg'
  | 'pdf'
  | 'excel'
  | 'csv'
  | 'json'
  | 'html'
  | 'pptx'
  | 'word'
  | 'latex'
  | 'markdown'
  | 'xml'
  | 'yaml';

// Export Template Types
export type TemplateType =
  | 'report'
  | 'presentation'
  | 'dashboard'
  | 'infographic'
  | 'academic'
  | 'business'
  | 'minimal'
  | 'detailed';

// Export Configuration
export interface AdvancedExportOptions extends ExportOptions {
  template?: TemplateType;
  includeData?: boolean;
  includeAnalysis?: boolean;
  includeMetadata?: boolean;
  watermark?: string;
  compression?: number;
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margins?: { top: number; right: number; bottom: number; left: number };
  header?: string;
  footer?: string;
  theme?: 'light' | 'dark' | 'custom';
  customCSS?: string;
  embedFonts?: boolean;
  interactive?: boolean;
}

// Export Result
export interface ExportResult {
  success: boolean;
  filename: string;
  size: number;
  format: ExportFormat;
  timestamp: Date;
  error?: string;
}

/**
 * Main Export Manager Class
 */
export class ExportManager {
  private chartInstance: echarts.ECharts | null = null;
  private config: ChartConfig | null = null;

  constructor(chartInstance?: echarts.ECharts, config?: ChartConfig) {
    this.chartInstance = chartInstance || null;
    this.config = config || null;
  }

  /**
   * Export chart in specified format
   */
  async export(options: AdvancedExportOptions): Promise<ExportResult> {
    const timestamp = new Date();
    const filename = options.filename || `chart_${timestamp.getTime()}`;

    try {
      switch (options.format) {
        case 'png':
        case 'jpg':
          return await this.exportAsImage(filename, options);
        case 'svg':
          return await this.exportAsSVG(filename, options);
        case 'pdf':
          return await this.exportAsPDF(filename, options);
        case 'excel':
          return await this.exportAsExcel(filename, options);
        case 'csv':
          return await this.exportAsCSV(filename, options);
        case 'json':
          return await this.exportAsJSON(filename, options);
        case 'html':
          return await this.exportAsHTML(filename, options);
        case 'pptx':
          return await this.exportAsPowerPoint(filename, options);
        case 'word':
          return await this.exportAsWord(filename, options);
        case 'latex':
          return await this.exportAsLaTeX(filename, options);
        case 'markdown':
          return await this.exportAsMarkdown(filename, options);
        case 'xml':
          return await this.exportAsXML(filename, options);
        case 'yaml':
          return await this.exportAsYAML(filename, options);
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      return {
        success: false,
        filename,
        size: 0,
        format: options.format,
        timestamp,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  /**
   * Export as Image (PNG/JPG)
   */
  private async exportAsImage(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    if (!this.chartInstance) {
      throw new Error('Chart instance not available');
    }

    const canvas = await this.chartToCanvas(options);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image');
        }

        const format = options.format as 'png' | 'jpg';
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = options.quality || (format === 'jpg' ? 0.92 : 1);
        
        // Apply watermark if requested
        if (options.watermark) {
          this.applyWatermark(canvas, options.watermark);
        }

        canvas.toBlob((finalBlob) => {
          if (!finalBlob) {
            throw new Error('Failed to create final image');
          }

          saveAs(finalBlob, `${filename}.${format}`);
          
          resolve({
            success: true,
            filename: `${filename}.${format}`,
            size: finalBlob.size,
            format: format,
            timestamp: new Date()
          });
        }, mimeType, quality);
      });
    });
  }

  /**
   * Export as SVG
   */
  private async exportAsSVG(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    if (!this.chartInstance) {
      throw new Error('Chart instance not available');
    }

    const svgString = this.chartInstance.renderToSVGString();
    
    // Enhance SVG with additional features
    const enhancedSVG = this.enhanceSVG(svgString, options);
    
    const blob = new Blob([enhancedSVG], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, `${filename}.svg`);

    return {
      success: true,
      filename: `${filename}.svg`,
      size: blob.size,
      format: 'svg',
      timestamp: new Date()
    };
  }

  /**
   * Export as PDF
   */
  private async exportAsPDF(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    const orientation = options.orientation || 'portrait';
    const pageSize = options.pageSize || 'A4';
    const pdf = new jsPDF(orientation, 'mm', pageSize);

    // Add header
    if (options.header) {
      pdf.setFontSize(16);
      pdf.text(options.header, 15, 20);
    }

    // Add chart image
    const canvas = await this.chartToCanvas(options);
    const imgData = canvas.toDataURL('image/png');
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margins = options.margins || { top: 30, right: 15, bottom: 30, left: 15 };
    
    const imgWidth = pageWidth - margins.left - margins.right;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', margins.left, margins.top, imgWidth, imgHeight);

    // Add data table if requested
    if (options.includeData && this.config) {
      this.addDataTableToPDF(pdf, this.config, margins.top + imgHeight + 10);
    }

    // Add analysis if requested
    if (options.includeAnalysis && this.config) {
      this.addAnalysisToPDF(pdf, this.config);
    }

    // Add footer
    if (options.footer) {
      pdf.setFontSize(10);
      pdf.text(options.footer, 15, pageHeight - 10);
    }

    // Add metadata
    if (options.includeMetadata) {
      pdf.setProperties({
        title: this.config?.name || 'Chart Export',
        subject: 'Chart Data Visualization',
        author: 'ECharts Studio',
        keywords: 'chart, data, visualization',
        creator: 'ECharts Studio Export Tool'
      });
    }

    pdf.save(`${filename}.pdf`);

    return {
      success: true,
      filename: `${filename}.pdf`,
      size: pdf.output('blob').size,
      format: 'pdf',
      timestamp: new Date()
    };
  }

  /**
   * Export as Excel
   */
  private async exportAsExcel(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    if (!this.config) {
      throw new Error('Chart configuration not available');
    }

    const workbook = XLSX.utils.book_new();
    
    // Create data sheet
    const dataSheet = this.createDataSheet(this.config);
    XLSX.utils.book_append_sheet(workbook, dataSheet, 'Chart Data');

    // Create analysis sheet if requested
    if (options.includeAnalysis) {
      const analysisSheet = this.createAnalysisSheet(this.config);
      XLSX.utils.book_append_sheet(workbook, analysisSheet, 'Analysis');
    }

    // Create metadata sheet if requested
    if (options.includeMetadata) {
      const metadataSheet = this.createMetadataSheet(this.config);
      XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');
    }

    // Add chart image as embedded object (if supported)
    if (options.format === 'excel') {
      // Note: Adding images to Excel requires additional libraries
      // This is a placeholder for the functionality
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, `${filename}.xlsx`);

    return {
      success: true,
      filename: `${filename}.xlsx`,
      size: blob.size,
      format: 'excel',
      timestamp: new Date()
    };
  }

  /**
   * Export as CSV
   */
  private async exportAsCSV(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    if (!this.config) {
      throw new Error('Chart configuration not available');
    }

    const csvData = this.chartDataToCSV(this.config);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    
    saveAs(blob, `${filename}.csv`);

    return {
      success: true,
      filename: `${filename}.csv`,
      size: blob.size,
      format: 'csv',
      timestamp: new Date()
    };
  }

  /**
   * Export as JSON
   */
  private async exportAsJSON(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    if (!this.config) {
      throw new Error('Chart configuration not available');
    }

    const exportData: any = {
      chart: this.config,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    if (options.includeAnalysis) {
      exportData.analysis = this.generateAnalysis(this.config);
    }

    if (options.includeMetadata) {
      exportData.metadata = this.generateMetadata(this.config);
    }

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    saveAs(blob, `${filename}.json`);

    return {
      success: true,
      filename: `${filename}.json`,
      size: blob.size,
      format: 'json',
      timestamp: new Date()
    };
  }

  /**
   * Export as HTML
   */
  private async exportAsHTML(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    const template = this.getHTMLTemplate(options.template || 'minimal');
    const chartHTML = await this.generateChartHTML(options);
    
    let html = template.replace('{{CHART}}', chartHTML);
    
    if (options.includeData && this.config) {
      const dataTable = this.generateHTMLDataTable(this.config);
      html = html.replace('{{DATA}}', dataTable);
    }

    if (options.customCSS) {
      html = html.replace('{{CUSTOM_CSS}}', `<style>${options.customCSS}</style>`);
    }

    if (options.interactive && this.chartInstance) {
      const chartOptions = this.chartInstance.getOption();
      const scriptTag = `
        <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
        <script>
          const chartDom = document.getElementById('interactive-chart');
          const myChart = echarts.init(chartDom);
          myChart.setOption(${JSON.stringify(chartOptions)});
          window.addEventListener('resize', () => myChart.resize());
        </script>
      `;
      html = html.replace('{{SCRIPTS}}', scriptTag);
    }

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${filename}.html`);

    return {
      success: true,
      filename: `${filename}.html`,
      size: blob.size,
      format: 'html',
      timestamp: new Date()
    };
  }

  /**
   * Export as PowerPoint
   */
  private async exportAsPowerPoint(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    // Note: Full PowerPoint export would require a library like PptxGenJS
    // This is a simplified implementation
    const pptxContent = await this.generatePowerPointContent(options);
    const blob = new Blob([pptxContent], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    
    saveAs(blob, `${filename}.pptx`);

    return {
      success: true,
      filename: `${filename}.pptx`,
      size: blob.size,
      format: 'pptx',
      timestamp: new Date()
    };
  }

  /**
   * Export as Word Document
   */
  private async exportAsWord(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    // Note: Full Word export would require a library like docx
    // This is a simplified implementation using HTML
    const wordContent = await this.generateWordContent(options);
    const blob = new Blob([wordContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    saveAs(blob, `${filename}.docx`);

    return {
      success: true,
      filename: `${filename}.docx`,
      size: blob.size,
      format: 'word',
      timestamp: new Date()
    };
  }

  /**
   * Export as LaTeX
   */
  private async exportAsLaTeX(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    if (!this.config) {
      throw new Error('Chart configuration not available');
    }

    const latexContent = this.generateLaTeXContent(this.config, options);
    const blob = new Blob([latexContent], { type: 'text/x-latex;charset=utf-8' });
    
    saveAs(blob, `${filename}.tex`);

    return {
      success: true,
      filename: `${filename}.tex`,
      size: blob.size,
      format: 'latex',
      timestamp: new Date()
    };
  }

  /**
   * Export as Markdown
   */
  private async exportAsMarkdown(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    if (!this.config) {
      throw new Error('Chart configuration not available');
    }

    const markdownContent = this.generateMarkdownContent(this.config, options);
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    
    saveAs(blob, `${filename}.md`);

    return {
      success: true,
      filename: `${filename}.md`,
      size: blob.size,
      format: 'markdown',
      timestamp: new Date()
    };
  }

  /**
   * Export as XML
   */
  private async exportAsXML(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    if (!this.config) {
      throw new Error('Chart configuration not available');
    }

    const xmlContent = this.generateXMLContent(this.config, options);
    const blob = new Blob([xmlContent], { type: 'text/xml;charset=utf-8' });
    
    saveAs(blob, `${filename}.xml`);

    return {
      success: true,
      filename: `${filename}.xml`,
      size: blob.size,
      format: 'xml',
      timestamp: new Date()
    };
  }

  /**
   * Export as YAML
   */
  private async exportAsYAML(
    filename: string,
    options: AdvancedExportOptions
  ): Promise<ExportResult> {
    if (!this.config) {
      throw new Error('Chart configuration not available');
    }

    const yamlContent = this.generateYAMLContent(this.config, options);
    const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' });
    
    saveAs(blob, `${filename}.yaml`);

    return {
      success: true,
      filename: `${filename}.yaml`,
      size: blob.size,
      format: 'yaml',
      timestamp: new Date()
    };
  }

  // Helper Methods

  private async chartToCanvas(options: AdvancedExportOptions): Promise<HTMLCanvasElement> {
    if (!this.chartInstance) {
      throw new Error('Chart instance not available');
    }

    const chartDom = this.chartInstance.getDom();
    const canvas = await html2canvas(chartDom as HTMLElement, {
      backgroundColor: options.backgroundColor || '#ffffff',
      scale: 2, // Higher quality
      logging: false
    });

    return canvas;
  }

  private applyWatermark(canvas: HTMLCanvasElement, watermark: string): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.font = '20px Arial';
    ctx.fillStyle = '#999999';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Rotate and draw watermark
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.fillText(watermark, 0, 0);
    ctx.restore();
  }

  private enhanceSVG(svgString: string, options: AdvancedExportOptions): string {
    let enhanced = svgString;

    // Add title and description
    if (this.config) {
      const titleDesc = `
        <title>${this.config.name}</title>
        <desc>Generated by ECharts Studio on ${new Date().toISOString()}</desc>
      `;
      enhanced = enhanced.replace('<svg', `<svg>${titleDesc}<svg`).replace('</svg></svg>', '</svg>');
    }

    // Add CSS styles if provided
    if (options.customCSS) {
      const styleTag = `<style type="text/css">${options.customCSS}</style>`;
      enhanced = enhanced.replace('<svg', `<svg>${styleTag}<svg`).replace('</svg></svg>', '</svg>');
    }

    return enhanced;
  }

  private createDataSheet(config: ChartConfig): XLSX.WorkSheet {
    const data: any[][] = [];
    
    // Headers
    const headers = ['Category', ...config.data.series.map(s => s.name)];
    data.push(headers);

    // Data rows
    if (config.data.categories) {
      config.data.categories.forEach((cat, i) => {
        const row = [cat];
        config.data.series.forEach(series => {
          row.push(series.data[i] || 0);
        });
        data.push(row);
      });
    }

    return XLSX.utils.aoa_to_sheet(data);
  }

  private createAnalysisSheet(config: ChartConfig): XLSX.WorkSheet {
    const analysis = this.generateAnalysis(config);
    const data: any[][] = [
      ['Metric', 'Value'],
      ['Total Data Points', analysis.totalDataPoints],
      ['Series Count', analysis.seriesCount],
      ['Maximum Value', analysis.maxValue],
      ['Minimum Value', analysis.minValue],
      ['Average Value', analysis.avgValue],
      ['Standard Deviation', analysis.stdDev]
    ];

    return XLSX.utils.aoa_to_sheet(data);
  }

  private createMetadataSheet(config: ChartConfig): XLSX.WorkSheet {
    const metadata = this.generateMetadata(config);
    const data: any[][] = Object.entries(metadata).map(([key, value]) => [key, value]);
    
    return XLSX.utils.aoa_to_sheet(data);
  }

  private chartDataToCSV(config: ChartConfig): string {
    const data: any[][] = [];
    
    // Headers
    const headers = ['Category', ...config.data.series.map(s => s.name)];
    data.push(headers);

    // Data rows
    if (config.data.categories) {
      config.data.categories.forEach((cat, i) => {
        const row = [cat];
        config.data.series.forEach(series => {
          row.push(series.data[i] || 0);
        });
        data.push(row);
      });
    }

    return Papa.unparse(data);
  }

  private generateAnalysis(config: ChartConfig): any {
    const allValues = config.data.series.flatMap(s => s.data);
    const totalDataPoints = allValues.length;
    const seriesCount = config.data.series.length;
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const avgValue = allValues.reduce((a, b) => a + b, 0) / totalDataPoints;
    const variance = allValues.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / totalDataPoints;
    const stdDev = Math.sqrt(variance);

    return {
      totalDataPoints,
      seriesCount,
      maxValue,
      minValue,
      avgValue,
      stdDev,
      variance
    };
  }

  private generateMetadata(config: ChartConfig): any {
    return {
      name: config.name,
      type: config.type,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      generator: 'ECharts Studio Export Tool'
    };
  }

  private addDataTableToPDF(pdf: jsPDF, config: ChartConfig, startY: number): void {
    // Simplified table generation
    pdf.setFontSize(12);
    pdf.text('Data Table', 15, startY);
    
    // Would need a table plugin for jsPDF for proper implementation
    // This is a placeholder
  }

  private addAnalysisToPDF(pdf: jsPDF, config: ChartConfig): void {
    const analysis = this.generateAnalysis(config);
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text('Statistical Analysis', 15, 20);
    
    pdf.setFontSize(10);
    let y = 35;
    Object.entries(analysis).forEach(([key, value]) => {
      pdf.text(`${key}: ${value}`, 15, y);
      y += 7;
    });
  }

  private getHTMLTemplate(template: TemplateType): string {
    const templates: { [key: string]: string } = {
      minimal: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Chart Export</title>
          {{CUSTOM_CSS}}
        </head>
        <body>
          {{CHART}}
          {{DATA}}
          {{SCRIPTS}}
        </body>
        </html>
      `,
      report: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Chart Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            .chart-container { margin: 20px 0; }
            .data-table { margin-top: 30px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
          {{CUSTOM_CSS}}
        </head>
        <body>
          <h1>Data Visualization Report</h1>
          <div class="chart-container">{{CHART}}</div>
          <div class="data-table">{{DATA}}</div>
          {{SCRIPTS}}
        </body>
        </html>
      `
    };

    return templates[template] || templates.minimal;
  }

  private async generateChartHTML(options: AdvancedExportOptions): Promise<string> {
    if (options.interactive) {
      return '<div id="interactive-chart" style="width: 100%; height: 500px;"></div>';
    } else {
      const canvas = await this.chartToCanvas(options);
      return `<img src="${canvas.toDataURL()}" alt="Chart" style="max-width: 100%;">`;
    }
  }

  private generateHTMLDataTable(config: ChartConfig): string {
    let html = '<table><thead><tr><th>Category</th>';
    
    config.data.series.forEach(series => {
      html += `<th>${series.name}</th>`;
    });
    
    html += '</tr></thead><tbody>';
    
    config.data.categories?.forEach((cat, i) => {
      html += `<tr><td>${cat}</td>`;
      config.data.series.forEach(series => {
        html += `<td>${series.data[i] || 0}</td>`;
      });
      html += '</tr>';
    });
    
    html += '</tbody></table>';
    return html;
  }

  private async generatePowerPointContent(options: AdvancedExportOptions): Promise<string> {
    // Simplified - would need PptxGenJS for full implementation
    return 'PowerPoint content placeholder';
  }

  private async generateWordContent(options: AdvancedExportOptions): Promise<string> {
    // Simplified - would need docx library for full implementation
    return 'Word document content placeholder';
  }

  private generateLaTeXContent(config: ChartConfig, options: AdvancedExportOptions): string {
    let latex = `\\documentclass{article}
\\usepackage{graphicx}
\\usepackage{booktabs}
\\begin{document}

\\title{${config.name}}
\\date{\\today}
\\maketitle

\\section{Chart}
% Include chart image here
% \\includegraphics[width=\\textwidth]{chart.png}

\\section{Data}
\\begin{table}[h]
\\centering
\\begin{tabular}{l${'r'.repeat(config.data.series.length)}}
\\toprule
Category`;

    config.data.series.forEach(s => {
      latex += ` & ${s.name}`;
    });

    latex += ` \\\\
\\midrule
`;

    config.data.categories?.forEach((cat, i) => {
      latex += cat;
      config.data.series.forEach(series => {
        latex += ` & ${series.data[i] || 0}`;
      });
      latex += ` \\\\
`;
    });

    latex += `\\bottomrule
\\end{tabular}
\\end{table}

\\end{document}`;

    return latex;
  }

  private generateMarkdownContent(config: ChartConfig, options: AdvancedExportOptions): string {
    let markdown = `# ${config.name}

## Chart
![Chart](chart.png)

## Data

| Category |`;

    config.data.series.forEach(s => {
      markdown += ` ${s.name} |`;
    });

    markdown += `
|----------|${'----------|'.repeat(config.data.series.length)}
`;

    config.data.categories?.forEach((cat, i) => {
      markdown += `| ${cat} |`;
      config.data.series.forEach(series => {
        markdown += ` ${series.data[i] || 0} |`;
      });
      markdown += `
`;
    });

    if (options.includeAnalysis) {
      const analysis = this.generateAnalysis(config);
      markdown += `
## Analysis

- **Total Data Points**: ${analysis.totalDataPoints}
- **Series Count**: ${analysis.seriesCount}
- **Maximum Value**: ${analysis.maxValue}
- **Minimum Value**: ${analysis.minValue}
- **Average Value**: ${analysis.avgValue.toFixed(2)}
- **Standard Deviation**: ${analysis.stdDev.toFixed(2)}
`;
    }

    return markdown;
  }

  private generateXMLContent(config: ChartConfig, options: AdvancedExportOptions): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<chart>
  <metadata>
    <name>${config.name}</name>
    <type>${config.type}</type>
    <created>${config.createdAt}</created>
    <updated>${config.updatedAt}</updated>
  </metadata>
  <data>`;

    config.data.series.forEach(series => {
      xml += `
    <series name="${series.name}">`;
      series.data.forEach((value, i) => {
        xml += `
      <point category="${config.data.categories?.[i] || ''}" value="${value}"/>`;
      });
      xml += `
    </series>`;
    });

    xml += `
  </data>
</chart>`;

    return xml;
  }

  private generateYAMLContent(config: ChartConfig, options: AdvancedExportOptions): string {
    let yaml = `chart:
  name: ${config.name}
  type: ${config.type}
  created: ${config.createdAt}
  updated: ${config.updatedAt}

data:
  categories:`;

    config.data.categories?.forEach(cat => {
      yaml += `
    - ${cat}`;
    });

    yaml += `
  series:`;

    config.data.series.forEach(series => {
      yaml += `
    - name: ${series.name}
      data:`;
      series.data.forEach(value => {
        yaml += `
        - ${value}`;
      });
    });

    return yaml;
  }
}

// Export singleton instance
export const exportManager = new ExportManager();