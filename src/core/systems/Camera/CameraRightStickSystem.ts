import Phaser from "phaser";
import { CameraComponent } from "../../components/CameraComponent";
import { System, SystemUpdateProps } from "../_/_System";
import { RightStickComponent } from "../../components/Device/RightStickComponent";

type Dir = "idle" | "up" | "down" | "left" | "right";

/**
 * Controls camera movement using RightStickComponent values.
 * Does NOT access gamepad directly — fully decoupled.
 *
 * Features:
 * - Right stick camera control with deadzone already applied
 * - Movement counter to limit continuous movement
 * - Right bumper override (button 11) handled via external system
 * - Camera fixed state when no input is detected
 */
export class CameraRightStickSystem implements System {
  private readonly camera: Phaser.Cameras.Scene2D.Camera;
  private counterX = 0;
  private counterY = 0;
  private readonly maxCounter = 28;
  private readonly CAMERA_SCROLL_SPEED = 8;

  constructor(scene: Phaser.Scene) {
    this.camera = scene.cameras.main;
  }

  update({ entities }: SystemUpdateProps): void {
    for (const entity of entities) {
      if (!entity.has("camera")) continue;
      if (!entity.has("rightStick")) continue;

      const cameraComponent = entity.get<CameraComponent>("camera");
      const rightStick = entity.get<RightStickComponent>("rightStick");

      const actX = rightStick.xAxis;
      const actY = rightStick.yAxis;

      const dir = this.processCameraMovement(actX, actY);
      cameraComponent.setFixed(dir === "idle");
    }
  }

  private processCameraMovement(actX: number, actY: number): Dir {
    let dir: Dir = "idle";

    dir = this.processHorizontalMovement(actX, dir);
    dir = this.processVerticalMovement(actY, dir);

    if (actX === 0) this.counterX = 0;
    if (actY === 0) this.counterY = 0;

    return dir;
  }

  private processHorizontalMovement(actX: number, currentDir: Dir): Dir {
    const canMoveX = this.counterX < this.maxCounter;

    if (actX > 0) {
      if (canMoveX) this.camera.scrollX += this.CAMERA_SCROLL_SPEED;
      this.counterX++;
      return "right";
    } else if (actX < 0) {
      if (canMoveX) this.camera.scrollX -= this.CAMERA_SCROLL_SPEED;
      this.counterX++;
      return "left";
    }

    return currentDir;
  }

  private processVerticalMovement(actY: number, currentDir: Dir): Dir {
    const canMoveY = this.counterY < this.maxCounter;

    if (actY < 0) {
      if (canMoveY) this.camera.scrollY -= this.CAMERA_SCROLL_SPEED;
      this.counterY++;
      return "up";
    } else if (actY > 0) {
      if (canMoveY) this.camera.scrollY += this.CAMERA_SCROLL_SPEED;
      this.counterY++;
      return "down";
    }

    return currentDir;
  }
}