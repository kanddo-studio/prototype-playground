import { Entity } from "kanji-ecs";
import Phaser from "phaser";
import { CameraComponent } from "../../components/CameraComponent";

type Dir = "idle" | "up" | "down" | "left" | "right";

export class CameraRightStickSystem {
  private pad?: Phaser.Input.Gamepad.Gamepad;
  private readonly deadzone = 0.3;
  private counterX = 0;
  private counterY = 0;
  private readonly maxCounter = 28;

  constructor(scene: Phaser.Scene) {
    if (scene.input?.gamepad) {
      scene.input.gamepad.once(
        "connected",
        (pad: Phaser.Input.Gamepad.Gamepad) => (this.pad = pad),
      );
    }
  }

  update(entities: Entity[], scene: Phaser.Scene) {
    entities.forEach((entity) => {
      const cameraComponent = entity.get<CameraComponent>("camera");

      if (!this.pad) return;

      if (!cameraComponent) {
        throw new Error("Error: Missing Component");
      }

      const x = this.pad.axes.length > 2 ? this.pad.axes[2].getValue() : 0;
      const y = this.pad.axes.length > 3 ? this.pad.axes[3].getValue() : 0;

      const ax = Math.abs(x);
      const ay = Math.abs(y);
      const actX = ax < this.deadzone ? 0 : x;
      const actY = ay < this.deadzone ? 0 : y;
      const camera = scene.cameras.main;

      const CAMERA_SCROLL_SPEED = 8;

      let dir: Dir = "idle";

      const canMoveX = this.counterX < this.maxCounter;
      const canMoveY = this.counterY < this.maxCounter;

      if (actX > 0) {
        if (canMoveX) camera.scrollX += CAMERA_SCROLL_SPEED;
        this.counterX++;
        dir = "right";
      } else if (actX < 0) {
        if (canMoveX) camera.scrollX -= CAMERA_SCROLL_SPEED;
        this.counterX++;
        dir = "left";
      } else {
        this.counterX = 0;
      }

      if (actY < 0) {
        if (canMoveY) camera.scrollY -= CAMERA_SCROLL_SPEED;
        this.counterY++;
        dir = "up";
      } else if (actY > 0) {
        if (canMoveY) camera.scrollY += CAMERA_SCROLL_SPEED;
        this.counterY++;
        dir = "down";
      } else {
        this.counterY = 0;
      }

      if (actX === 0 && actY === 0) {
        dir = "idle";
      }

      this.pad.buttons.forEach((button, index) => {
        if (button.pressed && Number(index) === 11) {
          dir = "up";
        }
      });

      cameraComponent.isFixed = dir === "idle";
    });
  }
}
