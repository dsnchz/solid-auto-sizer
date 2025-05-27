import { A } from "@solidjs/router";

export const Navbar = () => {
  return (
    <nav class="bg-gray-800 text-white p-2 flex items-center">
      <div class="text-lg font-semibold mr-6">AutoSizer Playground</div>
      <div class="flex space-x-4">
        <A href="/" class="hover:text-gray-300 px-2 py-1 rounded">
          Home
        </A>
        <A href="/basic" class="hover:text-gray-300 px-2 py-1 rounded">
          Basic
        </A>
        <A href="/charts" class="hover:text-gray-300 px-2 py-1 rounded">
          Charts
        </A>
        <A href="/lists" class="hover:text-gray-300 px-2 py-1 rounded">
          Lists
        </A>
        <A href="/grids" class="hover:text-gray-300 px-2 py-1 rounded">
          Grids
        </A>
      </div>
    </nav>
  );
};
