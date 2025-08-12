import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Typography,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { useChartStore } from '../../store/chartStore';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ open, onClose }) => {
  const { importChartConfig } = useChartStore();
  const [jsonInput, setJsonInput] = React.useState('');
  const [error, setError] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImport = () => {
    try {
      // Validate JSON
      JSON.parse(jsonInput);
      importChartConfig(jsonInput);
      setJsonInput('');
      setError('');
      onClose();
    } catch (err) {
      setError('Invalid JSON format. Please check your configuration.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonInput(content);
        setError('');
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Chart Configuration</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Alert severity="info">
            Import a previously exported chart configuration in JSON format.
            This will replace your current chart configuration.
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload JSON File
            </Button>
            <Typography variant="body2" color="text.secondary">
              or paste JSON below
            </Typography>
          </Box>

          <TextField
            multiline
            rows={15}
            fullWidth
            placeholder="Paste your chart configuration JSON here..."
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!jsonInput.trim()}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};