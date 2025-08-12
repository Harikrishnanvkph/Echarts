# ECharts Studio

A comprehensive web application for creating, customizing, and exporting beautiful data visualizations using Apache ECharts.

![ECharts Studio](https://img.shields.io/badge/ECharts-5.x-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Material-UI](https://img.shields.io/badge/MUI-5.x-007fff)

## 🚀 Features

### Chart Types
- **Line Chart** - Show trends over time
- **Bar Chart** - Compare values across categories
- **Pie Chart** - Display proportions of a whole
- **Scatter Plot** - Visualize correlations between variables
- **Area Chart** - Show cumulative totals over time
- **Radar Chart** - Compare multiple variables
- **Heatmap** - Display data density with colors
- **Treemap** - Visualize hierarchical data
- **Sunburst** - Show hierarchical data in circles
- **Gauge Chart** - Display progress or metrics
- **Funnel Chart** - Visualize process stages
- **Sankey Diagram** - Show flow between nodes
- **Candlestick** - Display financial data
- **Box Plot** - Show data distribution
- **Parallel Coordinates** - Visualize multi-dimensional data

### Data Management
- **Interactive Data Editor** - Edit data directly in a table format
- **CSV Import/Export** - Import data from CSV files or export current data
- **JSON Import/Export** - Full configuration import/export
- **Dynamic Series Management** - Add, remove, and modify data series
- **Real-time Updates** - See changes instantly in the chart preview

### Customization Options
- **Title & Subtitle** - Customize chart titles with positioning
- **Legend Configuration** - Control legend display and positioning
- **Color Themes** - Customize color palettes for your charts
- **Animation Settings** - Control animation duration and effects
- **Grid & Spacing** - Adjust chart margins and spacing
- **Axis Configuration** - Customize X and Y axes
- **Tooltip Settings** - Configure tooltip behavior
- **Data Zoom** - Enable zooming and panning
- **Toolbox Features** - Add interactive tools to charts

### Export Options
- **PNG Export** - High-quality raster images
- **SVG Export** - Scalable vector graphics
- **PDF Export** - Document format for sharing
- **JSON Export** - Save complete chart configuration

### User Experience
- **Dark Mode** - Toggle between light and dark themes
- **Preview Mode** - Full-screen chart preview
- **Responsive Design** - Works on all screen sizes
- **Keyboard Navigation** - Accessibility-focused design
- **Auto-save** - Charts saved to browser storage
- **Undo/Redo** - (Coming soon)

## 🛠️ Installation

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/echarts-studio.git

# Navigate to project directory
cd echarts-studio

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

## 📖 Usage

### Creating a Chart
1. **Select Chart Type** - Choose from 15+ chart types in the sidebar
2. **Add Data** - Use the Data tab to input your data manually, import CSV, or paste JSON
3. **Customize Appearance** - Use the Style tab to customize colors, titles, and layout
4. **Configure Series** - Adjust individual series properties in the Series tab
5. **Advanced Options** - Fine-tune axis, tooltips, and other advanced settings

### Importing Data
#### CSV Format
```csv
Category,Series 1,Series 2
Monday,120,80
Tuesday,200,120
Wednesday,150,100
```

#### JSON Format
```json
{
  "categories": ["Monday", "Tuesday", "Wednesday"],
  "series": [
    {
      "name": "Series 1",
      "data": [120, 200, 150]
    },
    {
      "name": "Series 2",
      "data": [80, 120, 100]
    }
  ]
}
```

### Exporting Charts
1. Click the **Export** button in the header
2. Choose your format (PNG, SVG, PDF, or JSON)
3. Configure export options (filename, background color)
4. Click **Export** to download

### Saving and Loading Charts
- Charts are automatically saved to browser storage
- Use the **Save** button to name and save your chart
- Access saved charts from the Save dialog
- Import/Export complete configurations as JSON

## 🏗️ Architecture

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Charting Library**: Apache ECharts 5
- **State Management**: Zustand
- **Build Tool**: Vite
- **Styling**: Emotion (CSS-in-JS)
- **Testing**: Vitest + React Testing Library

### Project Structure
```
src/
├── components/
│   ├── Layout/          # Header, Sidebar components
│   ├── ChartConfig/     # Configuration panels
│   ├── ChartPreview/    # Chart rendering component
│   └── Dialogs/         # Export, Import, Save dialogs
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx             # Main application component
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Static Hosting
The built application can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Apache ECharts](https://echarts.apache.org/) for the powerful charting library
- [Material-UI](https://mui.com/) for the beautiful UI components
- [React](https://reactjs.org/) for the frontend framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ by the ECharts Studio Team
