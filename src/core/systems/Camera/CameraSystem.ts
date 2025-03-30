import { Entity, PositionComponent } from "kanji-ecs";

import { CameraComponent } from "../../components/CameraComponent";

export class CameraSystem {
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

    if (!cameraComponent.isDragging && cameraComponent.isFollowActive) {
      this.scene.cameras.main.startFollow(positionComponent);
    }
  }
}
