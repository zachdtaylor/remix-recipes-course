import { SerializeFrom } from "@remix-run/node";
import { useLocation, useMatches } from "@remix-run/react";
import React, { useEffect, useLayoutEffect } from "react";

export function useMatchesData<T>(id: string) {
  const matches = useMatches();
  const route = React.useMemo(
    () => matches.find((route) => route.id === id),
    [matches, id]
  );
  return route?.data as SerializeFrom<T> | undefined;
}

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

export function useBuildSearchParams() {
  const location = useLocation();

  return (name: string, value: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(name, value);

    return `?${searchParams.toString()}`;
  };
}
