import Phaser from "phaser";

import { Entity } from "../components/_/_Entity";

import { MovementSystem } from "../systems/MovementSystem";
import { KeyboardSystem } from "../systems/Device/KeyboardSystem";
import { CameraSystem } from "../systems/Camera/CameraSystem";
import { CameraZoomSystem } from "../systems/Camera/CameraZoomSystem";
import { CameraDragSystem } from "../systems/Camera/CameraDragSystem";
import { CameraRightStickSystem } from "../systems/Camera/CameraRightStickSystem";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { GamepadSystem } from "../systems/Device/GamepadSystem";
import { AnimationSystem } from "../systems/AnimationSystem";

import { PlayerFactory } from "../factories/Player/PlayerFactory";

import * as Utils from "../utils";
import { SystemUpdateProps } from "../systems/_/_System";
import { MouseWhellSystem } from "../systems/Device/MouseWhellSystem";
import { MousePointerSystem } from "../systems/Device/MousePointerSystem";
import { EventBus } from "../../event/EventBus";
import { SCENES } from "../../types/scenes.enum";
import { HitboxSystem } from "../systems/HitboxSystem";
import { AttackSystem } from "../systems/AttackSystem";
import { FacingSystem } from "../systems/FacingSystem";

export class GameScene extends Phaser.Scene {
  player!: Entity;

  private keyboardSystem!: KeyboardSystem;
  private mouseWhellSystem!: MouseWhellSystem;
  private mousePointerSystem!: MousePointerSystem;
  private gamepadSystem!: GamepadSystem;
  private movementSystem!: MovementSystem;
  private physicsSystem!: PhysicsSystem;
  private animationSystem!: AnimationSystem;

  private cameraSystem!: CameraSystem;
  private cameraZoomSystem!: CameraZoomSystem;
  private cameraDragSystem!: CameraDragSystem;
  private cameraRightStickSystem!: CameraRightStickSystem;

  private hitboxSystem!: HitboxSystem;
  private facingSystem!: FacingSystem;
  private attackSystem!: AttackSystem;

  private playerSystems: Array<{ update: (props: SystemUpdateProps) => void }> =
    [];

  constructor() {
    super(SCENES.PLAYGROUND);
  }

  preload() {
    PlayerFactory.preload(this);
  }

  create() {
    // Utils.GridHelper.create(this, 796, 600);
    Utils.GridHelper.create(this, 832, 640);

    this.player = PlayerFactory.create(this);

    EventBus.emit("hud:stats", { health: 20, score: 0 });

    this.initSystems();
  }

  private initSystems() {
    this.keyboardSystem = new KeyboardSystem(this);
    this.mouseWhellSystem = new MouseWhellSystem(this);
    this.mousePointerSystem = new MousePointerSystem(this);
    this.gamepadSystem = new GamepadSystem(this);
    this.movementSystem = new MovementSystem();
    this.physicsSystem = new PhysicsSystem();
    this.animationSystem = new AnimationSystem();

    this.cameraSystem = new CameraSystem(this);
    this.cameraZoomSystem = new CameraZoomSystem(this);
    this.cameraDragSystem = new CameraDragSystem(this);
    this.cameraRightStickSystem = new CameraRightStickSystem(this);

    this.facingSystem = new FacingSystem();
    this.hitboxSystem = new HitboxSystem(this);
    this.attackSystem = new AttackSystem(this);

    this.playerSystems = [
      this.keyboardSystem,
      this.mouseWhellSystem,
      this.mousePointerSystem,
      this.gamepadSystem,
      this.movementSystem,
      this.physicsSystem,
      this.animationSystem,
      this.cameraSystem,
      this.cameraZoomSystem,
      this.cameraDragSystem,
      this.cameraRightStickSystem,
    ];
  }

  update(_time: number) {
    for (const system of this.playerSystems) {
      system.update({ entities: [this.player] });
    }

    this.facingSystem.update({ entities: [this.player] });
    this.attackSystem.update({ entities: [this.player] });

    const enemiesArray = [] as any;
    const combatEntities = [this.player, ...enemiesArray]; 
    this.hitboxSystem.update({ entities: combatEntities });
  }
}
