import { ResizeObserver as ResizeObserverPoly } from "@juggle/resize-observer";
import { createEffect, createSignal, onCleanup } from "solid-js";

type ObservedSize = {
  width: number | undefined;
  height: number | undefined;
};

type ResizeHandler = (size: ObservedSize, ref: Element) => void;

export function createResizeObserverPoly<T extends Element>(opts: {
  onResize: ResizeHandler;
  refs?: T | T[] | (() => T | T[]);
}): (arg: T) => void {
  const [otherRefs, setOtherRefs] = createSignal<T[]>([]);
  // @ts-ignore
  const refCallback = (e: T) => setOtherRefs((l: T[]) => l.concat(e));
  const previousMap = new Map<Element, ObservedSize>();
  const resizeObserver = new ResizeObserverPoly((entries) => {
    if (!Array.isArray(entries)) {
      return;
    }
    for (const entry of entries) {
      const newWidth = Math.round(entry.contentRect.width);
      const newHeight = Math.round(entry.contentRect.height);
      const previous = previousMap.get(entry.target);
      if (
        !previous ||
        previous.width !== newWidth ||
        previous.height !== newHeight
      ) {
        const newSize = { width: newWidth, height: newHeight };
        opts.onResize(newSize, entry.target);
        previousMap.set(entry.target, { width: newWidth, height: newHeight });
      }
    }
  });
  createEffect((oldRefs?: T[]) => {
    let refs: T[] = [];
    if (opts.refs) {
      const optsRefs =
        typeof opts.refs === "function" ? opts.refs() : opts.refs;
      if (Array.isArray(optsRefs)) refs = refs.concat(optsRefs);
      else refs.push(optsRefs);
    }
    refs = refs.concat(otherRefs());
    oldRefs = oldRefs || [];
    oldRefs.forEach((oldRef) => {
      if (!(oldRef in refs)) {
        resizeObserver.unobserve(oldRef);
        previousMap.delete(oldRef);
      }
    });
    refs.forEach((ref) => {
      if (!(ref in oldRefs!)) {
        resizeObserver.observe(ref);
      }
    });
    return refs;
  });
  onCleanup(() => resizeObserver.disconnect());
  return refCallback;
}
