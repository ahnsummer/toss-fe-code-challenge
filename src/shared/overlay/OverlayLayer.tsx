import type { ReactNode } from "react";

const OVERLAY_LAYER = "overlay-layer";

type OverlayLayerProps = {
  children: ReactNode;
}

export function OverlayLayer({ children }: OverlayLayerProps) {
  return <div className="fixed top-0 inset-0">
    {children}
  </div>
}

OverlayLayer.id = OVERLAY_LAYER;