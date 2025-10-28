import Phaser from "phaser";

import { CameraComponent } from "../../components/Camera";
import { System } from "../_System";
import { Entity } from "../../components/Entity";

export class CameraSystem implements System {
  constructor(
    private scene: Phaser.Scene,
    private entity: Entity,
  ) {}

  update() {
    const cameraComponent = this.entity.get<CameraComponent>("camera");

    if (!cameraComponent) {
      throw new Error("Error: Missing CameraComponent");
    }

    if (!cameraComponent.target) {
      throw new Error("Error: CameraComponent missing target GameObject");
    }

    if (!cameraComponent.isDragging && cameraComponent.isFixed) {
      return this.scene.cameras.main.startFollow(cameraComponent.target);
    }

    return this.scene.cameras.main.stopFollow();
  }
}
