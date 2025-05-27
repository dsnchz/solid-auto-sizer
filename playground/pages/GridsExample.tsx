import { createMemo, createSignal, For } from "solid-js";

import { AutoSizer } from "../../src/AutoSizer";

export const GridsExample = () => {
  const [itemCount, setItemCount] = createSignal(50);
  const [minItemWidth, setMinItemWidth] = createSignal(200);

  const items = createMemo(() =>
    Array.from({ length: itemCount() }, (_, i) => ({
      id: i,
      title: `Card ${i + 1}`,
      content: `This is the content for card number ${i + 1}. It contains some sample text to demonstrate the grid layout.`,
      color: `hsl(${(i * 137.5) % 360}, 70%, 50%)`,
      value: Math.floor(Math.random() * 100),
    })),
  );

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Grid Layout Examples</h1>

      <div class="space-y-8">
        {/* Example 1: Responsive Card Grid */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">1. Responsive Card Grid</h2>
          <p class="text-gray-600 mb-4">
            A responsive grid that automatically adjusts the number of columns based on container
            width.
          </p>

          <div class="mb-4 flex gap-4 items-center">
            <label class="text-sm font-medium">
              Item Count:
              <select
                value={itemCount()}
                onChange={(e) => setItemCount(parseInt(e.target.value))}
                class="ml-2 border rounded px-2 py-1"
              >
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </label>
            <label class="text-sm font-medium">
              Min Item Width:
              <select
                value={minItemWidth()}
                onChange={(e) => setMinItemWidth(parseInt(e.target.value))}
                class="ml-2 border rounded px-2 py-1"
              >
                <option value="150">150px</option>
                <option value="200">200px</option>
                <option value="250">250px</option>
                <option value="300">300px</option>
              </select>
            </label>
          </div>

          <div class="border-2 border-dashed border-gray-300 h-96 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => (
                <ResponsiveGrid
                  items={items()}
                  minItemWidth={minItemWidth()}
                  width={width}
                  height={height}
                />
              )}
            </AutoSizer>
          </div>
        </section>

        {/* Example 2: Masonry Layout */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">2. Masonry Layout</h2>
          <p class="text-gray-600 mb-4">
            A Pinterest-style masonry layout with items of varying heights.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-96 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => (
                <MasonryGrid items={items().slice(0, 30)} width={width} height={height} />
              )}
            </AutoSizer>
          </div>
        </section>

        {/* Example 3: Fixed Columns Grid */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">3. Fixed Columns Grid</h2>
          <p class="text-gray-600 mb-4">
            A grid with a fixed number of columns that adjusts item width based on container size.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-96 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => (
                <FixedColumnsGrid
                  items={items().slice(0, 40)}
                  columns={4}
                  width={width}
                  height={height}
                />
              )}
            </AutoSizer>
          </div>
        </section>

        {/* Example 4: Responsive Table Grid */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">4. Responsive Table Grid</h2>
          <p class="text-gray-600 mb-4">
            A table-like grid that adapts column widths and shows/hides columns based on available
            space.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-96 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => (
                <ResponsiveTable items={items().slice(0, 25)} width={width} height={height} />
              )}
            </AutoSizer>
          </div>
        </section>
      </div>
    </div>
  );
};

// Responsive Grid Component
interface GridProps {
  items: Array<{
    id: number;
    title: string;
    content: string;
    color: string;
    value: number;
  }>;
  width: number;
  height: number;
}

interface ResponsiveGridProps extends GridProps {
  minItemWidth: number;
}

const ResponsiveGrid = (props: ResponsiveGridProps) => {
  const gap = 16;

  const columns = createMemo(() =>
    Math.max(1, Math.floor((props.width + gap) / (props.minItemWidth + gap))),
  );

  const itemWidth = createMemo(() => (props.width - gap * (columns() - 1)) / columns());

  return (
    <div
      style={{ width: `${props.width}px`, height: `${props.height}px` }}
      class="overflow-auto p-4"
    >
      <div
        style={{
          display: "grid",
          "grid-template-columns": `repeat(${columns()}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        <For each={props.items}>
          {(item) => (
            <div
              style={{
                "background-color": item.color,
                width: `${itemWidth()}px`,
              }}
              class="rounded-lg p-4 text-white shadow-md"
            >
              <h3 class="font-semibold mb-2">{item.title}</h3>
              <p class="text-sm opacity-90 mb-3">{item.content}</p>
              <div class="text-lg font-bold">{item.value}%</div>
            </div>
          )}
        </For>
      </div>

      {/* Grid info */}
      <div class="fixed top-4 right-4 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        {columns()} columns × {Math.ceil(itemWidth())}px width
      </div>
    </div>
  );
};

// Masonry Grid Component
const MasonryGrid = (props: GridProps) => {
  const columnWidth = 200;
  const gap = 16;

  const columns = createMemo(() =>
    Math.max(1, Math.floor((props.width + gap) / (columnWidth + gap))),
  );

  const columnHeights = createMemo(() => new Array(columns()).fill(0));

  const itemPositions = createMemo(() => {
    const heights = [...columnHeights()];
    return props.items.map((_, index) => {
      // Find shortest column
      const shortestColumn = heights.indexOf(Math.min(...heights));
      const x = shortestColumn * (columnWidth + gap);
      const y = heights[shortestColumn];

      // Calculate item height based on content (simulate variable heights)
      const itemHeight = 120 + (index % 4) * 40;
      heights[shortestColumn] += itemHeight + gap;

      return { x, y, height: itemHeight };
    });
  });

  const totalHeight = () => Math.max(...columnHeights()) + 100;

  return (
    <div
      style={{ width: `${props.width}px`, height: `${props.height}px` }}
      class="overflow-auto p-4"
    >
      <div style={{ height: `${totalHeight()}px`, position: "relative" }}>
        <For each={props.items}>
          {(item, index) => {
            const position = () => itemPositions()[index()] || { x: 0, y: 0, height: 120 };
            return (
              <div
                style={{
                  position: "absolute",
                  left: `${position().x}px`,
                  top: `${position().y}px`,
                  width: `${columnWidth}px`,
                  height: `${position().height}px`,
                  "background-color": item.color,
                }}
                class="rounded-lg p-4 text-white shadow-md"
              >
                <h3 class="font-semibold mb-2">{item.title}</h3>
                <p class="text-sm opacity-90">{item.content}</p>
                <div class="absolute bottom-2 right-2 text-lg font-bold">{item.value}%</div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};

// Fixed Columns Grid Component
interface FixedColumnsGridProps extends GridProps {
  columns: number;
}

const FixedColumnsGrid = (props: FixedColumnsGridProps) => {
  const gap = 16;
  const itemWidth = () => (props.width - gap * (props.columns - 1)) / props.columns;
  const itemHeight = 150;

  return (
    <div
      style={{ width: `${props.width}px`, height: `${props.height}px` }}
      class="overflow-auto p-4"
    >
      <div
        style={{
          display: "grid",
          "grid-template-columns": `repeat(${props.columns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        <For each={props.items}>
          {(item) => (
            <div
              style={{
                "background-color": item.color,
                width: `${itemWidth()}px`,
                height: `${itemHeight}px`,
              }}
              class="rounded-lg p-4 text-white shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 class="font-semibold mb-2">{item.title}</h3>
                <p class="text-sm opacity-90">{item.content.slice(0, 80)}...</p>
              </div>
              <div class="text-xl font-bold text-right">{item.value}%</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

// Responsive Table Component
const ResponsiveTable = (props: GridProps) => {
  const columns = createMemo(() => {
    const baseColumns = [
      { key: "title", label: "Title", minWidth: 120 },
      { key: "content", label: "Content", minWidth: 200 },
      { key: "value", label: "Value", minWidth: 80 },
      { key: "color", label: "Color", minWidth: 100 },
    ];

    // Show/hide columns based on available width
    let totalWidth = 0;
    const visibleColumns = [];

    for (const col of baseColumns) {
      if (totalWidth + col.minWidth <= props.width - 40) {
        visibleColumns.push(col);
        totalWidth += col.minWidth;
      }
    }

    return visibleColumns.length > 0 ? visibleColumns : [baseColumns[0]];
  });

  const columnWidths = createMemo(() => {
    const totalMinWidth = columns().reduce((sum, col) => sum + (col?.minWidth || 0), 0);
    const extraSpace = Math.max(0, props.width - 40 - totalMinWidth);

    return columns().map(
      (col) => (col?.minWidth || 0) + (extraSpace * (col?.minWidth || 0)) / totalMinWidth,
    );
  });

  return (
    <div style={{ width: `${props.width}px`, height: `${props.height}px` }} class="overflow-auto">
      <table class="w-full border-collapse">
        <thead class="bg-gray-100 sticky top-0">
          <tr>
            <For each={columns()}>
              {(col, index) =>
                col && (
                  <th
                    style={{ width: `${columnWidths()[index()] || 100}px` }}
                    class="border border-gray-300 px-2 py-2 text-left text-sm font-semibold"
                  >
                    {col.label}
                  </th>
                )
              }
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={props.items}>
            {(item) => (
              <tr class="hover:bg-gray-50">
                <For each={columns()}>
                  {(col, index) =>
                    col && (
                      <td
                        style={{ width: `${columnWidths()[index()] || 100}px` }}
                        class="border border-gray-300 px-2 py-2 text-sm"
                      >
                        {col.key === "title" && item.title}
                        {col.key === "content" && `${item.content.slice(0, 50)}...`}
                        {col.key === "value" && `${item.value}%`}
                        {col.key === "color" && (
                          <div class="flex items-center gap-2">
                            <div
                              style={{ "background-color": item.color }}
                              class="w-4 h-4 rounded"
                            />
                            <span class="text-xs">{item.color}</span>
                          </div>
                        )}
                      </td>
                    )
                  }
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>

      {/* Table info */}
      <div class="fixed top-4 right-4 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        Showing {columns().length} of 4 columns
      </div>
    </div>
  );
};
