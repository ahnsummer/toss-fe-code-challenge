import {
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { OverlayContext } from "./OverlayContext";
import { nanoid } from "nanoid";

export function useOverlay() {
  const { overlays, add, remove } = useContext(OverlayContext);
  const resolvers = useRef<Record<string, () => void>>({});

  const close = useCallback(
    (id: string) => {
      resolvers.current[id]();
      delete resolvers.current[id];

      remove(id);
    },
    [resolvers, remove]
  );

  const open = useCallback(
    (controller: ({ close }: { close: () => void }) => ReactElement) => {
      const id = nanoid();
      let resolver: () => void = () => {};

      const promise = new Promise<void>((resolve) => {
        resolver = resolve;
      });

      resolvers.current[id] = resolver;

      add(
        id,
        controller({
          close: () => {
            resolver();
            close(id);
          },
        })
      );

      return promise;
    },
    [resolvers, overlays, add, close]
  );

  return {
    open,
    close,
  };
}
