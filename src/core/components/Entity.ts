import { Component } from "./Component";

export class Entity {
  private components: Map<string, Component> = new Map();

  add(name: string, component: Component) {
    this.components.set(name, component);
  }

  get<T extends Component>(name: string): T {
    return this.components.get(name) as T;
  }

  has(name: string): boolean {
    return this.components.has(name);
  }
}
