import Phaser from "phaser";

import { CameraZoomSystem } from "../../../../core/systems/Camera/CameraZoomSystem";

jest.mock("phaser");

describe("CameraZoomSystem", () => {
  let mockScene: Phaser.Scene;
  let mockEntity: any;
  let mockCameraComponent: any;

  let wheelHandler: Function;

  beforeEach(() => {
    mockScene = new Phaser.Scene();

    mockCameraComponent = {
      zoom: 1,
      minZoom: 0.5,
      maxZoom: 2,
    };

    mockEntity = {
      get: jest.fn().mockImplementation((name: string) => {
        if (name === "camera") return mockCameraComponent;
      }),
    };

    mockScene.input.on = jest.fn().mockImplementation((event, callback) => {
      if (event === "wheel") wheelHandler = callback;
    });

    new CameraZoomSystem(mockScene, mockEntity);
  });

  it("should initialize the system and set up the wheel event listener", () => {
    expect(mockScene.input.on).toHaveBeenCalledWith("wheel", expect.any(Function));
  });

  it("should zoom out when wheel is scrolled down", () => {
    const initialZoom = mockCameraComponent.zoom;
    const deltaY = 100;

    wheelHandler({}, [], 0, deltaY, 0);

    expect(mockCameraComponent.zoom).toBeLessThan(initialZoom);
    expect(mockScene.cameras.main.setZoom).toHaveBeenCalledWith(mockCameraComponent.zoom);
  });

  it("should zoom in when wheel is scrolled up", () => {
    const initialZoom = mockCameraComponent.zoom;
    const deltaY = -100;

    wheelHandler({}, [], 0, deltaY, 0);

    expect(mockCameraComponent.zoom).toBeGreaterThan(initialZoom);
    expect(mockScene.cameras.main.setZoom).toHaveBeenCalledWith(mockCameraComponent.zoom);
  });

  it("should not zoom below the minimum zoom level", () => {
    mockCameraComponent.zoom = mockCameraComponent.minZoom;
    const deltaY = 100;

    wheelHandler({}, [], 0, deltaY, 0);

    expect(mockCameraComponent.zoom).toBe(mockCameraComponent.minZoom);
    expect(mockScene.cameras.main.setZoom).toHaveBeenCalledWith(mockCameraComponent.zoom);
  });

  it("should not zoom above the maximum zoom level", () => {
    mockCameraComponent.zoom = mockCameraComponent.maxZoom;
    const deltaY = -100;

    wheelHandler({}, [], 0, deltaY, 0);

    expect(mockCameraComponent.zoom).toBe(mockCameraComponent.maxZoom);
    expect(mockScene.cameras.main.setZoom).toHaveBeenCalledWith(mockCameraComponent.zoom);
  });

  it("should throw error if camera component is missing", () => {
    mockEntity.get = jest.fn().mockReturnValue(undefined);

    expect(() => wheelHandler({}, [], 0, -100, 0)).toThrow(
      "Error: Missing Component Dependency"
    );
  });
});
