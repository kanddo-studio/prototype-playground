/**
 * Stores filtered analog values from the **right stick** of a gamepad.
 * Used for camera control, aiming, etc.
 */

export interface Component {}

export class RightStickComponent implements Component {
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
  public deadzone: number = 0.3; // default for right stick

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
