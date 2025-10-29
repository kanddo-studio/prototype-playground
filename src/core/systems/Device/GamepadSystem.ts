import Phaser from "phaser";
import { System, SystemUpdateProps } from "../_/_System";
import { InputComponent } from "../../components/Device/InputComponent";
import { LeftStickComponent } from "../../components/Device/LeftStickComponent";
import { RightStickComponent } from "../../components/Device/RightStickComponent";
import { MissingDependencyError } from "../../errors/MissingDependencyError";
import { KEYS } from "../../../types/keys.enum";
import {
  DEFAULT_BUTTON_THRESHOLD,
  GAMEPAD_BUTTONS,
} from "../../../types/gamepad";

/**
 * Reads gamepad inputs and updates:
 * - InputComponent (buttons + left stick as arrow keys)
 * - LeftStickComponent (left stick raw values with deadzone)
 * - RightStickComponent (right stick raw values with deadzone)
 */
export class GamepadSystem implements System {
  private pad?: Phaser.Input.Gamepad.Gamepad;

  private readonly dPadButtonMap: Record<number, string> = {
    [GAMEPAD_BUTTONS.DPAD_UP]: KEYS.UP,
    [GAMEPAD_BUTTONS.DPAD_DOWN]: KEYS.DOWN,
    [GAMEPAD_BUTTONS.DPAD_LEFT]: KEYS.LEFT,
    [GAMEPAD_BUTTONS.DPAD_RIGHT]: KEYS.RIGHT,
  };

  constructor(scene: Phaser.Scene) {
    const gamepad = scene.input?.gamepad;
    if (gamepad) {
      gamepad.once("connected", this.handleGamepadConnected.bind(this));
    }
  }

  private handleGamepadConnected(pad: Phaser.Input.Gamepad.Gamepad): void {
    this.pad = pad;
  }

  update({ entities }: SystemUpdateProps): void {
    if (!this.pad) return;

    const leftX = this.pad.axes[0]?.getValue() ?? 0;
    const leftY = this.pad.axes[1]?.getValue() ?? 0;
    const rightX = this.pad.axes[2]?.getValue() ?? 0;
    const rightY = this.pad.axes[3]?.getValue() ?? 0;

    entities.forEach((entity) => {
      // Process buttons + left stick -> InputComponent
      if (entity.has("input")) {
        const input = entity.get<InputComponent>("input");
        if (!input) {
          throw new MissingDependencyError(
            `Entity '${entity.id}' is missing 'input' component.`,
          );
        }
        input.clear();
        this.processButtonInputs(input);
        this.processLeftStickAsInput(input, leftX, leftY);
      }

      // Update LeftStickComponent
      if (entity.has("leftStick")) {
        const stick = entity.get<LeftStickComponent>("leftStick");
        if (stick && stick.enabled) {
          this.processLeftStickRaw(stick, leftX, leftY);
        }
      }

      // Update RightStickComponent
      if (entity.has("rightStick")) {
        const stick = entity.get<RightStickComponent>("rightStick");
        if (stick && stick.enabled) {
          this.processRightStickRaw(stick, rightX, rightY);
        }
      }
    });
  }

  /**
   * Maps D-pad buttons to arrow keys in InputComponent.
   */
  private processButtonInputs(inputComponent: InputComponent): void {
    if (!this.pad) return;

    Object.entries(this.dPadButtonMap).forEach(([buttonIndex, key]) => {
      const button = this.pad!.buttons[parseInt(buttonIndex)];
      if (button?.value) {
        inputComponent.add(key);
      } else {
        inputComponent.remove(key);
      }
    });
  }

  /**
   * Maps left stick axis to arrow keys based on threshold.
   * Used for character movement or UI navigation.
   */
  private processLeftStickAsInput(
    inputComponent: InputComponent,
    xAxis: number,
    yAxis: number,
  ): void {
    if (xAxis < -DEFAULT_BUTTON_THRESHOLD) {
      inputComponent.add(KEYS.LEFT);
    } else if (xAxis > DEFAULT_BUTTON_THRESHOLD) {
      inputComponent.add(KEYS.RIGHT);
    }

    if (yAxis < -DEFAULT_BUTTON_THRESHOLD) {
      inputComponent.add(KEYS.UP);
    } else if (yAxis > DEFAULT_BUTTON_THRESHOLD) {
      inputComponent.add(KEYS.DOWN);
    }
  }

  /**
   * Updates LeftStickComponent with raw axis values.
   * Applies component's own deadzone.
   */
  private processLeftStickRaw(
    stickComponent: LeftStickComponent,
    xAxis: number,
    yAxis: number,
  ): void {
    stickComponent.setAxes(xAxis, yAxis);
  }

  /**
   * Updates RightStickComponent with raw axis values.
   * Applies component's own deadzone.
   */
  private processRightStickRaw(
    stickComponent: RightStickComponent,
    xAxis: number,
    yAxis: number,
  ): void {
    stickComponent.setAxes(xAxis, yAxis);
  }
}
