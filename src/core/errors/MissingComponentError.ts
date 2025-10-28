/**
 * Custom error thrown when an entity is missing a required component.
 */
export class MissingComponentError extends Error {
  constructor(entityId: string, componentName: string) {
    super(
      `Entity '${entityId}' is missing required component '${componentName}'.`,
    );
    this.name = "MissingComponentError";
  }
}
