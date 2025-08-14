import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
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
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatListBulleted,
  FormatListNumbered,
  FormatIndentIncrease,
  FormatIndentDecrease,
  FormatQuote,
  Code,
  Link,
  Image,
  Table,
  Undo,
  Redo,
  Save,
  SaveAs,
  FolderOpen,
  Print,
  Search,
  FindReplace,
  FormatColorText,
  FormatColorFill,
  FormatSize,
  FontDownload,
  Subscript,
  Superscript,
  Functions,
  InsertEmoticon,
  AttachFile,
  InsertChart,
  InsertDriveFile,
  CloudUpload,
  CloudDownload,
  Share,
  ContentCopy,
  ContentPaste,
  ContentCut,
  SelectAll,
  Clear,
  Spellcheck,
  Translate,
  TextFields,
  Title,
  Subject,
  FormatClear,
  BorderColor,
  Highlight,
  FormatPaint,
  Palette,
  Brush,
  Create,
  Edit,
  Delete,
  Add,
  Remove,
  Check,
  Close,
  MoreVert,
  Settings,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
  Refresh,
  History,
  BookmarkBorder,
  Bookmark,
  Comment,
  Forum,
  RateReview,
  Track Changes,
  CompareArrows,
  MergeType,
  CallSplit,
  ViewColumn,
  ViewModule,
  ViewList,
  ViewHeadline,
  WrapText,
  Notes,
  Description,
  Article,
  Book,
  MenuBook,
  AutoStories,
  LibraryBooks,
  CollectionsBookmark,
  ImportContacts,
  LocalLibrary,
  School,
  Psychology,
  EmojiObjects,
  Lightbulb,
  TipsAndUpdates,
  AutoAwesome,
  AutoFixHigh,
  AutoFixNormal,
  AutoFixOff,
  Timer,
  Schedule,
  AccessTime,
  Alarm,
  AddAlarm,
  AlarmOn,
  AlarmOff,
  DateRange,
  Event,
  EventNote,
  CalendarToday,
  CalendarMonth,
  Today,
  Weekend,
  Pending,
  HourglassEmpty,
  HourglassFull,
  Timeline,
  TrendingUp,
  TrendingDown,
  Analytics,
  Assessment,
  BarChart,
  ShowChart,
  PieChart,
  BubbleChart,
  ScatterPlot,
  StackedLineChart,
  Insights,
  QueryStats,
  DataUsage,
  DonutLarge,
  DonutSmall,
  Leaderboard,
  Poll,
  Equalizer,
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { diffWords, diffLines, diffChars } from 'diff';
import { debounce } from 'lodash';

interface TextEditorProps {
  initialContent?: string;
  mode?: 'text' | 'rich' | 'markdown' | 'code' | 'html' | 'json' | 'xml' | 'yaml' | 'sql' | 'latex';
  language?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  showLineNumbers?: boolean;
  showMinimap?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  collaborationEnabled?: boolean;
  versionControl?: boolean;
  spellCheck?: boolean;
  grammarCheck?: boolean;
  autoComplete?: boolean;
  syntaxValidation?: boolean;
  formatOnSave?: boolean;
  tabSize?: number;
  wordWrap?: boolean;
  fontSize?: number;
  fontFamily?: string;
  maxLength?: number;
  placeholder?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  onExport?: (content: string, format: string) => void;
}

interface TextStatistics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
  selectedText: string;
  selectedWords: number;
  selectedCharacters: number;
}

interface FindReplaceOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  useRegex: boolean;
  searchBackward: boolean;
  wrapSearch: boolean;
  searchInSelection: boolean;
}

interface DocumentVersion {
  id: string;
  timestamp: Date;
  content: string;
  author: string;
  message: string;
  size: number;
  checksum: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  position: { start: number; end: number };
  replies: Comment[];
  resolved: boolean;
}

interface Bookmark {
  id: string;
  name: string;
  position: number;
  description: string;
  color: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  variables: { [key: string]: string };
  description: string;
  thumbnail: string;
}

interface Snippet {
  id: string;
  name: string;
  trigger: string;
  content: string;
  description: string;
  language: string;
  scope: string;
}

interface Macro {
  id: string;
  name: string;
  actions: MacroAction[];
  shortcut: string;
  description: string;
}

interface MacroAction {
  type: 'insert' | 'delete' | 'replace' | 'format' | 'command';
  value: string;
  options?: any;
}

interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  enabled: boolean;
  settings: any;
  commands: PluginCommand[];
}

interface PluginCommand {
  id: string;
  name: string;
  shortcut: string;
  handler: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  initialContent = '',
  mode = 'rich',
  language = 'javascript',
  theme = 'light',
  readOnly = false,
  showToolbar = true,
  showStatusBar = true,
  showLineNumbers = true,
  showMinimap = false,
  autoSave = false,
  autoSaveInterval = 30000,
  collaborationEnabled = false,
  versionControl = false,
  spellCheck = true,
  grammarCheck = false,
  autoComplete = true,
  syntaxValidation = true,
  formatOnSave = true,
  tabSize = 2,
  wordWrap = true,
  fontSize = 14,
  fontFamily = 'Monaco, Consolas, "Courier New", monospace',
  maxLength,
  placeholder = 'Start typing...',
  onChange,
  onSave,
  onExport,
}) => {
  const [content, setContent] = useState(initialContent);
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [statistics, setStatistics] = useState<TextStatistics>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0,
    selectedText: '',
    selectedWords: 0,
    selectedCharacters: 0,
  });
  
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    alignment: 'left',
    fontSize: 14,
    fontFamily: 'Arial',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    lineHeight: 1.5,
    letterSpacing: 0,
    textTransform: 'none',
  });

  const [history, setHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [macros, setMacros] = useState<Macro[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [findOptions, setFindOptions] = useState<FindReplaceOptions>({
    caseSensitive: false,
    wholeWord: false,
    useRegex: false,
    searchBackward: false,
    wrapSearch: true,
    searchInSelection: false,
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [snippetDialogOpen, setSnippetDialogOpen] = useState(false);
  const [macroDialogOpen, setMacroDialogOpen] = useState(false);
  const [pluginDialogOpen, setPluginDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [splitView, setSplitView] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [distrationFree, setDistractionFree] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [typewriterMode, setTypewriterMode] = useState(false);
  
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave) {
      const saveInterval = setInterval(() => {
        handleSave();
      }, autoSaveInterval);
      return () => clearInterval(saveInterval);
    }
  }, [autoSave, autoSaveInterval, content]);

  // Calculate statistics
  useEffect(() => {
    const calculateStatistics = () => {
      const text = content;
      const noSpaces = text.replace(/\s/g, '');
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
      const lines = text.split('\n');
      
      const wordsPerMinute = 200;
      const speakingWordsPerMinute = 150;
      const readingTime = Math.ceil(words.length / wordsPerMinute);
      const speakingTime = Math.ceil(words.length / speakingWordsPerMinute);

      setStatistics({
        characters: text.length,
        charactersNoSpaces: noSpaces.length,
        words: words.length,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        lines: lines.length,
        readingTime,
        speakingTime,
        selectedText: selectedText,
        selectedWords: selectedText.trim().split(/\s+/).filter(w => w.length > 0).length,
        selectedCharacters: selectedText.length,
      });
    };

    calculateStatistics();
  }, [content, selectedText]);

  // Handle text change
  const handleTextChange = (newContent: string) => {
    if (maxLength && newContent.length > maxLength) {
      showNotification(`Maximum length of ${maxLength} characters exceeded`, 'warning');
      return;
    }

    setContent(newContent);
    
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    if (onChange) {
      onChange(newContent);
    }
  };

  // Undo/Redo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  // Save functionality
  const handleSave = () => {
    let finalContent = content;
    
    if (formatOnSave && mode === 'code') {
      finalContent = formatCode(finalContent, language);
    }

    if (versionControl) {
      const version: DocumentVersion = {
        id: generateId(),
        timestamp: new Date(),
        content: finalContent,
        author: 'Current User',
        message: 'Auto-saved',
        size: new Blob([finalContent]).size,
        checksum: generateChecksum(finalContent),
      };
      setVersions([...versions, version]);
    }

    if (onSave) {
      onSave(finalContent);
    }

    showNotification('Document saved successfully', 'success');
  };

  // Export functionality
  const handleExport = (format: string) => {
    let exportContent = content;
    
    switch (format) {
      case 'pdf':
        exportAsPDF(exportContent);
        break;
      case 'docx':
        exportAsDocx(exportContent);
        break;
      case 'html':
        exportAsHTML(exportContent);
        break;
      case 'markdown':
        exportAsMarkdown(exportContent);
        break;
      case 'txt':
        exportAsText(exportContent);
        break;
      case 'rtf':
        exportAsRTF(exportContent);
        break;
      case 'json':
        exportAsJSON(exportContent);
        break;
      case 'xml':
        exportAsXML(exportContent);
        break;
      case 'csv':
        exportAsCSV(exportContent);
        break;
      case 'xlsx':
        exportAsExcel(exportContent);
        break;
      default:
        exportAsText(exportContent);
    }

    if (onExport) {
      onExport(exportContent, format);
    }
  };

  // Import functionality
  const handleImport = async (file: File) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const result = e.target?.result;
      
      if (typeof result === 'string') {
        if (file.name.endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          handleTextChange(result.value);
        } else if (file.name.endsWith('.pdf')) {
          // PDF import would require additional library
          showNotification('PDF import requires additional setup', 'info');
        } else {
          handleTextChange(result);
        }
      }
    };

    if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  // Find and Replace
  const handleFind = () => {
    if (!findText) return;
    
    let searchContent = content;
    let searchTerm = findText;
    
    if (!findOptions.caseSensitive) {
      searchContent = searchContent.toLowerCase();
      searchTerm = searchTerm.toLowerCase();
    }
    
    const index = searchContent.indexOf(searchTerm);
    
    if (index !== -1) {
      // Highlight found text
      setCursorPosition(index);
      setSelectedText(content.substring(index, index + findText.length));
    } else {
      showNotification('Text not found', 'info');
    }
  };

  const handleReplace = () => {
    if (!findText || !selectedText) return;
    
    const newContent = content.replace(selectedText, replaceText);
    handleTextChange(newContent);
    showNotification('Text replaced', 'success');
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    
    let regex: RegExp;
    
    if (findOptions.useRegex) {
      regex = new RegExp(findText, findOptions.caseSensitive ? 'g' : 'gi');
    } else {
      const escapedFind = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(escapedFind, findOptions.caseSensitive ? 'g' : 'gi');
    }
    
    const newContent = content.replace(regex, replaceText);
    const replacements = (content.match(regex) || []).length;
    
    handleTextChange(newContent);
    showNotification(`${replacements} replacements made`, 'success');
  };

  // Format code
  const formatCode = (code: string, lang: string): string => {
    // This would integrate with prettier or other formatters
    // For now, basic formatting
    return code
      .replace(/\s+/g, ' ')
      .replace(/;\s*/g, ';\n')
      .replace(/{\s*/g, ' {\n')
      .replace(/}\s*/g, '\n}\n');
  };

  // Export functions
  const exportAsPDF = (content: string) => {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(content, 180);
    let y = 20;
    
    lines.forEach((line: string) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 15, y);
      y += 7;
    });
    
    pdf.save('document.pdf');
  };

  const exportAsDocx = (content: string) => {
    // This would require docx library integration
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, 'document.docx');
  };

  const exportAsHTML = (content: string) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
        </style>
      </head>
      <body>
        ${marked(content)}
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, 'document.html');
  };

  const exportAsMarkdown = (content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    saveAs(blob, 'document.md');
  };

  const exportAsText = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, 'document.txt');
  };

  const exportAsRTF = (content: string) => {
    // Basic RTF conversion
    const rtf = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}} \\f0\\fs24 ${content} }`;
    const blob = new Blob([rtf], { type: 'application/rtf' });
    saveAs(blob, 'document.rtf');
  };

  const exportAsJSON = (content: string) => {
    const json = JSON.stringify({ content, metadata: statistics }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'document.json');
  };

  const exportAsXML = (content: string) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?><document><content>${content}</content></document>`;
    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, 'document.xml');
  };

  const exportAsCSV = (content: string) => {
    const lines = content.split('\n').map(line => `"${line.replace(/"/g, '""')}"`);
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'document.csv');
  };

  const exportAsExcel = (content: string) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(content.split('\n').map(line => [line]));
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'document.xlsx');
  };

  // Helper functions
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  const generateChecksum = (content: string) => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Render editor based on mode
  const renderEditor = () => {
    switch (mode) {
      case 'code':
        return (
          <Box sx={{ position: 'relative', height: '100%' }}>
            {showLineNumbers && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '50px',
                  backgroundColor: 'grey.100',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  userSelect: 'none',
                }}
              >
                {content.split('\n').map((_, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'right',
                      pr: 1,
                      color: 'text.secondary',
                      lineHeight: `${fontSize * 1.5}px`,
                      fontSize: `${fontSize - 2}px`,
                    }}
                  >
                    {index + 1}
                  </Typography>
                ))}
              </Box>
            )}
            <Box
              sx={{
                ml: showLineNumbers ? '50px' : 0,
                height: '100%',
                overflow: 'auto',
              }}
            >
              <SyntaxHighlighter
                language={language}
                style={theme === 'dark' ? vscDarkPlus : vs}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  fontSize: `${fontSize}px`,
                  fontFamily,
                  lineHeight: 1.5,
                  minHeight: '100%',
                }}
                showLineNumbers={false}
                wrapLines={wordWrap}
                lineProps={{ style: { wordBreak: 'break-word' } }}
              >
                {content}
              </SyntaxHighlighter>
              {!readOnly && (
                <textarea
                  value={content}
                  onChange={(e) => handleTextChange(e.target.value)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: showLineNumbers ? '50px' : 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    fontSize: `${fontSize}px`,
                    fontFamily,
                    padding: '16px',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                  }}
                  spellCheck={spellCheck}
                  placeholder={placeholder}
                />
              )}
            </Box>
          </Box>
        );

      case 'markdown':
        return (
          <Box sx={{ display: 'flex', height: '100%' }}>
            <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
              <TextField
                multiline
                fullWidth
                value={content}
                onChange={(e) => handleTextChange(e.target.value)}
                variant="outlined"
                placeholder={placeholder}
                disabled={readOnly}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: `${fontSize}px`,
                    fontFamily,
                  },
                }}
              />
            </Box>
            {splitView && (
              <Box sx={{ flex: 1, p: 2, overflow: 'auto', borderLeft: '1px solid', borderColor: 'divider' }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked(content)),
                  }}
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: 'inherit',
                  }}
                />
              </Box>
            )}
          </Box>
        );

      case 'rich':
      default:
        return (
          <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
            <div
              ref={editorRef}
              contentEditable={!readOnly}
              onInput={(e) => handleTextChange(e.currentTarget.textContent || '')}
              onSelect={() => {
                const selection = window.getSelection();
                if (selection) {
                  setSelectedText(selection.toString());
                }
              }}
              style={{
                minHeight: '100%',
                fontSize: `${fontSize}px`,
                fontFamily,
                lineHeight: formatting.lineHeight,
                letterSpacing: `${formatting.letterSpacing}px`,
                textAlign: formatting.alignment as any,
                color: formatting.textColor,
                backgroundColor: formatting.backgroundColor,
                fontWeight: formatting.bold ? 'bold' : 'normal',
                fontStyle: formatting.italic ? 'italic' : 'normal',
                textDecoration: formatting.underline ? 'underline' : formatting.strikethrough ? 'line-through' : 'none',
                textTransform: formatting.textTransform as any,
                outline: 'none',
                wordWrap: wordWrap ? 'break-word' : 'normal',
              }}
              suppressContentEditableWarning
            >
              {content || placeholder}
            </div>
          </Box>
        );
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zoom: `${zoom}%`,
      }}
    >
      {/* Toolbar */}
      {showToolbar && !distrationFree && (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          {/* Main Toolbar */}
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, flexWrap: 'wrap', gap: 1 }}>
            {/* File Operations */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="New Document">
                <IconButton size="small" onClick={() => handleTextChange('')}>
                  <Add />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open">
                <IconButton size="small" onClick={() => fileInputRef.current?.click()}>
                  <FolderOpen />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save">
                <IconButton size="small" onClick={handleSave}>
                  <Save />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save As">
                <IconButton size="small" onClick={() => setExportDialogOpen(true)}>
                  <SaveAs />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton size="small" onClick={() => window.print()}>
                  <Print />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Edit Operations */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Undo">
                <IconButton size="small" onClick={handleUndo} disabled={historyIndex === 0}>
                  <Undo />
                </IconButton>
              </Tooltip>
              <Tooltip title="Redo">
                <IconButton size="small" onClick={handleRedo} disabled={historyIndex === history.length - 1}>
                  <Redo />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cut">
                <IconButton size="small" onClick={() => document.execCommand('cut')}>
                  <ContentCut />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy">
                <IconButton size="small" onClick={() => document.execCommand('copy')}>
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip title="Paste">
                <IconButton size="small" onClick={() => document.execCommand('paste')}>
                  <ContentPaste />
                </IconButton>
              </Tooltip>
              <Tooltip title="Select All">
                <IconButton size="small" onClick={() => document.execCommand('selectAll')}>
                  <SelectAll />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Text Formatting */}
            {mode === 'rich' && (
              <>
                <ToggleButtonGroup
                  size="small"
                  value={[
                    formatting.bold && 'bold',
                    formatting.italic && 'italic',
                    formatting.underline && 'underline',
                    formatting.strikethrough && 'strikethrough',
                  ].filter(Boolean)}
                  onChange={(e, newFormats) => {
                    setFormatting({
                      ...formatting,
                      bold: newFormats.includes('bold'),
                      italic: newFormats.includes('italic'),
                      underline: newFormats.includes('underline'),
                      strikethrough: newFormats.includes('strikethrough'),
                    });
                  }}
                >
                  <ToggleButton value="bold">
                    <FormatBold />
                  </ToggleButton>
                  <ToggleButton value="italic">
                    <FormatItalic />
                  </ToggleButton>
                  <ToggleButton value="underline">
                    <FormatUnderlined />
                  </ToggleButton>
                  <ToggleButton value="strikethrough">
                    <FormatStrikethrough />
                  </ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={formatting.alignment}
                  onChange={(e, newAlignment) => {
                    if (newAlignment) {
                      setFormatting({ ...formatting, alignment: newAlignment });
                    }
                  }}
                >
                  <ToggleButton value="left">
                    <FormatAlignLeft />
                  </ToggleButton>
                  <ToggleButton value="center">
                    <FormatAlignCenter />
                  </ToggleButton>
                  <ToggleButton value="right">
                    <FormatAlignRight />
                  </ToggleButton>
                  <ToggleButton value="justify">
                    <FormatAlignJustify />
                  </ToggleButton>
                </ToggleButtonGroup>

                <Divider orientation="vertical" flexItem />
              </>
            )}

            {/* Search and Replace */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Find">
                <IconButton size="small" onClick={() => setFindReplaceOpen(true)}>
                  <Search />
                </IconButton>
              </Tooltip>
              <Tooltip title="Find and Replace">
                <IconButton size="small" onClick={() => setFindReplaceOpen(true)}>
                  <FindReplace />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Insert Options */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Insert Link">
                <IconButton size="small">
                  <Link />
                </IconButton>
              </Tooltip>
              <Tooltip title="Insert Image">
                <IconButton size="small">
                  <Image />
                </IconButton>
              </Tooltip>
              <Tooltip title="Insert Table">
                <IconButton size="small">
                  <Table />
                </IconButton>
              </Tooltip>
              <Tooltip title="Insert Code Block">
                <IconButton size="small">
                  <Code />
                </IconButton>
              </Tooltip>
              <Tooltip title="Insert Chart">
                <IconButton size="small">
                  <InsertChart />
                </IconButton>
              </Tooltip>
              <Tooltip title="Insert Emoji">
                <IconButton size="small">
                  <InsertEmoticon />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* View Options */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Zoom In">
                <IconButton size="small" onClick={() => setZoom(Math.min(zoom + 10, 200))}>
                  <ZoomIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom Out">
                <IconButton size="small" onClick={() => setZoom(Math.max(zoom - 10, 50))}>
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Tooltip title="Split View">
                <IconButton size="small" onClick={() => setSplitView(!splitView)} color={splitView ? 'primary' : 'default'}>
                  <ViewColumn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Fullscreen">
                <IconButton size="small" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Distraction Free">
                <IconButton size="small" onClick={() => setDistractionFree(!distrationFree)}>
                  <AutoAwesome />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Tools */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Spell Check">
                <IconButton size="small" color={spellCheck ? 'primary' : 'default'}>
                  <Spellcheck />
                </IconButton>
              </Tooltip>
              <Tooltip title="Comments">
                <IconButton size="small" onClick={() => setCommentDialogOpen(true)}>
                  <Comment />
                </IconButton>
              </Tooltip>
              <Tooltip title="Version History">
                <IconButton size="small" onClick={() => setVersionHistoryOpen(true)}>
                  <History />
                </IconButton>
              </Tooltip>
              <Tooltip title="Bookmarks">
                <IconButton size="small" onClick={() => setBookmarkDialogOpen(true)}>
                  <Bookmark />
                </IconButton>
              </Tooltip>
              <Tooltip title="Templates">
                <IconButton size="small" onClick={() => setTemplateDialogOpen(true)}>
                  <Description />
                </IconButton>
              </Tooltip>
              <Tooltip title="Snippets">
                <IconButton size="small" onClick={() => setSnippetDialogOpen(true)}>
                  <Functions />
                </IconButton>
              </Tooltip>
              <Tooltip title="Macros">
                <IconButton size="small" onClick={() => setMacroDialogOpen(true)}>
                  <Psychology />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton size="small" onClick={() => setSettingsOpen(true)}>
                  <Settings />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Secondary Toolbar */}
          {mode === 'rich' && (
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1, pb: 1, gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={formatting.fontFamily}
                  onChange={(e) => setFormatting({ ...formatting, fontFamily: e.target.value })}
                >
                  <MenuItem value="Arial">Arial</MenuItem>
                  <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                  <MenuItem value="Courier New">Courier New</MenuItem>
                  <MenuItem value="Georgia">Georgia</MenuItem>
                  <MenuItem value="Verdana">Verdana</MenuItem>
                  <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={formatting.fontSize}
                  onChange={(e) => setFormatting({ ...formatting, fontSize: Number(e.target.value) })}
                >
                  {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map(size => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Tooltip title="Text Color">
                <IconButton size="small">
                  <FormatColorText />
                </IconButton>
              </Tooltip>

              <Tooltip title="Background Color">
                <IconButton size="small">
                  <FormatColorFill />
                </IconButton>
              </Tooltip>

              <Tooltip title="Clear Formatting">
                <IconButton size="small">
                  <FormatClear />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem />

              <Tooltip title="Bulleted List">
                <IconButton size="small">
                  <FormatListBulleted />
                </IconButton>
              </Tooltip>

              <Tooltip title="Numbered List">
                <IconButton size="small">
                  <FormatListNumbered />
                </IconButton>
              </Tooltip>

              <Tooltip title="Increase Indent">
                <IconButton size="small">
                  <FormatIndentIncrease />
                </IconButton>
              </Tooltip>

              <Tooltip title="Decrease Indent">
                <IconButton size="small">
                  <FormatIndentDecrease />
                </IconButton>
              </Tooltip>

              <Tooltip title="Quote">
                <IconButton size="small">
                  <FormatQuote />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem />

              <Tooltip title="Subscript">
                <IconButton size="small">
                  <Subscript />
                </IconButton>
              </Tooltip>

              <Tooltip title="Superscript">
                <IconButton size="small">
                  <Superscript />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      )}

      {/* Editor Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {renderEditor()}
      </Box>

      {/* Status Bar */}
      {showStatusBar && !distrationFree && (
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            p: 0.5,
            px: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'grey.50',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption">
              {statistics.words} words
            </Typography>
            <Typography variant="caption">
              {statistics.characters} characters
            </Typography>
            <Typography variant="caption">
              {statistics.lines} lines
            </Typography>
            <Typography variant="caption">
              {statistics.readingTime} min read
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption">
              {mode.toUpperCase()}
            </Typography>
            {mode === 'code' && (
              <Typography variant="caption">
                {language.toUpperCase()}
              </Typography>
            )}
            <Typography variant="caption">
              Line {cursorPosition}
            </Typography>
            <Typography variant="caption">
              {zoom}%
            </Typography>
          </Box>
        </Box>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".txt,.md,.json,.html,.xml,.csv,.docx,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImport(file);
          }
        }}
      />

      {/* Find and Replace Dialog */}
      <Dialog open={findReplaceOpen} onClose={() => setFindReplaceOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Find and Replace</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Find"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              autoFocus
            />
            <TextField
              fullWidth
              label="Replace with"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="Case Sensitive"
                onClick={() => setFindOptions({ ...findOptions, caseSensitive: !findOptions.caseSensitive })}
                color={findOptions.caseSensitive ? 'primary' : 'default'}
              />
              <Chip
                label="Whole Word"
                onClick={() => setFindOptions({ ...findOptions, wholeWord: !findOptions.wholeWord })}
                color={findOptions.wholeWord ? 'primary' : 'default'}
              />
              <Chip
                label="Use Regex"
                onClick={() => setFindOptions({ ...findOptions, useRegex: !findOptions.useRegex })}
                color={findOptions.useRegex ? 'primary' : 'default'}
              />
              <Chip
                label="Wrap Search"
                onClick={() => setFindOptions({ ...findOptions, wrapSearch: !findOptions.wrapSearch })}
                color={findOptions.wrapSearch ? 'primary' : 'default'}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFindReplaceOpen(false)}>Cancel</Button>
          <Button onClick={handleFind}>Find</Button>
          <Button onClick={handleReplace}>Replace</Button>
          <Button onClick={handleReplaceAll} variant="contained">Replace All</Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Document</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography>Choose export format:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['pdf', 'docx', 'html', 'markdown', 'txt', 'rtf', 'json', 'xml', 'csv', 'xlsx'].map(format => (
                <Button
                  key={format}
                  variant="outlined"
                  onClick={() => {
                    handleExport(format);
                    setExportDialogOpen(false);
                  }}
                >
                  {format.toUpperCase()}
                </Button>
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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