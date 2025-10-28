/**
 * Lightweight component that stores pointer drag state.
 * This component is intended to be attached to entities that should react to pointer drag (e.g. camera entity).
 *
 * Responsibilities:
 * - Store whether pointer is down
 * - Store last world coordinates reported by pointer events
 * - Be a pure data container (no direct scene/camera logic)
 */

export interface Component {} // keep compatibility with existing minimal interface

export class MouseDragComponent implements Component {
  /**
   * True while pointer is pressed.
   */
  public isPointerDown: boolean = false;

  /**
   * Last world X reported by pointer events.
   */
  public lastWorldX: number = 0;

  /**
   * Last world Y reported by pointer events.
   */
  public lastWorldY: number = 0;

  /**
   * Whether this component should process input.
   */
  public enabled: boolean = true;

  /**
   * Create a MouseDragComponent.
   * @param enabled - initial enabled state (default true)
   */
  constructor(enabled = true) {
    this.enabled = enabled;
  }
}
