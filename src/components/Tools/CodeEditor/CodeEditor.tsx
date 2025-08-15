import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  TextField,
  Button,
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Drawer,
  Switch,
  FormControlLabel,
  Slider,
  Autocomplete,
  Badge,
  Avatar,
  AvatarGroup,
  ToggleButton,
  ToggleButtonGroup,
  Breadcrumbs,
  Link,
  LinearProgress,
  CircularProgress,
  Collapse,
  // TreeView, // Moved to @mui/x-tree-view
  // TreeItem, // Moved to @mui/x-tree-view
  Popover,
  Menu,
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepButton,
  Rating,
  Pagination,
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
  Fab,
  ButtonGroup,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Code as CodeIcon,
  Terminal,
  BugReport,
  PlayArrow,
  Stop,
  Pause,
  SkipNext,
  SkipPrevious,
  Refresh,
  Save,
  SaveAs,
  FolderOpen,
  Search,
  FindReplace,
  Settings,
  Extension,
  FormatPaint,
  CompareArrows,
  History,
  Undo,
  Redo,
  ContentCopy,
  ContentPaste,
  ContentCut,
  SelectAll,
  Comment,
  ChatBubble,
  Person,
  Group,
  Share,
  CloudUpload,
  CloudDownload,
  GitHub,
  Storage,
  DataObject,
  Functions,
  Api,
  IntegrationInstructions,
  Code as CodeBlock,
  DeveloperMode,
  DeveloperBoard,
  Memory,
  Build,
  Construction,
  Engineering,
  Science,
  Biotech,
  Psychology,
  AutoFixHigh,
  AutoAwesome,
  Lightbulb,
  TipsAndUpdates,
  Help,
  Info,
  Warning,
  Error,
  CheckCircle,
  Cancel,
  ExpandMore,
  ExpandLess,
  ChevronRight,
  ChevronLeft,
  KeyboardArrowUp,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
  MoreVert,
  MoreHoriz,
  Apps,
  ViewModule,
  ViewList,
  ViewColumn,
  ViewStream,
  ViewAgenda,
  ViewComfy,
  ViewCompact,
  ViewKanban,
  Dashboard,
  Widgets,
  Layers,
  Timeline,
  AccountTree,
  Schema,
  TableChart,
  PivotTableChart,
  StackedLineChart,
  MultilineChart,
  ShowChart,
  BarChart,
  PieChart,
  BubbleChart,
  ScatterPlot,
  Insights,
  Analytics,
  QueryStats,
  DataUsage,
  Speed,
  Timer,
  Schedule,
  AccessTime,
  Alarm,
  AddAlarm,
  AlarmOn,
  AlarmOff,
  WatchLater,
  HourglassEmpty,
  HourglassFull,
  Pending,
  CheckBox,
  CheckBoxOutlineBlank,
  IndeterminateCheckBox,
  RadioButtonChecked,
  RadioButtonUnchecked,
  ToggleOn,
  ToggleOff,
  Star,
  StarBorder,
  StarHalf,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Flag,
  FlagOutlined,
  PushPin,
  LocationOn,
  LocationOff,
  MyLocation,
  LocationSearching,
  GpsFixed,
  GpsNotFixed,
  GpsOff,
  Home,
  HomeOutlined,
  Work,
  WorkOutline,
  School,
  SchoolOutlined,
  Business,
  BusinessOutlined,
  Store,
  StoreOutlined,
  LocalHospital,
  LocalHospitalOutlined,
  Restaurant,
  RestaurantOutlined,
  Coffee,
  CoffeeOutlined,
  LocalCafe,
  LocalCafeOutlined,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothDisabled,
  SignalCellular4Bar,
  SignalCellularNull,
  Battery90,
  BatteryAlert,
  BatteryCharging90,
  BatteryFull,
  BatterySaver,
  PowerSettingsNew,
  Power,
  PowerOff,
  RestartAlt,
  Lock,
  LockOpen,
  Security,
  Shield,
  VerifiedUser,
  Fingerprint,
  VpnKey,
  Password,
  Pin,
  Pattern,
  Face,
  FaceRetouchingNatural,
  Visibility,
  VisibilityOff,
  RemoveRedEye,
  Panorama,
  PanoramaFishEye,
  Lens,
  Camera,
  CameraAlt,
  PhotoCamera,
  CameraRoll,
  Image,
  PhotoLibrary,
  Collections,
  // Burst, // Not available in MUI v7, using BurstMode as alternative
  BurstMode as Burst,
  Photo,
  AddAPhoto,
  AddPhotoAlternate,
  InsertPhoto,
  Wallpaper,
  Portrait,
  Landscape,
  Nature,
  NaturePeople,
  Terrain,
  Satellite,
  Map,
  MyLocation as MapLocation,
  Explore,
  NearMe,
  Navigation,
  LocalShipping,
  Flight,
  DirectionsCar,
  DirectionsBus,
  DirectionsRailway,
  DirectionsBoat,
  DirectionsBike,
  DirectionsWalk,
  DirectionsRun,
  Traffic,
  Commute,
  TwoWheeler,
  ElectricCar,
  ElectricBike,
  ElectricScooter,
  CarRental,
  CarRepair,
  LocalGasStation,
  LocalParking,
  Hotel,
  Apartment,
  House,
  Villa,
  Cabin,
  Cottage,
  Bungalow,
  Warehouse,
  Factory,
  // Corporate, // Not available in MUI v7, using CorporateFare as alternative
  CorporateFare as Corporate,
  Foundation,
  Domain,
  Dns,
  Cloud,
  CloudQueue,
  CloudCircle,
  CloudDone,
  CloudSync,
  CloudOff,
  Backup,
  SettingsBackupRestore,
  Restore,
  RestorePage,
  RestoreFromTrash,
  DeleteForever,
  DeleteOutline,
  Delete,
  Clear,
  Remove,
  RemoveCircle,
  RemoveCircleOutline,
  Add,
  AddCircle,
  AddCircleOutline,
  AddBox,
  Create,
  Edit,
  EditOutlined,
  ModeEdit,
  ModeEditOutline,
  BorderColor,
  FormatColorText,
  FormatColorFill,
  FormatColorReset,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatClear,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  FormatIndentDecrease,
  FormatIndentIncrease,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatLineSpacing,
  // FormatParagraph, // Not available in MUI v7, using Subject as alternative
  Subject as FormatParagraph,
  FormatTextdirectionLToR,
  FormatTextdirectionRToL,
  FormatSize,
  TextFormat,
  TextFields,
  Title,
  Subject,
  ShortText,
  Notes,
  Description,
  Article,
  Book,
  MenuBook,
  AutoStories,
  LibraryBooks,
  LibraryAdd,
  LibraryAddCheck,
  LibraryMusic,
  QueueMusic,
  PlaylistAdd,
  PlaylistAddCheck,
  PlaylistPlay,
  PlaylistRemove,
  MusicNote,
  MusicOff,
  Album,
  Audiotrack,
  Headset,
  HeadsetMic,
  HeadsetOff,
  Mic,
  MicNone,
  MicOff,
  VolumeUp,
  VolumeDown,
  VolumeMute,
  VolumeOff,
  Speaker,
  SpeakerGroup,
  SpeakerNotes,
  SpeakerNotesOff,
  SpeakerPhone,
  Hearing,
  HearingDisabled,
  Equalizer,
  GraphicEq,
  MicExternalOn,
  MicExternalOff,
  RecordVoiceOver,
  Voicemail,
  VoiceChat,
  VideoCall,
  VideoChat,
  VideoCameraBack,
  VideoCameraFront,
  Videocam,
  VideocamOff,
  VideoFile,
  VideoLabel,
  VideoLibrary,
  VideoSettings,
  VideoStable,
  OndemandVideo,
  LiveTv,
  Movie,
  MovieCreation,
  MovieFilter,
  LocalMovies,
  Theaters,
  Subscriptions,
  PlayCircle,
  PlayCircleFilled,
  PlayCircleOutline,
  PauseCircle,
  PauseCircleFilled,
  PauseCircleOutline,
  StopCircle,
  ReplayCircleFilled,
  FastForward,
  FastRewind,
  Forward10,
  Forward30,
  Forward5,
  Replay,
  Replay10,
  Replay30,
  Replay5,
  Shuffle,
  ShuffleOn,
  Repeat,
  RepeatOn,
  RepeatOne,
  RepeatOneOn,
  Loop,
  QueuePlayNext,
  SlowMotionVideo,
  Speed as SpeedIcon,
  HighQuality,
  // LowQuality, // Not available in MUI v7, using HighQuality as alternative
  HighQuality as LowQuality,
  ClosedCaption,
  ClosedCaptionDisabled,
  ClosedCaptionOff,
  Subtitles,
  SubtitlesOff,
  Lyrics,
  MusicVideo,
  FeaturedPlayList,
  FeaturedVideo,
  NewReleases,
  NotInterested,
  NotStarted,
  LibraryAddOutlined,
  QueueMusicOutlined,
  PlaylistAddOutlined,
  PlaylistAddCheckOutlined,
  PlaylistPlayOutlined,
  PlaylistRemoveOutlined,
  Check,
  Circle,
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { io, Socket } from 'socket.io-client';
import { debounce, throttle } from 'lodash';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserTypescript from 'prettier/parser-typescript';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserMarkdown from 'prettier/parser-markdown';
import parserYaml from 'prettier/parser-yaml';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  theme?: 'vs-dark' | 'vs-light' | 'hc-black' | 'hc-light';
  fontSize?: number;
  tabSize?: number;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  minimap?: boolean;
  scrollBeyondLastLine?: boolean;
  readOnly?: boolean;
  autoClosingBrackets?: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
  autoClosingQuotes?: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
  autoIndent?: 'none' | 'keep' | 'brackets' | 'advanced' | 'full';
  formatOnPaste?: boolean;
  formatOnType?: boolean;
  formatOnSave?: boolean;
  suggestOnTriggerCharacters?: boolean;
  acceptSuggestionOnCommitCharacter?: boolean;
  acceptSuggestionOnEnter?: 'on' | 'smart' | 'off';
  snippetSuggestions?: 'top' | 'bottom' | 'inline' | 'none';
  showFoldingControls?: 'always' | 'mouseover' | 'never';
  folding?: boolean;
  foldingStrategy?: 'auto' | 'indentation';
  renderWhitespace?: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
  renderControlCharacters?: boolean;
  renderLineHighlight?: 'none' | 'gutter' | 'line' | 'all';
  cursorStyle?: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  cursorBlinking?: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  smoothScrolling?: boolean;
  mouseWheelZoom?: boolean;
  multiCursorModifier?: 'ctrlCmd' | 'alt';
  accessibilitySupport?: 'auto' | 'off' | 'on';
  onChange?: (value: string | undefined) => void;
  onSave?: (value: string) => void;
  onRun?: (code: string, language: string) => void;
  onDebug?: (code: string, language: string) => void;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
  isModified?: boolean;
  isActive?: boolean;
  icon?: React.ReactNode;
  size?: number;
  lastModified?: Date;
  permissions?: string;
}

interface Breakpoint {
  id: string;
  line: number;
  condition?: string;
  hitCount?: number;
  enabled: boolean;
  verified: boolean;
}

interface DebugVariable {
  name: string;
  value: any;
  type: string;
  scope: 'local' | 'global' | 'closure';
  expandable: boolean;
  children?: DebugVariable[];
}

interface DebugFrame {
  id: string;
  name: string;
  source: string;
  line: number;
  column: number;
  variables: DebugVariable[];
}

interface ConsoleMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace';
  message: string;
  timestamp: Date;
  source?: string;
  line?: number;
  column?: number;
  stack?: string;
}

interface GitChange {
  file: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed' | 'copied' | 'untracked';
  additions: number;
  deletions: number;
  hunks: GitHunk[];
}

interface GitHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}

interface Extension {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  publisher: string;
  icon?: string;
  categories: string[];
  tags: string[];
  installed: boolean;
  enabled: boolean;
  rating: number;
  downloads: number;
  size: number;
  dependencies: string[];
  contributes: {
    commands?: ExtensionCommand[];
    languages?: ExtensionLanguage[];
    themes?: ExtensionTheme[];
    snippets?: ExtensionSnippet[];
    keybindings?: ExtensionKeybinding[];
  };
}

interface ExtensionCommand {
  command: string;
  title: string;
  category?: string;
  icon?: string;
  enablement?: string;
}

interface ExtensionLanguage {
  id: string;
  extensions: string[];
  aliases: string[];
  configuration?: string;
}

interface ExtensionTheme {
  label: string;
  uiTheme: string;
  path: string;
}

interface ExtensionSnippet {
  language: string;
  path: string;
}

interface ExtensionKeybinding {
  command: string;
  key: string;
  mac?: string;
  linux?: string;
  when?: string;
}

interface LiveShareSession {
  id: string;
  host: string;
  participants: LiveShareParticipant[];
  sharedFiles: string[];
  readOnly: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

interface LiveShareParticipant {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { line: number; column: number };
  selection?: { start: { line: number; column: number }; end: { line: number; column: number } };
  following?: string;
  role: 'host' | 'guest';
}

interface AIAssistant {
  enabled: boolean;
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'codex' | 'copilot';
  suggestions: AISuggestion[];
  completions: AICompletion[];
  explanations: AIExplanation[];
  refactorings: AIRefactoring[];
}

interface AISuggestion {
  id: string;
  type: 'completion' | 'fix' | 'refactor' | 'optimize' | 'document';
  content: string;
  confidence: number;
  accepted?: boolean;
}

interface AICompletion {
  id: string;
  trigger: string;
  completions: string[];
  selected?: number;
}

interface AIExplanation {
  id: string;
  code: string;
  explanation: string;
  complexity: 'simple' | 'moderate' | 'complex';
  concepts: string[];
}

interface AIRefactoring {
  id: string;
  type: 'extract-method' | 'rename' | 'inline' | 'move' | 'simplify';
  original: string;
  refactored: string;
  description: string;
  benefits: string[];
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'javascript',
  theme = 'vs-dark',
  fontSize = 14,
  tabSize = 2,
  wordWrap = 'on',
  lineNumbers = 'on',
  minimap = true,
  scrollBeyondLastLine = false,
  readOnly = false,
  autoClosingBrackets = 'languageDefined',
  autoClosingQuotes = 'languageDefined',
  autoIndent = 'full',
  formatOnPaste = true,
  formatOnType = true,
  formatOnSave = true,
  suggestOnTriggerCharacters = true,
  acceptSuggestionOnCommitCharacter = true,
  acceptSuggestionOnEnter = 'on',
  snippetSuggestions = 'inline',
  showFoldingControls = 'mouseover',
  folding = true,
  foldingStrategy = 'auto',
  renderWhitespace = 'selection',
  renderControlCharacters = false,
  renderLineHighlight = 'all',
  cursorStyle = 'line',
  cursorBlinking = 'blink',
  smoothScrolling = true,
  mouseWheelZoom = true,
  multiCursorModifier = 'alt',
  accessibilitySupport = 'auto',
  onChange,
  onSave,
  onRun,
  onDebug,
}) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [debugFrames, setDebugFrames] = useState<DebugFrame[]>([]);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [gitChanges, setGitChanges] = useState<GitChange[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [liveShareSession, setLiveShareSession] = useState<LiveShareSession | null>(null);
  const [aiAssistant, setAiAssistant] = useState<AIAssistant>({
    enabled: false,
    model: 'gpt-4',
    suggestions: [],
    completions: [],
    explanations: [],
    refactorings: [],
  });

  const [isDebugging, setIsDebugging] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSearchResult, setSelectedSearchResult] = useState<number>(0);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'explorer' | 'search' | 'git' | 'debug' | 'extensions'>('explorer');
  const [activeBottomPanel, setActiveBottomPanel] = useState<'terminal' | 'output' | 'console' | 'problems'>('terminal');
  const [activeRightPanel, setActiveRightPanel] = useState<'outline' | 'timeline' | 'live-share' | 'ai-assistant'>('outline');

  const [editorSettings, setEditorSettings] = useState({
    fontSize,
    tabSize,
    wordWrap,
    lineNumbers,
    minimap,
    theme: selectedTheme,
    formatOnSave,
    autoSave: false,
    autoSaveDelay: 1000,
    bracketPairColorization: true,
    semanticHighlighting: true,
    inlayHints: true,
    stickyScroll: true,
    columnSelection: false,
    multiCursor: true,
    linkedEditing: true,
    renameOnType: false,
    parameterHints: true,
    quickSuggestions: true,
    suggestSelection: 'first',
    tabCompletion: 'on',
    wordBasedSuggestions: true,
    fontLigatures: true,
    fontFamily: 'Fira Code, Consolas, Monaco, monospace',
    letterSpacing: 0,
    lineHeight: 1.5,
    rulers: [80, 120],
    renderIndentGuides: true,
    highlightActiveIndentGuide: true,
    showUnused: true,
    showDeprecated: true,
  });

  const [terminalSettings, setTerminalSettings] = useState({
    fontSize: 14,
    fontFamily: 'Consolas, Monaco, monospace',
    theme: 'dark',
    cursorStyle: 'block',
    cursorBlink: true,
    scrollback: 1000,
    bellStyle: 'sound',
    macOptionIsMeta: true,
    rightClickSelectsWord: true,
    rendererType: 'canvas',
    allowTransparency: false,
    tabStopWidth: 8,
    screenReaderMode: false,
  });

  const [shortcuts, setShortcuts] = useState({
    save: 'Ctrl+S',
    saveAll: 'Ctrl+Shift+S',
    open: 'Ctrl+O',
    close: 'Ctrl+W',
    closeAll: 'Ctrl+Shift+W',
    find: 'Ctrl+F',
    replace: 'Ctrl+H',
    findInFiles: 'Ctrl+Shift+F',
    goToLine: 'Ctrl+G',
    goToSymbol: 'Ctrl+Shift+O',
    goToFile: 'Ctrl+P',
    commandPalette: 'Ctrl+Shift+P',
    toggleTerminal: 'Ctrl+`',
    toggleSidebar: 'Ctrl+B',
    togglePanel: 'Ctrl+J',
    splitEditor: 'Ctrl+\\',
    focusEditor: 'Ctrl+1',
    focusTerminal: 'Ctrl+2',
    nextEditor: 'Ctrl+Tab',
    previousEditor: 'Ctrl+Shift+Tab',
    format: 'Shift+Alt+F',
    comment: 'Ctrl+/',
    blockComment: 'Shift+Alt+A',
    duplicate: 'Shift+Alt+Down',
    moveLineUp: 'Alt+Up',
    moveLineDown: 'Alt+Down',
    deleteWord: 'Ctrl+Delete',
    selectWord: 'Ctrl+D',
    selectLine: 'Ctrl+L',
    selectAll: 'Ctrl+A',
    undo: 'Ctrl+Z',
    redo: 'Ctrl+Y',
    cut: 'Ctrl+X',
    copy: 'Ctrl+C',
    paste: 'Ctrl+V',
    run: 'F5',
    debug: 'Shift+F5',
    stepOver: 'F10',
    stepInto: 'F11',
    stepOut: 'Shift+F11',
    continue: 'F8',
    toggleBreakpoint: 'F9',
    showHover: 'Ctrl+K Ctrl+I',
    triggerSuggest: 'Ctrl+Space',
    triggerParameterHints: 'Ctrl+Shift+Space',
    formatSelection: 'Ctrl+K Ctrl+F',
    showDefinition: 'Alt+F12',
    goToDefinition: 'F12',
    goToReferences: 'Shift+F12',
    rename: 'F2',
    quickFix: 'Ctrl+.',
    refactor: 'Ctrl+Shift+R',
    organizeImports: 'Shift+Alt+O',
    addCursor: 'Alt+Click',
    addCursorAbove: 'Ctrl+Alt+Up',
    addCursorBelow: 'Ctrl+Alt+Down',
    zoomIn: 'Ctrl+=',
    zoomOut: 'Ctrl+-',
    resetZoom: 'Ctrl+0',
  });

  const editorRef = useRef<any>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize Monaco Editor
  useEffect(() => {
    if (editorRef.current) {
      // Configure Monaco Editor
      monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: (model, position) => {
          const suggestions = [
            {
              label: 'console.log',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'console.log(${1:message});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Log a message to the console',
            },
            {
              label: 'function',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'function ${1:name}(${2:params}) {\n\t${3:// body}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Create a new function',
            },
            {
              label: 'if',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'if (${1:condition}) {\n\t${2:// body}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'If statement',
            },
            {
              label: 'for',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// body}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'For loop',
            },
            {
              label: 'forEach',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '${1:array}.forEach((${2:item}) => {\n\t${3:// body}\n});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Array forEach method',
            },
            {
              label: 'map',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '${1:array}.map((${2:item}) => {\n\t${3:// transform}\n\treturn ${4:transformed};\n});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Array map method',
            },
            {
              label: 'filter',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '${1:array}.filter((${2:item}) => {\n\t${3:// condition}\n\treturn ${4:condition};\n});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Array filter method',
            },
            {
              label: 'reduce',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: '${1:array}.reduce((${2:acc}, ${3:item}) => {\n\t${4:// accumulate}\n\treturn ${5:acc};\n}, ${6:initial});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Array reduce method',
            },
            {
              label: 'async',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'async function ${1:name}(${2:params}) {\n\t${3:// body}\n\treturn ${4:result};\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Async function',
            },
            {
              label: 'await',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'const ${1:result} = await ${2:promise};',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Await promise',
            },
            {
              label: 'try-catch',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'try {\n\t${1:// try block}\n} catch (${2:error}) {\n\t${3:// catch block}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Try-catch block',
            },
            {
              label: 'class',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'class ${1:ClassName} {\n\tconstructor(${2:params}) {\n\t\t${3:// constructor}\n\t}\n\n\t${4:method}() {\n\t\t${5:// method body}\n\t}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'ES6 Class',
            },
            {
              label: 'import',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'import ${1:module} from \'${2:path}\';',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'ES6 Import',
            },
            {
              label: 'export',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'export ${1:default} ${2:module};',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'ES6 Export',
            },
            {
              label: 'useState',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'React useState Hook',
            },
            {
              label: 'useEffect',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'useEffect(() => {\n\t${1:// effect}\n\treturn () => {\n\t\t${2:// cleanup}\n\t};\n}, [${3:dependencies}]);',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'React useEffect Hook',
            },
          ];

          return {
            suggestions: suggestions as any,
          };
        },
      });

      // Register custom theme
      monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955' },
          { token: 'keyword', foreground: '569CD6' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
          { token: 'regexp', foreground: 'D16969' },
          { token: 'type', foreground: '4EC9B0' },
          { token: 'class', foreground: '4EC9B0' },
          { token: 'function', foreground: 'DCDCAA' },
          { token: 'variable', foreground: '9CDCFE' },
          { token: 'constant', foreground: '4FC1FF' },
          { token: 'parameter', foreground: '9CDCFE' },
          { token: 'property', foreground: '9CDCFE' },
          { token: 'method', foreground: 'DCDCAA' },
          { token: 'operator', foreground: 'D4D4D4' },
          { token: 'namespace', foreground: '4EC9B0' },
          { token: 'tag', foreground: '569CD6' },
          { token: 'attribute.name', foreground: '9CDCFE' },
          { token: 'attribute.value', foreground: 'CE9178' },
        ],
        colors: {
          'editor.background': '#1E1E1E',
          'editor.foreground': '#D4D4D4',
          'editorLineNumber.foreground': '#858585',
          'editorLineNumber.activeForeground': '#C6C6C6',
          'editorCursor.foreground': '#AEAFAD',
          'editor.selectionBackground': '#264F78',
          'editor.inactiveSelectionBackground': '#3A3D41',
          'editorWhitespace.foreground': '#3B3A32',
          'editorIndentGuide.background': '#404040',
          'editorIndentGuide.activeBackground': '#707070',
          'editor.lineHighlightBackground': '#2A2A2A',
          'editorBracketMatch.background': '#0064001a',
          'editorBracketMatch.border': '#888888',
        },
      });

      // Set up language configuration
      monaco.languages.setLanguageConfiguration('javascript', {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/'],
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '`', close: '`' },
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '`', close: '`' },
        ],
        folding: {
          markers: {
            start: new RegExp('^\\s*//\\s*#?region\\b'),
            end: new RegExp('^\\s*//\\s*#?endregion\\b'),
          },
        },
      });

      // Add custom commands
      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        handleSave();
      });

      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.F5, () => {
        handleRun();
      });

      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.F5, () => {
        handleDebug();
      });

      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
        setSidebarOpen(!sidebarOpen);
      });

      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
        setBottomPanelOpen(!bottomPanelOpen);
      });

      // Add markers for errors/warnings
      const model = editorRef.current.getModel();
      if (model) {
        const markers = [
          {
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 5,
            message: 'Example error message',
          },
          {
            severity: monaco.MarkerSeverity.Warning,
            startLineNumber: 3,
            startColumn: 1,
            endLineNumber: 3,
            endColumn: 10,
            message: 'Example warning message',
          },
        ];
        // monaco.editor.setModelMarkers(model, 'owner', markers);
      }
    }
  }, []);

  // Initialize Terminal
  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      const term = new XTerm({
        fontSize: terminalSettings.fontSize,
        fontFamily: terminalSettings.fontFamily,
        theme: {
          background: terminalSettings.theme === 'dark' ? '#1e1e1e' : '#ffffff',
          foreground: terminalSettings.theme === 'dark' ? '#d4d4d4' : '#333333',
          cursor: '#aeafad',
          // selection: '#264f78', // This property is not available in ITheme
        },
        cursorStyle: terminalSettings.cursorStyle as any,
        cursorBlink: terminalSettings.cursorBlink,
        scrollback: terminalSettings.scrollback,
        rightClickSelectsWord: terminalSettings.rightClickSelectsWord,
        // rendererType: terminalSettings.rendererType as any, // Not available in newer xterm versions
        allowTransparency: terminalSettings.allowTransparency,
        tabStopWidth: terminalSettings.tabStopWidth,
        screenReaderMode: terminalSettings.screenReaderMode,
      });

      const fitAddon = new FitAddon();
      const searchAddon = new SearchAddon();
      const webLinksAddon = new WebLinksAddon();

      term.loadAddon(fitAddon);
      term.loadAddon(searchAddon);
      term.loadAddon(webLinksAddon);

      term.open(terminalRef.current);
      fitAddon.fit();

      term.writeln('Welcome to the integrated terminal!');
      term.writeln('Type "help" for available commands.');
      term.write('\r\n$ ');

      term.onData((data) => {
        // Handle terminal input
        term.write(data);
      });

      xtermRef.current = term;

      // Handle window resize
      const handleResize = () => {
        fitAddon.fit();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        term.dispose();
      };
    }
  }, [terminalSettings]);

  // Initialize WebSocket for live collaboration
  useEffect(() => {
    if (liveShareSession) {
      socketRef.current = io('ws://localhost:3001', {
        query: {
          sessionId: liveShareSession.id,
          userId: liveShareSession.host,
        },
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to live share session');
      });

      socketRef.current.on('code-change', (data: { code: string; userId: string }) => {
        if (data.userId !== liveShareSession.host) {
          setCode(data.code);
        }
      });

      socketRef.current.on('cursor-change', (data: { userId: string; cursor: any }) => {
        // Update participant cursor position
      });

      socketRef.current.on('selection-change', (data: { userId: string; selection: any }) => {
        // Update participant selection
      });

      socketRef.current.on('participant-joined', (participant: LiveShareParticipant) => {
        // Handle new participant
      });

      socketRef.current.on('participant-left', (participantId: string) => {
        // Handle participant leaving
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [liveShareSession]);

  // Handle code changes
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);

    if (onChange) {
      onChange(newCode);
    }

    // Broadcast changes in live share session
    if (liveShareSession && socketRef.current) {
      socketRef.current.emit('code-change', {
        code: newCode,
        userId: liveShareSession.host,
      });
    }

    // Update AI assistant
    if (aiAssistant.enabled) {
      debouncedAIAnalysis(newCode);
    }
  };

  // AI Analysis
  const debouncedAIAnalysis = debounce(async (code: string) => {
    try {
      const response = await axios.post('/api/ai/analyze', {
        code,
        language: selectedLanguage,
        model: aiAssistant.model,
      });

      setAiAssistant({
        ...aiAssistant,
        suggestions: response.data.suggestions,
        completions: response.data.completions,
        explanations: response.data.explanations,
        refactorings: response.data.refactorings,
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
  }, 1000);

  // Format code
  const formatCode = async () => {
    try {
      let formatted = code;

      switch (selectedLanguage) {
        case 'javascript':
        case 'typescript':
          formatted = await prettier.format(code, {
            parser: selectedLanguage === 'typescript' ? 'typescript' : 'babel',
            plugins: [selectedLanguage === 'typescript' ? parserTypescript : parserBabel],
            semi: true,
            singleQuote: true,
            tabWidth: editorSettings.tabSize,
            trailingComma: 'es5',
            bracketSpacing: true,
            arrowParens: 'avoid',
          });
          break;
        case 'html':
          formatted = await prettier.format(code, {
            parser: 'html',
            plugins: [parserHtml],
            tabWidth: editorSettings.tabSize,
          });
          break;
        case 'css':
        case 'scss':
        case 'less':
          formatted = await prettier.format(code, {
            parser: 'css',
            plugins: [parserCss],
            tabWidth: editorSettings.tabSize,
          });
          break;
        case 'markdown':
          formatted = await prettier.format(code, {
            parser: 'markdown',
            plugins: [parserMarkdown],
            tabWidth: editorSettings.tabSize,
          });
          break;
        case 'yaml':
          formatted = await prettier.format(code, {
            parser: 'yaml',
            plugins: [parserYaml],
            tabWidth: editorSettings.tabSize,
          });
          break;
        default:
          break;
      }

      setCode(formatted);
      showNotification('Code formatted successfully', 'success');
    } catch (error) {
      showNotification('Failed to format code', 'error');
      console.error('Format error:', error);
    }
  };

  // Save file
  const handleSave = () => {
    if (activeFile) {
      activeFile.content = code;
      activeFile.isModified = false;
      setFiles([...files]);
    }

    if (editorSettings.formatOnSave) {
      formatCode();
    }

    if (onSave) {
      onSave(code);
    }

    showNotification('File saved successfully', 'success');
  };

  // Run code
  const handleRun = async () => {
    setIsRunning(true);
    setActiveBottomPanel('output');
    setBottomPanelOpen(true);

    try {
      if (onRun) {
        onRun(code, selectedLanguage);
      } else {
        // Default run implementation
        const response = await axios.post('/api/run', {
          code,
          language: selectedLanguage,
        });

        const output = response.data.output;
        const error = response.data.error;

        if (error) {
          addConsoleMessage('error', error);
        } else {
          addConsoleMessage('log', output);
        }
      }
    } catch (error) {
      addConsoleMessage('error', `Execution failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Debug code
  const handleDebug = async () => {
    setIsDebugging(true);
    setActiveBottomPanel('console');
    setBottomPanelOpen(true);
    setActivePanel('debug');
    setSidebarOpen(true);

    try {
      if (onDebug) {
        onDebug(code, selectedLanguage);
      } else {
        // Default debug implementation
        // This would connect to a debug adapter protocol server
        showNotification('Debug session started', 'info');
      }
    } catch (error) {
      showNotification('Failed to start debug session', 'error');
      setIsDebugging(false);
    }
  };

  // Add console message
  const addConsoleMessage = (type: ConsoleMessage['type'], message: string) => {
    const newMessage: ConsoleMessage = {
      id: uuidv4(),
      type,
      message,
      timestamp: new Date(),
    };
    setConsoleMessages([...consoleMessages, newMessage]);
  };

  // Toggle breakpoint
  const toggleBreakpoint = (line: number) => {
    const existingBreakpoint = breakpoints.find(bp => bp.line === line);

    if (existingBreakpoint) {
      setBreakpoints(breakpoints.filter(bp => bp.id !== existingBreakpoint.id));
    } else {
      const newBreakpoint: Breakpoint = {
        id: uuidv4(),
        line,
        enabled: true,
        verified: false,
      };
      setBreakpoints([...breakpoints, newBreakpoint]);
    }
  };

  // Notification system
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Language options
  const languages = [
    'javascript',
    'typescript',
    'python',
    'java',
    'csharp',
    'cpp',
    'c',
    'go',
    'rust',
    'ruby',
    'php',
    'swift',
    'kotlin',
    'scala',
    'r',
    'matlab',
    'perl',
    'lua',
    'dart',
    'elixir',
    'clojure',
    'haskell',
    'erlang',
    'julia',
    'fortran',
    'cobol',
    'pascal',
    'ada',
    'lisp',
    'scheme',
    'prolog',
    'sql',
    'html',
    'css',
    'scss',
    'less',
    'xml',
    'json',
    'yaml',
    'toml',
    'ini',
    'markdown',
    'latex',
    'plaintext',
  ];

  // Theme options
  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs-light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast Dark' },
    { value: 'hc-light', label: 'High Contrast Light' },
    { value: 'custom-dark', label: 'Custom Dark' },
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Top Menu Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar variant="dense" sx={{ minHeight: 40 }}>
          <IconButton size="small" edge="start" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <ViewModule />
          </IconButton>
          
          <ButtonGroup size="small" sx={{ ml: 2 }}>
            <Button startIcon={<PlayArrow />} onClick={handleRun} disabled={isRunning}>
              Run
            </Button>
            <Button startIcon={<BugReport />} onClick={handleDebug} disabled={isDebugging}>
              Debug
            </Button>
            <Button startIcon={<Stop />} onClick={() => setIsRunning(false)} disabled={!isRunning && !isDebugging}>
              Stop
            </Button>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              {languages.map(lang => (
                <MenuItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120, ml: 1 }}>
            <Select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value as any)}>
              {themes.map(theme => (
                <MenuItem key={theme.value} value={theme.value}>
                  {theme.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side toolbar items */}
          <IconButton size="small" onClick={() => setRightPanelOpen(!rightPanelOpen)}>
            <Widgets />
          </IconButton>
          
          <IconButton size="small">
            <Settings />
          </IconButton>

          {liveShareSession && (
            <AvatarGroup max={4} sx={{ ml: 2 }}>
              {liveShareSession.participants.map(participant => (
                <Avatar
                  key={participant.id}
                  alt={participant.name}
                  src={participant.avatar}
                  sx={{ width: 24, height: 24 }}
                />
              ))}
            </AvatarGroup>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Collapse in={sidebarOpen} orientation="horizontal">
          <Box sx={{ width: 240, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
            {/* Sidebar Tabs */}
            <Tabs
              value={activePanel}
              onChange={(e, value) => setActivePanel(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40 }}
            >
              <Tab icon={<FolderOpen />} value="explorer" sx={{ minHeight: 40, minWidth: 48 }} />
              <Tab icon={<Search />} value="search" sx={{ minHeight: 40, minWidth: 48 }} />
              <Tab icon={<GitHub />} value="git" sx={{ minHeight: 40, minWidth: 48 }} />
              <Tab icon={<BugReport />} value="debug" sx={{ minHeight: 40, minWidth: 48 }} />
              <Tab icon={<Extension />} value="extensions" sx={{ minHeight: 40, minWidth: 48 }} />
            </Tabs>

            {/* Sidebar Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              {activePanel === 'explorer' && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    File explorer (TreeView component needs @mui/x-tree-view package)
                  </Typography>
                </Box>
              )}

              {activePanel === 'search' && (
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Replace"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button fullWidth variant="outlined" size="small">
                    Find All
                  </Button>
                </Box>
              )}

              {activePanel === 'git' && (
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Add />
                    </ListItemIcon>
                    <ListItemText primary="Stage All" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                    <ListItemText primary="Commit" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CloudUpload />
                    </ListItemIcon>
                    <ListItemText primary="Push" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CloudDownload />
                    </ListItemIcon>
                    <ListItemText primary="Pull" />
                  </ListItem>
                </List>
              )}

              {activePanel === 'debug' && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Breakpoints
                  </Typography>
                  <List dense>
                    {breakpoints.map(bp => (
                      <ListItem key={bp.id}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={bp.enabled}
                            size="small"
                          />
                        </ListItemIcon>
                        <ListItemText primary={`Line ${bp.line}`} />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Call Stack
                  </Typography>
                  <List dense>
                    {debugFrames.map(frame => (
                      <ListItem key={frame.id}>
                        <ListItemText
                          primary={frame.name}
                          secondary={`${frame.source}:${frame.line}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {activePanel === 'extensions' && (
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Extension />
                    </ListItemIcon>
                    <ListItemText
                      primary="Prettier"
                      secondary="Code formatter"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Extension />
                    </ListItemIcon>
                    <ListItemText
                      primary="ESLint"
                      secondary="Linting"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Extension />
                    </ListItemIcon>
                    <ListItemText
                      primary="GitLens"
                      secondary="Git supercharged"
                    />
                  </ListItem>
                </List>
              )}
            </Box>
          </Box>
        </Collapse>

        {/* Editor Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Open Files Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Tabs
              value={0}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ minHeight: 36 }}
            >
              {openFiles.map((file, index) => (
                <Tab
                  key={file.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {file.name}
                      {file.isModified && <Circle sx={{ fontSize: 8 }} />}
                    </Box>
                  }
                  sx={{ minHeight: 36, textTransform: 'none' }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Monaco Editor */}
          <Box sx={{ flex: 1 }}>
            <Editor
              height="100%"
              language={selectedLanguage}
              theme={selectedTheme}
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize: editorSettings.fontSize,
                tabSize: editorSettings.tabSize,
                wordWrap: wordWrap as any,
                lineNumbers: lineNumbers as any,
                minimap: { enabled: minimap },
                scrollBeyondLastLine,
                readOnly,
                autoClosingBrackets: autoClosingBrackets as any,
                autoClosingQuotes: autoClosingQuotes as any,
                autoIndent: autoIndent as any,
                formatOnPaste,
                formatOnType,
                suggestOnTriggerCharacters,
                acceptSuggestionOnCommitCharacter,
                acceptSuggestionOnEnter: acceptSuggestionOnEnter as any,
                snippetSuggestions: snippetSuggestions as any,
                showFoldingControls: showFoldingControls as any,
                folding,
                foldingStrategy: foldingStrategy as any,
                renderWhitespace: renderWhitespace as any,
                renderControlCharacters,
                renderLineHighlight: renderLineHighlight as any,
                cursorStyle: cursorStyle as any,
                cursorBlinking: cursorBlinking as any,
                smoothScrolling,
                mouseWheelZoom,
                multiCursorModifier: multiCursorModifier as any,
                accessibilitySupport: accessibilitySupport as any,
                fontFamily: editorSettings.fontFamily,
                fontLigatures: editorSettings.fontLigatures,
                letterSpacing: editorSettings.letterSpacing,
                lineHeight: editorSettings.lineHeight,
                rulers: editorSettings.rulers,
                // renderIndentGuides: editorSettings.renderIndentGuides, // Deprecated in newer Monaco versions
                highlightActiveIndentGuide: editorSettings.highlightActiveIndentGuide,
                bracketPairColorization: { enabled: editorSettings.bracketPairColorization },
                'semanticHighlighting.enabled': editorSettings.semanticHighlighting,
                quickSuggestions: editorSettings.quickSuggestions,
                suggestSelection: editorSettings.suggestSelection as any,
                tabCompletion: editorSettings.tabCompletion as any,
                wordBasedSuggestions: editorSettings.wordBasedSuggestions ? 'currentDocument' : 'off' as any,
                parameterHints: { enabled: editorSettings.parameterHints },
                inlayHints: { enabled: editorSettings.inlayHints ? 'on' : 'off' as any },
                stickyScroll: { enabled: editorSettings.stickyScroll },
                columnSelection: editorSettings.columnSelection,
                linkedEditing: editorSettings.linkedEditing,
                renameOnType: editorSettings.renameOnType,
                showUnused: editorSettings.showUnused,
                showDeprecated: editorSettings.showDeprecated,
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </Box>

          {/* Bottom Panel */}
          <Collapse in={bottomPanelOpen}>
            <Box sx={{ height: 200, borderTop: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
              <Tabs
                value={activeBottomPanel}
                onChange={(e, value) => setActiveBottomPanel(value)}
                sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 36 }}
              >
                <Tab label="Terminal" value="terminal" sx={{ minHeight: 36 }} />
                <Tab label="Output" value="output" sx={{ minHeight: 36 }} />
                <Tab label="Console" value="console" sx={{ minHeight: 36 }} />
                <Tab label="Problems" value="problems" sx={{ minHeight: 36 }} />
              </Tabs>

              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {activeBottomPanel === 'terminal' && (
                  <Box ref={terminalRef} sx={{ height: '100%', bgcolor: '#1e1e1e' }} />
                )}

                {activeBottomPanel === 'output' && (
                  <Box sx={{ p: 1, fontFamily: 'monospace', fontSize: 12 }}>
                    <Typography variant="caption" component="pre">
                      {consoleMessages
                        .filter(msg => msg.type === 'log')
                        .map(msg => msg.message)
                        .join('\n')}
                    </Typography>
                  </Box>
                )}

                {activeBottomPanel === 'console' && (
                  <List dense sx={{ p: 0 }}>
                    {consoleMessages.map(msg => (
                      <ListItem key={msg.id} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          {msg.type === 'error' && <Error color="error" fontSize="small" />}
                          {msg.type === 'warn' && <Warning color="warning" fontSize="small" />}
                          {msg.type === 'info' && <Info color="info" fontSize="small" />}
                          {msg.type === 'log' && <CheckCircle color="success" fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={msg.message}
                          secondary={msg.timestamp.toLocaleTimeString()}
                          primaryTypographyProps={{ fontFamily: 'monospace', fontSize: 12 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                {activeBottomPanel === 'problems' && (
                  <List dense sx={{ p: 0 }}>
                    <ListItem>
                      <ListItemIcon>
                        <Error color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Example error"
                        secondary="Line 1, Column 1"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Example warning"
                        secondary="Line 3, Column 1"
                      />
                    </ListItem>
                  </List>
                )}
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Right Panel */}
        <Collapse in={rightPanelOpen} orientation="horizontal">
          <Box sx={{ width: 300, borderLeft: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
            <Tabs
              value={activeRightPanel}
              onChange={(e, value) => setActiveRightPanel(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40 }}
            >
              <Tab label="Outline" value="outline" sx={{ minHeight: 40 }} />
              <Tab label="Timeline" value="timeline" sx={{ minHeight: 40 }} />
              <Tab label="Live Share" value="live-share" sx={{ minHeight: 40 }} />
              <Tab label="AI Assistant" value="ai-assistant" sx={{ minHeight: 40 }} />
            </Tabs>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {activeRightPanel === 'outline' && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Code outline (TreeView component needs @mui/x-tree-view package)
                  </Typography>
                </Box>
              )}

              {activeRightPanel === 'timeline' && (
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Initial commit"
                      secondary="2 hours ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Add feature"
                      secondary="1 hour ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Fix bug"
                      secondary="30 minutes ago"
                    />
                  </ListItem>
                </List>
              )}

              {activeRightPanel === 'live-share' && (
                <Box>
                  {liveShareSession ? (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Participants
                      </Typography>
                      <List dense>
                        {liveShareSession.participants.map(participant => (
                          <ListItem key={participant.id}>
                            <ListItemIcon>
                              <Avatar
                                src={participant.avatar}
                                sx={{ width: 24, height: 24 }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={participant.name}
                              secondary={participant.role}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ) : (
                    <Box>
                      <Button fullWidth variant="contained" startIcon={<Share />}>
                        Start Live Share
                      </Button>
                      <Button fullWidth variant="outlined" startIcon={<Group />} sx={{ mt: 1 }}>
                        Join Session
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {activeRightPanel === 'ai-assistant' && (
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={aiAssistant.enabled}
                        onChange={(e) => setAiAssistant({ ...aiAssistant, enabled: e.target.checked })}
                      />
                    }
                    label="Enable AI Assistant"
                  />
                  
                  {aiAssistant.enabled && (
                    <Box sx={{ mt: 2 }}>
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Model</InputLabel>
                        <Select
                          value={aiAssistant.model}
                          onChange={(e) => setAiAssistant({ ...aiAssistant, model: e.target.value as any })}
                        >
                          <MenuItem value="gpt-4">GPT-4</MenuItem>
                          <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                          <MenuItem value="codex">Codex</MenuItem>
                          <MenuItem value="copilot">Copilot</MenuItem>
                        </Select>
                      </FormControl>

                      <Typography variant="subtitle2" gutterBottom>
                        Suggestions
                      </Typography>
                      <List dense>
                        {aiAssistant.suggestions.map(suggestion => (
                          <ListItem key={suggestion.id}>
                            <ListItemIcon>
                              <Lightbulb color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={suggestion.content}
                              secondary={`${suggestion.type} - ${Math.round(suggestion.confidence * 100)}% confidence`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Status Bar */}
      <Box
        sx={{
          height: 24,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          px: 1,
          fontSize: 12,
        }}
      >
        <Typography variant="caption" sx={{ mr: 2 }}>
          {selectedLanguage.toUpperCase()}
        </Typography>
        <Typography variant="caption" sx={{ mr: 2 }}>
          Line {currentLine || 1}
        </Typography>
        <Typography variant="caption" sx={{ mr: 2 }}>
          UTF-8
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {isRunning && (
          <Chip
            label="Running"
            size="small"
            color="success"
            sx={{ height: 16, fontSize: 10 }}
          />
        )}
        {isDebugging && (
          <Chip
            label="Debugging"
            size="small"
            color="warning"
            sx={{ height: 16, fontSize: 10, ml: 1 }}
          />
        )}
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};