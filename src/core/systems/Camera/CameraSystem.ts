import Phaser from "phaser";

import { CameraComponent } from "../../components/CameraComponent";
import { System } from "../../components/System";
import { Entity } from "../../components/Entity";
import { PositionComponent } from "../../components/Position";

export class CameraSystem implements System {
  constructor(
    private scene: Phaser.Scene,
    private entity: Entity,
  ) {}

  update() {
    const cameraComponent = this.entity.get<CameraComponent>("camera");
    const positionComponent = this.entity.get<PositionComponent>("position");

    if (!cameraComponent || !positionComponent) {
      throw new Error("Error: Missing Component Dependency");
    }

    if (!cameraComponent.isDragging && cameraComponent.isFixed) {
      return this.scene.cameras.main.startFollow(positionComponent);
    }
    return this.scene.cameras.main.stopFollow();
  }
}
