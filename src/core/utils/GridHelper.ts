import Phaser from "phaser";

class GridHelper {
  static create(scene: Phaser.Scene, worldSize: number) {
    scene.physics.world.setBounds(0, 0, worldSize, worldSize);

    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0x444444);

    for (let y = 0; y <= worldSize; y += 64) {
      graphics.moveTo(0, y);
      graphics.lineTo(worldSize, y);
    }

    for (let x = 0; x <= worldSize; x += 64) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, worldSize);
    }

    graphics.strokePath();
  }
}

export { GridHelper };
