import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Preview as PreviewIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { useChartStore } from '../../store/chartStore';
import { ExportDialog } from '../Dialogs/ExportDialog';
import { ImportDialog } from '../Dialogs/ImportDialog';
import { SaveDialog } from '../Dialogs/SaveDialog';

interface HeaderProps {
  onViewChange?: (view: 'chart' | 'tools') => void;
  activeView?: 'chart' | 'tools';
}

export const Header: React.FC<HeaderProps> = ({ onViewChange, activeView = 'chart' }) => {
  const {
    currentChart,
    isDarkMode,
    isPreviewMode,
    toggleSidebar,
    toggleDarkMode,
    togglePreviewMode,
    resetChart,
    saveChart,
  } = useChartStore();

  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [fileMenuAnchor, setFileMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleFileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFileMenuAnchor(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
  };

  const handleSave = () => {
    if (currentChart) {
      setSaveDialogOpen(true);
    }
  };

  const handleQuickSave = () => {
    if (currentChart) {
      saveChart(currentChart);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0, mr: 4 }}>
            ECharts Studio
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            <Button
              color="inherit"
              onClick={handleFileMenuOpen}
              aria-label="File menu"
            >
              File
            </Button>
            <Menu
              anchorEl={fileMenuAnchor}
              open={Boolean(fileMenuAnchor)}
              onClose={handleFileMenuClose}
            >
              <MenuItem onClick={() => { handleFileMenuClose(); resetChart(); }}>
                New Chart
              </MenuItem>
              <MenuItem onClick={() => { handleFileMenuClose(); setSaveDialogOpen(true); }}>
                Save Chart
              </MenuItem>
              <MenuItem onClick={() => { handleFileMenuClose(); setImportDialogOpen(true); }}>
                Import Configuration
              </MenuItem>
              <MenuItem onClick={() => { handleFileMenuClose(); setExportDialogOpen(true); }}>
                Export Chart
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleFileMenuClose}>
                Settings
              </MenuItem>
            </Menu>

            <Button color="inherit" onClick={() => setExportDialogOpen(true)}>
              Export
            </Button>
            <Button color="inherit" onClick={() => setImportDialogOpen(true)}>
              Import
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Save Chart">
              <IconButton
                color="inherit"
                onClick={handleSave}
                aria-label="save chart"
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Reset Chart">
              <IconButton
                color="inherit"
                onClick={resetChart}
                aria-label="reset chart"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={isPreviewMode ? 'Edit Mode' : 'Preview Mode'}>
              <IconButton
                color="inherit"
                onClick={togglePreviewMode}
                aria-label="toggle preview mode"
              >
                <PreviewIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton
                color="inherit"
                onClick={toggleDarkMode}
                aria-label="toggle dark mode"
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Help">
              <IconButton
                color="inherit"
                aria-label="help"
                onClick={() => window.open('https://echarts.apache.org/en/option.html', '_blank')}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="GitHub">
              <IconButton
                color="inherit"
                aria-label="github"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      />
      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />
      <SaveDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
      />
    </>
  );
};