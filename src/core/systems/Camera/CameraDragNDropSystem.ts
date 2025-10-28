import Phaser from "phaser";
import { CameraComponent } from "../../components/Camera";
import { System, SystemUpdateProps } from "../_System";
import { Entity } from "../../components/Entity";

/**
 * System responsible for handling camera drag and drop functionality.
 *
 * This system allows users to drag the camera view by clicking and dragging
 * on the scene. It manages the drag state in the CameraComponent and applies
 * the movement to the Phaser camera.
 *
 * Design notes:
 * - Listens for pointer events in constructor (one-time setup)
 * - Updates CameraComponent state based on drag interactions
 * - Applies camera movement directly to Phaser camera
 * - Uses smooth factor for natural drag feel
 */
export class CameraDragNDropSystem implements System {
  private readonly smoothFactor: number = 0.2;
  private readonly dragMultiplier: number = 2;
  private cameraEntity: Entity | null = null;

  /**
   * Creates a new CameraDragNDropSystem and sets up pointer event listeners.
   * @param scene - The Phaser scene containing the camera to control.
   */
  constructor(private scene: Phaser.Scene) {
    this.setupEventListeners();
  }

  /**
   * Sets up all pointer event listeners.
   */
  private setupEventListeners(): void {
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.cameraEntity) {
        this.handlePointerDown(this.cameraEntity, pointer);
      }
    });

    this.scene.input.on("pointerup", () => {
      if (this.cameraEntity) {
        this.handlePointerUp(this.cameraEntity);
      }
    });

    this.scene.input.on("pointerupoutside", () => {
      if (this.cameraEntity) {
        this.handlePointerUp(this.cameraEntity);
      }
    });

    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.cameraEntity) {
        this.handlePointerMove(this.cameraEntity, pointer);
      }
    });
  }

  /**
   * Updates the camera entity reference.
   * @param entities - The list of entities to process (expects exactly one camera entity).
   */
  update({ entities }: SystemUpdateProps): void {
    // Store reference to camera entity for use in event listeners
    if (entities.length > 0) {
      this.cameraEntity = entities[0];
    }
  }

  /**
   * Handles pointer down event - starts camera drag.
   * @param entity - The entity containing the CameraComponent.
   * @param pointer - The pointer event data.
   */
  private handlePointerDown(
    entity: Entity,
    pointer: Phaser.Input.Pointer,
  ): void {
    const cameraComponent = this.validateAndGet(entity);

    // Start dragging
    cameraComponent.setFixed(false);
    cameraComponent.startDrag(pointer.worldX, pointer.worldY);
  }

  /**
   * Handles pointer up event - stops camera drag.
   * @param entity - The entity containing the CameraComponent.
   */
  private handlePointerUp(entity: Entity): void {
    const cameraComponent = this.validateAndGet(entity);

    // Stop dragging
    cameraComponent.setFixed(true);
    cameraComponent.endDrag();
  }

  /**
   * Handles pointer move event - updates camera position during drag.
   * @param entity - The entity containing the CameraComponent.
   * @param pointer - The pointer event data.
   */
  private handlePointerMove(
    entity: Entity,
    pointer: Phaser.Input.Pointer,
  ): void {
    const cameraComponent = this.validateAndGet(entity);

    // Only process if dragging
    if (!cameraComponent.isDragging) return;

    const camera = this.scene.cameras.main;

    // Calculate drag delta
    const dragX =
      (pointer.worldX - cameraComponent.dragStartX) * this.dragMultiplier;
    const dragY =
      (pointer.worldY - cameraComponent.dragStartY) * this.dragMultiplier;

    // Apply smooth camera movement
    camera.scrollX -= (dragX * this.smoothFactor) / cameraComponent.zoom;
    camera.scrollY -= (dragY * this.smoothFactor) / cameraComponent.zoom;

    // Update drag start position
    cameraComponent.startDrag(pointer.worldX, pointer.worldY);
  }

  /**
   * Validates entity has required CameraComponent and returns it.
   * @param entity - The entity to validate.
   * @returns The validated CameraComponent.
   * @throws Error if component is missing.
   */
  private validateAndGet(entity: Entity): CameraComponent {
    const component = entity.get<CameraComponent>("camera");
    if (!component) {
      throw new Error("Error: Missing CameraComponent");
    }
    return component;
  }
}
