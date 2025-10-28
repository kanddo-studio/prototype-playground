import Phaser from "phaser";
import { CameraComponent } from "../../components/Camera";
import { System, SystemUpdateProps } from "../_System";
import { Entity } from "../../components/Entity";

/**
 * System responsible for handling camera zoom based on mouse wheel input.
 *
 * This system listens for mouse wheel events and adjusts the camera zoom level
 * stored in the CameraComponent, then applies it to the Phaser camera.
 *
 * Design notes:
 * - Listens for wheel events in constructor (one-time setup)
 * - Updates CameraComponent.zoom and applies to Phaser camera
 * - Uses zoom factor for smooth zoom increments
 * - Clamps zoom values between minZoom and maxZoom from component
 */
export class CameraZoomSystem implements System {
  private readonly zoomFactor: number = 0.1;
  private cameraEntity: Entity | null = null;

  /**
   * Creates a new CameraZoomSystem and sets up mouse wheel listener.
   * @param scene - The Phaser scene containing the camera to control.
   */
  constructor(private scene: Phaser.Scene) {
    this.setupWheelListener();
  }

  /**
   * Sets up the mouse wheel event listener.
   */
  private setupWheelListener(): void {
    this.scene.input.on(
      "wheel",
      (
        _pointer: Phaser.Input.Pointer,
        _gameObjects: Phaser.GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number,
        _deltaZ: number,
      ) => {
        if (this.cameraEntity) {
          this.processWheelInput(this.cameraEntity, deltaY);
        }
      },
    );
  }

  /**
   * Updates the camera entity reference.
   * @param entities - The list of entities to process (expects exactly one camera entity).
   */
  update({ entities }: SystemUpdateProps): void {
    // Store reference to camera entity for use in event listener
    if (entities.length > 0) {
      this.cameraEntity = entities[0];
    }
  }

  /**
   * Processes wheel input and updates camera zoom.
   * @param entity - The entity containing the CameraComponent.
   * @param deltaY - The mouse wheel delta value.
   */
  private processWheelInput(entity: Entity, deltaY: number): void {
    const cameraComponent = this.validateAndGet(entity);

    // Adjust zoom based on wheel direction
    if (deltaY > 0) {
      cameraComponent.setZoom(cameraComponent.zoom - this.zoomFactor);
    } else if (deltaY < 0) {
      cameraComponent.setZoom(cameraComponent.zoom + this.zoomFactor);
    }

    // Apply zoom to Phaser camera
    this.scene.cameras.main.setZoom(cameraComponent.zoom);
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
