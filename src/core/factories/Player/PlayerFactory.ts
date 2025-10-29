import Phaser from "phaser";

import { Entity } from "../../components/_/_Entity";

import { PhysicsComponent } from "../../components/PhysicsComponent";
import { PlayerAnimationFactory } from "./PlayerAnimationFactory";
import { CameraComponent } from "../../components/CameraComponent";
import { VelocityComponent } from "../../components/Velocity/VelocityComponent";
import { InputComponent } from "../../components/Device/InputComponent";
import { DesiredVelocityComponent } from "../../components/Velocity/DesiredVelocityComponent";
import { MouseWheelComponent } from "../../components/Device/MouseWheelComponent";
import { MouseDragComponent } from "../../components/Device/MouseDragComponent";
import { RightStickComponent } from "../../components/Device/RightStickComponent";
import { LeftStickComponent } from "../../components/Device/LeftStickComponent";

/**
 * Factory class responsible for creating and initializing the player entity
 * with all necessary components and animations.
 */
export class PlayerFactory {
  /**
   * Preloads all assets required for the player, such as spritesheets.
   * @param scene - The Phaser scene where assets will be loaded.
   */
  static preload(scene: Phaser.Scene): void {
    PlayerAnimationFactory.loadSpritesheets(scene);
  }

  /**
   * Creates a new player entity with all components properly initialized.
   * @param scene - The Phaser scene where the player will be created.
   * @returns The fully constructed player entity.
   */
  static create(scene: Phaser.Scene): Entity {
    // Create animations and sprite for the player
    PlayerAnimationFactory.createAnimations(scene);
    const sprite = PlayerAnimationFactory.createSprite(scene);
    const body = sprite.body as Phaser.Physics.Arcade.Body;

    // Configure the physics body size and offset for accurate collision
    body?.setSize(16, 16);
    body?.setOffset(32, 32);

    // Instantiate the player entity with a unique ID
    const player = new Entity("player");

    // Initialize components with default or configured values
    const velocityComponent = new VelocityComponent(400);
    const desiredVelocityComponent = new DesiredVelocityComponent();
    const inputComponent = new InputComponent();
    const leftStickComponent = new LeftStickComponent();
    const rightStickComponent = new RightStickComponent();
    const mouseDragComponent = new MouseDragComponent();
    const mouseWheelComponent = new MouseWheelComponent();
    const cameraComponent = new CameraComponent({ target: sprite });
    const physicsComponent = new PhysicsComponent(body, sprite, {
      x: 100,
      y: 200,
    });

    physicsComponent.setPosition(400, 300);

    // Add components to the player entity with consistent keys
    player.add("velocity", velocityComponent);
    player.add("desiredVelocity", desiredVelocityComponent);
    player.add("input", inputComponent);
    player.add("leftStick", leftStickComponent);
    player.add("rightStick", rightStickComponent);
    player.add("mouseWheel", mouseWheelComponent);
    player.add("mouseDrag", mouseDragComponent);
    player.add("camera", cameraComponent);
    player.add("physics", physicsComponent);

    return player;
  }
}
