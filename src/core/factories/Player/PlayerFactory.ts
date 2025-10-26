import Phaser from "phaser";
import { Entity } from "kanji-ecs/core";
import {
  PositionComponent,
  VelocityComponent,
  InputComponent,
} from "kanji-ecs/components";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { PlayerAnimationFactory } from "./AnimationFactory";
import { CameraComponent } from "../../components/CameraComponent";

export class PlayerFactory {
  static preload(scene: Phaser.Scene) {
    PlayerAnimationFactory.loadSpritesheets(scene);
  }

  static create(scene: Phaser.Scene): Entity {
    PlayerAnimationFactory.createAnimations(scene);
    const sprite = PlayerAnimationFactory.createSprite(scene);

    const player = new Entity();

    // Components
    const positionComponent = new PositionComponent(200, 200);
    const velocityComponent = new VelocityComponent(400);
    const inputComponent = new InputComponent();
    const cameraComponent = new CameraComponent();
    const physicsComponent = new PhysicsComponent(
      sprite,
      positionComponent.x,
      positionComponent.y,
    );

    // Add Components to Player
    player.add("velocity", velocityComponent);
    player.add("position", positionComponent);
    player.add("input", inputComponent);
    player.add("camera", cameraComponent);
    player.add("physics", physicsComponent);

    return player;
  }
}
