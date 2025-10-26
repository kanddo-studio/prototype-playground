import type { Entity } from "kanji-ecs/core";
import type { InputComponent, VelocityComponent } from "kanji-ecs";

import { PhysicsComponent } from "../../../core/components/PhysicsComponent";
import { PhysicsSystem } from "../../../core/systems/PhysicsSystem";

describe("PhysicsSystem", () => {
  let physicsSystem: PhysicsSystem;
  let mockEntity: Entity;
  let inputComponent: InputComponent;
  let velocityComponent: VelocityComponent;
  let setVelocity: jest.Mock;

  beforeEach(() => {
    setVelocity = jest.fn();

    inputComponent = { keys: new Set<string>() };
    velocityComponent = { speed: 200 };

    const mockBody = { setVelocity } as Partial<Body>;

    const physicsComponent = {
      body: mockBody,
    } as unknown as PhysicsComponent;

    mockEntity = {
      get: jest.fn((name: string) => {
        if (name === "input") return inputComponent;
        if (name === "velocity") return velocityComponent;
        if (name === "physics") return physicsComponent;
        return undefined;
      }),
    } as unknown as Entity;

    physicsSystem = new PhysicsSystem();
  });

  it("should move left", () => {
    inputComponent.keys.add("ArrowLeft");

    physicsSystem.update([mockEntity]);

    expect(setVelocity).toHaveBeenCalledWith(-200, 0);
  });

  it("should move right", () => {
    inputComponent.keys.add("ArrowRight");

    physicsSystem.update([mockEntity]);

    expect(setVelocity).toHaveBeenCalledWith(200, 0);
  });

  it("should move up", () => {
    inputComponent.keys.add("ArrowUp");

    physicsSystem.update([mockEntity]);

    expect(setVelocity).toHaveBeenCalledWith(0, -200);
  });

  it("should move down", () => {
    inputComponent.keys.add("ArrowDown");

    physicsSystem.update([mockEntity]);

    expect(setVelocity).toHaveBeenCalledWith(0, 200);
  });

  it("should stop when no keys are pressed", () => {
    physicsSystem.update([mockEntity]);

    expect(setVelocity).toHaveBeenCalledWith(0, 0);
  });

  it("should normalize diagonal movement", () => {
    inputComponent.keys.add("ArrowRight");
    inputComponent.keys.add("ArrowDown");

    physicsSystem.update([mockEntity]);

    const n = Math.SQRT1_2; // ~0.7071
    expect(setVelocity).toHaveBeenCalledWith(200 * n, 200 * n);
  });

  it("should throw if any component is missing", () => {
    const faultyEntity = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as Entity;

    expect(() => physicsSystem.update([faultyEntity])).toThrow(
      "Error: Missing Component Dependency"
    );
  });
});