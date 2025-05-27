# @dschz/solid-auto-sizer

## 0.1.0

### Minor Changes

- **Initial release of @dschz/solid-auto-sizer** - A SolidJS component that automatically measures and provides container dimensions

### ✨ Features

- **AutoSizer Component** - Core component that measures parent container dimensions using ResizeObserver API
- **Reactive Updates** - Uses SolidJS signals for efficient re-rendering when container size changes
- **Render Props Pattern** - Children function receives `{ width, height }` for flexible content rendering
- **Initial Dimensions** - Support for `initialWidth` and `initialHeight` props to prevent layout shifts
- **Resize Callbacks** - Optional `onResize` prop for custom resize handling
- **Style Support** - Full `class` and `style` prop support (excluding width/height which are managed)
- **TypeScript Support** - Complete TypeScript definitions with proper type safety

### 🏗️ Implementation

- **Modern ResizeObserver API** - Better performance and reliability compared to legacy approaches
- **Proper Lifecycle Management** - Automatic cleanup of observers and event listeners
- **Zero Dependencies** - Lightweight implementation with no external dependencies beyond SolidJS
- **SolidJS Native** - Built specifically for SolidJS reactivity patterns

### 📦 Package

- **Comprehensive Testing** - 100% test coverage with 18 test cases covering all functionality
- **Playground Examples** - Interactive playground with 4 example categories:
  - Basic usage examples (5 demos)
  - Chart integration examples (4 demos)
  - Virtualized list examples (4 demos)
  - Responsive grid examples (4 demos)
- **Complete Documentation** - Comprehensive README with API reference and usage examples
- **Browser Compatibility** - Supports all modern browsers with ResizeObserver API

### 🎯 Inspiration

- Inspired by React Virtualized Auto Sizer but built natively for SolidJS
- Modernized implementation using ResizeObserver instead of legacy iframe techniques
- Leverages SolidJS reactivity for optimal performance
