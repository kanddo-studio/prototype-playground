// src/components/Camera.ts
import { Component } from "./_Component";
import Phaser from "phaser";

/**
 * Component that stores camera-related state and configuration for an entity.
 *
 * Responsibilities:
 * - Serve as a plain data container for camera state used by CameraSystem(s).
 * - Provide small, intention-revealing helpers (setZoom, startDrag, setTarget, etc).
 *
 * Design notes:
 * - This component should NOT contain side-effects such as modifying the Phaser camera directly.
 *   Those responsibilities belong to CameraSystem(s).
 * - Keep this component serializable for debugging and snapshotting.
 * - Separate concerns: zoom state vs drag state vs follow state.
 */
export class CameraComponent implements Component {
  /**
   * The current zoom level of the camera.
   * Typically 1.0 = 100%, values > 1 zoom in, < 1 zoom out.
   */
  public zoom: number;

  /**
   * Minimum allowed zoom level.
   */
  public minZoom: number;

  /**
   * Maximum allowed zoom level.
   */
  public maxZoom: number;

  /**
   * Whether the camera is currently being dragged by user input.
   */
  public isDragging: boolean;

  /**
   * Starting X position of drag (in world coordinates).
   */
  public dragStartX: number;

  /**
   * Starting Y position of drag (in world coordinates).
   */
  public dragStartY: number;

  /**
   * Whether the camera is fixed to follow a target.
   * When true, camera ignores drag and attempts to center on target.
   */
  public isFixed: boolean;

  /**
   * Optional Phaser GameObject that the camera should follow.
   * If undefined, camera uses position/velocity from PositionComponent or other sources.
   */
  public target?: Phaser.GameObjects.GameObject;

  /**
   * Creates a new CameraComponent.
   * @param params - Object containing camera configuration.
   */
  constructor(params: {
    target: Phaser.GameObjects.GameObject;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    isDragging?: boolean;
    dragStartX?: number;
    dragStartY?: number;
    isFixed?: boolean;
  }) {
    this.target = params.target;
    this.zoom = params.zoom ?? 1;
    this.minZoom = params.minZoom ?? 0.5;
    this.maxZoom = params.maxZoom ?? 3;
    this.isDragging = params.isDragging ?? false;
    this.dragStartX = params.dragStartX ?? 0;
    this.dragStartY = params.dragStartY ?? 0;
    this.isFixed = params.isFixed ?? true;
  }

  /**
   * Sets the camera zoom level, clamped between minZoom and maxZoom.
   * @param zoom - new zoom level
   * @returns this for chaining
   */
  public setZoom(zoom: number): this {
    this.zoom = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
    return this;
  }

  /**
   * Starts a drag operation at the given world coordinates.
   * @param x - world x coordinate where drag started
   * @param y - world y coordinate where drag started
   * @returns this for chaining
   */
  public startDrag(x: number, y: number): this {
    this.isDragging = true;
    this.dragStartX = x;
    this.dragStartY = y;
    return this;
  }

  /**
   * Ends the current drag operation.
   * @returns this for chaining
   */
  public endDrag(): this {
    this.isDragging = false;
    return this;
  }

  /**
   * Sets the camera target to follow.
   * @param target - new target GameObject (can be undefined to stop following)
   * @returns this for chaining
   */
  public setTarget(target?: Phaser.GameObjects.GameObject): this {
    this.target = target;
    return this;
  }

  /**
   * Sets whether the camera is fixed to follow its target.
   * @param isFixed - whether to fix camera to target
   * @returns this for chaining
   */
  public setFixed(isFixed: boolean): this {
    this.isFixed = isFixed;
    return this;
  }

  /**
   * Returns a plain object for debugging/serialization.
   */
  public toObject(): {
    zoom: number;
    minZoom: number;
    maxZoom: number;
    isDragging: boolean;
    dragStartX: number;
    dragStartY: number;
    isFixed: boolean;
    hasTarget: boolean;
  } {
    return {
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      isDragging: this.isDragging,
      dragStartX: this.dragStartX,
      dragStartY: this.dragStartY,
      isFixed: this.isFixed,
      hasTarget: !!this.target,
    };
  }

  /**
   * Creates a shallow clone of this component.
   */
  public clone(): CameraComponent {
    return new CameraComponent({
      target: this.target!,
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      isDragging: this.isDragging,
      dragStartX: this.dragStartX,
      dragStartY: this.dragStartY,
      isFixed: this.isFixed,
    });
  }
}
