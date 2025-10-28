import Phaser from "phaser";
import { System, SystemUpdateProps } from "../_/_System";
import { Entity } from "../../components/_/_Entity";
import { MouseDragComponent } from "../../components/Device/MouseDragComponent";

/**
 * Responsibility:
 * - Attach pointer listeners to the Phaser scene
 * - Update MouseDragComponent instances on entities passed in via update()
 *
 * Design notes:
 * - Listener installed in constructor and removed in destroy()
 * - The system keeps a live reference to the entities array provided each update()
 * - It only mutates MouseDragComponent (does NOT touch CameraComponent)
 */
export class PointerSystem implements System {
  private entities: Entity[] = [];

  private pointerDownHandler: (pointer: Phaser.Input.Pointer) => void;
  private pointerUpHandler: (pointer: Phaser.Input.Pointer) => void;
  private pointerMoveHandler: (pointer: Phaser.Input.Pointer) => void;

  /**
   * @param scene - Phaser scene to bind input events
   */
  constructor(private scene: Phaser.Scene) {
    this.pointerDownHandler = (pointer: Phaser.Input.Pointer) => {
      for (const e of this.entities) {
        if (!e.has("mouseDrag")) continue;
        const md = e.get<MouseDragComponent>("mouseDrag");
        if (md && md.enabled) {
          md.isPointerDown = true;
          md.lastWorldX = pointer.worldX;
          md.lastWorldY = pointer.worldY;
        }
      }
    };

    this.pointerUpHandler = (_pointer: Phaser.Input.Pointer) => {
      for (const e of this.entities) {
        if (!e.has("mouseDrag")) continue;
        const md = e.get<MouseDragComponent>("mouseDrag");
        if (md && md.enabled) {
          md.isPointerDown = false;
        }
      }
    };

    this.pointerMoveHandler = (pointer: Phaser.Input.Pointer) => {
      for (const e of this.entities) {
        if (!e.has("mouseDrag")) continue;
        const md = e.get<MouseDragComponent>("mouseDrag");
        if (md && md.enabled) {
          md.lastWorldX = pointer.worldX;
          md.lastWorldY = pointer.worldY;
        }
      }
    };

    // Register listeners
    this.scene.input.on("pointerdown", this.pointerDownHandler);
    this.scene.input.on("pointerup", this.pointerUpHandler);
    this.scene.input.on("pointerupoutside", this.pointerUpHandler);
    this.scene.input.on("pointermove", this.pointerMoveHandler);
  }

  /**
   * Store reference to matching entities so handlers can update components.
   */
  update({ entities }: SystemUpdateProps): void {
    this.entities = entities;
  }

  /**
   * Remove listeners to avoid leaks. Call when scene/system is destroyed.
   */
  destroy(): void {
    this.scene.input.off("pointerdown", this.pointerDownHandler);
    this.scene.input.off("pointerup", this.pointerUpHandler);
    this.scene.input.off("pointerupoutside", this.pointerUpHandler);
    this.scene.input.off("pointermove", this.pointerMoveHandler);
  }
}