import { useEffect, useRef } from "react";

type AxisDirection = "up" | "down" | "idle";

/**
 * Handler called when a directional event is emitted from the axis.
 * @param dir - 'up' or 'down'
 */
type AxisHandler = (dir: Exclude<AxisDirection, "idle">) => void;

type UseGamepadAxisProps = {
  axisIndex: number; // index of the axis to read (vertical axis is commonly 1 for left stick)
  handler: AxisHandler;
  deadzone?: number; // absolute threshold to consider axis active (0..1)
  initialDelayMs?: number; // delay before repeating while holding (ms)
  repeatDelayMs?: number; // delay between repeats after initialDelay (ms)
};

/**
 * Read a single gamepad axis and translate its vertical movement into discrete "up" / "down" events.
 *
 * Behavior:
 * - Applies a deadzone to avoid noise.
 * - Emits one immediate event on axis edge (idle -> up/down).
 * - When holding, waits initialDelayMs then emits repeated events every repeatDelayMs.
 *
 * Design choices:
 * - Uses requestAnimationFrame for smooth polling.
 * - Keeps internal state in refs to avoid re-registering raf loop on every render.
 * - Configurable delays to adapt to UX requirements.
 */
export const useGamepadAxis = ({
  axisIndex,
  handler,
  deadzone = 0.5,
  initialDelayMs = 400,
  repeatDelayMs = 120,
}: UseGamepadAxisProps): void => {
  const rafRef = useRef<number | null>(null);
  const connectedRef = useRef<boolean>(false);

  // lastDirection: -1 (up), 0 (idle), 1 (down)
  const lastDirectionRef = useRef<number>(0);
  const holdingRef = useRef<boolean>(false);

  useEffect(() => {
    const onConnect = () => {
      connectedRef.current = true;
    };
    const onDisconnect = () => {
      connectedRef.current = false;
      // reset state
      lastDirectionRef.current = 0;
      holdingRef.current = false;
    };

    window.addEventListener("gamepadconnected", onConnect);
    window.addEventListener("gamepaddisconnected", onDisconnect);

    const gps = navigator.getGamepads();
    if (gps && gps[0]) {
      connectedRef.current = true;
    }

    return () => {
      window.removeEventListener("gamepadconnected", onConnect);
      window.removeEventListener("gamepaddisconnected", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const nextTriggerTimeRef = { current: 0 };

    const loop = () => {
      const gamepads = navigator.getGamepads?.() ?? [];
      const gp = gamepads[0];
      const now = performance.now();

      if (gp && gp.axes.length > axisIndex) {
        const raw = gp.axes[axisIndex];
        const dir = raw <= -deadzone ? -1 : raw >= deadzone ? 1 : 0;

        // New direction pressed (idle -> dir)
        if (dir !== 0 && lastDirectionRef.current === 0) {
          handler(dir === -1 ? "up" : "down");
          lastDirectionRef.current = dir;
          // schedule next repeating trigger
          nextTriggerTimeRef.current = now + initialDelayMs;
        } else if (dir !== 0 && lastDirectionRef.current === dir) {
          // still holding same direction: maybe trigger repeat
          if (now >= nextTriggerTimeRef.current) {
            handler(dir === -1 ? "up" : "down");
            nextTriggerTimeRef.current = now + repeatDelayMs;
          }
        } else if (dir !== 0 && lastDirectionRef.current !== dir) {
          // changed direction without passing through idle (e.g., up -> down)
          handler(dir === -1 ? "up" : "down");
          lastDirectionRef.current = dir;
          nextTriggerTimeRef.current = now + initialDelayMs;
        } else if (dir === 0) {
          // idle
          lastDirectionRef.current = 0;
          nextTriggerTimeRef.current = 0;
        }
      } else {
        // no gamepad: reset
        lastDirectionRef.current = 0;
        nextTriggerTimeRef.current = 0;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [axisIndex, handler, deadzone, initialDelayMs, repeatDelayMs]);
};
