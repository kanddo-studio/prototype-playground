import { Component } from "./_/_Component";
import { DIRECTION } from "../../types/direction.type";
import { KEYS } from "../../types/keys.enum";

/**
 * FacingComponent
 *
 * Stores the entity's current facing direction.
 * - Systems should update this via FacingSystem.
 * - Other systems (AttackSystem, HitboxSystem) read this component as the canonical facing.
 *
 * Simple, serializable data-only component.
 */
export class FacingComponent implements Component {
  /** current facing direction (default RIGHT) */
  public direction: DIRECTION;

  /** last timestamp when direction changed (ms) */
  public lastUpdatedAt: number;

  constructor(initial: DIRECTION = KEYS.RIGHT) {
    this.direction = initial;
    this.lastUpdatedAt = Date.now();
  }

  /**
   * Set facing direction.
   * @param dir - new direction
   * @param nowMs - optional timestamp in ms (use scene.time.now if available)
   */
  set(dir: DIRECTION, nowMs?: number): void {
    if (this.direction === dir) return;
    this.direction = dir;
    this.lastUpdatedAt = nowMs ?? Date.now();
  }
}
