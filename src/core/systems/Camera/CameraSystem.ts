import Phaser from "phaser";
import { CameraComponent } from "../../components/Camera";
import { System, SystemUpdateProps } from "../_System";
import { Entity } from "../../components/Entity";

/**
 * System responsible for managing camera following behavior based on CameraComponent state.
 *
 * This system handles:
 * - Starting/stopping camera follow based on isFixed and isDragging flags
 * - Validating required components and target references
 *
 * Design notes:
 * - Does not modify CameraComponent directly (read-only)
 * - Delegates to Phaser camera API for actual following logic
 */
export class CameraSystem implements System {
  /**
   * Creates a new CameraSystem.
   * @param scene - The Phaser scene containing the camera to control.
   */
  constructor(private scene: Phaser.Scene) {}

  /**
   * Updates camera following behavior based on CameraComponent state.
   * @param entities - The list of entities to process (expects exactly one camera entity).
   * @throws Error if CameraComponent is missing or malformed.
   */
  update({ entities }: SystemUpdateProps): void {
    // Process exactly one camera entity (assumes single camera per scene)
    if (entities.length === 0) {
      throw new Error("Error: No entities provided to CameraSystem");
    }

    const entity = entities[0];
    const cameraComponent = this.validateAndGet(entity);

    // Validate target exists
    if (!cameraComponent.target) {
      throw new Error("Error: CameraComponent missing target GameObject");
    }

    // Apply camera behavior based on state
    if (!cameraComponent.isDragging && cameraComponent.isFixed) {
      this.startFollowing(cameraComponent.target);
    } else {
      this.stopFollowing();
    }
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

  /**
   * Starts following the target GameObject with the main camera.
   * @param target - The GameObject to follow.
   */
  private startFollowing(target: Phaser.GameObjects.GameObject): void {
    this.scene.cameras.main.startFollow(target);
  }

  /**
   * Stops following any target with the main camera.
   */
  private stopFollowing(): void {
    this.scene.cameras.main.stopFollow();
  }
}
