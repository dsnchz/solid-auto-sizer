import { createSignal, type JSX, mergeProps, onCleanup, onMount } from "solid-js";

type Size = {
  readonly width: number;
  readonly height: number;
};

/**
 * The props for the AutoSizer component.
 */
type AutoSizerProps = {
  /** Optional CSS class for the container */
  readonly class?: string;
  /** Optional inline styles for the container */
  readonly style?: Omit<JSX.CSSProperties, "width" | "height">;
  /** Default width for initial render */
  readonly initialWidth?: number;
  /** Default height for initial render */
  readonly initialHeight?: number;
  /** Callback when size changes */
  readonly onResize?: (size: Size) => void;
  /** Render prop that receives the measured dimensions */
  readonly children: (size: Size) => JSX.Element;
};

/**
 * AutoSizer component that measures its container and provides dimensions to children.
 *
 * Similar to [react-virtualized-auto-sizer](https://github.com/bvaughn/react-virtualized-auto-sizer), this component uses ResizeObserver to
 * monitor its container size and re-renders children with updated dimensions.
 *
 * @example
 * ```tsx
 * // Standard usage - provides both width and height
 * <AutoSizer>
 *   {({ width, height }) => (
 *     <SolidUplot width={width} height={height} data={data} />
 *   )}
 * </AutoSizer>
 *
 * // Setting initial size
 * <AutoSizer initialWidth={400} initialHeight={300}>
 *   {({ width, height }) => (
 *     <SolidUplot width={width} height={height} data={data} />
 *   )}
 * </AutoSizer>
 * ```
 */
export const AutoSizer = (props: AutoSizerProps): JSX.Element => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      initialWidth: 0,
      initialHeight: 0,
    },
    props,
  );

  const [size, setSize] = createSignal({
    width: _props.initialWidth,
    height: _props.initialHeight,
  });

  onMount(() => {
    const containerRect = container.getBoundingClientRect();

    const containerSize = {
      width: Math.floor(containerRect.width),
      height: Math.floor(containerRect.height),
    };

    if (containerSize.width !== size().width || containerSize.height !== size().height) {
      setSize(containerSize);
      _props.onResize?.(containerSize);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      const newSize = {
        width: Math.floor(width),
        height: Math.floor(height),
      };

      setSize(newSize);
      _props.onResize?.(newSize);
    });

    resizeObserver.observe(container);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  return (
    <div
      ref={container}
      class={_props.class}
      style={{
        width: "100%",
        height: "100%",
        ..._props.style,
      }}
    >
      {_props.children(size())}
    </div>
  );
};
