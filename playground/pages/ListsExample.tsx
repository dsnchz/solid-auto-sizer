import { createMemo, createSignal, For } from "solid-js";

import { AutoSizer } from "../../src/AutoSizer";

export const ListsExample = () => {
  // Generate large dataset
  const [itemCount, setItemCount] = createSignal(10000);
  const [itemHeight] = createSignal(50);
  const [searchTerm, setSearchTerm] = createSignal("");

  const items = createMemo(() =>
    Array.from({ length: itemCount() }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      description: `This is the description for item number ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
      category: ["Technology", "Business", "Science", "Arts"][i % 4] as string,
    })),
  );

  const filteredItems = createMemo(() => {
    const term = searchTerm().toLowerCase();
    if (!term) return items();
    return items().filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term),
    );
  });

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Virtualized Lists Examples</h1>

      <div class="space-y-8">
        {/* Example 1: Simple Virtual List */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">1. Simple Virtual List</h2>
          <p class="text-gray-600 mb-4">
            A basic virtual list that only renders visible items for performance with large
            datasets.
          </p>

          <div class="mb-4 flex gap-4 items-center">
            <label class="text-sm font-medium">
              Item Count:
              <select
                value={itemCount()}
                onChange={(e) => setItemCount(parseInt(e.target.value))}
                class="ml-2 border rounded px-2 py-1"
              >
                <option value="1000">1,000</option>
                <option value="10000">10,000</option>
                <option value="50000">50,000</option>
                <option value="100000">100,000</option>
              </select>
            </label>
            <div class="text-sm text-gray-500">Total items: {itemCount().toLocaleString()}</div>
          </div>

          <div class="border-2 border-dashed border-gray-300 h-96 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => (
                <VirtualList
                  items={items()}
                  itemHeight={itemHeight()}
                  width={width}
                  height={height}
                />
              )}
            </AutoSizer>
          </div>
        </section>

        {/* Example 2: Searchable Virtual List */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">2. Searchable Virtual List</h2>
          <p class="text-gray-600 mb-4">
            Virtual list with search functionality that filters items dynamically.
          </p>

          <div class="mb-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm()}
              onInput={(e) => setSearchTerm(e.target.value)}
              class="w-full border rounded px-3 py-2"
            />
            <div class="text-sm text-gray-500 mt-1">
              Showing {filteredItems().length.toLocaleString()} of {itemCount().toLocaleString()}{" "}
              items
            </div>
          </div>

          <div class="border-2 border-dashed border-gray-300 h-96 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => (
                <VirtualList
                  items={filteredItems()}
                  itemHeight={itemHeight()}
                  width={width}
                  height={height}
                />
              )}
            </AutoSizer>
          </div>
        </section>

        {/* Example 3: Variable Height List */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">3. Variable Height List</h2>
          <p class="text-gray-600 mb-4">
            Virtual list with items of different heights for more complex layouts.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-96 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => (
                <VariableHeightList items={items().slice(0, 1000)} width={width} height={height} />
              )}
            </AutoSizer>
          </div>
        </section>

        {/* Example 4: Grid Layout */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">4. Virtual Grid</h2>
          <p class="text-gray-600 mb-4">
            A virtual grid layout that adapts to container width and renders only visible cells.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-96 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => (
                <VirtualGrid items={items().slice(0, 5000)} width={width} height={height} />
              )}
            </AutoSizer>
          </div>
        </section>
      </div>
    </div>
  );
};

// Virtual List Component
interface VirtualListProps {
  items: Array<{
    id: number;
    name: string;
    description: string;
    value: number;
    category: string;
  }>;
  itemHeight: number;
  width: number;
  height: number;
}

const VirtualList = (props: VirtualListProps) => {
  const [scrollTop, setScrollTop] = createSignal(0);

  const visibleRange = createMemo(() => {
    const start = Math.floor(scrollTop() / props.itemHeight);
    const end = Math.min(
      start + Math.ceil(props.height / props.itemHeight) + 1,
      props.items.length,
    );
    return { start, end };
  });

  const visibleItems = createMemo(() => {
    const { start, end } = visibleRange();
    return props.items.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index,
    }));
  });

  const totalHeight = () => props.items.length * props.itemHeight;

  return (
    <div
      style={{ width: `${props.width}px`, height: `${props.height}px` }}
      class="overflow-auto"
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: `${totalHeight()}px`, position: "relative" }}>
        <For each={visibleItems()}>
          {(item) => (
            <div
              style={{
                position: "absolute",
                top: `${item.index * props.itemHeight}px`,
                left: "0",
                right: "0",
                height: `${props.itemHeight}px`,
              }}
              class="border-b border-gray-200 px-4 py-2 flex items-center justify-between hover:bg-gray-50"
            >
              <div class="flex-1">
                <div class="font-medium text-gray-900">{item.name}</div>
                <div class="text-sm text-gray-500">{item.description}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">${item.value}</div>
                <div class="text-xs text-gray-500">{item.category}</div>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Performance indicator */}
      <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        Rendering {visibleItems().length} of {props.items.length} items
      </div>
    </div>
  );
};

// Variable Height List Component
interface VariableHeightListProps {
  items: Array<{
    id: number;
    name: string;
    description: string;
    value: number;
    category: string;
  }>;
  width: number;
  height: number;
}

const VariableHeightList = (props: VariableHeightListProps) => {
  const [scrollTop, setScrollTop] = createSignal(0);

  // Calculate item heights (simulate variable heights)
  const itemHeights = createMemo(() => props.items.map((_, index) => 60 + (index % 3) * 20));

  const itemPositions = createMemo(() => {
    const positions = [0];
    const heights = itemHeights();
    for (let i = 0; i < heights.length; i++) {
      positions.push((positions[i] || 0) + (heights[i] || 0));
    }
    return positions;
  });

  const visibleRange = createMemo(() => {
    const positions = itemPositions();
    const scroll = scrollTop();

    let start = 0;
    let end = props.items.length;

    // Find start index
    for (let i = 0; i < positions.length - 1; i++) {
      if ((positions[i + 1] || 0) > scroll) {
        start = i;
        break;
      }
    }

    // Find end index
    for (let i = start; i < positions.length - 1; i++) {
      if ((positions[i] || 0) > scroll + props.height) {
        end = i;
        break;
      }
    }

    return { start, end: Math.min(end + 1, props.items.length) };
  });

  const visibleItems = createMemo(() => {
    const { start, end } = visibleRange();
    const positions = itemPositions();
    const heights = itemHeights();

    return props.items.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index,
      top: positions[start + index] || 0,
      height: heights[start + index] || 60,
    }));
  });

  const totalHeight = () => itemPositions()[itemPositions().length - 1] || 0;

  return (
    <div
      style={{ width: `${props.width}px`, height: `${props.height}px` }}
      class="overflow-auto"
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: `${totalHeight()}px`, position: "relative" }}>
        <For each={visibleItems()}>
          {(item) => (
            <div
              style={{
                position: "absolute",
                top: `${item.top}px`,
                left: "0",
                right: "0",
                height: `${item.height}px`,
              }}
              class="border-b border-gray-200 px-4 py-2 hover:bg-gray-50"
            >
              <div class="font-medium text-gray-900">{item.name}</div>
              <div class="text-sm text-gray-500">{item.description}</div>
              <div class="text-xs text-gray-400 mt-1">
                Height: {item.height}px | Category: {item.category}
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

// Virtual Grid Component
interface VirtualGridProps {
  items: Array<{
    id: number;
    name: string;
    description: string;
    value: number;
    category: string;
  }>;
  width: number;
  height: number;
}

const VirtualGrid = (props: VirtualGridProps) => {
  const [scrollTop, setScrollTop] = createSignal(0);

  const cellWidth = 200;
  const cellHeight = 120;
  const gap = 8;

  const columnsCount = createMemo(() => Math.floor((props.width + gap) / (cellWidth + gap)));

  const rowsCount = createMemo(() => Math.ceil(props.items.length / columnsCount()));

  const visibleRange = createMemo(() => {
    const rowHeight = cellHeight + gap;
    const start = Math.floor(scrollTop() / rowHeight);
    const end = Math.min(start + Math.ceil(props.height / rowHeight) + 1, rowsCount());
    return { start, end };
  });

  const visibleItems = createMemo(() => {
    const { start, end } = visibleRange();
    const cols = columnsCount();
    const items = [];

    for (let row = start; row < end; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        if (index < props.items.length) {
          items.push({
            ...props.items[index],
            row,
            col,
            index,
          });
        }
      }
    }

    return items;
  });

  const totalHeight = () => rowsCount() * (cellHeight + gap);

  return (
    <div
      style={{ width: `${props.width}px`, height: `${props.height}px` }}
      class="overflow-auto"
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: `${totalHeight()}px`, position: "relative" }}>
        <For each={visibleItems()}>
          {(item) => (
            <div
              style={{
                position: "absolute",
                top: `${item.row * (cellHeight + gap)}px`,
                left: `${item.col * (cellWidth + gap)}px`,
                width: `${cellWidth}px`,
                height: `${cellHeight}px`,
              }}
              class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div class="font-medium text-gray-900 text-sm">{item.name}</div>
              <div class="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</div>
              <div class="mt-2 flex justify-between items-center">
                <span class="text-sm font-medium text-blue-600">${item.value}</span>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded">{item.category}</span>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Grid info */}
      <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
        {columnsCount()} cols × {rowsCount()} rows
      </div>
    </div>
  );
};
