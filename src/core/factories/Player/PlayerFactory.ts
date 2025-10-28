import Phaser from "phaser";

import { PhysicsComponent } from "../../components/PhysicsComponent";
import { PlayerAnimationFactory } from "./AnimationFactory";
import { CameraComponent } from "../../components/CameraComponent";
import { Entity } from "../../components/Entity";
import { PositionComponent } from "../../components/Position";
import { VelocityComponent } from "../../components/Velocity";
import { InputComponent } from "../../components/Input";

export class PlayerFactory {
  static preload(scene: Phaser.Scene) {
    PlayerAnimationFactory.loadSpritesheets(scene);
  }

  static create(scene: Phaser.Scene): Entity {
    PlayerAnimationFactory.createAnimations(scene);
    const sprite = PlayerAnimationFactory.createSprite(scene);
    sprite.body?.setSize(16, 16);
    sprite.body?.setOffset(32, 32);

    const player = new Entity();

    // Components
    const positionComponent = new PositionComponent(0, 0);
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
