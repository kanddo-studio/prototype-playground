import { Entity } from "./Entity";

export interface System {
  update(entities: Entity[], deltaTime: number): void;
}
