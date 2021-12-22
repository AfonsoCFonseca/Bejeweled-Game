import { GameScene } from './App';

test('App create', () => {
    const scene = new GameScene();
    expect(scene.create()).toBe(3);
});
