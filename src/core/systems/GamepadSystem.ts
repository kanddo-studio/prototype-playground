import Phaser from "phaser";
import { System, SystemUpdateProps } from "./_System";
import { InputComponent } from "../components/Input";
import { MissingDependencyError } from "../errors/MissingDependencyError";

/**
 * System responsible for handling gamepad input and updating the InputComponent accordingly.
 *
 * This system listens for gamepad connections and translates gamepad inputs (axes and buttons)
 * into keyboard-like key events that can be processed by the game's input system.
 *
 * Supported inputs:
 * - Left stick axes (converted to arrow keys)
 * - D-pad buttons (mapped directly to arrow keys)
 */
export class GamepadSystem implements System {
  private pad?: Phaser.Input.Gamepad.Gamepad;
  private readonly axisThreshold: number = 0.5;

  /**
   * Button mapping from gamepad buttons to keyboard keys
   * Index corresponds to Phaser gamepad button indices:
   * 12: D-pad Up
   * 13: D-pad Down
   * 14: D-pad Left
   * 15: D-pad Right
   */
  private readonly buttonKeyMap: Record<number, string> = {
    12: "ArrowUp",
    13: "ArrowDown",
    14: "ArrowLeft",
    15: "ArrowRight",
  };

  /**
   * Creates a new GamepadSystem and listens for gamepad connection.
   * @param scene - The Phaser scene to bind gamepad input to.
   */
  constructor(scene: Phaser.Scene) {
    const gamepad = scene.input?.gamepad;
    if (gamepad) {
      gamepad.once("connected", this.handleGamepadConnected.bind(this));
    }
  }

  /**
   * Handler called when a gamepad is connected.
   * @param pad - The connected gamepad instance.
   */
  private handleGamepadConnected(pad: Phaser.Input.Gamepad.Gamepad): void {
    this.pad = pad;
  }

  /**
   * Updates the input state of each entity based on gamepad buttons and axes.
   * @param entities - The list of entities to update.
   * @throws MissingDependencyError if required components are missing.
   */
  update({ entities }: SystemUpdateProps): void {
    // Early exit if no gamepad is connected
    if (!this.pad) {
      return;
    }

    // Cache axis values to avoid repeated access
    const xAxis = this.pad.axes[0]?.getValue() ?? 0;
    const yAxis = this.pad.axes[1]?.getValue() ?? 0;

    entities.forEach((entity) => {
      const inputComponent = entity.get<InputComponent>("input");
      if (!inputComponent) {
        throw new MissingDependencyError(
          `Entity '${entity.id}' is missing 'input' component.`,
        );
      }

      // Reset previous input state
      inputComponent.clear();

      // Process button inputs
      this.processButtonInputs(inputComponent);

      // Process axis inputs
      this.processAxisInputs(inputComponent, xAxis, yAxis);
    });
  }

  /**
   * Processes gamepad button inputs and maps them to keyboard keys.
   * @param inputComponent - The input component to update.
   */
  private processButtonInputs(inputComponent: InputComponent): void {
    if (!this.pad) return;

    Object.entries(this.buttonKeyMap).forEach(([buttonIndex, key]) => {
      const button = this.pad!.buttons[parseInt(buttonIndex)];
      if (button?.value) {
        inputComponent.add(key);
      }
    });
  }

  /**
   * Processes gamepad axis inputs and maps them to keyboard keys based on threshold.
   * @param inputComponent - The input component to update.
   * @param xAxis - The x-axis value (-1 to 1).
   * @param yAxis - The y-axis value (-1 to 1).
   */
  private processAxisInputs(
    inputComponent: InputComponent,
    xAxis: number,
    yAxis: number,
  ): void {
    // Left stick horizontal movement
    if (xAxis < -this.axisThreshold) {
      inputComponent.add("ArrowLeft");
    } else if (xAxis > this.axisThreshold) {
      inputComponent.add("ArrowRight");
    }

    // Left stick vertical movement
    if (yAxis < -this.axisThreshold) {
      inputComponent.add("ArrowUp");
    } else if (yAxis > this.axisThreshold) {
      inputComponent.add("ArrowDown");
    }
  }
}
