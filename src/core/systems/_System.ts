import { Entity } from "../components/Entity";

/**
 * Properties passed to the update method of a System.
 */
export type SystemUpdateProps = {
  entities: Entity[]; // List of entities to process
  deltaTime?: number; // Optional time elapsed since last update
};

/**
 * Interface that all Systems must implement.
 */
export interface System {
  /**
   * Update method called every frame or tick.
   * @param props - Contains entities and optional context info.
   */
  update(props: SystemUpdateProps): void;
}
