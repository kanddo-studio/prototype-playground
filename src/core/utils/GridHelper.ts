import Phaser from "phaser";

class GridHelper {
  static create(scene: Phaser.Scene, width: number, height: number) {
    scene.physics.world.setBounds(0, 0, width, height);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0x444444);

    for (let y = 0; y <= height; y += 64) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }

    for (let x = 0; x <= width; x += 64) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }

    graphics.strokePath();
  }
}

export { GridHelper };
