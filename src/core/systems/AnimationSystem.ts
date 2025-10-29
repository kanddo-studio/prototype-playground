import { Component } from "../components/_/_Component";
import { Entity } from "../components/_/_Entity";
import { InputComponent } from "../components/Device/InputComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { System, SystemUpdateProps } from "./_/_System";
import { MissingComponentError } from "../errors/MissingComponentError";
import { KEYS } from "../../types/keys.enum";
import { DIRECTION } from "../../types/direction.type";

/**
 * System responsible for handling entity animations based on input and movement.
 *
 * This system manages character animations by:
 * - Playing walking animations when movement keys are pressed
 * - Flipping sprites based on horizontal direction
 * - Playing idle animations when no movement keys are pressed
 * - Playing idle animations when all directions are pressed
 * - Vertical animations (up/down) only play when ONLY vertical keys are pressed
 * - Diagonal movement (e.g. left+up) uses horizontal walk animation
 * - Maintaining last facing direction for proper idle animation selection
 *
 * Supported animations:
 * - walk (horizontal movement and diagonal movement)
 * - walk-up (only when up key is pressed alone)
 * - walk-down (only when down key is pressed alone)
 * - idle (horizontal idle)
 * - idle-up (upward idle)
 * - idle-down (downward idle)
 */
export class AnimationSystem implements System {
  private lastDirection: DIRECTION = KEYS.RIGHT;

  /**
   * Animation key mapping for different directions.
   */
  private readonly animationKeys = {
    walk: "walk",
    walkUp: "walk-up",
    walkDown: "walk-down",
    idle: "idle",
    idleUp: "idle-up",
    idleDown: "idle-down",
  };

  /**
   * Updates entity animations based on input and movement.
   * @param entities - The list of entities to process.
   * @throws Error if required components are missing.
   */
  update({ entities }: SystemUpdateProps): void {
    entities.forEach((entity) => {
      // Validate required components
      const physicsComponent = this.getComponent<PhysicsComponent>(
        entity,
        "physics",
      );
      const inputComponent = this.getComponent<InputComponent>(entity, "input");

      // Get sprite from physics body
      const sprite = this.getSpriteFromPhysics(physicsComponent);

      // Determine and apply appropriate animation
      this.applyAnimation(sprite, inputComponent);
    });
  }

  /**
   * Validates entity has required component and returns it.
   * @param entity - The entity to check.
   * @param componentName - The name of the component to validate.
   * @returns The component instance.
   * @throws MissingComponentError if component is missing.
   */
  private getComponent<T extends Component>(
    entity: Entity,
    componentName: string,
  ): T {
    const component = entity.get<T>(componentName);
    if (!component) {
      throw new MissingComponentError(entity.id, componentName);
    }
    return component;
  }

  /**
   * Gets the sprite from the physics component.
   * @param physicsComponent - The physics component containing the body.
   * @returns The sprite game object.
   */
  private getSpriteFromPhysics(
    physicsComponent: PhysicsComponent,
  ): Phaser.Physics.Arcade.Sprite {
    const gameObject = physicsComponent.body.gameObject;
    return gameObject as Phaser.Physics.Arcade.Sprite;
  }

  /**
   * Applies appropriate animation based on input.
   * @param sprite - The sprite to animate.
   * @param inputComponent - The input component with current key states.
   */
  private applyAnimation(
    sprite: Phaser.Physics.Arcade.Sprite,
    inputComponent: InputComponent,
  ): void {
    const hasLeft = inputComponent.has(KEYS.LEFT);
    const hasRight = inputComponent.has(KEYS.RIGHT);
    const hasUp = inputComponent.has(KEYS.UP);
    const hasDown = inputComponent.has(KEYS.DOWN);

    // Check if all directions are pressed
    const allDirectionsPressed = hasLeft && hasRight && hasUp && hasDown;

    // If all directions pressed, play idle animation
    if (allDirectionsPressed) {
      this.handleIdle(sprite);
      return;
    }

    // Check for horizontal conflict (left + right)
    const horizontalConflict = hasLeft && hasRight;

    // Process pure vertical movement (up or down alone)
    if (hasUp && !hasDown && !hasLeft && !hasRight) {
      this.handleMovement(sprite, KEYS.UP, sprite.flipX);
      return;
    }

    if (hasDown && !hasUp && !hasLeft && !hasRight) {
      this.handleMovement(sprite, KEYS.DOWN, sprite.flipX);
      return;
    }

    // Process vertical movement with horizontal conflict (left+right+up or left+right+down)
    if (horizontalConflict) {
      if (hasUp && !hasDown) {
        // Left + Right + Up - play up animation
        this.handleMovement(sprite, KEYS.UP, sprite.flipX);
        return;
      }

      if (hasDown && !hasUp) {
        // Left + Right + Down - play down animation
        this.handleMovement(sprite, KEYS.DOWN, sprite.flipX);
        return;
      }

      // Just horizontal conflict
      this.handleIdle(sprite);
      return;
    }

    // Process horizontal movement or diagonal
    if (hasLeft) {
      this.handleMovement(sprite, KEYS.LEFT, true);
    } else if (hasRight) {
      this.handleMovement(sprite, KEYS.RIGHT, false);
    } else {
      // No movement
      this.handleIdle(sprite);
    }
  }

  /**
   * Handles movement animation and sprite flipping.
   * @param sprite - The sprite to animate.
   * @param direction - The direction of movement.
   * @param flipX - Whether to flip the sprite horizontally.
   */
  private handleMovement(
    sprite: Phaser.Physics.Arcade.Sprite,
    direction: DIRECTION,
    flipX: boolean,
  ): void {
    // Update last direction
    this.lastDirection = direction;

    // Apply sprite flipping for horizontal movement
    if (direction === KEYS.LEFT || direction === KEYS.RIGHT) {
      sprite.setFlipX(flipX);
    }

    // Play appropriate walking animation
    switch (direction) {
      case KEYS.UP:
        sprite.anims.play(this.animationKeys.walkUp, true);
        break;
      case KEYS.DOWN:
        sprite.anims.play(this.animationKeys.walkDown, true);
        break;
      default: // left or right
        sprite.anims.play(this.animationKeys.walk, true);
        break;
    }
  }

  /**
   * Handles idle animation based on last movement direction.
   * @param sprite - The sprite to animate.
   */
  private handleIdle(sprite: Phaser.Physics.Arcade.Sprite): void {
    switch (this.lastDirection) {
      case KEYS.UP:
        sprite.anims.play(this.animationKeys.idleUp, true);
        break;
      case KEYS.DOWN:
        sprite.anims.play(this.animationKeys.idleDown, true);
        break;
      default: // left or right
        sprite.anims.play(this.animationKeys.idle, true);
        break;
    }
  }
}
