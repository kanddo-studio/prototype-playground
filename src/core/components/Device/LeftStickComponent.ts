/**
 * Stores filtered analog values from the **left stick** of a gamepad.
 * Used for character movement, UI navigation, etc.
 */

import { DEFAULT_BUTTON_THRESHOLD } from "../../../types/gamepad.const";

export interface Component {}

export class LeftStickComponent implements Component {
  /**
   * Normalized X axis (-1 to 1)
   */
  public xAxis: number = 0;

  /**
   * Normalized Y axis (-1 to 1)
   */
  public yAxis: number = 0;

  /**
   * Whether this input is enabled
   */
  public enabled: boolean = true;

  /**
   * Deadzone to apply before setting values
   */
  public deadzone: number = DEFAULT_BUTTON_THRESHOLD; // default for left stick

  /**
   * Set raw axis values with optional deadzone filtering
   * @param x - raw x value
   * @param y - raw y value
   */
  public setAxes(x: number, y: number): void {
    this.xAxis = Math.abs(x) < this.deadzone ? 0 : x;
    this.yAxis = Math.abs(y) < this.deadzone ? 0 : y;
  }
}
