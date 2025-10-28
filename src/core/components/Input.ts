import { Component } from "./_Component";

/**
 * Component that stores the current input keys for an entity.
 *
 * Responsibilities:
 * - Act as a plain data container for pressed keys (keyboard / virtual keys).
 * - Provide small, well-documented helpers to manipulate the key set.
 *
 * Design notes:
 * - This component must not contain input mapping or polling logic (those belong to InputSystem / GamepadSystem).
 * - Keep operations immutable-friendly (methods return `this` to allow chaining if desired).
 */
export class InputComponent implements Component {
  /**
   * Set of active key identifiers (e.g. "ArrowLeft", "ArrowUp", "Action", ...).
   * Using Set<string> ensures quick membership checks and clear semantics.
   */
  public readonly keys: Set<string>;

  /**
   * Creates a new InputComponent.
   * @param keys - optional initial set of keys (copy will be created).
   */
  constructor(keys: Iterable<string> = []) {
    // copy incoming iterable so external mutation doesn't affect internal state
    this.keys = new Set<string>(keys);
  }

  /**
   * Adds a key to the active set.
   * @param key - key identifier to add
   * @returns this for chaining
   */
  public add(key: string): this {
    this.keys.add(key);
    return this;
  }

  /**
   * Removes a key from the active set.
   * @param key - key identifier to remove
   * @returns this for chaining
   */
  public remove(key: string): this {
    this.keys.delete(key);
    return this;
  }

  /**
   * Clears all active keys.
   * @returns this for chaining
   */
  public clear(): this {
    this.keys.clear();
    return this;
  }

  /**
   * Checks whether a key is active.
   * @param key - key identifier to check
   */
  public has(key: string): boolean {
    return this.keys.has(key);
  }

  /**
   * Returns a shallow array copy of active keys (useful for iteration or debug).
   */
  public toArray(): string[] {
    return Array.from(this.keys);
  }

  /**
   * Returns a plain object representation of the component (debug / serialization).
   */
  public toObject(): { keys: string[] } {
    return { keys: this.toArray() };
  }

  /**
   * Creates a shallow copy of this component.
   * Useful for snapshotting state for tests or deterministic updates.
   */
  public clone(): InputComponent {
    return new InputComponent(this.keys);
  }
}
