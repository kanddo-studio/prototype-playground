// src/components/Physics.ts
import Phaser from "phaser";
import { Component } from "./_/_Component";

/**
 * Component that stores references to a Phaser physics body and its game object.
 *
 * Responsibilities:
 * - Be a plain data container that references the physics body and, optionally, the sprite (game object).
 * - Expose small, well-documented helpers to interact with the underlying body in a controlled way.
 *
 * Rationale:
 * - Avoid side-effects in the constructor (no setPosition / setCollideWorldBounds) so components stay serializable
 *   and simple (SRP). Initialization and engine-side effects should be handled by Systems (PhysicsInitSystem,
 *   EntityFactory, etc).
 */
export class PhysicsComponent implements Component {
  /**
   * The underlying Arcade physics body.
   */
  public readonly body: Phaser.Physics.Arcade.Body;

  /**
   * Optional reference to the sprite (useful for position, flipping, etc).
   */
  public readonly gameObject?: Phaser.Physics.Arcade.Sprite;

  /**
   * Optional initial spawn position to be applied by an initialization system.
   */
  public readonly initialPosition?: { x: number; y: number };

  /**
   * Flag used by initialization systems to avoid re-applying initialization logic.
   */
  public initialized: boolean = false;

  /**
   * Creates a new PhysicsComponent.
   * @param body - The Arcade physics body associated with this entity.
   * @param gameObject - Optional: the sprite/service game object that owns the body.
   * @param initialPosition - Optional initial position to apply once during initialization.
   */
  constructor(
    body: Phaser.Physics.Arcade.Body,
    gameObject?: Phaser.Physics.Arcade.Sprite,
    initialPosition?: { x: number; y: number }
  ) {
    this.body = body;
    this.gameObject = gameObject;
    this.initialPosition = initialPosition;
  }

  /**
   * Set whether the underlying body should collide with world bounds.
   * This is a convenience wrapper; mutating behaviour is explicit via methods instead of constructor side-effects.
   * @param value - enable/disable collide with world bounds (default true)
   * @returns this for chaining
   */
  public setCollideWorldBounds(value: boolean = true): this {
    this.body.setCollideWorldBounds(value);
    return this;
  }

  /**
   * Set the sprite (game object) position if available.
   * @param x - X position
   * @param y - Y position
   * @returns this for chaining
   */
  public setPosition(x: number, y: number): this {
    if (this.gameObject) {
      this.gameObject.setPosition(x, y);
    }
    return this;
  }

  /**
   * Returns a plain debugging object with relevant state.
   */
  public toObject(): {
    initialized: boolean;
    hasGameObject: boolean;
    velocity: { x: number; y: number };
    initialPosition?: { x: number; y: number };
  } {
    return {
      initialized: this.initialized,
      hasGameObject: !!this.gameObject,
      velocity: { x: this.body.velocity.x, y: this.body.velocity.y },
      initialPosition: this.initialPosition,
    };
  }
}