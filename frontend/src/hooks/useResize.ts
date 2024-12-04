import { DependencyList, RefObject, useEffect } from "react";

export default function useResize(
  ref: RefObject<HTMLElement>,
  handle: () => void,
  dependencies?: DependencyList,
) {
  useEffect(() => {
    if (!ref.current) return;

    const observe = new ResizeObserver(handle);
    observe.observe(ref.current);

    return () => {
      observe.disconnect();
    };
  }, dependencies);
}
