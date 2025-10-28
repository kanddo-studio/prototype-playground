import "../styles/global.css";

import Phaser from "phaser";

import { GameScene } from "./scenes/GameScene";

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  powerPreference: "high-performance",
  antialias: false,
  parent: "app",
  roundPixels: true,
  fps: {
    target: 60,
    min: 60,
    forceSetTimeOut: true,
  },
  scene: GameScene,
  input: {
    gamepad: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 0, x: 0 },
    },
  },
};

export function run() {
  return new Phaser.Game(config);
}
