import { createSignal, For } from "solid-js";

import { AutoSizer } from "../../src/AutoSizer";

export const ChartsExample = () => {
  const [data] = createSignal([
    { label: "Jan", value: 65 },
    { label: "Feb", value: 78 },
    { label: "Mar", value: 90 },
    { label: "Apr", value: 81 },
    { label: "May", value: 95 },
    { label: "Jun", value: 88 },
  ]);

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Chart Integration Examples</h1>

      <div class="space-y-8">
        {/* Example 1: Responsive Bar Chart */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">1. Responsive Bar Chart</h2>
          <p class="text-gray-600 mb-4">
            A simple bar chart that adapts to container size. Resize to see how bars scale.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-80 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => <BarChart data={data()} width={width} height={height} />}
            </AutoSizer>
          </div>
        </section>

        {/* Example 2: Line Chart with Grid */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">2. Line Chart with Grid</h2>
          <p class="text-gray-600 mb-4">
            A line chart with responsive grid lines and proper scaling.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-64 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => <LineChart data={data()} width={width} height={height} />}
            </AutoSizer>
          </div>
        </section>

        {/* Example 3: Pie Chart */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">3. Responsive Pie Chart</h2>
          <p class="text-gray-600 mb-4">
            A pie chart that maintains proportions while scaling with container size.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-96 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => <PieChart data={data()} width={width} height={height} />}
            </AutoSizer>
          </div>
        </section>

        {/* Example 4: Dashboard with Multiple Charts */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">4. Dashboard Layout</h2>
          <p class="text-gray-600 mb-4">
            Multiple charts in a dashboard layout, each with its own AutoSizer.
          </p>

          <div class="grid grid-cols-2 gap-4 h-96">
            <div class="border-2 border-dashed border-gray-300">
              <AutoSizer>
                {({ width, height }) => (
                  <MiniBarChart data={data().slice(0, 4)} width={width} height={height} />
                )}
              </AutoSizer>
            </div>

            <div class="border-2 border-dashed border-gray-300">
              <AutoSizer>
                {({ width, height }) => (
                  <MiniLineChart data={data()} width={width} height={height} />
                )}
              </AutoSizer>
            </div>

            <div class="border-2 border-dashed border-gray-300 col-span-2">
              <AutoSizer>
                {({ width, height }) => <AreaChart data={data()} width={width} height={height} />}
              </AutoSizer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Simple Bar Chart Component
interface ChartProps {
  data: Array<{ label: string; value: number }>;
  width: number;
  height: number;
}

const BarChart = (props: ChartProps) => {
  const padding = 40;

  const chartWidth = () => props.width - padding * 2;
  const chartHeight = () => props.height - padding * 2;
  const maxValue = () => Math.max(...props.data.map((d) => d.value));
  const barWidth = () => (chartWidth() / props.data.length) * 0.8;
  const barSpacing = () => (chartWidth() / props.data.length) * 0.2;

  return (
    <svg width={props.width} height={props.height} class="bg-white">
      {/* Chart Title */}
      <text
        x={props.width / 2}
        y={20}
        text-anchor="middle"
        class="text-sm font-semibold fill-gray-700"
      >
        Monthly Sales Data
      </text>

      {/* Bars */}
      <For each={props.data}>
        {(item, index) => {
          const barHeight = () => (item.value / maxValue()) * chartHeight();
          const x = () => padding + index() * (barWidth() + barSpacing());
          const y = () => padding + chartHeight() - barHeight();

          return (
            <g>
              <rect
                x={x()}
                y={y()}
                width={barWidth()}
                height={barHeight()}
                fill={`hsl(${200 + index() * 30}, 70%, 50%)`}
                class="hover:opacity-80 transition-opacity"
              />
              <text
                x={x() + barWidth() / 2}
                y={props.height - 10}
                text-anchor="middle"
                class="text-xs fill-gray-600"
              >
                {item.label}
              </text>
              <text
                x={x() + barWidth() / 2}
                y={y() - 5}
                text-anchor="middle"
                class="text-xs fill-gray-700"
              >
                {item.value}
              </text>
            </g>
          );
        }}
      </For>

      {/* Size indicator */}
      <text
        x={props.width - 10}
        y={props.height - 10}
        text-anchor="end"
        class="text-xs fill-gray-400"
      >
        {props.width} × {props.height}
      </text>
    </svg>
  );
};

// Simple Line Chart Component
const LineChart = (props: ChartProps) => {
  const padding = 40;

  const chartWidth = () => props.width - padding * 2;
  const chartHeight = () => props.height - padding * 2;
  const maxValue = () => Math.max(...props.data.map((d) => d.value));

  const points = () =>
    props.data
      .map((item, index) => {
        const x = padding + (index / (props.data.length - 1)) * chartWidth();
        const y = padding + chartHeight() - (item.value / maxValue()) * chartHeight();
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <svg width={props.width} height={props.height} class="bg-white">
      {/* Grid lines */}
      <For each={[0, 0.25, 0.5, 0.75, 1]}>
        {(ratio) => (
          <line
            x1={padding}
            y1={padding + chartHeight() * ratio}
            x2={padding + chartWidth()}
            y2={padding + chartHeight() * ratio}
            stroke="#e5e7eb"
            stroke-width="1"
          />
        )}
      </For>

      {/* Chart Title */}
      <text
        x={props.width / 2}
        y={20}
        text-anchor="middle"
        class="text-sm font-semibold fill-gray-700"
      >
        Trend Analysis
      </text>

      {/* Line */}
      <polyline
        points={points()}
        fill="none"
        stroke="#3b82f6"
        stroke-width="3"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      {/* Data points */}
      <For each={props.data}>
        {(item, index) => {
          const x = () => padding + (index() / (props.data.length - 1)) * chartWidth();
          const y = () => padding + chartHeight() - (item.value / maxValue()) * chartHeight();

          return (
            <g>
              <circle cx={x()} cy={y()} r="4" fill="#3b82f6" class="hover:r-6 transition-all" />
              <text
                x={x()}
                y={props.height - 10}
                text-anchor="middle"
                class="text-xs fill-gray-600"
              >
                {item.label}
              </text>
            </g>
          );
        }}
      </For>

      {/* Size indicator */}
      <text
        x={props.width - 10}
        y={props.height - 10}
        text-anchor="end"
        class="text-xs fill-gray-400"
      >
        {props.width} × {props.height}
      </text>
    </svg>
  );
};

// Simple Pie Chart Component
const PieChart = (props: ChartProps) => {
  const centerX = () => props.width / 2;
  const centerY = () => props.height / 2;
  const radius = () => Math.min(props.width, props.height) / 2 - 40;
  const total = () => props.data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = 0;

  return (
    <svg width={props.width} height={props.height} class="bg-white">
      {/* Chart Title */}
      <text x={centerX()} y={20} text-anchor="middle" class="text-sm font-semibold fill-gray-700">
        Data Distribution
      </text>

      <For each={props.data}>
        {(item, index) => {
          const sliceAngle = () => (item.value / total()) * 2 * Math.PI;
          const startAngle = () => currentAngle;
          const endAngle = () => currentAngle + sliceAngle();

          const x1 = () => centerX() + radius() * Math.cos(startAngle());
          const y1 = () => centerY() + radius() * Math.sin(startAngle());
          const x2 = () => centerX() + radius() * Math.cos(endAngle());
          const y2 = () => centerY() + radius() * Math.sin(endAngle());

          const largeArcFlag = () => (sliceAngle() > Math.PI ? 1 : 0);

          const pathData = () =>
            [
              `M ${centerX()} ${centerY()}`,
              `L ${x1()} ${y1()}`,
              `A ${radius()} ${radius()} 0 ${largeArcFlag()} 1 ${x2()} ${y2()}`,
              "Z",
            ].join(" ");

          currentAngle += sliceAngle();

          // Label position
          const labelAngle = () => startAngle() + sliceAngle() / 2;
          const labelX = () => centerX() + radius() * 0.7 * Math.cos(labelAngle());
          const labelY = () => centerY() + radius() * 0.7 * Math.sin(labelAngle());

          return (
            <g>
              <path
                d={pathData()}
                fill={`hsl(${index() * 60}, 70%, 50%)`}
                stroke="white"
                stroke-width="2"
                class="hover:opacity-80 transition-opacity"
              />
              <text
                x={labelX()}
                y={labelY()}
                text-anchor="middle"
                class="text-xs fill-white font-semibold"
              >
                {item.label}
              </text>
            </g>
          );
        }}
      </For>

      {/* Size indicator */}
      <text
        x={props.width - 10}
        y={props.height - 10}
        text-anchor="end"
        class="text-xs fill-gray-400"
      >
        {props.width} × {props.height}
      </text>
    </svg>
  );
};

// Mini chart components for dashboard
const MiniBarChart = (props: ChartProps) => (
  <div class="p-4 h-full flex flex-col">
    <h3 class="text-sm font-semibold mb-2">Mini Bar Chart</h3>
    <div class="flex-1">
      <BarChart {...props} />
    </div>
  </div>
);

const MiniLineChart = (props: ChartProps) => (
  <div class="p-4 h-full flex flex-col">
    <h3 class="text-sm font-semibold mb-2">Mini Line Chart</h3>
    <div class="flex-1">
      <LineChart {...props} />
    </div>
  </div>
);

const AreaChart = (props: ChartProps) => {
  const padding = 40;
  const chartWidth = () => props.width - padding * 2;
  const chartHeight = () => props.height - padding * 2;
  const maxValue = () => Math.max(...props.data.map((d) => d.value));

  const points = () =>
    props.data
      .map((item, index) => {
        const x = padding + (index / (props.data.length - 1)) * chartWidth();
        const y = padding + chartHeight() - (item.value / maxValue()) * chartHeight();
        return `${x},${y}`;
      })
      .join(" ");

  const areaPoints = () =>
    `${padding},${padding + chartHeight()} ${points()} ${padding + chartWidth()},${padding + chartHeight()}`;

  return (
    <div class="p-4 h-full flex flex-col">
      <h3 class="text-sm font-semibold mb-2">Area Chart</h3>
      <div class="flex-1">
        <svg width={props.width - 32} height={props.height - 40} class="bg-white">
          <polygon points={areaPoints()} fill="url(#gradient)" stroke="#3b82f6" stroke-width="2" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ "stop-color": "#3b82f6", "stop-opacity": "0.3" }} />
              <stop offset="100%" style={{ "stop-color": "#3b82f6", "stop-opacity": "0.1" }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
