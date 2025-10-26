import Phaser from "phaser";

import { Entity } from "../components/Entity";

import { MovementSystem } from "../systems/MovementSystem";
import { KeyboardSystem } from "../systems/KeyboardSystem";
import { CameraSystem } from "../systems/Camera/CameraSystem";
import { CameraZoomSystem } from "../systems/Camera/CameraZoomSystem";
import { CameraDragNDropSystem } from "../systems/Camera/CameraDragNDropSystem";
import { CameraRightStickSystem } from "../systems/Camera/CameraRightStickSystem";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { GamepadSystem } from "../systems/GamepadSystem";
import { AnimationSystem } from "../systems/AnimationSystem";

import { PlayerFactory } from "../factories/Player/PlayerFactory";

import * as Utils from "../utils";

export class GameScene extends Phaser.Scene {
  player!: Entity;
  movementSystem!: MovementSystem;
  keyboardSystem!: KeyboardSystem;
  cameraSystem!: CameraSystem;
  cameraZoomSystem!: CameraZoomSystem;
  cameraDragNDropSystem!: CameraDragNDropSystem;
  cameraRightStickSystem!: CameraRightStickSystem;
  physicsSystem!: PhysicsSystem;
  gamepadSystem!: GamepadSystem;
  animationSystem!: AnimationSystem;

  constructor() {
    super("game-scene");
  }

  preload() {
    PlayerFactory.preload(this);
  }

  create() {
    Utils.GridHelper.create(this, 512);

    this.player = PlayerFactory.create(this);

    this.movementSystem = new MovementSystem();
    this.keyboardSystem = new KeyboardSystem(this);
    this.gamepadSystem = new GamepadSystem(this);
    this.physicsSystem = new PhysicsSystem();
    this.animationSystem = new AnimationSystem();
    this.cameraSystem = new CameraSystem(this, this.player);
    this.cameraZoomSystem = new CameraZoomSystem(this, this.player);
    this.cameraDragNDropSystem = new CameraDragNDropSystem(this, this.player);
    this.cameraRightStickSystem = new CameraRightStickSystem(this);
  }

  update(_time: number) {
    this.keyboardSystem.update([this.player]);
    this.gamepadSystem.update([this.player]);
    this.movementSystem.update([this.player]);
    this.physicsSystem.update([this.player]);
    this.animationSystem.update([this.player]);
    this.cameraSystem.update();
    this.cameraRightStickSystem.update([this.player], this);
  }
}
