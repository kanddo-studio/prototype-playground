import Phaser from "phaser";

interface AnimationConfig {
  key: string;
  spritesheet: string;
  start: number;
  end: number;
}

export class PlayerAnimationFactory {
  private static readonly SPRITESHEETS = [
    { key: "player-idle", path: "assets/images/game/player/idle.png" },
    { key: "player-walk", path: "assets/images/game/player/walk.png" },
  ];

  private static readonly ANIMATIONS: AnimationConfig[] = [
    { key: "idle", spritesheet: "player-idle", start: 0, end: 3 },
    { key: "idle-down", spritesheet: "player-idle", start: 4, end: 7 },
    { key: "idle-up", spritesheet: "player-idle", start: 8, end: 11 },
    { key: "walk", spritesheet: "player-walk", start: 0, end: 7 },
    { key: "walk-down", spritesheet: "player-walk", start: 8, end: 15 },
    { key: "walk-up", spritesheet: "player-walk", start: 16, end: 24 },
  ];

  static loadSpritesheets(scene: Phaser.Scene) {
    this.SPRITESHEETS.forEach(({ key, path }) => {
      scene.load.spritesheet(key, path, {
        frameWidth: 80,
        frameHeight: 80,
      });
    });
  }

  static createAnimations(scene: Phaser.Scene) {
    this.ANIMATIONS.forEach(({ key, spritesheet, start, end }) => {
      scene.anims.create({
        key,
        frames: scene.anims.generateFrameNumbers(spritesheet, { start, end }),
        frameRate: 8,
        repeat: -1,
      });
    });
  }

  static createSprite(scene: Phaser.Scene): Phaser.Physics.Arcade.Sprite {
    const sprite = scene.physics.add.sprite(0, 0, "player-idle", 0);
    sprite.setScale(4);
    sprite.body.setSize(16, 16);
    sprite.body.setOffset(32, 32);
    sprite.anims.play("idle");
    return sprite;
  }
}
