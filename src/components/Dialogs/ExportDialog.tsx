import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useChartStore } from '../../store/chartStore';
import * as echarts from 'echarts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { ExportOptions } from '../../types/chart';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose }) => {
  const { currentChart, exportChartConfig } = useChartStore();
  const [exportOptions, setExportOptions] = React.useState<ExportOptions>({
    format: 'png',
    filename: 'chart',
    quality: 1,
    backgroundColor: 'transparent',
  });

  const handleExport = async () => {
    if (!currentChart) return;

    const chartContainer = document.getElementById('chart-container');
    const echartsInstance = chartContainer ? echarts.getInstanceByDom(chartContainer as HTMLDivElement) : null;

    switch (exportOptions.format) {
      case 'png':
        if (echartsInstance) {
          const url = echartsInstance.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: exportOptions.backgroundColor === 'transparent' ? 'transparent' : exportOptions.backgroundColor,
          });
          const link = document.createElement('a');
          link.download = `${exportOptions.filename}.png`;
          link.href = url;
          link.click();
        }
        break;

      case 'svg':
        if (echartsInstance) {
          const url = echartsInstance.getDataURL({
            type: 'svg',
          });
          const link = document.createElement('a');
          link.download = `${exportOptions.filename}.svg`;
          link.href = url;
          link.click();
        }
        break;

      case 'pdf':
        if (chartContainer) {
          const canvas = await html2canvas(chartContainer as HTMLElement, {
            backgroundColor: exportOptions.backgroundColor === 'transparent' ? null : exportOptions.backgroundColor,
          });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'landscape',
          });
          const imgWidth = 280;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`${exportOptions.filename}.pdf`);
        }
        break;

      case 'json':
        const configJson = exportChartConfig();
        const blob = new Blob([configJson], { type: 'application/json' });
        saveAs(blob, `${exportOptions.filename}.json`);
        break;
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Chart</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Export Format</InputLabel>
            <Select
              value={exportOptions.format}
              label="Export Format"
              onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value as any })}
            >
              <MenuItem value="png">PNG Image</MenuItem>
              <MenuItem value="svg">SVG Vector</MenuItem>
              <MenuItem value="pdf">PDF Document</MenuItem>
              <MenuItem value="json">JSON Configuration</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Filename"
            value={exportOptions.filename}
            onChange={(e) => setExportOptions({ ...exportOptions, filename: e.target.value })}
            helperText="Without extension"
          />

          {(exportOptions.format === 'png' || exportOptions.format === 'pdf') && (
            <FormControl fullWidth>
              <InputLabel>Background Color</InputLabel>
              <Select
                value={exportOptions.backgroundColor}
                label="Background Color"
                onChange={(e) => setExportOptions({ ...exportOptions, backgroundColor: e.target.value })}
              >
                <MenuItem value="transparent">Transparent</MenuItem>
                <MenuItem value="#ffffff">White</MenuItem>
                <MenuItem value="#000000">Black</MenuItem>
                <MenuItem value="#f5f5f5">Light Gray</MenuItem>
              </Select>
            </FormControl>
          )}

          <Alert severity="info">
            {exportOptions.format === 'png' && 'Export as high-quality PNG image suitable for presentations'}
            {exportOptions.format === 'svg' && 'Export as scalable vector graphics for unlimited scaling'}
            {exportOptions.format === 'pdf' && 'Export as PDF document for easy sharing and printing'}
            {exportOptions.format === 'json' && 'Export chart configuration to recreate or share the chart'}
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleExport}
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={!currentChart}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};