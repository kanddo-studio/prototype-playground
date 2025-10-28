import { Component } from "../_/_Component";

/**
 * Component that stores mouse wheel input state for an entity (e.g. a camera entity).
 * This component is a pure data container with helper methods for accumulation/reset.
 * MouseWheelComponent stores accumulated wheel delta and configuration for zooming.
 */
export class MouseWheelComponent implements Component {
  /**
   * Accumulated wheel delta since last consumption by a system.
   * Positive values follow native deltaY semantics.
   */
  public accumulatedDeltaY: number = 0;

  /**
   * Zoom increment applied per wheel "step". Configurable to avoid hardcoding.
   */

  /**
   * If false, wheel events will be ignored for this entity.
   */
  public enabled: boolean;

  /**
   * Create a MouseWheelComponent.
   * @param enabled - Whether this component is active (default true)
   */
  constructor(enabled = true) {
    this.enabled = enabled;
  }

  /**
   * Add a wheel delta to the accumulator.
   * @param deltaY - raw deltaY from the wheel event
   */
  public addDelta(deltaY: number): void {
    this.accumulatedDeltaY += deltaY;
  }

  /**
   * Consume and reset the accumulated delta.
   * Returns the accumulated value before reset.
   */
  public consumeDelta(): number {
    const val = this.accumulatedDeltaY;
    this.accumulatedDeltaY = 0;
    return val;
  }
}
