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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useChartStore } from '../../store/chartStore';

interface SaveDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SaveDialog: React.FC<SaveDialogProps> = ({ open, onClose }) => {
  const { currentChart, savedCharts, saveChart, deleteChart, loadChart } = useChartStore();
  const [chartName, setChartName] = React.useState(currentChart?.name || 'Untitled Chart');
  const [showSaved, setShowSaved] = React.useState(false);

  React.useEffect(() => {
    if (currentChart) {
      setChartName(currentChart.name);
    }
  }, [currentChart]);

  const handleSave = () => {
    if (currentChart) {
      const chartToSave = {
        ...currentChart,
        name: chartName,
        updatedAt: new Date(),
      };
      saveChart(chartToSave);
      setShowSaved(true);
      setTimeout(() => {
        onClose();
        setShowSaved(false);
      }, 1500);
    }
  };

  const handleLoad = (id: string) => {
    loadChart(id);
    onClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this chart?')) {
      deleteChart(id);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Chart</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {showSaved ? (
            <Alert severity="success">Chart saved successfully!</Alert>
          ) : (
            <>
              <TextField
                fullWidth
                label="Chart Name"
                value={chartName}
                onChange={(e) => setChartName(e.target.value)}
                autoFocus
              />

              {savedCharts.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2">Saved Charts</Typography>
                  <List>
                    {savedCharts.map((chart) => (
                      <ListItem
                        key={chart.id}
                        disablePadding
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(chart.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemButton onClick={() => handleLoad(chart.id)}>
                          <ListItemText
                            primary={chart.name}
                            secondary={`Type: ${chart.type} | Updated: ${new Date(
                              chart.updatedAt
                            ).toLocaleDateString()}`}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!chartName.trim() || showSaved}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};