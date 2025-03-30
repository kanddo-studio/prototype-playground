import { Component } from "kanji-ecs/core";

export class SpriteComponent implements Component {
  constructor(public sprite: Phaser.GameObjects.Sprite) {}
}
