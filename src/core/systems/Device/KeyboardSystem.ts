import Phaser from "phaser";
import { InputComponent } from "../../components/Device/InputComponent";
import { System, SystemUpdateProps } from "../_/_System";
import { MissingDependencyError } from "../../errors/MissingDependencyError";

/**
 * System responsible for handling keyboard input and updating the InputComponent accordingly.
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
   * @param entities - The list of entities to update.
   * @throws MissingDependencyError if required components or keyboard input are missing.
   */
  update({ entities }: SystemUpdateProps): void {
    if (!this.cursors) {
      throw new MissingDependencyError("Keyboard cursors are not initialized.");
    }

    entities.forEach((entity) => {
      const inputComponent = entity.get<InputComponent>("input");
      if (!inputComponent) {
        throw new MissingDependencyError(
          `Entity '${entity.id}' is missing 'input' component.`,
        );
      }

      // Clear previous keys pressed
      inputComponent.clear();

      // Check each cursor key and add to input keys set if pressed
      if (this.cursors.left?.isDown) {
        inputComponent.add("ArrowLeft");
      }
      if (this.cursors.right?.isDown) {
        inputComponent.add("ArrowRight");
      }
      if (this.cursors.up?.isDown) {
        inputComponent.add("ArrowUp");
      }
      if (this.cursors.down?.isDown) {
        inputComponent.add("ArrowDown");
      }
    });
  }
}
