import Phaser from "phaser";
import { System, SystemUpdateProps } from "../_/_System";
import { Entity } from "../../components/_/_Entity";
import { MouseWheelComponent } from "../../components/Device/MouseWheelComponent";

/**
 * MouseSystem
 * Responsible for listening to scene mouse wheel events and updating the
 * MouseWheelComponent(s) attached to entities passed into the system.
 *
 * Design notes:
 * - Listener is installed once in constructor.
 * - The system keeps a live reference to the entities array provided each update.
 * - When a wheel event fires, it updates all entities that have a MouseWheelComponent and are enabled.
 * - The listener is removable via destroy() to avoid leaks.
 */
export class MouseSystem implements System {
  private entities: Entity[] = [];
  private wheelHandler: (
    pointer: Phaser.Input.Pointer,
    gameObjects: Phaser.GameObjects.GameObject[],
    deltaX: number,
    deltaY: number,
    deltaZ: number,
  ) => void;

  /**
   * Construct the MouseSystem and attach wheel listener to the scene.
   * @param scene - Phaser scene to bind input events to.
   */
  constructor(private scene: Phaser.Scene) {
    this.wheelHandler = (
      _pointer: Phaser.Input.Pointer,
      _gameObjects: Phaser.GameObjects.GameObject[],
      _deltaX: number,
      deltaY: number,
      _deltaZ: number,
    ) => {
      // Update all entities that have a mouse wheel component
      for (const entity of this.entities) {
        if (!entity.has("mouseWheel")) continue;
        const mw = entity.get<MouseWheelComponent>("mouseWheel");
        if (mw && mw.enabled) {
          mw.addDelta(deltaY);
        }
      }
    };

    this.scene.input.on("wheel", this.wheelHandler);
  }

  /**
   * Update is called by the ECS manager with the matching entities.
   * We simply store the array reference so the wheel listener can update components.
   */
  update({ entities }: SystemUpdateProps): void {
    this.entities = entities;
  }

  /**
   * Remove the wheel listener to prevent memory leaks when the system is destroyed.
   */
  destroy(): void {
    this.scene.input.off("wheel", this.wheelHandler);
  }
}
