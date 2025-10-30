import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Draggable Floating Action Button that snaps to the nearest screen edge
// Tailwind v4-friendly (no tailwind.config edits). Works with mouse & touch.
// Drop into any Next.js/React app. No external libs.
//
// HYDRATION-SAFE: On the server we DO NOT read window size. When not dragging,
// we render using edge-anchored styles (top/left/right/bottom) so SSR and CSR match.

export type Edge = "left" | "right" | "top" | "bottom";

interface DraggableFabProps {
  size?: number; // px, width & height (default 56 like Material FAB)
  edgePadding?: number; // px distance from edges when snapped
  snapDurationMs?: number; // ms transition when snapping
  initialEdge?: Edge; // starting edge
  initialOffset?: number; // starting offset along that edge (px)
  rememberKey?: string | null; // localStorage key; if provided, position persists
  className?: string; // extra classes for the button wrapper
  onClick?: () => void;
  children?: React.ReactNode; // icon/content inside the FAB
}


export default function DraggableSnapFab({
  size = 56,
  edgePadding = 16,
  snapDurationMs = 220,
  initialEdge = "right",
  initialOffset = 120,
  rememberKey = "draggable-fab",
  className = "",
  onClick,
  children,
}: DraggableFabProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const [dragPos, setDragPos] = useState({ x: 0, y: 0 }); // used only while dragging
  const [snappedEdge, setSnappedEdge] = useState<Edge>(initialEdge);
  const [edgeOffset, setEdgeOffset] = useState<number>(initialOffset);
  const [snapping, setSnapping] = useState(false); // toggles transition on release

  // Hydrate from localStorage (if enabled) after first paint
  useEffect(() => {
    if (!rememberKey) return;
    try {
      const raw = localStorage.getItem(rememberKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { edge: Edge; offset: number };
        if (parsed && parsed.edge && Number.isFinite(parsed.offset)) {
          setSnappedEdge(parsed.edge);
          setEdgeOffset(parsed.offset);
        }
      }
    } catch {}
  }, [rememberKey]);

  // Persist to localStorage on change
  useEffect(() => {
    if (!rememberKey) return;
    try {
      localStorage.setItem(
        rememberKey,
        JSON.stringify({ edge: snappedEdge, offset: edgeOffset })
      );
    } catch {}
  }, [snappedEdge, edgeOffset, rememberKey]);

  // Ensure offset remains in viewport bounds on resize/orientation change
  useEffect(() => {
    const handler = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxX = Math.max(edgePadding, vw - size - edgePadding);
      const maxY = Math.max(edgePadding, vh - size - edgePadding);
      if (snappedEdge === "left" || snappedEdge === "right") {
        setEdgeOffset((p) => clamp(p, edgePadding, maxY));
      } else {
        setEdgeOffset((p) => clamp(p, edgePadding, maxX));
      }
    };
    window.addEventListener("resize", handler, { passive: true });
    window.addEventListener("orientationchange", handler, { passive: true });
    handler();
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, [snappedEdge, size, edgePadding]);

  // Pointer handlers
  const onPointerDown = (e: React.PointerEvent) => {
    if (!wrapperRef.current) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    setSnapping(false);

    startPointerRef.current = { x: e.clientX, y: e.clientY };

    // Convert current anchored position into absolute top/left for a smooth pickup
    const { x, y } = computeAbsoluteFromEdge(snappedEdge, edgeOffset, size, edgePadding);
    startPosRef.current = { x, y };
    setDragPos({ x, y });

    (e as any).preventDefault?.();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startPointerRef.current.x;
    const dy = e.clientY - startPointerRef.current.y;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const nextX = clamp(startPosRef.current.x + dx, 0, vw - size);
    const nextY = clamp(startPosRef.current.y + dy, 0, vh - size);
    setDragPos({ x: nextX, y: nextY });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { x, y } = dragPos;

    // Distances to each edge
    const distLeft = x;
    const distRight = vw - (x + size);
    const distTop = y;
    const distBottom = vh - (y + size);

    // Pick nearest edge
    const min = Math.min(distLeft, distRight, distTop, distBottom);
    let edge: Edge = snappedEdge;
    if (min === distLeft) edge = "left";
    else if (min === distRight) edge = "right";
    else if (min === distTop) edge = "top";
    else edge = "bottom";

    // Compute offset along that edge
    const clampedY = clamp(y, edgePadding, vh - size - edgePadding);
    const clampedX = clamp(x, edgePadding, vw - size - edgePadding);

    const offset = edge === "left" || edge === "right" ? clampedY : clampedX;

    setSnappedEdge(edge);
    setEdgeOffset(offset);

    // Trigger snapping transition
    setSnapping(true);
    // Remove transition flag after duration to avoid interfering with future drags
    window.setTimeout(() => setSnapping(false), snapDurationMs);
  };

  // Compute styles: if dragging -> absolute (top/left from dragPos), else -> snapped positions
  const style = (() => {
    // DRAGGING: use absolute top/left (in px) so pointer movement feels natural
    if (draggingRef.current) {
      return {
        top: dragPos.y + "px",
        left: dragPos.x + "px",
        right: undefined,
        bottom: undefined,
        width: size + "px",
        height: size + "px",
        transition: "none",
      } as React.CSSProperties;
    }

    // NOT DRAGGING (SSR-safe): anchor to the chosen edge without needing window dims
    const base: React.CSSProperties = {
      width: size + "px",
      height: size + "px",
      transition: snapping
        ? `top ${snapDurationMs}ms ease, left ${snapDurationMs}ms ease, right ${snapDurationMs}ms ease, bottom ${snapDurationMs}ms ease`
        : "none",
    };

    if (snappedEdge === "left") {
      return { ...base, left: edgePadding, top: edgeOffset, right: undefined, bottom: undefined };
    }
    if (snappedEdge === "right") {
      return { ...base, right: edgePadding, top: edgeOffset, left: undefined, bottom: undefined };
    }
    if (snappedEdge === "top") {
      return { ...base, top: edgePadding, left: edgeOffset, right: undefined, bottom: undefined };
    }
    // bottom
    return { ...base, bottom: edgePadding, left: edgeOffset, right: undefined, top: undefined };
  })();

  return (
    <div
      ref={wrapperRef}
      className={[
        "fixed z-50 select-none", // layer & no text selection while dragging
        "touch-none", // helpful on mobile while dragging
        "rounded-full shadow-lg", // FAB feel
        "bg-black text-white", // default look; override via className
        "flex items-center justify-center",
        "active:scale-[0.98]", // tiny press feedback
        className,
      ].join(" ")}
      style={style}
      role="button"
      aria-label="Floating Action Button"
      onClick={(e) => {
        // Ignore click if user was dragging (movement threshold handled implicitly)
        if (!draggingRef.current) onClick?.();
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children ?? (
        // Default plus icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
          aria-hidden
        >
          <path d="M11 11V5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6z" />
        </svg>
      )}
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeAbsoluteFromEdge(edge: Edge, offset: number, size: number, pad: number) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const maxX = Math.max(pad, vw - size - pad);
  const maxY = Math.max(pad, vh - size - pad);

  if (edge === "left") return { x: pad, y: clamp(offset, pad, maxY) };
  if (edge === "right") return { x: vw - size - pad, y: clamp(offset, pad, maxY) };
  if (edge === "top") return { x: clamp(offset, pad, maxX), y: pad };
  // bottom
  return { x: clamp(offset, pad, maxX), y: vh - size - pad };
}
