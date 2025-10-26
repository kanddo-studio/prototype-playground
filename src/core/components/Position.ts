import { Component } from "./Component";

export class PositionComponent implements Component {
  constructor(
    public x: number,
    public y: number,
  ) {}
}
