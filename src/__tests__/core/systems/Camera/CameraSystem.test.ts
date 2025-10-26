import Phaser from "phaser";


import { CameraComponent } from "../../../../core/components/CameraComponent";
import { CameraSystem } from "../../../../core/systems/Camera/CameraSystem";
import { Entity } from "../../../../core/components/Entity";
import { PositionComponent } from "../../../../core/components/Position";

describe("CameraSystem", () => {
  let mockScene: Phaser.Scene;
  let mockEntity: Entity;
  let mockCameraComponent: CameraComponent;
  let mockPositionComponent: PositionComponent;

  beforeEach(() => {
    mockScene = new Phaser.Scene();

    mockCameraComponent = new CameraComponent();
    mockPositionComponent = new PositionComponent(100, 100);

    mockEntity = new Entity();

    mockEntity.add("camera", mockCameraComponent);
    mockEntity.add("position", mockPositionComponent);
  });

  it("should start following the position component if follow is active", () => {
    const cameraSystem = new CameraSystem(mockScene, mockEntity);

    cameraSystem.update();

    expect(mockScene.cameras.main.startFollow).toHaveBeenCalledWith(
      mockPositionComponent,
    );
    expect(mockScene.cameras.main.stopFollow).not.toHaveBeenCalled();
  });

  it("should not follow if the camera is dragging", () => {
    mockCameraComponent.isDragging = true;
    const cameraSystem = new CameraSystem(mockScene, mockEntity);

    cameraSystem.update();

    expect(mockScene.cameras.main.stopFollow).toHaveBeenCalledWith();
    expect(mockScene.cameras.main.startFollow).not.toHaveBeenCalled();
  });

  it("should throw error if camera component is missing", () => {
    const newMockEntity = new Entity();

    const cameraSystem = new CameraSystem(mockScene, newMockEntity);

    expect(() => cameraSystem.update()).toThrow(
      "Error: Missing Component Dependency",
    );
  });
});
