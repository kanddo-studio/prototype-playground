import { System, SystemUpdateProps } from "./_/_System";
import { InputComponent } from "../components/Device/InputComponent";
import { DesiredVelocityComponent } from "../components/Velocity/DesiredVelocityComponent";
import { FacingComponent } from "../components/FacingComponent";
import { KEYS } from "../../types/keys.enum";
import { DIRECTION } from "../../types/direction.type";

/**
 * FacingSystem
 *
 * - Updates FacingComponent based on explicit input or movement.
 * - PRESERVES the last facing when the entity is idle (no input and zero desired velocity).
 *
 * Rationale:
 * - The facing value must represent the "last known facing" so attacks use it even when
 *   there is no simultaneous input. Therefore we only change facing when there is a
 *   clear indication (input or movement). We avoid automatic fallbacks that overwrite
 *   the stored facing while idle.
 */
export class FacingSystem implements System {
  update({ entities }: SystemUpdateProps): void {
    const now = Date.now();

    for (const e of entities) {
      if (!e.has("facing")) continue;
      const facing = e.get<FacingComponent>("facing");

      // 1) input-based facing (highest priority)
      if (e.has("input")) {
        const input = e.get<InputComponent>("input");
        const dirFromInput = this.directionFromInput(input);
        if (dirFromInput) {
          facing.set(dirFromInput, now);
          continue; // explicit input chosen, next entity
        }
      }

      // 2) desired velocity-based facing (only when moving)
      if (e.has("desiredVelocity")) {
        const dv = e.get<DesiredVelocityComponent>("desiredVelocity");
        const dirFromVel = this.directionFromVelocity(dv);
        if (dirFromVel) {
          facing.set(dirFromVel, now);
          continue;
        }
      }
    }
  }

  private directionFromInput(input: InputComponent): DIRECTION | undefined {
    if (input.has(KEYS.UP)) return KEYS.UP;
    if (input.has(KEYS.DOWN)) return KEYS.DOWN;
    if (input.has(KEYS.LEFT)) return KEYS.LEFT;
    if (input.has(KEYS.RIGHT)) return KEYS.RIGHT;
    return undefined;
  }

  private directionFromVelocity(
    dv: DesiredVelocityComponent,
  ): DIRECTION | undefined {
    const { x, y } = dv;
    if (x === 0 && y === 0) return undefined; // idle -> do not change facing
    // choose dominant axis
    if (Math.abs(x) >= Math.abs(y)) {
      return x < 0 ? (KEYS.LEFT) : (KEYS.RIGHT);
    } else {
      return y < 0 ? (KEYS.UP) : (KEYS.DOWN);
    }
  }
}
