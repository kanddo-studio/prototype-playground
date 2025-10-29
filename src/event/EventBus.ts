// src/core/EventBus.ts

/**
 * Typed EventBus for communication between game and UI.
 *
 * Implementation notes:
 * - Public API is fully typed (on/off/emit) using generics.
 * - Internally we store listeners in a Map<EventKey, Set<Function>> to avoid
 *   complex mapped-type assignment problems that TS can't reason about.
 * - When invoking listeners we cast Function -> Listener<K> in a local, controlled place.
 *
 * All public types and comments are in English per project rules.
 */

/** Map of event keys to payload types. Extend as needed. */
export type EventMap = {
  "hud:stats": { health: number; score: number };
  "hud:pause": { isPaused: boolean; scene: Phaser.Scenes.ScenePlugin };
};

type EventKey = keyof EventMap;
type Listener<K extends EventKey> = (payload: EventMap[K]) => void;

class EventBusClass {
  /**
   * Internal storage for listeners.
   * Using Map<EventKey, Set<Function>> avoids the mapped-type assignment pitfalls.
   */
  private listeners = new Map<EventKey, Set<Function>>();

  /**
   * Subscribe to an event.
   * @param key Event key
   * @param fn Listener function
   */
  on<K extends EventKey>(key: K, fn: Listener<K>): void {
    const bucket = this.listeners.get(key);
    if (!bucket) {
      this.listeners.set(key, new Set([fn as unknown as Function]));
    } else {
      bucket.add(fn as unknown as Function);
    }
  }

  /**
   * Unsubscribe a listener from an event.
   * @param key Event key
   * @param fn Listener function reference to remove
   */
  off<K extends EventKey>(key: K, fn: Listener<K>): void {
    const bucket = this.listeners.get(key);
    if (!bucket) return;
    bucket.delete(fn as unknown as Function);
    if (bucket.size === 0) {
      this.listeners.delete(key);
    }
  }

  /**
   * Emit an event to all subscribers.
   * @param key Event key
   * @param payload Event payload
   */
  emit<K extends EventKey>(key: K, payload: EventMap[K]): void {
    const bucket = this.listeners.get(key);
    if (!bucket) return;

    // Copy to avoid mutation while iterating
    const toCall = Array.from(bucket);
    for (const fn of toCall) {
      try {
        // Cast Function -> Listener<K> in a narrow, controlled scope.
        (fn as Listener<K>)(payload);
      } catch (err) {
        // Do not let one listener break the bus
        // eslint-disable-next-line no-console
        console.error("[EventBus] listener error", err);
      }
    }
  }
}

/** Singleton instance for the app */
export const EventBus = new EventBusClass();
