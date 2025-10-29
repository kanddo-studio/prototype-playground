import { useState, useEffect } from "react";

export const useGame = () => {
  const [game, setGame] = useState<Phaser.Game | null>(null);

  useEffect(() => {
    setGame((window as any).__PHASER_GAME__ || null);
  }, []);

  return game;
};
