import { createContext, Fragment, useCallback, useState, type ReactElement, type ReactNode } from "react";
import { OverlayLayer } from "./OverlayLayer";

const noop = () => {};

export const OverlayContext = createContext<{
  overlays: Record<string, ReactElement>;
  add: (id: string, overlay: ReactElement) => void;
  remove: (id: string) => void;
}>({
  overlays: {},
  add: noop,
  remove: noop
});

type OverlayProviderProps = {
  children: ReactNode;
}

export function OverlayProvider({ children }: OverlayProviderProps) {
  const [overlays, setOverlays] = useState<Record<string, ReactElement>>({});

  const add = useCallback((id: string, overlay: ReactElement) => {
    setOverlays(existOverlays => ({ ...existOverlays, [id]: overlay }));
  }, [])

  const remove = useCallback((id: string) => {
    setOverlays(existOverlays => {
      const { [id]: _, ...rest } = existOverlays;
      return rest;
    });
  }, []);

  return (
    <OverlayContext.Provider value={{
      overlays,
      add,
      remove
    }}>
      {children}
      {Object.entries(overlays).length > 0 && <OverlayLayer>
        {Object.entries(overlays).map(([id, overlay]) => (
          <Fragment key={id}>
            {overlay}
          </Fragment>
        ))}
      </OverlayLayer>}
    </OverlayContext.Provider>
  )
}