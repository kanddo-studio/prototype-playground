import { Component } from "../components/_Component";
import { DesiredVelocityComponent } from "../components/DesiredVelocity";
import { Entity } from "../components/Entity";
import { PhysicsComponent } from "../components/Physics";
import { System, SystemUpdateProps } from "./_System";
import { MissingComponentError } from "../errors/MissingComponentError";

/**
 * System responsible for applying desired velocity to the physics body.
 *
 * This system transfers the calculated desired velocity from the DesiredVelocityComponent
 * to the actual physics body in the PhysicsComponent. It acts as a bridge between
 * high-level movement intentions and the low-level physics engine.
 *
 * The system ensures that:
 * - Entities with physics bodies move according to their desired velocity
 * - Component dependencies are properly validated
 * - Physics bodies are updated with the correct velocity values
 */
export class PhysicsSystem implements System {
  /**
   * Updates physics bodies with desired velocities for all entities.
   * @param entities - The list of entities to process.
   * @throws MissingComponentError if any required component is missing.
   */
  update({ entities }: SystemUpdateProps): void {
    entities.forEach((entity) => {
      // Validate and retrieve required components
      const desiredVelocity = this.getComponent<DesiredVelocityComponent>(
        entity,
        "desiredVelocity",
      );

      const physics = this.getComponent<PhysicsComponent>(entity, "physics");

      // Apply desired velocity to physics body
      this.applyVelocityToBody(physics, desiredVelocity);
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
   * Applies desired velocity to the physics body.
   * @param physics - The physics component containing the body.
   * @param desiredVelocity - The desired velocity component.
   */
  private applyVelocityToBody(
    physics: PhysicsComponent,
    desiredVelocity: DesiredVelocityComponent,
  ): void {
    physics.body.setVelocity(desiredVelocity.x, desiredVelocity.y);
  }
}
