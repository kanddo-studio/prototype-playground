import React from "react";
import { EventBus } from "../event/EventBus";
import { PlayerStatus } from "./PlayerStatus";

/**
 * HUD component rendered outside Phaser canvas (overlay).
 * Subscribes to game updates and emits HUD actions.
 */
export const HUD: React.FC = () => {
  const [health, setHealth] = React.useState<number>(0);
  const [score, setScore] = React.useState<number>(0);

  React.useEffect(() => {
    function handleUpdate(payload: { health: number; score: number }): void {
      setHealth(payload.health);
      setScore(payload.score);
    }

    EventBus.on("game:updateStats", handleUpdate);
    return () => {
      EventBus.off("game:updateStats", handleUpdate);
    };
  }, []);

  return (
    <div role="region" aria-label="hud">
      <PlayerStatus health={health} score={score} />
    </div>
  );
};
