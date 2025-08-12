import React from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Alert,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useChartStore } from '../../store/chartStore';
import { SeriesData } from '../../types/chart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

export const DataEditor: React.FC = () => {
  const { currentChart, updateChartData } = useChartStore();
  const [tabValue, setTabValue] = React.useState(0);
  const [editingCell, setEditingCell] = React.useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [csvInput, setCsvInput] = React.useState('');
  const [jsonInput, setJsonInput] = React.useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddCategory = () => {
    if (!currentChart) return;
    const newCategories = [...(currentChart.data.categories || []), `Category ${(currentChart.data.categories?.length || 0) + 1}`];
    const newSeries = currentChart.data.series.map(s => ({
      ...s,
      data: [...s.data, 0],
    }));
    updateChartData({ categories: newCategories, series: newSeries });
  };

  const handleDeleteCategory = (index: number) => {
    if (!currentChart) return;
    const newCategories = currentChart.data.categories?.filter((_, i) => i !== index);
    const newSeries = currentChart.data.series.map(s => ({
      ...s,
      data: s.data.filter((_, i) => i !== index),
    }));
    updateChartData({ categories: newCategories, series: newSeries });
  };

  const handleAddSeries = () => {
    if (!currentChart) return;
    const dataLength = currentChart.data.categories?.length || 0;
    const newSeries: SeriesData = {
      name: `Series ${currentChart.data.series.length + 1}`,
      data: Array(dataLength).fill(0),
    };
    updateChartData({ series: [...currentChart.data.series, newSeries] });
  };

  const handleDeleteSeries = (index: number) => {
    if (!currentChart) return;
    const newSeries = currentChart.data.series.filter((_, i) => i !== index);
    updateChartData({ series: newSeries });
  };

  const handleCellEdit = (row: number, col: number) => {
    if (!currentChart) return;
    if (col === 0) {
      setEditValue(currentChart.data.categories?.[row] || '');
    } else {
      setEditValue(String(currentChart.data.series[col - 1]?.data[row] || 0));
    }
    setEditingCell({ row, col });
  };

  const handleCellSave = () => {
    if (!currentChart || !editingCell) return;
    
    if (editingCell.col === 0) {
      const newCategories = [...(currentChart.data.categories || [])];
      newCategories[editingCell.row] = editValue;
      updateChartData({ categories: newCategories });
    } else {
      const newSeries = [...currentChart.data.series];
      newSeries[editingCell.col - 1].data[editingCell.row] = parseFloat(editValue) || 0;
      updateChartData({ series: newSeries });
    }
    
    setEditingCell(null);
    setEditValue('');
  };

  const handleSeriesNameEdit = (index: number, name: string) => {
    if (!currentChart) return;
    const newSeries = [...currentChart.data.series];
    newSeries[index].name = name;
    updateChartData({ series: newSeries });
  };

  const handleCSVImport = () => {
    try {
      const lines = csvInput.trim().split('\n');
      if (lines.length < 2) {
        alert('Invalid CSV format');
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      const categories: string[] = [];
      const seriesData: { [key: string]: number[] } = {};
      
      headers.slice(1).forEach(header => {
        seriesData[header] = [];
      });
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        categories.push(values[0]);
        
        for (let j = 1; j < values.length && j < headers.length; j++) {
          seriesData[headers[j]].push(parseFloat(values[j]) || 0);
        }
      }
      
      const series: SeriesData[] = Object.entries(seriesData).map(([name, data]) => ({
        name,
        data,
      }));
      
      updateChartData({ categories, series });
      setCsvInput('');
      setTabValue(0);
    } catch (error) {
      alert('Failed to import CSV data');
    }
  };

  const handleJSONImport = () => {
    try {
      const data = JSON.parse(jsonInput);
      if (data.categories && data.series) {
        updateChartData(data);
        setJsonInput('');
        setTabValue(0);
      } else {
        alert('Invalid JSON format. Expected {categories: [], series: []}');
      }
    } catch (error) {
      alert('Failed to parse JSON data');
    }
  };

  const exportAsCSV = () => {
    if (!currentChart) return;
    
    const headers = ['Category', ...currentChart.data.series.map(s => s.name)].join(',');
    const rows = currentChart.data.categories?.map((cat, i) => {
      const values = [cat, ...currentChart.data.series.map(s => s.data[i])];
      return values.join(',');
    }) || [];
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    if (!currentChart) return;
    
    const json = JSON.stringify(currentChart.data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!currentChart) return null;

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Table" />
          <Tab label="Import CSV" />
          <Tab label="Import JSON" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddCategory}
            variant="outlined"
          >
            Add Category
          </Button>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddSeries}
            variant="outlined"
          >
            Add Series
          </Button>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={exportAsCSV}
          >
            Export CSV
          </Button>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={exportAsJSON}
          >
            Export JSON
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                {currentChart.data.series.map((series, index) => (
                  <TableCell key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TextField
                        size="small"
                        value={series.name}
                        onChange={(e) => handleSeriesNameEdit(index, e.target.value)}
                        variant="standard"
                        sx={{ width: 100 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSeries(index)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentChart.data.categories?.map((category, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {editingCell?.row === rowIndex && editingCell?.col === 0 ? (
                        <>
                          <TextField
                            size="small"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            variant="standard"
                            autoFocus
                          />
                          <IconButton size="small" onClick={handleCellSave}>
                            <SaveIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => setEditingCell(null)}>
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2">{category}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleCellEdit(rowIndex, 0)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCategory(rowIndex)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                  {currentChart.data.series.map((series, colIndex) => (
                    <TableCell key={colIndex}>
                      {editingCell?.row === rowIndex && editingCell?.col === colIndex + 1 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            variant="standard"
                            autoFocus
                            sx={{ width: 80 }}
                          />
                          <IconButton size="small" onClick={handleCellSave}>
                            <SaveIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => setEditingCell(null)}>
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleCellEdit(rowIndex, colIndex + 1)}
                        >
                          <Chip
                            label={series.data[rowIndex]}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Alert severity="info" sx={{ mb: 2 }}>
          CSV format: First row should be headers (Category, Series1, Series2, ...), 
          followed by data rows.
        </Alert>
        <TextField
          multiline
          rows={10}
          fullWidth
          placeholder="Category,Series 1,Series 2&#10;Mon,120,80&#10;Tue,200,120&#10;Wed,150,100"
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          variant="outlined"
        />
        <Button
          startIcon={<UploadIcon />}
          onClick={handleCSVImport}
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!csvInput.trim()}
        >
          Import CSV Data
        </Button>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Alert severity="info" sx={{ mb: 2 }}>
          JSON format: {"{"} "categories": [...], "series": [{"{"} "name": "...", "data": [...] {"}"}] {"}"}
        </Alert>
        <TextField
          multiline
          rows={10}
          fullWidth
          placeholder={JSON.stringify({ categories: ['Mon', 'Tue'], series: [{ name: 'Series 1', data: [120, 200] }] }, null, 2)}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          variant="outlined"
        />
        <Button
          startIcon={<UploadIcon />}
          onClick={handleJSONImport}
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!jsonInput.trim()}
        >
          Import JSON Data
        </Button>
      </TabPanel>
    </Box>
  );
};