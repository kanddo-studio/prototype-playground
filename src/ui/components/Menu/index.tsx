import React from "react";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { KEYS } from "../../../types/keys.enum";
import { useGamepadButtons } from "../../hooks/useGamepadButtons";

type Props = {
  isPaused: boolean;
  handleResume: () => void;
  handlePause: () => void;
};

export const Menu: React.FC<Props> = ({
  isPaused,
  handleResume,
  handlePause,
}) => {
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

  useGamepadButtons({
    buttons: [9],
    handler: () => {
      isPaused ? handleResume() : handlePause();
    },
  });

  if (!isPaused) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "#333",
        }}
      >
        <h1>PAUSADO</h1>
        <button
          onClick={handleResume}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            border: "none",
            borderRadius: "4px",
            color: "white",
          }}
        >
          Despausar
        </button>
      </div>
    </div>
  );
};
