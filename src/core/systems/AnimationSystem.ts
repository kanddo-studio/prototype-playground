import { Entity } from "../components/Entity";
import { InputComponent } from "../components/Input";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { System } from "../components/System";


export class AnimationSystem implements System {
  private lastDirection: string = "right";

  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const physicsComponent = entity.get<PhysicsComponent>("physics");
      const inputComponent = entity.get<InputComponent>("input");

      if (!physicsComponent || !inputComponent) {
        throw new Error("Error: Missing Component");
      }

      const gameObject = physicsComponent.body.gameObject;
      const sprite = gameObject as Phaser.Physics.Arcade.Sprite;

      if (inputComponent.keys.has("ArrowRight")) {
        this.lastDirection = "right";
        sprite.setFlipX(false);
        sprite.anims.play("walk", true);
      } else if (inputComponent.keys.has("ArrowLeft")) {
        this.lastDirection = "left";
        sprite.setFlipX(true);
        sprite.anims.play("walk", true);
      } else if (inputComponent.keys.has("ArrowUp")) {
        this.lastDirection = "up";
        sprite.anims.play("walk-up", true);
      } else if (inputComponent.keys.has("ArrowDown")) {
        this.lastDirection = "down";
        sprite.anims.play("walk-down", true);
      } else {
        if (this.lastDirection === "up") {
          sprite.anims.play("idle-up", true);
        } else if (this.lastDirection === "down") {
          sprite.anims.play("idle-down", true);
        } else {
          sprite.anims.play("idle", true);
        }
      }
    });
  }
}
