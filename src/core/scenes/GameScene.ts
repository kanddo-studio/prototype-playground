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
import { SystemUpdateProps } from "../components/System";

export class GameScene extends Phaser.Scene {
  player!: Entity;

  private keyboardSystem!: KeyboardSystem;
  private gamepadSystem!: GamepadSystem;
  private movementSystem!: MovementSystem;
  private physicsSystem!: PhysicsSystem;
  private animationSystem!: AnimationSystem;

  private cameraSystem!: CameraSystem;
  private cameraZoomSystem!: CameraZoomSystem;
  private cameraDragNDropSystem!: CameraDragNDropSystem;
  private cameraRightStickSystem!: CameraRightStickSystem;

  private playerSystems: Array<{ update: (props: SystemUpdateProps) => void }> =
    [];
  private defaultSystems: Array<{ update: () => void }> = [];

  constructor() {
    super("game-scene");
  }

  preload() {
    PlayerFactory.preload(this);
  }

  create() {
    Utils.GridHelper.create(this, 832, 640);

    this.player = PlayerFactory.create(this);

    this.initSystems();
  }

  private initSystems() {
    this.keyboardSystem = new KeyboardSystem(this);
    this.gamepadSystem = new GamepadSystem(this);
    this.movementSystem = new MovementSystem();
    this.physicsSystem = new PhysicsSystem();
    this.animationSystem = new AnimationSystem();

    this.cameraSystem = new CameraSystem(this, this.player);
    this.cameraZoomSystem = new CameraZoomSystem(this, this.player);
    this.cameraDragNDropSystem = new CameraDragNDropSystem(this, this.player);
    this.cameraRightStickSystem = new CameraRightStickSystem(this);

    this.defaultSystems = [
      this.cameraSystem,
      this.cameraZoomSystem,
      this.cameraDragNDropSystem,
    ];

    this.playerSystems = [
      this.keyboardSystem,
      this.gamepadSystem,
      this.movementSystem,
      this.physicsSystem,
      this.animationSystem,
      this.cameraRightStickSystem,
    ];
  }

  update(_time: number) {
    for (const system of this.defaultSystems) {
      system.update();
    }

    for (const system of this.playerSystems) {
      system.update({ entities: [this.player] });
    }
  }
}
