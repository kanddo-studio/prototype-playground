import { Component } from "./_Component";

/**
 * Component to store the desired velocity calculated from input and movement logic.
 *
 * Responsibilities:
 * - Hold the desired velocity vector (x, y) which represents movement intent.
 * - Provide simple helpers to update/reset/copy the vector.
 *
 * Notes on design:
 * - This component must NOT contain movement logic (normalization, speed multipliers, physics integration).
 *   Those responsibilities belong to Systems (MovementSystem, PhysicsSystem).
 * - Keep the data shape minimal and serializable so it can be inspected easily in debugging tools.
 */
export class DesiredVelocityComponent implements Component {
  /**
   * Desired horizontal velocity (units per second or units per update depending on how your systems interpret it).
   */
  public x: number = 0;

  /**
   * Desired vertical velocity (units per second or units per update depending on how your systems interpret it).
   */
  public y: number = 0;

  /**
   * Creates a new DesiredVelocityComponent.
   * @param x - initial x velocity (default 0)
   * @param y - initial y velocity (default 0)
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Sets desired velocity.
   * @param x - new x velocity
   * @param y - new y velocity
   * @returns this for chaining
   */
  public set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Resets velocity to zero.
   * @returns this for chaining
   */
  public reset(): this {
    this.x = 0;
    this.y = 0;
    return this;
  }

  /**
   * Copies velocity values from another DesiredVelocityComponent or a plain object.
   * Useful when applying movement smoothing or interpolation results.
   * @param other - source component or object with x and y
   * @returns this for chaining
   */
  public copyFrom(other: { x: number; y: number }): this {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  /**
   * Returns a plain object representation (useful for debugging / serialization).
   */
  public toObject(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}