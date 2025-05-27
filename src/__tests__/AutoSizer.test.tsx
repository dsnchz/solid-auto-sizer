import { render, screen, waitFor } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AutoSizer } from "../AutoSizer";

// Mock ResizeObserver
class MockResizeObserver {
  private callback: ResizeObserverCallback;
  private elements: Set<Element> = new Set();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Helper method to trigger resize
  trigger(entries: ResizeObserverEntry[]) {
    this.callback(entries, this);
  }
}

// Mock getBoundingClientRect
const mockGetBoundingClientRect = vi.fn();

describe("AutoSizer", () => {
  let mockResizeObserver: MockResizeObserver;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock ResizeObserver
    mockResizeObserver = new MockResizeObserver(() => {});
    global.ResizeObserver = vi.fn().mockImplementation((callback) => {
      mockResizeObserver = new MockResizeObserver(callback);
      return mockResizeObserver;
    });

    // Mock getBoundingClientRect
    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
  });

  it("renders with default initial dimensions", () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    render(() => <AutoSizer>{mockChildren}</AutoSizer>);

    expect(mockChildren).toHaveBeenCalledWith({ width: 0, height: 0 });
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders with custom initial dimensions", () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    render(() => (
      <AutoSizer initialWidth={200} initialHeight={150}>
        {mockChildren}
      </AutoSizer>
    ));

    expect(mockChildren).toHaveBeenCalledWith({ width: 200, height: 150 });
  });

  it("applies custom class and style props", () => {
    render(() => (
      <AutoSizer class="custom-class" style={{ "background-color": "red", padding: "10px" }}>
        {() => <div>Child</div>}
      </AutoSizer>
    ));

    const container = screen.getByText("Child").parentElement;
    expect(container).toHaveClass("custom-class");
    expect(container).toHaveStyle({
      "background-color": "rgb(255, 0, 0)",
      padding: "10px",
      width: "100%",
      height: "100%",
    });
  });

  it("updates dimensions based on container size on mount", async () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    mockGetBoundingClientRect.mockReturnValue({
      width: 300,
      height: 200,
      top: 0,
      left: 0,
      bottom: 200,
      right: 300,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    render(() => <AutoSizer>{mockChildren}</AutoSizer>);

    await waitFor(() => {
      expect(mockChildren).toHaveBeenLastCalledWith({ width: 300, height: 200 });
    });
  });

  it("calls onResize when container size changes on mount", async () => {
    const onResize = vi.fn();

    mockGetBoundingClientRect.mockReturnValue({
      width: 400,
      height: 300,
      top: 0,
      left: 0,
      bottom: 300,
      right: 400,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    render(() => <AutoSizer onResize={onResize}>{() => <div>Child</div>}</AutoSizer>);

    await waitFor(() => {
      expect(onResize).toHaveBeenCalledWith({ width: 400, height: 300 });
    });
  });

  it("does not call onResize if container size matches initial size", async () => {
    const onResize = vi.fn();
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 50,
      top: 0,
      left: 0,
      bottom: 50,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    render(() => (
      <AutoSizer initialWidth={100} initialHeight={50} onResize={onResize}>
        {mockChildren}
      </AutoSizer>
    ));

    await waitFor(() => {
      expect(onResize).not.toHaveBeenCalled();
      expect(mockChildren).toHaveBeenCalledWith({ width: 100, height: 50 });
    });
  });

  it("updates size when only width changes on mount", async () => {
    const onResize = vi.fn();
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    mockGetBoundingClientRect.mockReturnValue({
      width: 200, // Different width
      height: 50, // Same height
      top: 0,
      left: 0,
      bottom: 50,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    render(() => (
      <AutoSizer initialWidth={100} initialHeight={50} onResize={onResize}>
        {mockChildren}
      </AutoSizer>
    ));

    await waitFor(() => {
      expect(onResize).toHaveBeenCalledWith({ width: 200, height: 50 });
      expect(mockChildren).toHaveBeenLastCalledWith({ width: 200, height: 50 });
    });
  });

  it("updates size when only height changes on mount", async () => {
    const onResize = vi.fn();
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100, // Same width
      height: 150, // Different height
      top: 0,
      left: 0,
      bottom: 150,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    render(() => (
      <AutoSizer initialWidth={100} initialHeight={50} onResize={onResize}>
        {mockChildren}
      </AutoSizer>
    ));

    await waitFor(() => {
      expect(onResize).toHaveBeenCalledWith({ width: 100, height: 150 });
      expect(mockChildren).toHaveBeenLastCalledWith({ width: 100, height: 150 });
    });
  });

  it("does not update size if container size matches initial size without onResize", async () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    mockGetBoundingClientRect.mockReturnValue({
      width: 100,
      height: 50,
      top: 0,
      left: 0,
      bottom: 50,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    render(() => (
      <AutoSizer initialWidth={100} initialHeight={50}>
        {mockChildren}
      </AutoSizer>
    ));

    await waitFor(() => {
      expect(mockChildren).toHaveBeenCalledWith({ width: 100, height: 50 });
    });
  });

  it("responds to ResizeObserver changes", async () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);
    const onResize = vi.fn();

    render(() => <AutoSizer onResize={onResize}>{mockChildren}</AutoSizer>);

    // Wait for initial mount
    await waitFor(() => {
      expect(mockChildren).toHaveBeenCalled();
    });

    // Simulate resize
    const mockEntry = {
      contentRect: {
        width: 500,
        height: 400,
        top: 0,
        left: 0,
        bottom: 400,
        right: 500,
        x: 0,
        y: 0,
        toJSON: () => {},
      },
      target: document.createElement("div"),
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    } as ResizeObserverEntry;

    mockResizeObserver.trigger([mockEntry]);

    await waitFor(() => {
      expect(mockChildren).toHaveBeenLastCalledWith({ width: 500, height: 400 });
      expect(onResize).toHaveBeenLastCalledWith({ width: 500, height: 400 });
    });
  });

  it("floors fractional dimensions", async () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    render(() => <AutoSizer>{mockChildren}</AutoSizer>);

    // Wait for initial mount
    await waitFor(() => {
      expect(mockChildren).toHaveBeenCalled();
    });

    // Simulate resize with fractional dimensions
    const mockEntry = {
      contentRect: {
        width: 123.7,
        height: 456.9,
        top: 0,
        left: 0,
        bottom: 456.9,
        right: 123.7,
        x: 0,
        y: 0,
        toJSON: () => {},
      },
      target: document.createElement("div"),
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    } as ResizeObserverEntry;

    mockResizeObserver.trigger([mockEntry]);

    await waitFor(() => {
      expect(mockChildren).toHaveBeenLastCalledWith({ width: 123, height: 456 });
    });
  });

  it("handles empty ResizeObserver entries gracefully", async () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    render(() => <AutoSizer>{mockChildren}</AutoSizer>);

    // Wait for initial mount
    await waitFor(() => {
      expect(mockChildren).toHaveBeenCalled();
    });

    const initialCallCount = mockChildren.mock.calls.length;

    // Simulate empty entries
    mockResizeObserver.trigger([]);

    // Should not cause additional calls
    expect(mockChildren).toHaveBeenCalledTimes(initialCallCount);
  });

  it("disconnects ResizeObserver on cleanup", async () => {
    const disconnectSpy = vi.fn();
    const observeSpy = vi.fn();

    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: observeSpy,
      disconnect: disconnectSpy,
      unobserve: vi.fn(),
    }));

    const { unmount } = render(() => <AutoSizer>{() => <div>Child</div>}</AutoSizer>);

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it("works with reactive children", async () => {
    const [count, setCount] = createSignal(0);

    // Mock getBoundingClientRect to return 0x0 for this test
    mockGetBoundingClientRect.mockReturnValue({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    render(() => (
      <AutoSizer>
        {({ width, height }) => (
          <div data-testid="reactive-child">
            Count: {count()}, Size: {width}x{height}
          </div>
        )}
      </AutoSizer>
    ));

    expect(screen.getByTestId("reactive-child")).toHaveTextContent("Count: 0, Size: 0x0");

    setCount(1);

    await waitFor(() => {
      expect(screen.getByTestId("reactive-child")).toHaveTextContent("Count: 1, Size: 0x0");
    });
  });

  it("preserves container styles while adding required ones", () => {
    render(() => (
      <AutoSizer
        style={{
          "background-color": "blue",
          border: "1px solid red",
          padding: "5px",
        }}
      >
        {() => <div data-testid="child">Child</div>}
      </AutoSizer>
    ));

    const container = screen.getByTestId("child").parentElement;
    expect(container).toHaveStyle({
      "background-color": "rgb(0, 0, 255)",
      border: "1px solid red",
      padding: "5px",
      width: "100%",
      height: "100%",
    });
  });

  it("works without onResize callback on mount", async () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    mockGetBoundingClientRect.mockReturnValue({
      width: 200,
      height: 150,
      top: 0,
      left: 0,
      bottom: 150,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // No onResize callback provided
    render(() => <AutoSizer>{mockChildren}</AutoSizer>);

    await waitFor(() => {
      expect(mockChildren).toHaveBeenLastCalledWith({ width: 200, height: 150 });
    });
  });

  it("works without onResize callback", async () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);

    mockGetBoundingClientRect.mockReturnValue({
      width: 200,
      height: 150,
      top: 0,
      left: 0,
      bottom: 150,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    render(() => <AutoSizer>{mockChildren}</AutoSizer>);

    await waitFor(() => {
      expect(mockChildren).toHaveBeenLastCalledWith({ width: 200, height: 150 });
    });

    // Simulate resize without onResize callback
    const mockEntry = {
      contentRect: {
        width: 300,
        height: 250,
        top: 0,
        left: 0,
        bottom: 250,
        right: 300,
        x: 0,
        y: 0,
        toJSON: () => {},
      },
      target: document.createElement("div"),
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    } as ResizeObserverEntry;

    mockResizeObserver.trigger([mockEntry]);

    await waitFor(() => {
      expect(mockChildren).toHaveBeenLastCalledWith({ width: 300, height: 250 });
    });
  });

  it("handles multiple rapid resize events", async () => {
    const mockChildren = vi.fn().mockReturnValue(<div data-testid="child">Child</div>);
    const onResize = vi.fn();

    render(() => <AutoSizer onResize={onResize}>{mockChildren}</AutoSizer>);

    // Wait for initial mount
    await waitFor(() => {
      expect(mockChildren).toHaveBeenCalled();
    });

    // Simulate multiple rapid resizes
    const sizes = [
      { width: 100, height: 100 },
      { width: 200, height: 150 },
      { width: 300, height: 200 },
      { width: 400, height: 250 },
    ];

    for (const size of sizes) {
      const mockEntry = {
        contentRect: {
          ...size,
          top: 0,
          left: 0,
          bottom: size.height,
          right: size.width,
          x: 0,
          y: 0,
          toJSON: () => {},
        },
        target: document.createElement("div"),
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as ResizeObserverEntry;

      mockResizeObserver.trigger([mockEntry]);
    }

    await waitFor(() => {
      expect(mockChildren).toHaveBeenLastCalledWith({ width: 400, height: 250 });
      expect(onResize).toHaveBeenLastCalledWith({ width: 400, height: 250 });
    });

    // Should have been called for each resize + initial mount call (5 total)
    expect(onResize).toHaveBeenCalledTimes(5);
    expect(onResize).toHaveBeenLastCalledWith({ width: 400, height: 250 });
  });
});
