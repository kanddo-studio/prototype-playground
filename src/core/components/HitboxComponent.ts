import { Component } from "./_/_Component";
import { DIRECTION } from "../../types/direction.type";

/**
 * HitboxComponent
 *
 * Data-only component describing a directional hitbox with duration.
 *
 * - distance: how far from entity center the hitbox center will be placed.
 * - durationMs: active window in milliseconds after activation.
 * - lastDirection: last direction used when activating the hitbox.
 * - lastActivatedAt: internal timestamp (ms) of activation (0 = inactive).
 */
export interface HitboxOptions {
  width: number;
  height: number;
  distance: number; // pixels from entity center to hitbox center
  durationMs?: number; // active window in ms
  debug?: boolean;
}

export class HitboxComponent implements Component {
  public width: number;
  public height: number;
  public distance: number;
  public durationMs: number;
  public debug: boolean;

  /** last activation timestamp in ms (0 = inactive) */
  private lastActivatedAt: number = 0;

  /** last direction used on activation (if any) */
  public lastDirection?: DIRECTION;

  constructor(options: HitboxOptions) {
    this.width = options.width;
    this.height = options.height;
    this.distance = options.distance;
    this.durationMs = options.durationMs ?? 120;
    this.debug = !!options.debug;
  }

  /**
   * Activate the hitbox for a specific direction.
   * Always prefer passing scene.time.now from systems to maintain a single clock.
   * @param dir - direction of the hit (UP/DOWN/LEFT/RIGHT)
   * @param nowMs - current scene time in ms (scene.time.now)
   */
  activate(dir: DIRECTION, nowMs: number): void {
    this.lastDirection = dir;
    this.lastActivatedAt = nowMs;
  }

  /**
   * Manually disable the hitbox (force stop).
   */
  disable(): void {
    this.lastActivatedAt = 0;
    this.lastDirection = undefined;
  }

  /**
   * Whether the hitbox is currently active (based on durationMs).
   * Expects caller to pass scene.time.now for deterministic timing.
   * @param nowMs - current scene time in ms
   */
  isActive(nowMs: number): boolean {
    if (this.lastActivatedAt <= 0) return false;
    if (this.durationMs <= 0) return true; // permanent if non-positive duration
    return nowMs - this.lastActivatedAt <= this.durationMs;
  }
}
