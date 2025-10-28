import Phaser from "phaser";

import { System, SystemUpdateProps } from "../_/_System";
import { MouseWheelComponent } from "../../components/Device/MouseWheelComponent";
import { CameraComponent } from "../../components/CameraComponent";

/**
 * CameraZoomSystem (refactored)
 * - No longer registers input listeners.
 * - Reads mouse wheel input from MouseWheelComponent attached to the same entity
 *   and applies zoom changes to the CameraComponent.
 *
 * Behavior preserved:
 * - If deltaY > 0 => zoom decreases by zoomFactor.
 * - If deltaY < 0 => zoom increases by zoomFactor.
 * - After applying, it applies the resulting zoom to the Phaser camera.
 */
export class CameraZoomSystem implements System {
  /**
   * Create with a scene reference to apply camera changes.
   * @param scene - Phaser.Scene instance with a main camera.
   */
  constructor(private scene: Phaser.Scene) {}

  /**
   * Update is called with entities that match camera-related archetype.
   * Each entity is expected to have a CameraComponent and optionally a MouseWheelComponent.
   */
  update({ entities }: SystemUpdateProps): void {
    for (const entity of entities) {
      // camera component is required for this system to operate
      if (!entity.has("camera")) {
        continue;
      }

      const cameraComponent = entity.get<CameraComponent>("camera");

      // mouse wheel component is optional; if absent, nothing to do
      if (!entity.has("mouseWheel")) {
        continue;
      }

      const mouse = entity.get<MouseWheelComponent>("mouseWheel");

      // consume accumulated wheel delta, if any
      const delta = mouse.consumeDelta();
      if (delta === 0) {
        continue;
      }

      const zoomFactor = 0.1;

      // compute zoom change preserving previous behavior:
      // deltaY > 0 -> decrease zoom; deltaY < 0 -> increase
      const change = -Math.sign(delta) * zoomFactor;

      // apply to component (component should clamp within min/max itself)
      cameraComponent.setZoom(cameraComponent.zoom + change);

      // apply to Phaser camera
      this.scene.cameras.main.setZoom(cameraComponent.zoom);
    }
  }
}
