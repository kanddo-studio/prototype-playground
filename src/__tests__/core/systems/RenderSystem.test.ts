import Phaser from "phaser";

import { PositionComponent } from "kanji-ecs/components";
import { Entity } from "kanji-ecs/core";

import { RenderSystem } from "../../../core/systems/RenderSystem";
import { SpriteComponent } from "../../../core/components/SpriteComponent";

describe("RenderSystem", () => {
  let renderSystem: RenderSystem;
  let mockEntity: Entity;
  let mockPositionComponent: PositionComponent;
  let mockSpriteComponent: SpriteComponent;

  beforeEach(() => {
    renderSystem = new RenderSystem();
    mockEntity = new Entity();

    mockPositionComponent = new PositionComponent(100, 150);
    const mockSprite = new Phaser.GameObjects.Sprite(
      new Phaser.Scene(),
      0,
      0,
      "test",
    );
    mockSpriteComponent = new SpriteComponent(mockSprite);

    mockEntity.add("position", mockPositionComponent);
    mockEntity.add("sprite", mockSpriteComponent);
  });

  it("should update sprite position based on PositionComponent", () => {
    renderSystem.update([mockEntity]);

    expect(mockSpriteComponent.sprite.x).toBe(100);
    expect(mockSpriteComponent.sprite.y).toBe(150);
  });

  it("should throw error if sprite component is missing", () => {
    const newMockEntity = new Entity();
    newMockEntity.add("position", mockPositionComponent);

    expect(() => renderSystem.update([newMockEntity])).toThrow(
      "Error: Missing Component Dependency",
    );
  });

  it("should throw error if position component is missing", () => {
    const newMockEntity = new Entity();
    newMockEntity.add("sprite", mockSpriteComponent);

    expect(() => renderSystem.update([newMockEntity])).toThrow();
  });
});
