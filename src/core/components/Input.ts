import { Component } from "./Component";

export class InputComponent implements Component {
  constructor(public keys: Set<string> = new Set<string>()) {}
}
