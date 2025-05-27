import { createSignal } from "solid-js";

import { AutoSizer } from "../../src/AutoSizer";

export const BasicExample = () => {
  const [resizeCount, setResizeCount] = createSignal(0);
  const [lastSize, setLastSize] = createSignal({ width: 0, height: 0 });

  const handleResize = (size: { width: number; height: number }) => {
    setResizeCount((prev) => prev + 1);
    setLastSize(size);
  };

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Basic AutoSizer Examples</h1>

      <div class="space-y-8">
        {/* Example 1: Simple responsive content */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">1. Simple Responsive Content</h2>
          <p class="text-gray-600 mb-4">
            AutoSizer automatically provides dimensions to its children. Resize the container to see
            it adapt.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-64 resize overflow-auto">
            <AutoSizer>
              {({ width, height }) => (
                <div
                  class="bg-gradient-to-br from-blue-400 to-purple-600 text-white flex items-center justify-center text-lg font-semibold"
                  style={{ width: `${width}px`, height: `${height}px` }}
                >
                  <div class="text-center">
                    <div>Container Size</div>
                    <div class="text-2xl">
                      {width} × {height}
                    </div>
                  </div>
                </div>
              )}
            </AutoSizer>
          </div>
        </section>

        {/* Example 2: With resize callback */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">2. With Resize Callback</h2>
          <p class="text-gray-600 mb-4">
            Track resize events and display statistics about size changes.
          </p>

          <div class="mb-4 p-3 bg-gray-100 rounded">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                Resize Count: <span class="font-semibold">{resizeCount()}</span>
              </div>
              <div>
                Last Size:{" "}
                <span class="font-semibold">
                  {lastSize().width} × {lastSize().height}
                </span>
              </div>
            </div>
          </div>

          <div class="border-2 border-dashed border-gray-300 h-48 resize overflow-auto">
            <AutoSizer onResize={handleResize}>
              {({ width, height }) => (
                <div
                  class="bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center"
                  style={{ width: `${width}px`, height: `${height}px` }}
                >
                  <div class="text-center">
                    <div class="text-lg">Resize me!</div>
                    <div class="text-sm opacity-80">Events tracked: {resizeCount()}</div>
                  </div>
                </div>
              )}
            </AutoSizer>
          </div>
        </section>

        {/* Example 3: Initial dimensions */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">3. Custom Initial Dimensions</h2>
          <p class="text-gray-600 mb-4">
            Set initial width and height for server-side rendering or to avoid layout shifts.
          </p>

          <div class="border-2 border-dashed border-gray-300 h-56 resize overflow-auto">
            <AutoSizer initialWidth={400} initialHeight={200}>
              {({ width, height }) => (
                <div
                  class="bg-gradient-to-tr from-pink-400 to-red-500 text-white flex flex-col items-center justify-center"
                  style={{ width: `${width}px`, height: `${height}px` }}
                >
                  <div class="text-lg font-semibold">Initial: 400 × 200</div>
                  <div class="text-sm opacity-80">
                    Current: {width} × {height}
                  </div>
                  <div class="text-xs opacity-60 mt-2">
                    {width === 400 && height === 200
                      ? "Using initial size"
                      : "Measured actual size"}
                  </div>
                </div>
              )}
            </AutoSizer>
          </div>
        </section>

        {/* Example 4: Flexbox integration */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">4. Flexbox Integration</h2>
          <p class="text-gray-600 mb-4">
            AutoSizer works well with flexbox layouts. The container grows to fill available space.
          </p>

          <div class="flex h-64 gap-4">
            <div class="w-1/3 bg-gray-200 flex items-center justify-center">
              <span class="text-gray-600">Sidebar</span>
            </div>

            <div class="flex-1 border-2 border-dashed border-gray-300">
              <AutoSizer>
                {({ width, height }) => (
                  <div
                    class="bg-gradient-to-bl from-yellow-400 to-orange-500 text-white flex items-center justify-center"
                    style={{ width: `${width}px`, height: `${height}px` }}
                  >
                    <div class="text-center">
                      <div class="text-lg">Flex Content</div>
                      <div class="text-sm">
                        {width} × {height}
                      </div>
                    </div>
                  </div>
                )}
              </AutoSizer>
            </div>

            <div class="w-1/4 bg-gray-200 flex items-center justify-center">
              <span class="text-gray-600">Panel</span>
            </div>
          </div>
        </section>

        {/* Example 5: Multiple AutoSizers */}
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">5. Multiple AutoSizers</h2>
          <p class="text-gray-600 mb-4">
            Multiple AutoSizers can be used independently in the same layout.
          </p>

          <div class="grid grid-cols-2 gap-4 h-48">
            <div class="border-2 border-dashed border-gray-300">
              <AutoSizer>
                {({ width, height }) => (
                  <div
                    class="bg-gradient-to-r from-indigo-400 to-purple-500 text-white flex items-center justify-center"
                    style={{ width: `${width}px`, height: `${height}px` }}
                  >
                    <div class="text-center">
                      <div>Left Panel</div>
                      <div class="text-sm">
                        {width} × {height}
                      </div>
                    </div>
                  </div>
                )}
              </AutoSizer>
            </div>

            <div class="border-2 border-dashed border-gray-300">
              <AutoSizer>
                {({ width, height }) => (
                  <div
                    class="bg-gradient-to-l from-teal-400 to-cyan-500 text-white flex items-center justify-center"
                    style={{ width: `${width}px`, height: `${height}px` }}
                  >
                    <div class="text-center">
                      <div>Right Panel</div>
                      <div class="text-sm">
                        {width} × {height}
                      </div>
                    </div>
                  </div>
                )}
              </AutoSizer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
