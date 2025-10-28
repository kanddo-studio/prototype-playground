import { InputComponent } from "../components/Device/InputComponent";
import { VelocityComponent } from "../components/Velocity/VelocityComponent";
import { DesiredVelocityComponent } from "../components/Velocity/DesiredVelocityComponent";
import { MissingComponentError } from "../errors/MissingComponentError";
import { System, SystemUpdateProps } from "./_/_System";
import { Entity } from "../components/_/_Entity";
import { Component } from "../components/_/_Component";

/**
 * System responsible for calculating desired velocity based on input and speed.
 *
 * This system processes player input and translates it into velocity vectors
 * that represent the intended movement direction and speed. It handles:
 * - Cardinal direction movement (up, down, left, right)
 * - Diagonal movement with proper normalization
 * - Component validation and error handling
 *
 * The resulting velocity is stored in the DesiredVelocityComponent which
 * can be used by physics systems to move entities.
 */
export class MovementSystem implements System {
  /**
   * Normalization factor for diagonal movement to maintain consistent speed
   * Equal to 1/sqrt(2) ≈ 0.7071
   */
  private readonly DIAGONAL_NORMALIZATION_FACTOR = Math.SQRT1_2;

  /**
   * Processes input from all entities and calculates their desired velocity.
   * @param entities - The list of entities to process.
   * @throws MissingComponentError if any required component is missing.
   */
  update({ entities }: SystemUpdateProps): void {
    entities.forEach((entity) => {
      // Validate and get required components
      const input = this.getComponent<InputComponent>(entity, "input");
      const velocity = this.getComponent<VelocityComponent>(entity, "velocity");
      const desiredVelocity = this.getComponent<DesiredVelocityComponent>(
        entity,
        "desiredVelocity",
      );

      // Calculate velocity based on input
      const { vx, vy } = this.calculateVelocity(input, velocity);

      // Apply to desired velocity component
      desiredVelocity.x = vx;
      desiredVelocity.y = vy;
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
   * Calculates velocity vector based on input and entity speed.
   * @param input - The input component with current key states.
   * @param velocity - The velocity component with speed information.
   * @returns Object containing x and y velocity values.
   */
  private calculateVelocity(
    input: InputComponent,
    velocity: VelocityComponent,
  ): { vx: number; vy: number } {
    let vx = 0;
    let vy = 0;

    // Calculate base velocity from input
    if (input.has("ArrowLeft")) vx -= velocity.speed;
    if (input.has("ArrowRight")) vx += velocity.speed;
    if (input.has("ArrowUp")) vy -= velocity.speed;
    if (input.has("ArrowDown")) vy += velocity.speed;

    // Normalize diagonal movement to maintain consistent speed
    return this.normalizeDiagonal(vx, vy);
  }

  /**
   * Normalizes diagonal movement to prevent faster speed when moving diagonally.
   * @param vx - X velocity component.
   * @param vy - Y velocity component.
   * @returns Normalized velocity components.
   */
  private normalizeDiagonal(
    vx: number,
    vy: number,
  ): { vx: number; vy: number } {
    // Only normalize if moving in both directions
    if (vx !== 0 && vy !== 0) {
      vx *= this.DIAGONAL_NORMALIZATION_FACTOR;
      vy *= this.DIAGONAL_NORMALIZATION_FACTOR;
    }

    return { vx, vy };
  }
}
