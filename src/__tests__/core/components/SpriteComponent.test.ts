import Phaser from 'phaser';
import { SpriteComponent } from '../../../core/components/SpriteComponent';

describe('SpriteComponent', () => {
  let mockScene: Phaser.Scene;
  let mockSprite: Phaser.GameObjects.Sprite;

  beforeEach(() => {
    mockScene = new Phaser.Scene() as Phaser.Scene;
    mockSprite = new Phaser.GameObjects.Sprite(mockScene, 10, 20, 'testTexture');
  });

  it('should initialize with the correct sprite', () => {
    const component = new SpriteComponent(mockSprite);

    expect(component.sprite).toBe(mockSprite);
  });

  it('should have correct initial properties', () => {
    const component = new SpriteComponent(mockSprite);

    expect(component.sprite.x).toBe(10);
    expect(component.sprite.y).toBe(20);
    expect(component.sprite.texture.key).toBe('testTexture');
  });

  it('should be able to set new texture', () => {
    const component = new SpriteComponent(mockSprite);
    component.sprite.setTexture('newTexture');

    expect(component.sprite.setTexture).toHaveBeenCalledWith('newTexture');
  });

  it('should be able to set position', () => {
    const component = new SpriteComponent(mockSprite);
    component.sprite.setPosition(30, 40);

    expect(component.sprite.setPosition).toHaveBeenCalledWith(30, 40);
  });
});
