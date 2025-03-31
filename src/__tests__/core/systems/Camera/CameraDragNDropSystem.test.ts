import Phaser from "phaser";

import { CameraDragNDropSystem } from "../../../../core/systems/Camera/CameraDragNDropSystem";

describe("CameraDragNDropSystem", () => {
  let mockScene: Phaser.Scene;
  let mockEntity: any;
  let mockCameraComponent: any;
  let mockPositionComponent: any;

  let pointerdownHandler: Function;
  let pointerupHandler: Function;
  let pointermoveHandler: Function;
  let pointerupoutsideHandler: Function;

  beforeEach(() => {
    mockScene = new Phaser.Scene();
    mockScene.cameras = {
      main: {
        scrollX: 0,
        scrollY: 0,
        zoom: 1,
        stopFollow: jest.fn(),
        startFollow: jest.fn(),
      },
    } as any;

    mockCameraComponent = {
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      isFollowActive: true,
    };

    mockPositionComponent = {};

    mockEntity = {
      get: jest.fn().mockImplementation((name: string) => {
        if (name === "camera") return mockCameraComponent;
        if (name === "position") return mockPositionComponent;
      }),
    };

    mockScene.input.on = jest.fn().mockImplementation((event, callback) => {
      if (event === "pointerdown") pointerdownHandler = callback;
      if (event === "pointerup") pointerupHandler = callback;
      if (event === "pointerupoutside") pointerupoutsideHandler = callback;
      if (event === "pointermove") pointermoveHandler = callback;
    });

    new CameraDragNDropSystem(mockScene, mockEntity);
  });

  it("should initialize the system and set up event listeners", () => {
    expect(mockScene.input.on).toHaveBeenCalledTimes(4);
    expect(mockScene.input.on).toHaveBeenCalledWith("pointerdown", expect.any(Function));
    expect(mockScene.input.on).toHaveBeenCalledWith("pointerup", expect.any(Function));
    expect(mockScene.input.on).toHaveBeenCalledWith("pointerupoutside", expect.any(Function));
    expect(mockScene.input.on).toHaveBeenCalledWith("pointermove", expect.any(Function));
  });

  it("should start dragging when pointerdown is triggered", () => {
    const pointer = { worldX: 10, worldY: 20 };
    pointerdownHandler(pointer);

    expect(mockCameraComponent.isDragging).toBe(true);
    expect(mockCameraComponent.dragStartX).toBe(pointer.worldX);
    expect(mockCameraComponent.dragStartY).toBe(pointer.worldY);
    expect(mockCameraComponent.isFollowActive).toBe(false);
    expect(mockScene.cameras.main.stopFollow).toHaveBeenCalled();
  });

  it("should stop dragging and start following when pointerup is triggered", () => {
    pointerupHandler();

    expect(mockCameraComponent.isDragging).toBe(false);
    expect(mockCameraComponent.isFollowActive).toBe(true);
    expect(mockScene.cameras.main.startFollow).toHaveBeenCalled();
  });

  it("should stop dragging and start following when pointerupoutside is triggered", () => {
    pointerupoutsideHandler();

    expect(mockCameraComponent.isDragging).toBe(false);
    expect(mockCameraComponent.isFollowActive).toBe(true);
    expect(mockScene.cameras.main.startFollow).toHaveBeenCalled();
  });

  it("should move the camera when dragging and pointermove is triggered", () => {
    const pointerDown = { worldX: 10, worldY: 20 };
    const pointerMove = { worldX: 30, worldY: 40 };

    mockScene.cameras.main.scrollX = 0;
    mockScene.cameras.main.scrollY = 0;

    pointerdownHandler(pointerDown);
    mockCameraComponent.isDragging = true;

    const initialScrollX = mockScene.cameras.main.scrollX;
    const initialScrollY = mockScene.cameras.main.scrollY;

    pointermoveHandler(pointerMove);

    expect(mockScene.cameras.main.scrollX).not.toBe(initialScrollX);
    expect(mockScene.cameras.main.scrollY).not.toBe(initialScrollY);
  });

  it("should not move the camera if dragging is not active", () => {
    const pointer = { worldX: 30, worldY: 40 };

    const initialScrollX = mockScene.cameras.main.scrollX;
    const initialScrollY = mockScene.cameras.main.scrollY;

    pointermoveHandler(pointer);

    expect(mockScene.cameras.main.scrollX).toBe(initialScrollX);
    expect(mockScene.cameras.main.scrollY).toBe(initialScrollY);
  });

  it("should throw error if camera component is missing on pointerdown", () => {
    mockEntity.get = jest.fn().mockReturnValue(undefined);
    const pointer = { worldX: 10, worldY: 20 };

    expect(() => pointerdownHandler(pointer)).toThrow("Error: Missing Component Dependency");
  });

  it("should throw error if camera component is missing on pointerupoutside", () => {
    mockEntity.get = jest.fn().mockImplementation((name: string) => {
      if (name === "camera") return undefined;
      if (name === "position") return mockPositionComponent;
    });

    expect(() => pointerupoutsideHandler()).toThrow("Error: Missing Component Dependency");
  });

  it("should throw error if camera component is missing on pointerup", () => {
    mockEntity.get = jest.fn().mockImplementation((name: string) => {
      if (name === "camera") return undefined;
      if (name === "position") return mockPositionComponent;
    });

    expect(() => pointerupHandler()).toThrow("Error: Missing Component Dependency");
  });

  it("should throw error if position component is missing on pointerup", () => {
    mockEntity.get = jest.fn().mockImplementation((name: string) => {
      if (name === "camera") return mockCameraComponent;
      if (name === "position") return undefined;
    });

    expect(() => pointerupHandler()).toThrow("Error: Missing Component Dependency");
  });

  it("should throw error if camera component is missing on pointermove", () => {
    mockEntity.get = jest.fn().mockReturnValue(undefined);
    const pointer = { worldX: 30, worldY: 40 };

    expect(() => pointermoveHandler(pointer)).toThrow("Error: Missing Component Dependency");
  });
});
