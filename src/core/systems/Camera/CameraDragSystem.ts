import Phaser from "phaser";
import { CameraComponent } from "../../components/CameraComponent";
import { System, SystemUpdateProps } from "../_/_System";
import { Entity } from "../../components/_/_Entity";
import { MouseDragComponent } from "../../components/Device/MouseDragComponent";
import { Component } from "../../components/_/_Component";
import { MissingComponentError } from "../../errors/MissingComponentError";

/**
 * - Consume MouseDragComponent state and apply drag behavior to the Phaser camera
 * - Update CameraComponent state via its public API (startDrag, endDrag, setFixed)
 *
 * Design notes:
 * - This system does NOT register input listeners (decoupled)
 * - Keeps same behavior as previous CameraDragNDropSystem:
 *   * pointerdown -> setFixed(false) + startDrag()
 *   * pointerup -> setFixed(true) + endDrag()
 *   * pointermove while dragging -> apply smooth scroll and update drag start
 *
 * - smoothFactor and dragMultiplier configurable via constructor
 */
export class CameraDragSystem implements System {
  private readonly smoothFactor: number;
  private readonly dragMultiplier: number;

  /**
   * @param scene - Phaser scene (used to read/modify main camera)
   * @param config - optional overrides for smoothFactor and dragMultiplier
   */
  constructor(
    private scene: Phaser.Scene,
    config?: { smoothFactor?: number; dragMultiplier?: number },
  ) {
    this.smoothFactor = config?.smoothFactor ?? 0.2;
    this.dragMultiplier = config?.dragMultiplier ?? 2;
  }

  update({ entities }: SystemUpdateProps): void {
    // Expect camera-related entities; iterate all to preserve original single-entity behavior if only one is supplied
    for (const entity of entities) {
      if (!entity.has("camera")) continue;
      if (!entity.has("mouseDrag")) continue;

      const cameraComponent = this.getComponent<CameraComponent>(
        entity,
        "camera",
      );
      const mouseComponent = this.getComponent<MouseDragComponent>(
        entity,
        "mouseDrag",
      );

      if (!mouseComponent || !mouseComponent.enabled) continue;

      // pointer down: start dragging if not already dragging
      if (mouseComponent.isPointerDown && !cameraComponent.isDragging) {
        cameraComponent.setFixed(false);
        cameraComponent.startDrag(
          mouseComponent.lastWorldX,
          mouseComponent.lastWorldY,
        );
        continue; // wait next frame for movement
      }

      // pointer released: end dragging if currently dragging
      if (!mouseComponent.isPointerDown && cameraComponent.isDragging) {
        cameraComponent.setFixed(true);
        cameraComponent.endDrag();
        continue;
      }

      // pointer move while dragging: apply movement
      if (mouseComponent.isPointerDown && cameraComponent.isDragging) {
        const camera = this.scene.cameras.main;

        const dragX =
          (mouseComponent.lastWorldX - cameraComponent.dragStartX) *
          this.dragMultiplier;
        const dragY =
          (mouseComponent.lastWorldY - cameraComponent.dragStartY) *
          this.dragMultiplier;

        // Apply smooth camera movement (preserve original scaling by zoom)
        camera.scrollX -= (dragX * this.smoothFactor) / cameraComponent.zoom;
        camera.scrollY -= (dragY * this.smoothFactor) / cameraComponent.zoom;

        // Update camera component's drag start to current pointer position
        cameraComponent.startDrag(
          mouseComponent.lastWorldX,
          mouseComponent.lastWorldY,
        );
      }
    }
  }

  /**
   * Validates entity has required component and returns it.
   * @param entity - The entity to check.
   * @param componentName - The name of the component to validate.
   * @returns The component instance.
   * @throws MissingComponentError if component is missing.
   */
  private getComponent<T extends Component>(
    entity: Entity,
    componentName: string,
  ): T {
    const component = entity.get<T>(componentName);
    if (!component) {
      throw new MissingComponentError(entity.id, componentName);
    }
    return component;
  }
}
