import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Button,
  ButtonGroup,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Typography,
  Chip,
  Stack,
  Alert,
  Snackbar,
  Menu,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Drawer,
  Switch,
  FormControlLabel,
  Slider,
  Autocomplete,
  Badge,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  CircularProgress,
  Collapse,
  Grid,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Radio,
  RadioGroup,
  AppBar,
  Toolbar,
  Popover,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  Save,
  SaveAs,
  FileDownload,
  FileUpload,
  Print,
  Undo,
  Redo,
  ContentCopy,
  ContentPaste,
  ContentCut,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatColorText,
  FormatColorFill,
  BorderAll,
  BorderClear,
  BorderColor,
  BorderStyle,
  BorderLeft,
  BorderRight,
  BorderTop,
  BorderBottom,
  BorderHorizontal,
  BorderVertical,
  BorderOuter,
  BorderInner,
  MergeType,
  CallSplit,
  Functions,
  Calculate,
  ShowChart,
  BarChart,
  PieChart,
  Timeline,
  BubbleChart,
  ScatterPlot,
  StackedLineChart,
  TableChart,
  PivotTableChart,
  Filter,
  FilterList,
  FilterAlt,
  Sort,
  SortByAlpha,
  ImportExport,
  Search,
  FindReplace,
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff,
  Comment,
  InsertComment,
  FormatListNumbered,
  FormatListBulleted,
  CheckBox,
  CheckBoxOutlineBlank,
  RadioButtonChecked,
  RadioButtonUnchecked,
  DateRange,
  AccessTime,
  AttachMoney,
  Percent,
  Link,
  Image,
  InsertChart,
  InsertDriveFile,
  Code,
  TextFields,
  Title,
  WrapText,
  VerticalAlignTop,
  VerticalAlignCenter,
  VerticalAlignBottom,
  RotateLeft,
  RotateRight,
  Flip,
  CropRotate,
  Transform,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
  ViewColumn,
  ViewModule,
  ViewList,
  ViewAgenda,
  GridOn,
  GridOff,
  TableRows,
  ViewHeadline,
  DragIndicator,
  DragHandle,
  OpenWith,
  Height,
  Width,
  AspectRatio,
  CropFree,
  CropSquare,
  Crop169,
  Crop75,
  Crop54,
  Crop32,
  CropPortrait,
  CropLandscape,
  CropDin,
  RoundedCorner,
  SelectAll,
  Deselect,
  InvertColors,
  InvertColorsOff,
  Tonality,
  Gradient,
  Palette,
  ColorLens,
  Brush,
  FormatPaint,
  FormatClear,
  AutoFixHigh,
  AutoFixNormal,
  AutoFixOff,
  AutoAwesome,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Analytics,
  Assessment,
  Insights,
  QueryStats,
  DataUsage,
  DonutLarge,
  DonutSmall,
  Equalizer,
  Leaderboard,
  Poll,
  Rule,
  SquareFoot,
  Straighten,
  Architecture,
  Engineering,
  Science,
  Biotech,
  Psychology,
  School,
  MenuBook,
  LibraryBooks,
  LocalLibrary,
  Book,
  Bookmark,
  BookmarkBorder,
  Bookmarks,
  CollectionsBookmark,
  Label,
  LabelOutline,
  Category,
  Folder,
  FolderOpen,
  CreateNewFolder,
  FolderSpecial,
  FolderShared,
  Topic,
  Subject,
  Assignment,
  AssignmentTurnedIn,
  AssignmentLate,
  AssignmentReturn,
  Receipt,
  Description,
  Article,
  Newspaper,
  Feed,
  RssFeed,
  Email,
  Drafts,
  Send,
  Inbox,
  Outbox,
  Mail,
  MarkEmailRead,
  MarkEmailUnread,
  ForwardToInbox,
  MarkAsUnread,
  AlternateEmail,
  ContactMail,
  Contacts,
  ContactPage,
  ImportContacts,
  Person,
  People,
  Group,
  Groups,
  PersonAdd,
  PersonRemove,
  PersonOutline,
  PeopleOutline,
  GroupAdd,
  GroupRemove,
  SupervisorAccount,
  ManageAccounts,
  AdminPanelSettings,
  Badge as BadgeIcon,
  VerifiedUser,
  Shield,
  Security,
  PrivacyTip,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Key,
  VpnKey,
  Password,
  Pin,
  Pattern,
  Fingerprint,
  Face,
  FaceRetouchingNatural,
  AccountCircle,
  AccountBox,
  AccountBalance,
  AccountBalanceWallet,
  Wallet,
  Savings,
  CreditCard,
  Payment,
  Receipt as ReceiptIcon,
  RequestQuote,
  PriceCheck,
  PriceChange,
  MonetizationOn,
  Euro,
  AttachMoney as AttachMoneyIcon,
  MoneyOff,
  CurrencyExchange,
  CurrencyBitcoin,
  Paid,
  Sell,
  ShoppingCart,
  ShoppingBag,
  ShoppingBasket,
  Store,
  Storefront,
  LocalMall,
  LocalGroceryStore,
  LocalOffer,
  Loyalty,
  Discount,
  Redeem,
  CardGiftcard,
  CardMembership,
  CardTravel,
  Inventory,
  Inventory2,
  ProductionQuantityLimits,
  Category as CategoryIcon,
  QrCode,
  QrCode2,
  QrCodeScanner,
  Barcode,
  Scanner,
  CameraAlt,
  PhotoCamera,
  AddAPhoto,
  AddPhotoAlternate,
  Collections,
  PhotoLibrary,
  PhotoAlbum,
  Photo,
  PhotoSizeSelectActual,
  PhotoSizeSelectLarge,
  PhotoSizeSelectSmall,
  PhotoFilter,
  PhotoCameraFront,
  PhotoCameraBack,
  Portrait,
  Landscape,
  Panorama,
  PanoramaFishEye,
  PanoramaHorizontal,
  PanoramaVertical,
  PanoramaWideAngle,
  Lens,
  BlurOn,
  BlurOff,
  BlurCircular,
  BlurLinear,
  Details,
  Tune,
  Settings,
  SettingsApplications,
  SettingsInputComponent,
  SettingsInputComposite,
  SettingsInputHdmi,
  SettingsInputSvideo,
  SettingsInputAntenna,
  SettingsOverscan,
  SettingsBrightness,
  SettingsDisplay,
  SettingsPhone,
  SettingsPower,
  SettingsRemote,
  SettingsVoice,
  SettingsEthernet,
  SettingsBluetooth,
  SettingsSystemDaydream,
  Build,
  Construction,
  Handyman,
  Hardware,
  Carpenter,
  Plumbing,
  ElectricalServices,
  HomeRepairService,
  CleaningServices,
  Wash,
  DryClean,
  LocalLaundryService,
  IronIcon,
  Checkroom,
  RoomService,
  RoomPreferences,
  BedroomParent,
  BedroomChild,
  BedroomBaby,
  Bathroom,
  Kitchen,
  Dining,
  TableRestaurant,
  TableBar,
  Chair,
  ChairAlt,
  Weekend,
  Deck,
  Yard,
  Fence,
  Roofing,
  Foundation,
  Window,
  Door,
  DoorFront,
  DoorBack,
  DoorSliding,
  MeetingRoom,
  NoMeetingRoom,
  Balcony,
  Stairs,
  Elevator,
  Escalator,
  EscalatorWarning,
  Accessible,
  AccessibleForward,
  WheelchairPickup,
  Elderly,
  ElderlyWoman,
  PregnantWoman,
  ChildCare,
  ChildFriendly,
  BabyChangingStation,
  FamilyRestroom,
  Wc,
  Man,
  Woman,
  Boy,
  Girl,
  Transgender,
  Male,
  Female,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowsProp, GridToolbar, GridCellParams, GridRowParams, GridSelectionModel } from '@mui/x-data-grid';
import { DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BarChart as RechartsBarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, ScatterChart, Scatter, AreaChart, Area, RadarChart, Radar, RadialBarChart, RadialBar, Treemap, Sankey, Funnel, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { evaluate, parse, compile } from 'mathjs';
import moment from 'moment';
import numeral from 'numeral';
import { v4 as uuidv4 } from 'uuid';
import { debounce, throttle, cloneDeep, merge, groupBy, orderBy, sumBy, meanBy, maxBy, minBy, uniqBy, flatten, chunk, zip, unzip } from 'lodash';
import axios from 'axios';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import Handsontable from 'handsontable';

interface SpreadsheetEditorProps {
  initialData?: any[][];
  columns?: ColumnDefinition[];
  rows?: number;
  readOnly?: boolean;
  allowFormulas?: boolean;
  allowCharts?: boolean;
  allowPivotTables?: boolean;
  allowMacros?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  collaborationEnabled?: boolean;
  theme?: 'light' | 'dark';
  locale?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: string;
  numberFormat?: string;
  onChange?: (data: any[][]) => void;
  onSave?: (data: any[][]) => void;
  onExport?: (data: any[][], format: string) => void;
}

interface ColumnDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'time' | 'datetime' | 'boolean' | 'select' | 'multiselect' | 'currency' | 'percentage' | 'email' | 'url' | 'phone' | 'formula' | 'image' | 'file' | 'rating' | 'progress' | 'tags' | 'json' | 'markdown' | 'html' | 'code';
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  required?: boolean;
  unique?: boolean;
  validation?: ValidationRule[];
  format?: FormatOptions;
  defaultValue?: any;
  options?: SelectOption[];
  formula?: string;
  aggregate?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'median' | 'mode' | 'std' | 'var';
  hidden?: boolean;
  frozen?: boolean;
  headerStyle?: CellStyle;
  cellStyle?: CellStyle;
  conditional?: ConditionalFormat[];
}

interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
  value?: any;
  message?: string;
  validator?: (value: any, row: any) => boolean;
}

interface FormatOptions {
  prefix?: string;
  suffix?: string;
  thousandsSeparator?: string;
  decimalSeparator?: string;
  decimals?: number;
  dateFormat?: string;
  timeFormat?: string;
  trueText?: string;
  falseText?: string;
  nullText?: string;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'title';
}

interface SelectOption {
  value: any;
  label: string;
  color?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface CellStyle {
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  padding?: string | number;
  margin?: string | number;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
  wordWrap?: 'normal' | 'break-word';
  textOverflow?: 'clip' | 'ellipsis';
}

interface ConditionalFormat {
  condition: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'notBetween' | 'in' | 'notIn' | 'empty' | 'notEmpty' | 'custom';
  value?: any;
  value2?: any;
  style?: CellStyle;
  className?: string;
  icon?: React.ReactNode;
  validator?: (value: any, row: any) => boolean;
}

interface Cell {
  id: string;
  row: number;
  column: number;
  value: any;
  formula?: string;
  type?: string;
  style?: CellStyle;
  validation?: ValidationRule[];
  locked?: boolean;
  hidden?: boolean;
  merged?: { rowspan: number; colspan: number };
  comment?: string;
  history?: CellHistory[];
}

interface CellHistory {
  value: any;
  timestamp: Date;
  user: string;
  action: 'create' | 'update' | 'delete';
}

interface Selection {
  start: { row: number; column: number };
  end: { row: number; column: number };
}

interface Chart {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'radar' | 'treemap' | 'sankey' | 'funnel' | 'gauge' | 'heatmap' | 'bubble' | 'waterfall' | 'boxplot' | 'candlestick' | 'gantt' | 'network' | 'word-cloud' | 'sunburst' | 'parallel' | 'flow';
  title: string;
  data: any[];
  options: ChartOptions;
  position: { x: number; y: number; width: number; height: number };
}

interface ChartOptions {
  xAxis?: AxisOptions;
  yAxis?: AxisOptions;
  legend?: LegendOptions;
  colors?: string[];
  animation?: boolean;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: any;
}

interface AxisOptions {
  title?: string;
  type?: 'category' | 'value' | 'time' | 'log';
  min?: number;
  max?: number;
  tickInterval?: number;
  format?: string;
  gridLines?: boolean;
  labels?: boolean;
}

interface LegendOptions {
  display?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  labels?: {
    color?: string;
    font?: {
      size?: number;
      family?: string;
      weight?: string;
    };
  };
}

interface PivotTable {
  id: string;
  rows: string[];
  columns: string[];
  values: string[];
  filters: string[];
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'median' | 'mode' | 'std' | 'var';
  showTotals?: boolean;
  showSubtotals?: boolean;
}

interface Macro {
  id: string;
  name: string;
  description?: string;
  script: string;
  trigger?: 'manual' | 'onChange' | 'onSave' | 'onLoad' | 'onSchedule';
  schedule?: string;
  enabled: boolean;
}

interface Filter {
  column: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'notBetween' | 'in' | 'notIn' | 'empty' | 'notEmpty';
  value: any;
  value2?: any;
}

interface Sort {
  column: string;
  direction: 'asc' | 'desc';
}

interface DataValidation {
  type: 'list' | 'range' | 'custom' | 'date' | 'time' | 'length' | 'whole' | 'decimal' | 'text';
  formula?: string;
  allowBlank?: boolean;
  showDropdown?: boolean;
  showInputMessage?: boolean;
  showErrorMessage?: boolean;
  inputTitle?: string;
  inputMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  errorStyle?: 'stop' | 'warning' | 'information';
}

interface NamedRange {
  name: string;
  range: string;
  scope?: 'workbook' | 'worksheet';
  comment?: string;
}

interface Protection {
  locked: boolean;
  password?: string;
  allowSelectLocked?: boolean;
  allowSelectUnlocked?: boolean;
  allowFormatCells?: boolean;
  allowFormatColumns?: boolean;
  allowFormatRows?: boolean;
  allowInsertColumns?: boolean;
  allowInsertRows?: boolean;
  allowInsertHyperlinks?: boolean;
  allowDeleteColumns?: boolean;
  allowDeleteRows?: boolean;
  allowSort?: boolean;
  allowFilter?: boolean;
  allowPivotTables?: boolean;
}

interface Collaboration {
  users: User[];
  cursors: { [userId: string]: { row: number; column: number; color: string } };
  selections: { [userId: string]: Selection };
  changes: Change[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer' | 'commenter';
  online: boolean;
  lastSeen?: Date;
}

interface Change {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'cell' | 'row' | 'column' | 'format' | 'formula' | 'chart' | 'pivot' | 'macro';
  before: any;
  after: any;
  range?: string;
}

interface ImportOptions {
  delimiter?: string;
  quote?: string;
  escape?: string;
  hasHeaders?: boolean;
  encoding?: string;
  skipRows?: number;
  skipColumns?: number;
  maxRows?: number;
  maxColumns?: number;
  dateFormat?: string;
  numberFormat?: string;
  booleanTrueValues?: string[];
  booleanFalseValues?: string[];
  nullValues?: string[];
  trimWhitespace?: boolean;
  convertEmptyToNull?: boolean;
}

interface ExportOptions {
  format: 'xlsx' | 'csv' | 'json' | 'html' | 'pdf' | 'xml' | 'sql' | 'markdown';
  filename?: string;
  sheetName?: string;
  delimiter?: string;
  quote?: string;
  escape?: string;
  includeHeaders?: boolean;
  encoding?: string;
  dateFormat?: string;
  numberFormat?: string;
  booleanTrueValue?: string;
  booleanFalseValue?: string;
  nullValue?: string;
  compression?: boolean;
}

export const SpreadsheetEditor: React.FC<SpreadsheetEditorProps> = ({
  initialData = [[]],
  columns = [],
  rows = 100,
  readOnly = false,
  allowFormulas = true,
  allowCharts = true,
  allowPivotTables = true,
  allowMacros = false,
  autoSave = false,
  autoSaveInterval = 30000,
  collaborationEnabled = false,
  theme = 'light',
  locale = 'en-US',
  currency = 'USD',
  dateFormat = 'MM/DD/YYYY',
  timeFormat = 'HH:mm:ss',
  numberFormat = '#,##0.00',
  onChange,
  onSave,
  onExport,
}) => {
  const [data, setData] = useState<any[][]>(initialData);
  const [selectedCells, setSelectedCells] = useState<Selection | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; column: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; column: number; value: string } | null>(null);
  const [clipboard, setClipboard] = useState<any[][]>([]);
  const [history, setHistory] = useState<{ data: any[][]; timestamp: Date }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sorts, setSorts] = useState<Sort[]>([]);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [pivotTables, setPivotTables] = useState<PivotTable[]>([]);
  const [macros, setMacros] = useState<Macro[]>([]);
  const [namedRanges, setNamedRanges] = useState<NamedRange[]>([]);
  const [protection, setProtection] = useState<Protection | null>(null);
  const [collaboration, setCollaboration] = useState<Collaboration | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showGridlines, setShowGridlines] = useState(true);
  const [showHeaders, setShowHeaders] = useState(true);
  const [showFormulas, setShowFormulas] = useState(false);
  const [freezePanes, setFreezePanes] = useState<{ row: number; column: number } | null>(null);
  const [splitPanes, setSplitPanes] = useState<{ horizontal?: number; vertical?: number } | null>(null);
  const [activeSheet, setActiveSheet] = useState(0);
  const [sheets, setSheets] = useState([{ name: 'Sheet1', data: initialData }]);
  
  const [cellStyles, setCellStyles] = useState<{ [key: string]: CellStyle }>({});
  const [mergedCells, setMergedCells] = useState<{ [key: string]: { rowspan: number; colspan: number } }>({});
  const [cellComments, setCellComments] = useState<{ [key: string]: string }>({});
  const [cellValidations, setCellValidations] = useState<{ [key: string]: DataValidation }>({});
  const [conditionalFormats, setConditionalFormats] = useState<ConditionalFormat[]>([]);
  
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [findOptions, setFindOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
    useRegex: false,
    searchInFormulas: false,
  });
  
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [chartDialogOpen, setChartDialogOpen] = useState(false);
  const [pivotDialogOpen, setPivotDialogOpen] = useState(false);
  const [macroDialogOpen, setMacroDialogOpen] = useState(false);
  const [formatDialogOpen, setFormatDialogOpen] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [protectionDialogOpen, setProtectionDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  const hotTableRef = useRef<HotTable>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Formula functions
  const formulaFunctions = {
    // Math functions
    SUM: (...args: number[]) => args.reduce((a, b) => a + b, 0),
    AVERAGE: (...args: number[]) => args.reduce((a, b) => a + b, 0) / args.length,
    MIN: (...args: number[]) => Math.min(...args),
    MAX: (...args: number[]) => Math.max(...args),
    COUNT: (...args: any[]) => args.filter(a => a !== null && a !== undefined && a !== '').length,
    COUNTA: (...args: any[]) => args.length,
    COUNTIF: (range: any[], criteria: any) => range.filter(cell => cell === criteria).length,
    SUMIF: (range: any[], criteria: any, sumRange?: any[]) => {
      const sum = sumRange || range;
      return range.reduce((acc, cell, index) => {
        if (cell === criteria) {
          return acc + (sum[index] || 0);
        }
        return acc;
      }, 0);
    },
    ROUND: (num: number, digits: number) => Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits),
    ROUNDUP: (num: number, digits: number) => Math.ceil(num * Math.pow(10, digits)) / Math.pow(10, digits),
    ROUNDDOWN: (num: number, digits: number) => Math.floor(num * Math.pow(10, digits)) / Math.pow(10, digits),
    ABS: (num: number) => Math.abs(num),
    POWER: (base: number, exponent: number) => Math.pow(base, exponent),
    SQRT: (num: number) => Math.sqrt(num),
    EXP: (num: number) => Math.exp(num),
    LN: (num: number) => Math.log(num),
    LOG: (num: number, base: number = 10) => Math.log(num) / Math.log(base),
    LOG10: (num: number) => Math.log10(num),
    RAND: () => Math.random(),
    RANDBETWEEN: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
    PI: () => Math.PI,
    SIN: (angle: number) => Math.sin(angle),
    COS: (angle: number) => Math.cos(angle),
    TAN: (angle: number) => Math.tan(angle),
    ASIN: (num: number) => Math.asin(num),
    ACOS: (num: number) => Math.acos(num),
    ATAN: (num: number) => Math.atan(num),
    DEGREES: (radians: number) => radians * (180 / Math.PI),
    RADIANS: (degrees: number) => degrees * (Math.PI / 180),
    
    // Text functions
    CONCATENATE: (...args: string[]) => args.join(''),
    CONCAT: (...args: string[]) => args.join(''),
    LEFT: (text: string, numChars: number) => text.substring(0, numChars),
    RIGHT: (text: string, numChars: number) => text.substring(text.length - numChars),
    MID: (text: string, startNum: number, numChars: number) => text.substring(startNum - 1, startNum - 1 + numChars),
    LEN: (text: string) => text.length,
    LOWER: (text: string) => text.toLowerCase(),
    UPPER: (text: string) => text.toUpperCase(),
    PROPER: (text: string) => text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
    TRIM: (text: string) => text.trim(),
    SUBSTITUTE: (text: string, oldText: string, newText: string, instance?: number) => {
      if (instance) {
        let count = 0;
        return text.replace(new RegExp(oldText, 'g'), match => {
          count++;
          return count === instance ? newText : match;
        });
      }
      return text.replace(new RegExp(oldText, 'g'), newText);
    },
    REPLACE: (oldText: string, startNum: number, numChars: number, newText: string) => {
      return oldText.substring(0, startNum - 1) + newText + oldText.substring(startNum - 1 + numChars);
    },
    FIND: (findText: string, withinText: string, startNum: number = 1) => {
      const index = withinText.indexOf(findText, startNum - 1);
      return index === -1 ? null : index + 1;
    },
    SEARCH: (findText: string, withinText: string, startNum: number = 1) => {
      const regex = new RegExp(findText, 'i');
      const match = withinText.substring(startNum - 1).match(regex);
      return match ? match.index! + startNum : null;
    },
    TEXT: (value: any, format: string) => {
      // Implement text formatting
      return String(value);
    },
    VALUE: (text: string) => parseFloat(text),
    CLEAN: (text: string) => text.replace(/[\x00-\x1F\x7F]/g, ''),
    CHAR: (num: number) => String.fromCharCode(num),
    CODE: (text: string) => text.charCodeAt(0),
    REPT: (text: string, times: number) => text.repeat(times),
    
    // Date and time functions
    TODAY: () => new Date().toLocaleDateString(),
    NOW: () => new Date().toLocaleString(),
    DATE: (year: number, month: number, day: number) => new Date(year, month - 1, day),
    TIME: (hour: number, minute: number, second: number) => {
      const date = new Date();
      date.setHours(hour, minute, second, 0);
      return date.toLocaleTimeString();
    },
    YEAR: (date: Date | string) => new Date(date).getFullYear(),
    MONTH: (date: Date | string) => new Date(date).getMonth() + 1,
    DAY: (date: Date | string) => new Date(date).getDate(),
    HOUR: (time: Date | string) => new Date(time).getHours(),
    MINUTE: (time: Date | string) => new Date(time).getMinutes(),
    SECOND: (time: Date | string) => new Date(time).getSeconds(),
    WEEKDAY: (date: Date | string, returnType: number = 1) => {
      const d = new Date(date);
      const day = d.getDay();
      if (returnType === 1) return day === 0 ? 7 : day;
      if (returnType === 2) return day === 0 ? 1 : day + 1;
      return day;
    },
    WEEKNUM: (date: Date | string) => {
      const d = new Date(date);
      const onejan = new Date(d.getFullYear(), 0, 1);
      return Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    },
    DAYS: (endDate: Date | string, startDate: Date | string) => {
      const end = new Date(endDate);
      const start = new Date(startDate);
      return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    },
    DATEDIF: (startDate: Date | string, endDate: Date | string, unit: string) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = end.getTime() - start.getTime();
      
      switch (unit.toUpperCase()) {
        case 'Y': return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        case 'M': return Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
        case 'D': return Math.floor(diff / (1000 * 60 * 60 * 24));
        case 'H': return Math.floor(diff / (1000 * 60 * 60));
        case 'MN': return Math.floor(diff / (1000 * 60));
        case 'S': return Math.floor(diff / 1000);
        default: return 0;
      }
    },
    DATEVALUE: (dateText: string) => new Date(dateText).getTime(),
    TIMEVALUE: (timeText: string) => {
      const [hours, minutes, seconds] = timeText.split(':').map(Number);
      return hours * 3600 + minutes * 60 + (seconds || 0);
    },
    NETWORKDAYS: (startDate: Date | string, endDate: Date | string, holidays?: (Date | string)[]) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const holidayDates = holidays ? holidays.map(h => new Date(h).getTime()) : [];
      
      let count = 0;
      const current = new Date(start);
      
      while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6 && !holidayDates.includes(current.getTime())) {
          count++;
        }
        current.setDate(current.getDate() + 1);
      }
      
      return count;
    },
    WORKDAY: (startDate: Date | string, days: number, holidays?: (Date | string)[]) => {
      const start = new Date(startDate);
      const holidayDates = holidays ? holidays.map(h => new Date(h).getTime()) : [];
      
      let count = 0;
      const current = new Date(start);
      
      while (count < Math.abs(days)) {
        current.setDate(current.getDate() + (days > 0 ? 1 : -1));
        const day = current.getDay();
        if (day !== 0 && day !== 6 && !holidayDates.includes(current.getTime())) {
          count++;
        }
      }
      
      return current;
    },
    
    // Logical functions
    IF: (condition: boolean, trueValue: any, falseValue: any) => condition ? trueValue : falseValue,
    AND: (...args: boolean[]) => args.every(Boolean),
    OR: (...args: boolean[]) => args.some(Boolean),
    NOT: (value: boolean) => !value,
    XOR: (...args: boolean[]) => args.filter(Boolean).length % 2 === 1,
    TRUE: () => true,
    FALSE: () => false,
    IFERROR: (value: any, valueIfError: any) => {
      try {
        return value;
      } catch {
        return valueIfError;
      }
    },
    IFNA: (value: any, valueIfNA: any) => value === '#N/A' ? valueIfNA : value,
    IFS: (...args: any[]) => {
      for (let i = 0; i < args.length; i += 2) {
        if (args[i]) return args[i + 1];
      }
      return '#N/A';
    },
    SWITCH: (expression: any, ...args: any[]) => {
      for (let i = 0; i < args.length - 1; i += 2) {
        if (expression === args[i]) return args[i + 1];
      }
      return args.length % 2 === 0 ? '#N/A' : args[args.length - 1];
    },
    
    // Lookup functions
    VLOOKUP: (lookupValue: any, tableArray: any[][], colIndexNum: number, rangeLookup: boolean = false) => {
      for (let i = 0; i < tableArray.length; i++) {
        if (rangeLookup) {
          if (tableArray[i][0] <= lookupValue) {
            if (i === tableArray.length - 1 || tableArray[i + 1][0] > lookupValue) {
              return tableArray[i][colIndexNum - 1];
            }
          }
        } else {
          if (tableArray[i][0] === lookupValue) {
            return tableArray[i][colIndexNum - 1];
          }
        }
      }
      return '#N/A';
    },
    HLOOKUP: (lookupValue: any, tableArray: any[][], rowIndexNum: number, rangeLookup: boolean = false) => {
      const transposed = tableArray[0].map((_, colIndex) => tableArray.map(row => row[colIndex]));
      return formulaFunctions.VLOOKUP(lookupValue, transposed, rowIndexNum, rangeLookup);
    },
    LOOKUP: (lookupValue: any, lookupVector: any[], resultVector?: any[]) => {
      const result = resultVector || lookupVector;
      for (let i = 0; i < lookupVector.length; i++) {
        if (lookupVector[i] === lookupValue) {
          return result[i];
        }
      }
      return '#N/A';
    },
    INDEX: (array: any[][], rowNum: number, colNum?: number) => {
      if (colNum !== undefined) {
        return array[rowNum - 1][colNum - 1];
      }
      return array[rowNum - 1];
    },
    MATCH: (lookupValue: any, lookupArray: any[], matchType: number = 0) => {
      for (let i = 0; i < lookupArray.length; i++) {
        if (matchType === 0 && lookupArray[i] === lookupValue) {
          return i + 1;
        } else if (matchType === 1 && lookupArray[i] <= lookupValue) {
          if (i === lookupArray.length - 1 || lookupArray[i + 1] > lookupValue) {
            return i + 1;
          }
        } else if (matchType === -1 && lookupArray[i] >= lookupValue) {
          return i + 1;
        }
      }
      return '#N/A';
    },
    CHOOSE: (indexNum: number, ...values: any[]) => values[indexNum - 1],
    OFFSET: (reference: any[][], rows: number, cols: number, height?: number, width?: number) => {
      // Implement OFFSET function
      return reference;
    },
    INDIRECT: (refText: string) => {
      // Implement INDIRECT function
      return refText;
    },
    
    // Statistical functions
    MEDIAN: (...args: number[]) => {
      const sorted = args.sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },
    MODE: (...args: number[]) => {
      const frequency: { [key: number]: number } = {};
      let maxFreq = 0;
      let mode = args[0];
      
      args.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
          maxFreq = frequency[num];
          mode = num;
        }
      });
      
      return mode;
    },
    STDEV: (...args: number[]) => {
      const mean = formulaFunctions.AVERAGE(...args);
      const squaredDiffs = args.map(num => Math.pow(num - mean, 2));
      const variance = formulaFunctions.AVERAGE(...squaredDiffs);
      return Math.sqrt(variance);
    },
    VAR: (...args: number[]) => {
      const mean = formulaFunctions.AVERAGE(...args);
      const squaredDiffs = args.map(num => Math.pow(num - mean, 2));
      return formulaFunctions.AVERAGE(...squaredDiffs);
    },
    PERCENTILE: (array: number[], k: number) => {
      const sorted = array.sort((a, b) => a - b);
      const index = (sorted.length - 1) * k;
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index % 1;
      
      if (lower === upper) {
        return sorted[lower];
      }
      
      return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    },
    QUARTILE: (array: number[], quart: number) => {
      return formulaFunctions.PERCENTILE(array, quart * 0.25);
    },
    RANK: (number: number, ref: number[], order: number = 0) => {
      const sorted = [...ref].sort((a, b) => order ? a - b : b - a);
      return sorted.indexOf(number) + 1;
    },
    CORREL: (array1: number[], array2: number[]) => {
      const n = array1.length;
      const sum1 = formulaFunctions.SUM(...array1);
      const sum2 = formulaFunctions.SUM(...array2);
      const sum1Sq = formulaFunctions.SUM(...array1.map(x => x * x));
      const sum2Sq = formulaFunctions.SUM(...array2.map(x => x * x));
      const pSum = formulaFunctions.SUM(...array1.map((x, i) => x * array2[i]));
      
      const num = pSum - (sum1 * sum2 / n);
      const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
      
      return den === 0 ? 0 : num / den;
    },
    COVAR: (array1: number[], array2: number[]) => {
      const mean1 = formulaFunctions.AVERAGE(...array1);
      const mean2 = formulaFunctions.AVERAGE(...array2);
      const n = array1.length;
      
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += (array1[i] - mean1) * (array2[i] - mean2);
      }
      
      return sum / n;
    },
    
    // Financial functions
    PMT: (rate: number, nper: number, pv: number, fv: number = 0, type: number = 0) => {
      if (rate === 0) {
        return -(pv + fv) / nper;
      }
      
      const pvif = Math.pow(1 + rate, nper);
      let pmt = rate * (pv * pvif + fv) / (pvif - 1);
      
      if (type === 1) {
        pmt /= (1 + rate);
      }
      
      return -pmt;
    },
    PV: (rate: number, nper: number, pmt: number, fv: number = 0, type: number = 0) => {
      if (rate === 0) {
        return -pmt * nper - fv;
      }
      
      const pvif = Math.pow(1 + rate, nper);
      let pv = (pmt * (1 - pvif) / rate) + (fv / pvif);
      
      if (type === 1) {
        pv *= (1 + rate);
      }
      
      return -pv;
    },
    FV: (rate: number, nper: number, pmt: number, pv: number = 0, type: number = 0) => {
      if (rate === 0) {
        return -pv - pmt * nper;
      }
      
      const pvif = Math.pow(1 + rate, nper);
      let fv = pv * pvif + pmt * ((pvif - 1) / rate);
      
      if (type === 1) {
        fv *= (1 + rate);
      }
      
      return -fv;
    },
    NPV: (rate: number, ...values: number[]) => {
      let npv = 0;
      for (let i = 0; i < values.length; i++) {
        npv += values[i] / Math.pow(1 + rate, i + 1);
      }
      return npv;
    },
    IRR: (values: number[], guess: number = 0.1) => {
      const maxIterations = 100;
      const tolerance = 1e-7;
      
      let rate = guess;
      
      for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dnpv = 0;
        
        for (let j = 0; j < values.length; j++) {
          const factor = Math.pow(1 + rate, j);
          npv += values[j] / factor;
          dnpv -= j * values[j] / (factor * (1 + rate));
        }
        
        const newRate = rate - npv / dnpv;
        
        if (Math.abs(newRate - rate) < tolerance) {
          return newRate;
        }
        
        rate = newRate;
      }
      
      return '#NUM!';
    },
    RATE: (nper: number, pmt: number, pv: number, fv: number = 0, type: number = 0, guess: number = 0.1) => {
      const maxIterations = 100;
      const tolerance = 1e-7;
      
      let rate = guess;
      
      for (let i = 0; i < maxIterations; i++) {
        let y, f;
        
        if (rate === 0) {
          y = pv + pmt * nper + fv;
        } else {
          const factor = Math.pow(1 + rate, nper);
          y = pv * factor + pmt * (1 + rate * type) * (factor - 1) / rate + fv;
        }
        
        if (Math.abs(y) < tolerance) {
          return rate;
        }
        
        if (rate === 0) {
          f = pmt * nper;
        } else {
          const factor = Math.pow(1 + rate, nper);
          f = pv * nper * Math.pow(1 + rate, nper - 1) +
              pmt * (1 + rate * type) * (nper * Math.pow(1 + rate, nper - 1) * rate - (factor - 1)) / (rate * rate);
        }
        
        rate = rate - y / f;
      }
      
      return '#NUM!';
    },
    
    // Information functions
    ISBLANK: (value: any) => value === null || value === undefined || value === '',
    ISERROR: (value: any) => typeof value === 'string' && value.startsWith('#'),
    ISEVEN: (value: number) => value % 2 === 0,
    ISODD: (value: number) => value % 2 !== 0,
    ISLOGICAL: (value: any) => typeof value === 'boolean',
    ISNA: (value: any) => value === '#N/A',
    ISNONTEXT: (value: any) => typeof value !== 'string',
    ISNUMBER: (value: any) => typeof value === 'number' && !isNaN(value),
    ISREF: (value: any) => false, // Simplified
    ISTEXT: (value: any) => typeof value === 'string',
    N: (value: any) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'boolean') return value ? 1 : 0;
      if (value instanceof Date) return value.getTime();
      return 0;
    },
    NA: () => '#N/A',
    TYPE: (value: any) => {
      if (typeof value === 'number') return 1;
      if (typeof value === 'string') return 2;
      if (typeof value === 'boolean') return 4;
      if (value === null || value === undefined) return 16;
      if (Array.isArray(value)) return 64;
      return 128;
    },
    CELL: (infoType: string, reference: any) => {
      // Simplified CELL function
      switch (infoType.toLowerCase()) {
        case 'address': return 'A1';
        case 'col': return 1;
        case 'row': return 1;
        case 'type': return formulaFunctions.TYPE(reference);
        case 'contents': return reference;
        default: return reference;
      }
    },
    ERROR: (errorType: string) => {
      const errors: { [key: string]: string } = {
        'NULL': '#NULL!',
        'DIV/0': '#DIV/0!',
        'VALUE': '#VALUE!',
        'REF': '#REF!',
        'NAME': '#NAME?',
        'NUM': '#NUM!',
        'N/A': '#N/A',
      };
      return errors[errorType] || '#ERROR!';
    },
  };

  // Auto-save functionality
  useEffect(() => {
    if (autoSave) {
      const saveInterval = setInterval(() => {
        handleSave();
      }, autoSaveInterval);
      return () => clearInterval(saveInterval);
    }
  }, [autoSave, autoSaveInterval, data]);

  // Calculate cell value with formula support
  const calculateCellValue = (row: number, col: number): any => {
    const cellValue = data[row]?.[col];
    
    if (typeof cellValue === 'string' && cellValue.startsWith('=')) {
      try {
        // Parse and evaluate formula
        const formula = cellValue.substring(1);
        return evaluateFormula(formula, row, col);
      } catch (error) {
        return '#ERROR!';
      }
    }
    
    return cellValue;
  };

  // Evaluate formula
  const evaluateFormula = (formula: string, currentRow: number, currentCol: number): any => {
    // Replace cell references with values
    let processedFormula = formula;
    
    // Replace A1-style references
    processedFormula = processedFormula.replace(/([A-Z]+)(\d+)/g, (match, col, row) => {
      const colIndex = col.split('').reduce((acc: number, char: string) => {
        return acc * 26 + char.charCodeAt(0) - 65;
      }, 0);
      const rowIndex = parseInt(row) - 1;
      const value = calculateCellValue(rowIndex, colIndex);
      return typeof value === 'number' ? value.toString() : `"${value}"`;
    });
    
    // Replace range references (e.g., A1:B10)
    processedFormula = processedFormula.replace(/([A-Z]+\d+):([A-Z]+\d+)/g, (match, start, end) => {
      const startMatch = start.match(/([A-Z]+)(\d+)/);
      const endMatch = end.match(/([A-Z]+)(\d+)/);
      
      if (startMatch && endMatch) {
        const startCol = startMatch[1].split('').reduce((acc: number, char: string) => {
          return acc * 26 + char.charCodeAt(0) - 65;
        }, 0);
        const startRow = parseInt(startMatch[2]) - 1;
        const endCol = endMatch[1].split('').reduce((acc: number, char: string) => {
          return acc * 26 + char.charCodeAt(0) - 65;
        }, 0);
        const endRow = parseInt(endMatch[2]) - 1;
        
        const rangeValues = [];
        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            rangeValues.push(calculateCellValue(r, c));
          }
        }
        
        return `[${rangeValues.join(',')}]`;
      }
      
      return match;
    });
    
    // Evaluate formula functions
    Object.keys(formulaFunctions).forEach(funcName => {
      const regex = new RegExp(`${funcName}\\(([^)]*)\\)`, 'gi');
      processedFormula = processedFormula.replace(regex, (match, args) => {
        try {
          const parsedArgs = eval(`[${args}]`);
          const result = (formulaFunctions as any)[funcName](...parsedArgs);
          return typeof result === 'number' ? result.toString() : `"${result}"`;
        } catch {
          return '#ERROR!';
        }
      });
    });
    
    // Evaluate the final expression
    try {
      return eval(processedFormula);
    } catch {
      return '#ERROR!';
    }
  };

  // Handle cell edit
  const handleCellEdit = (row: number, col: number, value: any) => {
    const newData = [...data];
    if (!newData[row]) {
      newData[row] = [];
    }
    newData[row][col] = value;
    setData(newData);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ data: newData, timestamp: new Date() });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    if (onChange) {
      onChange(newData);
    }
  };

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(data);
    }
    showNotification('Spreadsheet saved successfully', 'success');
  };

  // Handle export
  const handleExport = (format: string) => {
    let exportData = data;
    
    switch (format) {
      case 'xlsx':
        exportToExcel(exportData);
        break;
      case 'csv':
        exportToCSV(exportData);
        break;
      case 'json':
        exportToJSON(exportData);
        break;
      case 'pdf':
        exportToPDF(exportData);
        break;
      case 'html':
        exportToHTML(exportData);
        break;
      default:
        break;
    }
    
    if (onExport) {
      onExport(exportData, format);
    }
  };

  // Export functions
  const exportToExcel = (data: any[][]) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'spreadsheet.xlsx');
  };

  const exportToCSV = (data: any[][]) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'spreadsheet.csv');
  };

  const exportToJSON = (data: any[][]) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'spreadsheet.json');
  };

  const exportToPDF = (data: any[][]) => {
    const doc = new jsPDF();
    (doc as any).autoTable({
      head: [data[0]],
      body: data.slice(1),
    });
    doc.save('spreadsheet.pdf');
  };

  const exportToHTML = (data: any[][]) => {
    let html = '<table border="1">';
    data.forEach((row, rowIndex) => {
      html += '<tr>';
      row.forEach((cell, colIndex) => {
        const tag = rowIndex === 0 ? 'th' : 'td';
        html += `<${tag}>${cell || ''}</${tag}>`;
      });
      html += '</tr>';
    });
    html += '</table>';
    
    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, 'spreadsheet.html');
  };

  // Import functions
  const handleImport = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'xlsx':
      case 'xls':
        importFromExcel(file);
        break;
      case 'csv':
        importFromCSV(file);
        break;
      case 'json':
        importFromJSON(file);
        break;
      default:
        showNotification('Unsupported file format', 'error');
    }
  };

  const importFromExcel = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    setData(jsonData as any[][]);
    showNotification('Excel file imported successfully', 'success');
  };

  const importFromCSV = async (file: File) => {
    const text = await file.text();
    Papa.parse(text, {
      complete: (result) => {
        setData(result.data as any[][]);
        showNotification('CSV file imported successfully', 'success');
      },
      error: () => {
        showNotification('Failed to import CSV file', 'error');
      },
    });
  };

  const importFromJSON = async (file: File) => {
    const text = await file.text();
    try {
      const jsonData = JSON.parse(text);
      setData(jsonData);
      showNotification('JSON file imported successfully', 'success');
    } catch {
      showNotification('Failed to import JSON file', 'error');
    }
  };

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex].data);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex].data);
    }
  };

  // Copy/Paste
  const handleCopy = () => {
    if (selectedCells) {
      const copiedData = [];
      for (let r = selectedCells.start.row; r <= selectedCells.end.row; r++) {
        const row = [];
        for (let c = selectedCells.start.column; c <= selectedCells.end.column; c++) {
          row.push(data[r]?.[c] || '');
        }
        copiedData.push(row);
      }
      setClipboard(copiedData);
      showNotification('Copied to clipboard', 'info');
    }
  };

  const handlePaste = () => {
    if (clipboard.length > 0 && activeCell) {
      const newData = [...data];
      clipboard.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const targetRow = activeCell.row + rowIndex;
          const targetCol = activeCell.column + colIndex;
          if (!newData[targetRow]) {
            newData[targetRow] = [];
          }
          newData[targetRow][targetCol] = cell;
        });
      });
      setData(newData);
      showNotification('Pasted from clipboard', 'info');
    }
  };

  const handleCut = () => {
    handleCopy();
    if (selectedCells) {
      const newData = [...data];
      for (let r = selectedCells.start.row; r <= selectedCells.end.row; r++) {
        for (let c = selectedCells.start.column; c <= selectedCells.end.column; c++) {
          if (newData[r]) {
            newData[r][c] = '';
          }
        }
      }
      setData(newData);
    }
  };

  // Helper functions
  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  const getColumnLabel = (index: number): string => {
    let label = '';
    while (index >= 0) {
      label = String.fromCharCode(65 + (index % 26)) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  const getCellKey = (row: number, col: number): string => {
    return `${row}-${col}`;
  };

  // Handsontable configuration
  const hotSettings = {
    data: data,
    colHeaders: true,
    rowHeaders: true,
    width: '100%',
    height: '100%',
    licenseKey: 'non-commercial-and-evaluation',
    stretchH: 'all',
    autoWrapRow: true,
    autoWrapCol: true,
    manualRowResize: true,
    manualColumnResize: true,
    manualRowMove: true,
    manualColumnMove: true,
    contextMenu: true,
    filters: true,
    dropdownMenu: true,
    multiColumnSorting: true,
    comments: true,
    customBorders: true,
    autoColumnSize: false,
    autoRowSize: false,
    formulas: allowFormulas,
    mergeCells: true,
    search: true,
    undo: true,
    redo: true,
    copyPaste: true,
    trimWhitespace: false,
    enterBeginsEditing: true,
    persistentState: true,
    columnSorting: true,
    hiddenColumns: {
      copyPasteEnabled: true,
      indicators: true,
    },
    hiddenRows: {
      copyPasteEnabled: true,
      indicators: true,
    },
    nestedHeaders: [],
    collapsibleColumns: [],
    nestedRows: false,
    bindRowsWithHeaders: false,
    afterChange: (changes: any) => {
      if (changes) {
        changes.forEach(([row, col, oldValue, newValue]: any) => {
          handleCellEdit(row, col, newValue);
        });
      }
    },
    afterSelection: (row: number, column: number, row2: number, column2: number) => {
      setActiveCell({ row, column });
      setSelectedCells({
        start: { row: Math.min(row, row2), column: Math.min(column, column2) },
        end: { row: Math.max(row, row2), column: Math.max(column, column2) },
      });
    },
    cells: (row: number, col: number) => {
      const cellProperties: any = {};
      const key = getCellKey(row, col);
      
      if (cellStyles[key]) {
        cellProperties.className = 'custom-cell';
        cellProperties.renderer = (instance: any, td: HTMLElement, row: number, col: number, prop: any, value: any, cellProperties: any) => {
          Handsontable.renderers.TextRenderer.apply(this, arguments as any);
          Object.assign(td.style, cellStyles[key]);
        };
      }
      
      if (cellValidations[key]) {
        cellProperties.validator = (value: any, callback: (valid: boolean) => void) => {
          // Implement validation logic
          callback(true);
        };
      }
      
      return cellProperties;
    },
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar variant="dense">
          <ButtonGroup size="small" sx={{ mr: 1 }}>
            <Tooltip title="Save">
              <IconButton onClick={handleSave}>
                <Save />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open">
              <IconButton onClick={() => setImportDialogOpen(true)}>
                <FileUpload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export">
              <IconButton onClick={() => setExportDialogOpen(true)}>
                <FileDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton onClick={() => window.print()}>
                <Print />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ButtonGroup size="small" sx={{ mr: 1 }}>
            <Tooltip title="Undo">
              <IconButton onClick={handleUndo} disabled={historyIndex === 0}>
                <Undo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton onClick={handleRedo} disabled={historyIndex === history.length - 1}>
                <Redo />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ButtonGroup size="small" sx={{ mr: 1 }}>
            <Tooltip title="Cut">
              <IconButton onClick={handleCut}>
                <ContentCut />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy">
              <IconButton onClick={handleCopy}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
            <Tooltip title="Paste">
              <IconButton onClick={handlePaste}>
                <ContentPaste />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ButtonGroup size="small" sx={{ mr: 1 }}>
            <Tooltip title="Bold">
              <IconButton>
                <FormatBold />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton>
                <FormatItalic />
              </IconButton>
            </Tooltip>
            <Tooltip title="Underline">
              <IconButton>
                <FormatUnderlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Strikethrough">
              <IconButton>
                <FormatStrikethrough />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ButtonGroup size="small" sx={{ mr: 1 }}>
            <Tooltip title="Align Left">
              <IconButton>
                <FormatAlignLeft />
              </IconButton>
            </Tooltip>
            <Tooltip title="Align Center">
              <IconButton>
                <FormatAlignCenter />
              </IconButton>
            </Tooltip>
            <Tooltip title="Align Right">
              <IconButton>
                <FormatAlignRight />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <ButtonGroup size="small" sx={{ mr: 1 }}>
            <Tooltip title="Insert Chart">
              <IconButton onClick={() => setChartDialogOpen(true)}>
                <InsertChart />
              </IconButton>
            </Tooltip>
            <Tooltip title="Pivot Table">
              <IconButton onClick={() => setPivotDialogOpen(true)}>
                <PivotTableChart />
              </IconButton>
            </Tooltip>
            <Tooltip title="Functions">
              <IconButton>
                <Functions />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Box sx={{ flexGrow: 1 }} />

          <ButtonGroup size="small">
            <Tooltip title="Zoom Out">
              <IconButton onClick={() => setZoom(Math.max(zoom - 10, 50))}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ mx: 1, alignSelf: 'center' }}>
              {zoom}%
            </Typography>
            <Tooltip title="Zoom In">
              <IconButton onClick={() => setZoom(Math.min(zoom + 10, 200))}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Toolbar>
      </AppBar>

      {/* Formula Bar */}
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1, minWidth: 60 }}>
          {activeCell ? `${getColumnLabel(activeCell.column)}${activeCell.row + 1}` : ''}
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={editingCell?.value || (activeCell ? data[activeCell.row]?.[activeCell.column] || '' : '')}
          onChange={(e) => {
            if (editingCell) {
              setEditingCell({ ...editingCell, value: e.target.value });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && editingCell) {
              handleCellEdit(editingCell.row, editingCell.column, editingCell.value);
              setEditingCell(null);
            }
          }}
          placeholder="Enter value or formula (start with =)"
        />
      </Box>

      {/* Spreadsheet */}
      <Box ref={containerRef} sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <HotTable
          ref={hotTableRef}
          settings={hotSettings}
        />
      </Box>

      {/* Status Bar */}
      <Box sx={{ p: 0.5, px: 2, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <Tabs value={activeSheet} onChange={(e, value) => setActiveSheet(value)} variant="scrollable" scrollButtons="auto">
          {sheets.map((sheet, index) => (
            <Tab key={index} label={sheet.name} sx={{ minHeight: 32 }} />
          ))}
          <Tab icon={<Add />} sx={{ minHeight: 32, minWidth: 32 }} onClick={() => {
            setSheets([...sheets, { name: `Sheet${sheets.length + 1}`, data: [[]] }]);
          }} />
        </Tabs>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Typography variant="caption" sx={{ mr: 2 }}>
          {selectedCells ? `Selected: ${(selectedCells.end.row - selectedCells.start.row + 1) * (selectedCells.end.column - selectedCells.start.column + 1)} cells` : 'Ready'}
        </Typography>
        
        {selectedCells && (
          <>
            <Typography variant="caption" sx={{ mr: 2 }}>
              Sum: {(() => {
                let sum = 0;
                for (let r = selectedCells.start.row; r <= selectedCells.end.row; r++) {
                  for (let c = selectedCells.start.column; c <= selectedCells.end.column; c++) {
                    const value = calculateCellValue(r, c);
                    if (typeof value === 'number') {
                      sum += value;
                    }
                  }
                }
                return sum;
              })()}
            </Typography>
            <Typography variant="caption" sx={{ mr: 2 }}>
              Avg: {(() => {
                let sum = 0;
                let count = 0;
                for (let r = selectedCells.start.row; r <= selectedCells.end.row; r++) {
                  for (let c = selectedCells.start.column; c <= selectedCells.end.column; c++) {
                    const value = calculateCellValue(r, c);
                    if (typeof value === 'number') {
                      sum += value;
                      count++;
                    }
                  }
                }
                return count > 0 ? (sum / count).toFixed(2) : 0;
              })()}
            </Typography>
            <Typography variant="caption">
              Count: {(() => {
                let count = 0;
                for (let r = selectedCells.start.row; r <= selectedCells.end.row; r++) {
                  for (let c = selectedCells.start.column; c <= selectedCells.end.column; c++) {
                    const value = calculateCellValue(r, c);
                    if (value !== null && value !== undefined && value !== '') {
                      count++;
                    }
                  }
                }
                return count;
              })()}
            </Typography>
          </>
        )}
      </Box>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Spreadsheet</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography>Choose export format:</Typography>
            <Grid container spacing={1}>
              {['xlsx', 'csv', 'json', 'pdf', 'html'].map(format => (
                <Grid item xs={6} key={format}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      handleExport(format);
                      setExportDialogOpen(false);
                    }}
                  >
                    {format.toUpperCase()}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};