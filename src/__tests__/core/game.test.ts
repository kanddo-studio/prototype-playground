import Phaser from "phaser";
import { config, run } from "../../core/game";

jest.mock("../../styles/global.css", () => {});

describe("Phaser Game Initialization", () => {
  it("should create a new Phaser game instance with the correct config", () => {
    const PhaserGameMock = jest.fn();
    Phaser.Game = PhaserGameMock;
    run();
    expect(PhaserGameMock).toHaveBeenCalledWith(config);
  });
});
