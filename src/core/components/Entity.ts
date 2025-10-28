import { Component } from "./Component";

/**
 * Represents a game entity composed of multiple components.
 * Each entity has a unique identifier and manages its components.
 */
export class Entity {
  /**
   * Unique identifier for this entity.
   */
  public readonly id: string;

  /**
   * Internal map storing components by their string keys.
   */
  private components: Map<string, Component> = new Map();

  /**
   * Creates a new Entity with a unique id.
   * @param id - Unique identifier for the entity.
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * Adds a component to the entity.
   * @param name - The key/name of the component.
   * @param component - The component instance.
   */
  add<T extends Component>(name: string, component: T): void {
    this.components.set(name, component);
  }

  /**
   * Retrieves a component by name.
   * Throws an error if the component does not exist.
   * @param name - The key/name of the component.
   * @returns The component instance of type T.
   * @throws Error if component is not found.
   */
  get<T extends Component>(name: string): T {
    const component = this.components.get(name);
    if (!component) {
      throw new Error(`Component '${name}' not found in entity '${this.id}'.`);
    }
    return component as T;
  }

  /**
   * Checks if the entity has a component by name.
   * @param name - The key/name of the component.
   * @returns True if the component exists, false otherwise.
   */
  has(name: string): boolean {
    return this.components.has(name);
  }

  /**
   * Removes a component by name.
   * @param name - The key/name of the component.
   * @returns True if the component was removed, false if it did not exist.
   */
  remove(name: string): boolean {
    return this.components.delete(name);
  }
}
