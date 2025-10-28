/**
 * Custom error thrown when a required component or resource is missing.
 */
export class MissingDependencyError extends Error {
  /**
   * Constructs a new MissingDependencyError.
   * @param message - Description of the missing dependency.
   */
  constructor(message: string) {
    super(message);
    this.name = "MissingDependencyError";
  }
}
