import React from 'react';
import {
  Drawer,
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  DataObject as DataIcon,
  Palette as StyleIcon,
  Settings as SettingsIcon,
  Timeline as SeriesIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useChartStore } from '../../store/chartStore';
import { ChartTypeSelector } from '../ChartConfig/ChartTypeSelector';
import { DataEditor } from '../ChartConfig/DataEditor';
import { StyleEditor } from '../ChartConfig/StyleEditor';
import { SeriesEditor } from '../ChartConfig/SeriesEditor';
import { OptionsEditor } from '../ChartConfig/OptionsEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sidebar-tabpanel-${index}`}
      aria-labelledby={`sidebar-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const DRAWER_WIDTH = 360;

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar, isPreviewMode } = useChartStore();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isPreviewMode) {
    return null;
  }

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          mt: '64px', // Height of AppBar
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Chart Configuration</Typography>
          <IconButton onClick={toggleSidebar} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <ChartTypeSelector />
        </Box>
        
        <Divider />

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<DataIcon />}
            label="Data"
            id="sidebar-tab-0"
            aria-controls="sidebar-tabpanel-0"
          />
          <Tab
            icon={<SeriesIcon />}
            label="Series"
            id="sidebar-tab-1"
            aria-controls="sidebar-tabpanel-1"
          />
          <Tab
            icon={<StyleIcon />}
            label="Style"
            id="sidebar-tab-2"
            aria-controls="sidebar-tabpanel-2"
          />
          <Tab
            icon={<SettingsIcon />}
            label="Options"
            id="sidebar-tab-3"
            aria-controls="sidebar-tabpanel-3"
          />
        </Tabs>

        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <TabPanel value={tabValue} index={0}>
            <DataEditor />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <SeriesEditor />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <StyleEditor />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <OptionsEditor />
          </TabPanel>
        </Box>
      </Box>
    </Drawer>
  );
};