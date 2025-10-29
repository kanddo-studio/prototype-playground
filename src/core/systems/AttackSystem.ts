import { System, SystemUpdateProps } from "./_/_System";
import { InputComponent } from "../components/Device/InputComponent";
import { HitboxComponent } from "../components/HitboxComponent";
import { FacingComponent } from "../components/FacingComponent";
import { KEYS } from "../../types/keys.enum";
import { DIRECTION } from "../../types/direction.type";

/**
 * AttackSystem
 *
 * - Listens to InputComponent for ACTION key.
 * - Uses FacingComponent (preferred) to determine attack direction.
 * - Activates the hitbox using scene.time.now and schedules a cleanup disable after hitbox.durationMs.
 *
 * Important: AttackSystem DOES NOT compute facing itself. It reads FacingComponent,
 * so FacingSystem must run before AttackSystem.
 */
export class AttackSystem implements System {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  update(props: SystemUpdateProps): void {
    const entities = props.entities;
    const now = this.scene.time.now;

    for (const e of entities) {
      if (!e.has("input") || !e.has("hitbox")) continue;
      const input = e.get<InputComponent>("input");
      const hb = e.get<HitboxComponent>("hitbox");

      // Trigger attack only when ACTION pressed and hitbox not active
      if (input.has(KEYS.ATTACK) && !hb.isActive(now)) {
        // Choose direction: prefer FacingComponent if present
        let dir: DIRECTION;
        if (e.has("facing")) {
          const facing = e.get<FacingComponent>("facing");
          dir = facing.direction;
        } else {
          // fallback to resolve from input keys (consistency)
          dir = this.resolveDirectionFromInput(input);
        }

        // Activate using Phaser clock for deterministic duration
        hb.activate(dir, now);

        // Schedule a defensive disable using the component's own durationMs (keeps state clean).
        // This is optional because HitboxSystem checks the duration via isActive(now), but
        // scheduling ensures the component returns to clean state.
        this.scene.time.delayedCall(hb.durationMs, () => {
          hb.disable();
        });
      }
    }
  }

  private resolveDirectionFromInput(input: InputComponent): DIRECTION {
    if (input.has(KEYS.UP)) return KEYS.UP;
    if (input.has(KEYS.DOWN)) return KEYS.DOWN;
    if (input.has(KEYS.LEFT)) return KEYS.LEFT;
    return KEYS.RIGHT;
  }
}
