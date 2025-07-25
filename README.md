# DFFinity

A modern web-based 3D model viewer specifically designed for GTA San Andreas DFF and TXD files. Built with React Three Fiber and Three.js for high-performance 3D rendering in the browser.

![DFFinity Logo](public/DFFinity-logo.png)

## Features

- 🎮 **Real-time 3D Rendering** - Interactive 3D models with smooth performance
- 📁 **Drag & Drop Upload** - Enhanced drag-and-drop interface with visual feedback
- 🎯 **Camera Controls** - Orbit, pan, and zoom with mouse controls
- � **File Info Display** - Shows file name and size after upload
- 📊 **Status Indicators** - Clear visual feedback on model and texture loading
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Beautiful dark theme with purple/pink gradient accents

## Supported Formats

- **DFF**: RenderWare geometry files from GTA San Andreas
- **TXD**: RenderWare texture dictionary files



## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zuperzonic1/three-js-dff.git
   cd three-js-dff
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## Usage

### Getting Started

1. **Upload Files**: Choose or drag & drop your DFF and TXD files
2. **Load Model**: Click the "Load Model" button to render
3. **Explore**: Use mouse controls to orbit around the model

### Mouse Controls

- **Left Click + Drag**: Rotate camera around the model
- **Right Click + Drag**: Pan the camera
- **Scroll Wheel**: Zoom in and out



## Technology Stack

- **Frontend Framework**: React 18
- **3D Rendering**: React Three Fiber + Three.js
- **3D Controls**: @react-three/drei
- **Styling**: Tailwind CSS
- **File Parsing**: [rw-parser](https://github.com/Timic3/rw-parser) by Timic3
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)

## Project Structure

```
src/
├── Components/
│   ├── Model.jsx           # 3D model component
│   ├── ViewerCanvas.jsx    # Main 3D canvas with controls
│   ├── ModelViewer.jsx     # Main application component
│   ├── FileUpload.jsx      # File upload interface
│   ├── ControlPanel.jsx    # UI controls
│   ├── ErrorBoundary.jsx   # Error handling
│   ├── HelpPanel.jsx       # Help and documentation
│   └── Notifications.jsx   # Toast notifications
├── data-parser/
│   ├── dff-parser.py       # Python DFF parsing scripts
│   └── parser.py
├── assets/
├── App.jsx
└── main.jsx
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Importing PNG into TXD Files on the browser

## Performance Considerations

- **WebGL Support**: Requires WebGL-enabled browser
- **File Size**: Large models may impact performance
- **Memory**: High-polygon models use more GPU memory
- **Mobile**: Optimized for mobile but desktop recommended for large files

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ Internet Explorer (Not supported)


## Acknowledgments

- **[rw-parser](https://github.com/Timic3/rw-parser)** by Timic3 - For DFF/TXD file parsing
- **[React Three Fiber](https://github.com/pmndrs/react-three-fiber)** - React renderer for Three.js
- **[Three.js](https://threejs.org/)** - 3D JavaScript library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the GTA San Andreas modding community**
