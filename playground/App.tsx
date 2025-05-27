import { Route, Router } from "@solidjs/router";
import { ErrorBoundary, type ParentProps } from "solid-js";

import { Navbar } from "./Navbar";
import { BasicExample } from "./pages/BasicExample";
import { ChartsExample } from "./pages/ChartsExample";
import { ErrorPage } from "./pages/Error";
import { GridsExample } from "./pages/GridsExample";
import { Home } from "./pages/Home";
import { ListsExample } from "./pages/ListsExample";
import { NotFound } from "./pages/NotFound";

const MainContent = (props: ParentProps) => {
  return (
    <main class="flex flex-col h-full w-full grow overflow-auto bg-app-background">
      {props.children}
    </main>
  );
};

const RootLayout = (props: ParentProps) => (
  <div id="root-screen" class="h-screen w-screen">
    <Navbar />
    <MainContent>{props.children}</MainContent>
  </div>
);

export const App = () => {
  return (
    <ErrorBoundary fallback={(e, r) => <ErrorPage error={e} reset={r} />}>
      <Router root={RootLayout}>
        <Route path="/" component={Home} />
        <Route path="/basic" component={BasicExample} />
        <Route path="/charts" component={ChartsExample} />
        <Route path="/lists" component={ListsExample} />
        <Route path="/grids" component={GridsExample} />
        <Route path="*" component={NotFound} />
      </Router>
    </ErrorBoundary>
  );
};
