import React, { useEffect, useLayoutEffect } from "react";

export function isRunningOnServer() {
  return typeof window === "undefined";
}

export const useServerLayoutEffect = isRunningOnServer()
  ? useEffect
  : useLayoutEffect;

let hasHydrated = false;
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = React.useState(hasHydrated);

  React.useEffect(() => {
    hasHydrated = true;
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

export function useDebouncedFunction<T extends Array<any>>(
  fn: (...args: T) => unknown,
  time: number
) {
  const timeoutId = React.useRef<number>();

  const debouncedFn = (...args: T) => {
    window.clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(() => fn(...args), time);
  };

  return debouncedFn;
}
