import { InputComponent, VelocityComponent } from "kanji-ecs";
import { Entity, System } from "kanji-ecs/core";
import { PhysicsComponent } from "../components/PhysicsComponent";

export class PhysicsSystem implements System {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const inputComponent = entity.get<InputComponent>("input");
      const velocityComponent = entity.get<VelocityComponent>("velocity");
      const physicsComponent = entity.get<PhysicsComponent>("physics");

      if (!inputComponent || !velocityComponent || !physicsComponent) {
        throw new Error("Error: Missing Component Dependency");
      }

      const body = physicsComponent.body;
      let velocityX = 0;
      let velocityY = 0;

      if (inputComponent.keys.has("ArrowLeft")) {
        velocityX = -velocityComponent.speed;
      } else if (inputComponent.keys.has("ArrowRight")) {
        velocityX = velocityComponent.speed;
      }

      if (inputComponent.keys.has("ArrowUp")) {
        velocityY = -velocityComponent.speed;
      } else if (inputComponent.keys.has("ArrowDown")) {
        velocityY = velocityComponent.speed;
      }

      if (velocityX !== 0 && velocityY !== 0) {
        velocityX *= Math.SQRT1_2;
        velocityY *= Math.SQRT1_2;
      }

      body.setVelocity(velocityX, velocityY);
    });
  }
}
