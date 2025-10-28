// src/components/Velocity.ts
import { Component } from "./_Component";

/**
 * Component that stores an entity's base movement speed.
 *
 * Responsibilities:
 * - Serve as a plain data container for movement speed used by MovementSystem.
 * - Provide small, intention-revealing helpers (set, reset, clone).
 *
 * Design notes:
 * - This component should NOT contain actual velocity vectors (x/y) — those belong in DesiredVelocityComponent.
 * - Keep this component small and serializable for debugging and snapshotting.
 * - Speed is typically in units per second (but depends on how your systems interpret it).
 */
export class VelocityComponent implements Component {
  /**
   * Base movement speed in world units per second (or per update, depending on system implementation).
   * This value is used by MovementSystem to calculate DesiredVelocity based on input.
   */
  public speed: number;

  /**
   * Creates a new VelocityComponent.
   * @param speed - base movement speed (default 0)
   */
  constructor(speed = 0) {
    this.speed = speed;
  }

  /**
   * Sets the base movement speed.
   * @param speed - new speed value
   * @returns this for chaining
   */
  public set(speed: number): this {
    this.speed = speed;
    return this;
  }

  /**
   * Resets speed to zero.
   * @returns this for chaining
   */
  public reset(): this {
    this.speed = 0;
    return this;
  }

  /**
   * Returns a plain object for debugging/serialization.
   */
  public toObject(): { speed: number } {
    return { speed: this.speed };
  }

  /**
   * Creates a shallow clone of this component.
   */
  public clone(): VelocityComponent {
    return new VelocityComponent(this.speed);
  }
}
