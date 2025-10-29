import { System, SystemUpdateProps } from "./_/_System";
import { Entity } from "../components/_/_Entity";
import Phaser from "phaser";
import { HitboxComponent } from "../components/HitboxComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { FacingComponent } from "../components/FacingComponent";
import { DIRECTION } from "../../types/direction.type";
import { KEYS } from "../../types/keys.enum";

/**
 * Positions and evaluates directional hitboxes.
 *
 * Fix implemented:
 * - For horizontal attacks (Left/Right) the system uses HitboxComponent.width as the horizontal
 *   size and HitboxComponent.height as the vertical size.
 * - For vertical attacks (Up/Down) the system swaps the values so the rectangle becomes tall:
 *   rectWidth  = HitboxComponent.height
 *   rectHeight = HitboxComponent.width
 *
 * This keeps the HitboxComponent API simple (width/height as the "default" orientation for
 * horizontal attacks) while ensuring vertical attacks produce a tall rectangle instead of a
 * thin horizontal rectangle rotated implicitly by swapping width/height.
 */
export class HitboxSystem implements System {
  private scene: Phaser.Scene;
  private debugGraphics?: Phaser.GameObjects.Graphics;
  private onHit?: (attacker: Entity, target: Entity) => void;

  constructor(
    scene: Phaser.Scene,
    onHit?: (attacker: Entity, target: Entity) => void,
  ) {
    this.scene = scene;
    this.onHit = onHit;
  }

  update(props: SystemUpdateProps): void {
    const now = this.scene.time.now;
    const entities = props.entities;

    // Build lookup maps: id -> PhysicsComponent, id -> Entity
    const physMap: Map<string, PhysicsComponent> = new Map();
    const entityMap: Map<string, Entity> = new Map();

    for (const e of entities) {
      entityMap.set(e.id, e);
      if (e.has("physics")) {
        physMap.set(e.id, e.get<PhysicsComponent>("physics"));
      }
    }

    // Create debug graphics if any hitbox requests debug
    const needDebug = entities.some(
      (e) => e.has("hitbox") && e.get<HitboxComponent>("hitbox").debug,
    );
    if (needDebug && !this.debugGraphics) {
      this.debugGraphics = this.scene.add.graphics();
      this.debugGraphics.setDepth(1000);
    }
    if (this.debugGraphics) this.debugGraphics.clear();

    // Iterate attackers (entities that may have hitboxes)
    for (const attacker of entities) {
      if (!attacker.has("hitbox") || !attacker.has("physics")) continue;

      const hb = attacker.get<HitboxComponent>("hitbox");
      const phys = attacker.get<PhysicsComponent>("physics");

      // Only consider active hitboxes
      if (!hb.isActive(now)) continue;

      // Resolve direction: hitbox.lastDirection -> facing component -> flipX -> default RIGHT
      const dir =
        hb.lastDirection ?? this.resolveFallbackDirection(attacker, phys);

      // Compute entity center from Arcade.Body
      const body = phys.body;
      const centerX = body.x + body.width / 2;
      const centerY = body.y + body.height / 2;

      // Decide size/orientation depending on direction.
      // Horizontal (LEFT/RIGHT): use hb.width x hb.height (default)
      // Vertical (UP/DOWN): swap -> use hb.height x hb.width to produce a tall rectangle
      let rectWidth: number;
      let rectHeight: number;

      if (dir === KEYS.UP || dir === KEYS.DOWN) {
        rectWidth = hb.height;
        rectHeight = hb.width;
      } else {
        rectWidth = hb.width;
        rectHeight = hb.height;
      }

      // Compute hitbox center depending on direction
      let rectCenterX = centerX;
      let rectCenterY = centerY;

      switch (dir) {
        case KEYS.LEFT:
          rectCenterX = centerX - hb.distance;
          rectCenterY = centerY;
          break;
        case KEYS.RIGHT:
          rectCenterX = centerX + hb.distance;
          rectCenterY = centerY;
          break;
        case KEYS.UP:
          rectCenterX = centerX;
          rectCenterY = centerY - hb.distance;
          break;
        case KEYS.DOWN:
          rectCenterX = centerX;
          rectCenterY = centerY + hb.distance;
          break;
        default:
          rectCenterX = centerX + hb.distance;
          rectCenterY = centerY;
          break;
      }

      // Build the hitbox rectangle with the chosen orientation
      const rect = new Phaser.Geom.Rectangle(
        Math.round(rectCenterX - rectWidth / 2),
        Math.round(rectCenterY - rectHeight / 2),
        rectWidth,
        rectHeight,
      );

      // Debug draw
      if (hb.debug && this.debugGraphics) {
        this.debugGraphics.lineStyle(1, 0x00ff00, 1);
        this.debugGraphics.strokeRectShape(rect);
      }

      // Check overlap against all physics-enabled entities
      for (const [targetId, targetPhys] of physMap.entries()) {
        if (targetId === attacker.id) continue;

        const tb = targetPhys.body;
        const tRect = new Phaser.Geom.Rectangle(
          Math.round(tb.x),
          Math.round(tb.y),
          tb.width,
          tb.height,
        );

        if (Phaser.Geom.Intersects.RectangleToRectangle(rect, tRect)) {
          const targetEntity = entityMap.get(targetId);
          if (!targetEntity) continue;

          // Hit detected: call callback or default onHit if present on target
          if (this.onHit) {
            this.onHit(attacker, targetEntity);
          } else {
            const maybeOnHit = (
              targetEntity as unknown as { onHit?: (from: Entity) => void }
            ).onHit;
            if (maybeOnHit) maybeOnHit(attacker);
          }

          // Disable hitbox after first hit to avoid multi-hits per activation
          hb.disable();
          break; // stop checking other targets for this attacker this frame
        }
      }
    }
  }

  /**
   * Resolve fallback direction using FacingComponent (if present) or physics.gameObject.flipX.
   * Defaults to RIGHT.
   */
  private resolveFallbackDirection(
    attacker: Entity,
    phys: PhysicsComponent,
  ): DIRECTION {
    if (attacker.has("facing")) {
      const facing = attacker.get<FacingComponent>("facing");
      return facing.direction;
    }

    const go = phys.gameObject;
    if (go) {
      return go.flipX ? KEYS.LEFT : KEYS.RIGHT;
    }

    return KEYS.RIGHT;
  }
}
