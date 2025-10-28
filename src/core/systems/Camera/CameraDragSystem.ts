import Phaser from "phaser";
import { CameraComponent } from "../../components/CameraComponent";
import { System, SystemUpdateProps } from "../_/_System";
import { Entity } from "../../components/_/_Entity";
import { MouseDragComponent } from "../../components/Device/MouseDragComponent";

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

      const cameraComponent = this.validateAndGet(entity);
      const mouse = entity.get<MouseDragComponent>("mouseDrag");

      if (!mouse || !mouse.enabled) continue;

      // pointer down: start dragging if not already dragging
      if (mouse.isPointerDown && !cameraComponent.isDragging) {
        cameraComponent.setFixed(false);
        cameraComponent.startDrag(mouse.lastWorldX, mouse.lastWorldY);
        continue; // wait next frame for movement
      }

      // pointer released: end dragging if currently dragging
      if (!mouse.isPointerDown && cameraComponent.isDragging) {
        cameraComponent.setFixed(true);
        cameraComponent.endDrag();
        continue;
      }

      // pointer move while dragging: apply movement
      if (mouse.isPointerDown && cameraComponent.isDragging) {
        const camera = this.scene.cameras.main;

        const dragX =
          (mouse.lastWorldX - cameraComponent.dragStartX) * this.dragMultiplier;
        const dragY =
          (mouse.lastWorldY - cameraComponent.dragStartY) * this.dragMultiplier;

        // Apply smooth camera movement (preserve original scaling by zoom)
        camera.scrollX -= (dragX * this.smoothFactor) / cameraComponent.zoom;
        camera.scrollY -= (dragY * this.smoothFactor) / cameraComponent.zoom;

        // Update camera component's drag start to current pointer position
        cameraComponent.startDrag(mouse.lastWorldX, mouse.lastWorldY);
      }
    }
  }

  private validateAndGet(entity: Entity): CameraComponent {
    const component = entity.get<CameraComponent>("camera");
    if (!component) {
      throw new Error("Error: Missing CameraComponent");
    }
    return component;
  }
}
