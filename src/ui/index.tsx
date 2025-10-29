import React, { useState } from "react";
import { EventBus } from "../event/EventBus";
import { PlayerStatus } from "./components/PlayerStatus";
import { Menu } from "./components/Menu";
import { useGame } from "./hooks/useGame";
import { SCENES } from "../types/scenes.enum";

/**
 * HUD component rendered outside Phaser canvas (overlay).
 * Subscribes to game updates and emits HUD actions.
 */
export const HUD: React.FC = () => {
  const game = useGame();
  const [stats, setStats] = React.useState({ health: 100, score: 0 });
  const [isPaused, setIsPaused] = useState(false);

  function handleUpdateStats(payload: { health: number; score: number }): void {
    setStats({ health: payload.health, score: payload.score });
  }

  React.useEffect(() => {
    EventBus.on("hud:stats", handleUpdateStats);
    return () => {
      EventBus.off("hud:stats", handleUpdateStats);
    };
  }, []);

  return (
    <div
      role="region"
      aria-label="hud"
      style={{
        color: "white",
        padding: "8px 10px",
        borderRadius: 6,
      }}
    >
      <PlayerStatus health={stats.health} score={stats.score} />
      <Menu
        isPaused={isPaused}
        handleResume={() => {
          setIsPaused(false);
          game?.scene.resume(SCENES.PLAYGROUND);
        }}
        handlePause={() => {
          setIsPaused(true);
          game?.scene.pause(SCENES.PLAYGROUND);
        }}
      />
    </div>
  );
};
