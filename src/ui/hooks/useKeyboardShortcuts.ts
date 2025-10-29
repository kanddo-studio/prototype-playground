import { useEffect } from "react";

type KeyHandler = () => void;

type KeyboardShortcut = {
  key: string;
  handler: KeyHandler;
};

type KeyboardShortcutsProps = {
  shortcuts: KeyboardShortcut[];
};

export const useKeyboardShortcuts = ({ shortcuts }: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, handler }) => {
        if (event.key === key) {
          handler();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};
