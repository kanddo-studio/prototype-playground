import Phaser from "phaser";
import { CameraComponent } from "../../../../core/components/CameraComponent";
import { CameraRightStickSystem } from "../../../../core/systems/Camera/CameraRightStickSystem";
import { Entity } from "../../../../core/components/Entity";

describe("CameraRightStickSystem", () => {
  let mockScene: Phaser.Scene;
  let mockEntity: Entity;
  let mockCameraComponent: CameraComponent;
  let system: CameraRightStickSystem;
  let mockGamepad: Phaser.Input.Gamepad.Gamepad;

  beforeEach(() => {
    mockScene = new Phaser.Scene();
    mockCameraComponent = new CameraComponent();
    mockEntity = new Entity();
    mockEntity.add("camera", mockCameraComponent);

    mockGamepad = {
      axes: [
        { getValue: () => 0 },
        { getValue: () => 0 },
        { getValue: () => 0 },
        { getValue: () => 0 },
      ],
      buttons: [],
    } as unknown as Phaser.Input.Gamepad.Gamepad;

    mockScene.cameras.main.scrollX = 0;
    mockScene.cameras.main.scrollY = 0;

    system = new CameraRightStickSystem(mockScene);
    (system as any).pad = mockGamepad;
  });

  it("should not move camera when stick is in deadzone", () => {
    mockGamepad.axes[2].getValue = () => 0.2;
    mockGamepad.axes[3].getValue = () => 0.1;

    system.update([mockEntity], mockScene);

    expect(mockScene.cameras.main.scrollX).toBe(0);
    expect(mockScene.cameras.main.scrollY).toBe(0);
    expect(mockCameraComponent.isFixed).toBe(true);
  });

  it("should move camera right when stick is pushed right", () => {
    mockGamepad.axes[2].getValue = () => 0.8;
    mockGamepad.axes[3].getValue = () => 0;

    system.update([mockEntity], mockScene);

    expect(mockScene.cameras.main.scrollX).toBe(8);
    expect(mockScene.cameras.main.scrollY).toBe(0);
    expect(mockCameraComponent.isFixed).toBe(false);
  });

  it("should move camera left when stick is pushed left", () => {
    mockGamepad.axes[2].getValue = () => -0.8;
    mockGamepad.axes[3].getValue = () => 0;

    system.update([mockEntity], mockScene);

    expect(mockScene.cameras.main.scrollX).toBe(-8);
    expect(mockScene.cameras.main.scrollY).toBe(0);
    expect(mockCameraComponent.isFixed).toBe(false);
  });

  it("should move camera up when stick is pushed up", () => {
    mockGamepad.axes[2].getValue = () => 0;
    mockGamepad.axes[3].getValue = () => -0.8;

    system.update([mockEntity], mockScene);

    expect(mockScene.cameras.main.scrollX).toBe(0);
    expect(mockScene.cameras.main.scrollY).toBe(-8);
    expect(mockCameraComponent.isFixed).toBe(false);
  });

  it("should move camera down when stick is pushed down", () => {
    mockGamepad.axes[2].getValue = () => 0;
    mockGamepad.axes[3].getValue = () => 0.8;

    system.update([mockEntity], mockScene);

    expect(mockScene.cameras.main.scrollX).toBe(0);
    expect(mockScene.cameras.main.scrollY).toBe(8);
    expect(mockCameraComponent.isFixed).toBe(false);
  });

  it("should move camera diagonally", () => {
    mockGamepad.axes[2].getValue = () => 0.8;
    mockGamepad.axes[3].getValue = () => 0.8;

    system.update([mockEntity], mockScene);

    expect(mockScene.cameras.main.scrollX).toBe(8);
    expect(mockScene.cameras.main.scrollY).toBe(8);
    expect(mockCameraComponent.isFixed).toBe(false);
  });

  it("should stop moving on X axis after reaching max counter", () => {
    mockGamepad.axes[2].getValue = () => 0.8;
    mockGamepad.axes[3].getValue = () => 0;

    for (let i = 0; i < 30; i++) {
      system.update([mockEntity], mockScene);
    }

    expect(mockScene.cameras.main.scrollX).toBe(28 * 8);
  });

  it("should stop moving on Y axis after reaching max counter", () => {
    mockGamepad.axes[2].getValue = () => 0;
    mockGamepad.axes[3].getValue = () => 0.8;

    for (let i = 0; i < 30; i++) {
      system.update([mockEntity], mockScene);
    }

    expect(mockScene.cameras.main.scrollY).toBe(28 * 8);
  });

  it("should reset X counter when stick returns to center", () => {
    mockGamepad.axes[2].getValue = () => 0.8;
    mockGamepad.axes[3].getValue = () => 0;

    for (let i = 0; i < 10; i++) {
      system.update([mockEntity], mockScene);
    }

    mockGamepad.axes[2].getValue = () => 0;
    system.update([mockEntity], mockScene);

    mockGamepad.axes[2].getValue = () => 0.8;
    system.update([mockEntity], mockScene);

    expect(mockScene.cameras.main.scrollX).toBe(10 * 8 + 8);
  });

  it("should reset Y counter when stick returns to center", () => {
    mockGamepad.axes[2].getValue = () => 0;
    mockGamepad.axes[3].getValue = () => 0.8;

    for (let i = 0; i < 10; i++) {
      system.update([mockEntity], mockScene);
    }

    mockGamepad.axes[3].getValue = () => 0;
    system.update([mockEntity], mockScene);

    mockGamepad.axes[3].getValue = () => 0.8;
    system.update([mockEntity], mockScene);

    expect(mockScene.cameras.main.scrollY).toBe(10 * 8 + 8);
  });

  it("should set isFixed to true when stick is idle", () => {
    mockGamepad.axes[2].getValue = () => 0;
    mockGamepad.axes[3].getValue = () => 0;

    system.update([mockEntity], mockScene);

    expect(mockCameraComponent.isFixed).toBe(true);
  });

  it("should not move camera when gamepad is not connected", () => {
    const systemWithoutPad = new CameraRightStickSystem(mockScene);

    systemWithoutPad.update([mockEntity], mockScene);

    expect(mockScene.cameras.main.scrollX).toBe(0);
    expect(mockScene.cameras.main.scrollY).toBe(0);
  });

  it("should throw error if camera component is missing", () => {
    const newMockEntity = new Entity();

    expect(() => system.update([newMockEntity], mockScene)).toThrow(
      "Error: Missing Component",
    );
  });
});
