<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Ecosystem&background=tiles&project=solid-auto-sizer" alt="SolidJS AutoSizer">
</p>

# @dschz/solid-auto-sizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@dschz/solid-auto-sizer?color=blue)](https://www.npmjs.com/package/@dschz/solid-auto-sizer)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@dschz/solid-auto-sizer)](https://bundlephobia.com/package/@dschz/solid-auto-sizer)
[![JSR](https://jsr.io/badges/@dschz/solid-auto-sizer/score)](https://jsr.io/@dschz/solid-auto-sizer)
[![CI](https://github.com/dsnchz/solid-auto-sizer/actions/workflows/ci.yaml/badge.svg)](https://github.com/dsnchz/solid-auto-sizer/actions/workflows/ci.yaml)

> A SolidJS component that automatically measures and provides the width and height of its parent container, making it perfect for responsive layouts and virtualized components.

**Inspired by [React Virtualized Auto Sizer](https://github.com/bvaughn/react-virtualized-auto-sizer)**, this component brings the same powerful auto-sizing capabilities to SolidJS with modern improvements like ResizeObserver API and reactive signals for better performance and developer experience.

## ✨ Features

- 🔍 **Modern ResizeObserver API** - Better performance and reliability
- ⚡ **Reactive updates** - Uses SolidJS signals for efficient re-rendering
- 🎛️ **Customizable initial dimensions** - Set default width/height for initial render
- 📞 **Optional resize callbacks** - Get notified when size changes
- 🎨 **Style and class prop support** - Full styling flexibility
- 📦 **Lightweight** - Minimal bundle size with zero dependencies

## 📦 Installation

Install via your favorite package manager:

```bash
npm install solid-js @dschz/solid-auto-sizer
pnpm install solid-js @dschz/solid-auto-sizer
yarn install solid-js @dschz/solid-auto-sizer
bun install solid-js @dschz/solid-auto-sizer
```

> This is a **peer dependency**, so it must be installed manually:
>
> - `solid-js@>=1.6.0`

## 🚀 Quick Start

```tsx
import { AutoSizer } from "@dschz/solid-auto-sizer";

function MyComponent() {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <AutoSizer>
        {({ width, height }) => (
          <div style={{ width: `${width}px`, height: `${height}px` }}>
            Content that adapts to container size: {width} × {height}
          </div>
        )}
      </AutoSizer>
    </div>
  );
}
```

## 📖 Usage Examples

### Basic Usage

```tsx
import { AutoSizer } from "@dschz/solid-auto-sizer";

<AutoSizer>{({ width, height }) => <canvas width={width} height={height} />}</AutoSizer>;
```

### With Initial Dimensions

```tsx
<AutoSizer initialWidth={400} initialHeight={300}>
  {({ width, height }) => <MyChart width={width} height={height} data={data} />}
</AutoSizer>
```

### With Resize Callback

```tsx
<AutoSizer
  onResize={({ width, height }) => {
    console.log(`Container resized to: ${width}x${height}`);
  }}
>
  {({ width, height }) => <VirtualizedList width={width} height={height} items={items} />}
</AutoSizer>
```

### With Custom Styling

```tsx
<AutoSizer
  class="my-auto-sizer"
  style={{
    "background-color": "#f0f0f0",
    border: "1px solid #ccc",
    padding: "10px",
  }}
>
  {({ width, height }) => (
    <div>
      Styled container: {width} × {height}
    </div>
  )}
</AutoSizer>
```

## 📚 API Reference

### Props

| Prop            | Type                          | Default      | Description                                                 |
| --------------- | ----------------------------- | ------------ | ----------------------------------------------------------- |
| `children`      | `(size: Size) => JSX.Element` | **Required** | Render prop that receives the measured dimensions           |
| `initialWidth`  | `number`                      | `0`          | Default width for initial render before measurement         |
| `initialHeight` | `number`                      | `0`          | Default height for initial render before measurement        |
| `onResize`      | `(size: Size) => void`        | `undefined`  | Callback fired when container size changes                  |
| `class`         | `string`                      | `undefined`  | CSS class for the container element                         |
| `style`         | `JSX.CSSProperties`           | `undefined`  | Inline styles for the container (width/height are reserved) |

### Types

```tsx
type Size = {
  readonly width: number;
  readonly height: number;
};

type AutoSizerProps = {
  readonly class?: string;
  readonly style?: Omit<JSX.CSSProperties, "width" | "height">;
  readonly initialWidth?: number;
  readonly initialHeight?: number;
  readonly onResize?: (size: Size) => void;
  readonly children: (size: Size) => JSX.Element;
};
```

## 🎮 Interactive Playground

Explore AutoSizer's capabilities with our comprehensive playground app! The playground includes:

- **Basic Examples** - Simple responsive content, resize callbacks, custom dimensions, flexbox integration
- **Charts & Visualizations** - Responsive bar charts, line charts, pie charts, and dashboards
- **Virtual Lists & Grids** - Performance demos with 1K-100K items, searchable lists, variable heights
- **Real-time Demos** - Interactive examples you can resize and modify

### Running the Playground

```bash
# Clone the repository
git clone https://github.com/dsnchz/solid-auto-sizer.git
cd solid-auto-sizer

# Install dependencies
npm|pnpm|yarn|bun install

# Start the development server
npm|pnpm|yarn|bun start
```

The playground will be available at `http://localhost:3000` and showcases real-world use cases including:

- 📊 **Chart Integration** - See how AutoSizer works with data visualizations
- 📋 **Virtual Scrolling** - Performance testing with large datasets
- 🎨 **Styling Examples** - Custom themes and responsive designs
- ⚡ **Performance Monitoring** - Real-time resize event tracking

## 💡 Common Use Cases

### Charts and Visualizations

```tsx
import { AutoSizer } from "@dschz/solid-auto-sizer";
import { LineChart } from "my-chart-library";

<div style={{ width: "100%", height: "400px" }}>
  <AutoSizer>
    {({ width, height }) => <LineChart width={width} height={height} data={chartData} />}
  </AutoSizer>
</div>;
```

### Virtualized Lists

```tsx
import { AutoSizer } from "@dschz/solid-auto-sizer";
import { VirtualList } from "my-virtualization-library";

<div style={{ width: "100%", height: "600px" }}>
  <AutoSizer>
    {({ width, height }) => (
      <VirtualList
        width={width}
        height={height}
        itemCount={items.length}
        itemSize={50}
        renderItem={({ index }) => <div>{items[index].name}</div>}
      />
    )}
  </AutoSizer>
</div>;
```

### Responsive Grids

```tsx
import { AutoSizer } from "@dschz/solid-auto-sizer";

<AutoSizer>
  {({ width }) => {
    const columns = Math.floor(width / 200); // 200px per column
    return (
      <div
        style={{
          display: "grid",
          "grid-template-columns": `repeat(${columns}, 1fr)`,
          gap: "16px",
        }}
      >
        {items.map((item) => (
          <GridItem key={item.id} {...item} />
        ))}
      </div>
    );
  }}
</AutoSizer>;
```

## 🌐 Browser Support

AutoSizer uses the [ResizeObserver API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), which is supported in:

- Chrome 64+
- Firefox 69+
- Safari 13.1+
- Edge 79+

For older browsers, you can use a [ResizeObserver polyfill](https://github.com/que-etc/resize-observer-polyfill).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [React Virtualized Auto Sizer](https://github.com/bvaughn/react-virtualized-auto-sizer)
- Built with [SolidJS](https://www.solidjs.com/)
