import Phaser from "phaser";
import { CameraComponent } from "../../components/Camera";
import { System, SystemUpdateProps } from "../../components/System";

type Dir = "idle" | "up" | "down" | "left" | "right";

/**
 * System responsible for controlling camera movement using the right stick of a gamepad.
 *
 * This system allows players to move the camera by using the right analog stick
 * or by pressing the right bumper (button 11) to move the camera upward.
 *
 * Features:
 * - Right stick camera control with deadzone filtering
 * - Movement counter to limit continuous movement
 * - Right bumper override for upward movement
 * - Camera fixed state when no input is detected
 */
export class CameraRightStickSystem implements System {
  private pad?: Phaser.Input.Gamepad.Gamepad;
  private readonly camera: Phaser.Cameras.Scene2D.Camera;
  private readonly deadzone = 0.3;
  private counterX = 0;
  private counterY = 0;
  private readonly maxCounter = 28;
  private readonly CAMERA_SCROLL_SPEED = 8;

  /**
   * Creates a new CameraRightStickSystem.
   * @param scene - The Phaser scene containing the camera to control.
   */
  constructor(scene: Phaser.Scene) {
    // Store reference to the main camera
    this.camera = scene.cameras.main;

    // Set up gamepad connection listener
    const gamepad = scene.input?.gamepad;
    if (gamepad) {
      gamepad.once(
        "connected",
        (pad: Phaser.Input.Gamepad.Gamepad) => (this.pad = pad),
      );
    }
  }

  /**
   * Updates the camera position based on gamepad right stick input.
   * @param entities - The list of entities to process.
   */
  update({ entities }: SystemUpdateProps) {
    entities.forEach((entity) => {
      const cameraComponent = entity.get<CameraComponent>("camera");

      // Skip if no gamepad is connected
      if (!this.pad) return;

      // Validate required components
      if (!cameraComponent) {
        throw new Error("Error: Missing Camera Component");
      }

      // Get right stick axis values (axes 2 and 3)
      const x = this.pad.axes.length > 2 ? this.pad.axes[2].getValue() : 0;
      const y = this.pad.axes.length > 3 ? this.pad.axes[3].getValue() : 0;

      // Apply deadzone filtering
      const actX = Math.abs(x) < this.deadzone ? 0 : x;
      const actY = Math.abs(y) < this.deadzone ? 0 : y;

      // Process camera movement
      const dir = this.processCameraMovement(actX, actY);

      // Update camera fixed state
      cameraComponent.isFixed = dir === "idle";
    });
  }

  /**
   * Processes camera movement based on axis inputs and button presses.
   * @param actX - The filtered x-axis value.
   * @param actY - The filtered y-axis value.
   * @returns The direction of movement.
   */
  private processCameraMovement(actX: number, actY: number): Dir {
    let dir: Dir = "idle";

    // Process horizontal movement
    dir = this.processHorizontalMovement(actX, dir);

    // Process vertical movement
    dir = this.processVerticalMovement(actY, dir);

    // Check for button override (right bumper)
    if (this.isRightBumperPressed()) {
      dir = "up";
    }

    // Reset counters when no movement
    if (actX === 0) this.counterX = 0;
    if (actY === 0) this.counterY = 0;

    return dir;
  }

  /**
   * Processes horizontal camera movement.
   * @param actX - The filtered x-axis value.
   * @param currentDir - The current movement direction.
   * @returns Updated movement direction.
   */
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

  /**
   * Processes vertical camera movement.
   * @param actY - The filtered y-axis value.
   * @param currentDir - The current movement direction.
   * @returns Updated movement direction.
   */
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

  /**
   * Checks if the right bumper button (button 11) is pressed.
   * @returns True if the right bumper is pressed.
   */
  private isRightBumperPressed(): boolean {
    if (!this.pad) return false;

    // Check if button 11 (typically right bumper) is pressed
    return this.pad.buttons.some(
      (button, index) => index === 11 && button.pressed,
    );
  }
}
