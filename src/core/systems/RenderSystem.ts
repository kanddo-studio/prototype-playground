import { Entity, System } from "kanji-ecs/core";

import { PositionComponent } from "kanji-ecs/components";

import { SpriteComponent } from "../components/SpriteComponent";

export class RenderSystem implements System {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const spriteComponent = entity.get<SpriteComponent>("sprite");

      if (!spriteComponent) {
        throw new Error("Error: Missing Component Dependency");
      }

      spriteComponent.sprite.x = entity.get<PositionComponent>("position").x;
      spriteComponent.sprite.y = entity.get<PositionComponent>("position").y;
    });
  }
}
