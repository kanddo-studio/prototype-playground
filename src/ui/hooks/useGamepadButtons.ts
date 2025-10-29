import { useEffect, useRef, useState } from "react";

type GamepadButtonHandler = (buttonIndex: number) => void;

type GamepadShortcutsProps = {
  buttons: number[];
  handler: GamepadButtonHandler;
};

export const useGamepadButtons = ({
  buttons,
  handler,
}: GamepadShortcutsProps) => {
  const rafRef = useRef<number | null>(null);
  const [connected, setConnected] = useState(false);
  const pressedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    window.addEventListener("gamepadconnected", handleConnect);
    window.addEventListener("gamepaddisconnected", handleDisconnect);

    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!connected) return;

    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0];
      if (gp) {
        gp.buttons.forEach((btn, index) => {
          if (!buttons.includes(index)) return;

          const wasPressed = pressedRef.current.has(index);
          if (btn.pressed) {
            if (!wasPressed) {
              handler(index);
              pressedRef.current.add(index);
            }
          } else {
            pressedRef.current.delete(index);
          }
        });
      }
      rafRef.current = requestAnimationFrame(checkGamepad);
    };

    rafRef.current = requestAnimationFrame(checkGamepad);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [connected, buttons, handler]);
};
