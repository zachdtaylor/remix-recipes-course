import React from "react";
import { useMatches } from "remix";

export function classNames(...names: Array<string | undefined>) {
  const className = names.reduce(
    (acc, name) => (name ? `${acc} ${name}` : acc),
    ""
  );

  return className || "";
}

export function useMatchesData(id: string) {
  const matches = useMatches();
  const route = React.useMemo(
    () => matches.find((route) => route.id === id),
    [matches, id]
  );
  return route?.data;
}
