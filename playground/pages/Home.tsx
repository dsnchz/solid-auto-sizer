import { A } from "@solidjs/router";

export const Home = () => {
  return (
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">SolidJS AutoSizer Playground</h1>

      <div class="mb-8">
        <p class="text-lg text-gray-700 mb-4">
          Welcome to the SolidJS AutoSizer playground! This component automatically measures and
          provides the width and height of its parent container, making it perfect for responsive
          layouts and virtualized components.
        </p>

        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
          <p class="text-amber-800 text-sm">
            <strong>Inspired by React Virtualized Auto Sizer:</strong> This component brings the
            same powerful auto-sizing capabilities to SolidJS, with modern improvements like
            ResizeObserver API and reactive signals for better performance and developer experience.
          </p>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <h3 class="font-semibold text-blue-800 mb-2">Key Features:</h3>
          <ul class="list-disc list-inside text-blue-700 space-y-1">
            <li>Uses modern ResizeObserver API (no CSP issues)</li>
            <li>Reactive updates with SolidJS signals</li>
            <li>Customizable initial dimensions</li>
            <li>Optional resize callbacks</li>
            <li>Style and class prop support</li>
          </ul>
        </div>

        <div class="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">Quick Start</h2>
          <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
            {`import { AutoSizer } from "@dschz/solid-auto-sizer";

<AutoSizer>
  {({ width, height }) => (
    <div style={{ width: \`\${width}px\`, height: \`\${height}px\` }}>
      Content that adapts to container size: {width} × {height}
    </div>
  )}
</AutoSizer>`}
          </pre>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExampleCard
          title="Basic Usage"
          description="Simple AutoSizer with responsive content"
          href="/basic"
          color="bg-green-100 border-green-300"
        />

        <ExampleCard
          title="Chart Integration"
          description="AutoSizer with dynamic charts and graphs"
          href="/charts"
          color="bg-blue-100 border-blue-300"
        />

        <ExampleCard
          title="Virtualized Lists"
          description="Large lists with AutoSizer for performance"
          href="/lists"
          color="bg-purple-100 border-purple-300"
        />

        <ExampleCard
          title="Grid Layouts"
          description="Responsive grids that adapt to container size"
          href="/grids"
          color="bg-yellow-100 border-yellow-300"
        />

        <ExampleCard
          title="Nested AutoSizers"
          description="Complex layouts with multiple AutoSizers"
          href="/nested"
          color="bg-red-100 border-red-300"
        />

        <ExampleCard
          title="Custom Styling"
          description="AutoSizer with custom styles and classes"
          href="/styling"
          color="bg-indigo-100 border-indigo-300"
        />
      </div>
    </div>
  );
};

interface ExampleCardProps {
  title: string;
  description: string;
  href: string;
  color: string;
}

const ExampleCard = (props: ExampleCardProps) => {
  return (
    <A
      href={props.href}
      class={`block p-6 rounded-lg border-2 ${props.color} hover:shadow-lg transition-shadow duration-200`}
    >
      <h3 class="text-lg font-semibold mb-2">{props.title}</h3>
      <p class="text-gray-600">{props.description}</p>
      <div class="mt-4 text-blue-600 font-medium">View Example →</div>
    </A>
  );
};
