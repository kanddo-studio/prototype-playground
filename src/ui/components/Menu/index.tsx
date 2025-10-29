import React, { useEffect, useRef, useState } from "react";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { KEYS } from "../../../types/keys.enum";
import { useGamepadButtons } from "../../hooks/useGamepadButtons";
import { useGamepadAxis } from "../../hooks/useGamepadAxis";

import {
  Overlay,
  Card,
  Title,
  Buttons,
  ActionButton,
  HelperText,
} from "./index.styles";
import { GAMEPAD_BUTTONS } from "../../../types/gamepad.const";

type Props = {
  isPaused: boolean;
  handleResume: () => void;
  handlePause: () => void;
  handleExit?: () => void;
};

/**
 * Pause menu with support for:
 * - Keyboard navigation (ArrowUp / ArrowDown / Enter / Esc)
 * - Gamepad D-Pad and buttons (12/13/0/9)
 * - Analog vertical axis (left stick axis index 1)
 *
 * Accessibility:
 * - role="dialog" and aria-modal provided at overlay usage site in scene integration.
 *
 * Design:
 * - Visual state is managed with selectedIndex local state.
 * - Input debounce used to prevent double triggers from multiple sources.
 */
export const Menu: React.FC<Props> = ({
  isPaused,
  handleResume,
  handlePause,
  handleExit,
}) => {
  // 0 => Resume, 1 => Exit
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // short debounce to avoid double-firing across input sources (D-Pad + stick)
  const lastInputAtRef = useRef<number>(0);
  const INPUT_DEBOUNCE_MS = 80;

  const now = () => performance.now();

  const acceptInput = (): boolean => {
    const t = now();
    if (t - lastInputAtRef.current < INPUT_DEBOUNCE_MS) return false;
    lastInputAtRef.current = t;
    return true;
  };

  // Toggle pause with Esc (keyboard)
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: KEYS.ESC,
        handler: () => {
          isPaused ? handleResume() : handlePause();
        },
      },
    ],
  });

  // Keyboard navigation (arrow keys and enter)
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: KEYS.UP,
        handler: () => {
          if (!acceptInput()) return;
          setSelectedIndex((prev) => (prev === 0 ? 1 : prev - 1));
        },
      },
      {
        key: KEYS.DOWN,
        handler: () => {
          if (!acceptInput()) return;
          setSelectedIndex((prev) => (prev === 1 ? 0 : prev + 1));
        },
      },
      {
        key: "Enter",
        handler: () => {
          if (!acceptInput()) return;
          confirmSelection(selectedIndex);
        },
      },
    ],
  });

  // Gamepad buttons handling (D-Pad, A, Start)
  useGamepadButtons({
    buttons: [
      GAMEPAD_BUTTONS.DPAD_UP,
      GAMEPAD_BUTTONS.DPAD_DOWN,
      GAMEPAD_BUTTONS.A,
      GAMEPAD_BUTTONS.START,
    ],
    handler: (index) => {
      if (!acceptInput()) return;

      switch (index) {
        case GAMEPAD_BUTTONS.DPAD_UP: 
          setSelectedIndex((prev) => (prev === 0 ? 1 : prev - 1));
          break;
        case GAMEPAD_BUTTONS.DPAD_DOWN:
          setSelectedIndex((prev) => (prev === 1 ? 0 : prev + 1));
          break;
        case GAMEPAD_BUTTONS.A:
          confirmSelection(selectedIndex);
          break;
        case GAMEPAD_BUTTONS.START:
          isPaused ? handleResume() : handlePause();
          break;
        default:
          break;
      }
    },
  });

  // Analog vertical axis (left stick axis index 1)
  useGamepadAxis({
    axisIndex: 1,
    deadzone: 0.5,
    initialDelayMs: 840,
    repeatDelayMs: 220,
    handler: (dir) => {
      if (!acceptInput()) return;
      if (dir === "up") {
        setSelectedIndex((prev) => (prev === 0 ? 1 : prev - 1));
      } else {
        setSelectedIndex((prev) => (prev === 1 ? 0 : prev + 1));
      }
    },
  });

  // reset selection when opening
  useEffect(() => {
    if (isPaused) setSelectedIndex(0);
  }, [isPaused]);

  /**
   * Execute the action for the selected index.
   * 0 => Resume
   * 1 => Exit (calls handleExit if provided, otherwise resumes)
   */
  function confirmSelection(idx: number) {
    if (idx === 0) {
      handleResume();
    } else if (idx === 1) {
      if (handleExit) handleExit();
      else handleResume();
    }
  }

  if (!isPaused) return null;

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="Pause menu">
      <Card>
        <Title>PAUSADO</Title>

        <Buttons>
          <ActionButton
            selected={selectedIndex === 0}
            onClick={() => {
              if (!acceptInput()) return;
              confirmSelection(0);
            }}
            aria-pressed={selectedIndex === 0}
          >
            Despausar
          </ActionButton>

          <ActionButton
            selected={selectedIndex === 1}
            onClick={() => {
              if (!acceptInput()) return;
              confirmSelection(1);
            }}
            aria-pressed={selectedIndex === 1}
          >
            Sair
          </ActionButton>
        </Buttons>

        <HelperText>A or Enter to confirm —Esc / Start to close</HelperText>
      </Card>
    </Overlay>
  );
};
