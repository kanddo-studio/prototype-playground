import { createRoot } from "react-dom/client";
import { run } from "./core/game";
import { HUD } from "./ui";

/**
 * Start Phaser game and keep reference to the instance for potential
 * communication between React and Phaser.
 */
(function bootstrapGame() {
  const game = run();
  // You can expose the game to window for debugging if needed
  // (avoid in production)
  (window as any).__PHASER_GAME__ = game;
  console.log("[DEBUG] Phaser game started:", game);
})();

/**
 * Mount React UI overlay into #ui-root
 */
const rootElement = document.getElementById("ui-root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<HUD />);
}
