import Phaser from "phaser";
import { InputComponent } from "../../components/Device/InputComponent";
import { System, SystemUpdateProps } from "../_/_System";
import { MissingDependencyError } from "../../errors/MissingDependencyError";
import { KEYS } from "../../../types/keys.enum";

/**
 * System responsible for handling keyboard input and updating the InputComponent accordingly.
 * Also detects the ESC key press to toggle the pause state via PauseComponent.
 */
export class KeyboardSystem implements System {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  /**
   * Creates a new KeyboardSystem.
   * @param scene - The Phaser scene to bind keyboard input to.
   * @throws MissingDependencyError if keyboard input is not available in the scene.
   */
  constructor(scene: Phaser.Scene) {
    if (!scene.input.keyboard) {
      throw new MissingDependencyError(
        "Keyboard input is not available in the scene.",
      );
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  /**
   * Updates the input state of each entity based on keyboard keys pressed.
   * Also toggles the pause state when ESC is pressed.
   * @param props - System update properties including time, delta, and list of entities.
   * @throws MissingDependencyError if required components or keyboard input are missing.
   */
  update({ entities }: SystemUpdateProps): void {
    if (!this.cursors) {
      throw new MissingDependencyError("Keyboard cursors are not initialized.");
    }

    entities.forEach((entity) => {
      const inputComponent = entity.get<InputComponent>("input");
      if (inputComponent) {
        inputComponent.clear();

        if (this.cursors.left?.isDown) inputComponent.add(KEYS.LEFT);
        if (this.cursors.right?.isDown) inputComponent.add(KEYS.RIGHT);
        if (this.cursors.up?.isDown) inputComponent.add(KEYS.UP);
        if (this.cursors.down?.isDown) inputComponent.add(KEYS.DOWN);
      }
    });
  }
}
