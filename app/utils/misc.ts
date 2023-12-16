import { SerializeFrom } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import React from "react";

export function useMatchesData<T>(id: string) {
  const matches = useMatches();
  const route = React.useMemo(
    () => matches.find((route) => route.id === id),
    [matches, id]
  );
  return route?.data as SerializeFrom<T> | undefined;
}
