import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';

// Game configuration
const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Top-down game, no gravity
      debug: false // Set to true to see collision boxes
    }
  },
  scene: [BootScene, GameScene],
  pixelArt: true, // Important for crisp pixel art rendering
  antialias: false,
  roundPixels: true
};

// Create the game instance
const game = new Phaser.Game(config);

// Expose game instance globally for debugging
window.game = game;

