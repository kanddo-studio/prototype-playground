import { Entity, PositionComponent } from "kanji-ecs";

import { CameraComponent } from "../../components/CameraComponent";

export class CameraDragNDropSystem {
  constructor(
    private scene: Phaser.Scene,
    private entity: Entity,
  ) {
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const cameraComponent = this.entity.get<CameraComponent>("camera");
      if (!cameraComponent) {
        throw new Error("Error: Missing Component Dependency");
      }

      cameraComponent.isDragging = true;
      cameraComponent.dragStartX = pointer.worldX;
      cameraComponent.dragStartY = pointer.worldY;

      cameraComponent.isFollowActive = false;
      scene.cameras.main.stopFollow();
    });

    this.scene.input.on("pointerup", () => {
      const cameraComponent = this.entity.get<CameraComponent>("camera");
      const positionComponent = this.entity.get<PositionComponent>("position");

      if (!cameraComponent || !positionComponent) {
        throw new Error("Error: Missing Component Dependency");
      }

      cameraComponent.isDragging = false;
      cameraComponent.isFollowActive = true;
      scene.cameras.main.startFollow(positionComponent);
    });

    this.scene.input.on("pointerupoutside", () => {
      const cameraComponent = this.entity.get<CameraComponent>("camera");
      const positionComponent = this.entity.get<PositionComponent>("position");

      if (!cameraComponent || !positionComponent) {
        throw new Error("Error: Missing Component Dependency");
      }

      cameraComponent.isDragging = false;
      cameraComponent.isFollowActive = true;
      scene.cameras.main.startFollow(positionComponent);
    });

    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      const cameraComponent = this.entity.get<CameraComponent>("camera");

      if (!cameraComponent) {
        throw new Error("Error: Missing Component Dependency");
      }

      if (!cameraComponent.isDragging) return;

      const camera = scene.cameras.main;
      const dragX = (pointer.worldX - cameraComponent.dragStartX) * 4;
      const dragY = (pointer.worldY - cameraComponent.dragStartY) * 4;

      const smoothFactor = 0.1;
      camera.scrollX -= (dragX * smoothFactor) / camera.zoom;
      camera.scrollY -= (dragY * smoothFactor) / camera.zoom;

      cameraComponent.dragStartX = pointer.worldX;
      cameraComponent.dragStartY = pointer.worldY;
    });
  }
}
