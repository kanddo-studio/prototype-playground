import Phaser from "phaser";
import { Component } from "./_Component";

export class PhysicsComponent implements Component {
  body!: Phaser.Physics.Arcade.Body;

  constructor(sprite: Phaser.GameObjects.Sprite, x: number, y: number) {
    this.body = sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    sprite.setPosition(x, y);
  }
}
