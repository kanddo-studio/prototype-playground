import { Component } from "./Component";
import Phaser from "phaser";

/**
 * Component to store camera-related state and configuration.
 */
export class CameraComponent implements Component {
  /**
   * The zoom level of the camera.
   */
  public zoom: number;

  /**
   * Minimum allowed zoom.
   */
  public minZoom: number;

  /**
   * Maximum allowed zoom.
   */
  public maxZoom: number;

  /**
   * Whether the camera is currently being dragged.
   */
  public isDragging: boolean;

  /**
   * Starting X position of drag.
   */
  public dragStartX: number;

  /**
   * Starting Y position of drag.
   */
  public dragStartY: number;

  /**
   * Whether the camera is fixed to follow a target.
   */
  public isFixed: boolean;

  /**
   * The Phaser GameObject that the camera should follow.
   */
  public target?: Phaser.GameObjects.GameObject;

  /**
   * Constructs a new CameraComponent.
   * @param params - Object containing optional camera configuration.
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
    this.zoom = params.zoom ?? 1;
    this.minZoom = params.minZoom ?? 0.5;
    this.maxZoom = params.maxZoom ?? 3;
    this.isDragging = params.isDragging ?? false;
    this.dragStartX = params.dragStartX ?? 0;
    this.dragStartY = params.dragStartY ?? 0;
    this.isFixed = params.isFixed ?? true;
    this.target = params.target;
  }
}
