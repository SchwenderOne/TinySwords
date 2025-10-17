import Phaser from 'phaser';
import { GameBalance } from '../config/GameBalance.js';

/**
 * InteractiveBuilding - Buildings that spawn allies when interacted with
 * 
 * Features:
 * - Proximity detection (shows prompt when player nearby)
 * - E key interaction to spawn allies
 * - 20-second cooldown per building
 * - Visual cooldown bar
 * - Spawns specific ally type (warrior/monk)
 */
export default class InteractiveBuilding {
  /**
   * @param {Phaser.Scene} scene - The scene this building belongs to
   * @param {Phaser.Physics.Arcade.Sprite} sprite - The static building sprite
   * @param {string} buildingType - Type of building ('house' or 'tower')
   * @param {Object} player - Reference to player for proximity checks
   */
  constructor(scene, sprite, buildingType, player) {
    this.scene = scene;
    this.sprite = sprite;
    this.buildingType = buildingType;
    this.player = player;
    
    // Determine ally type based on building
    this.allyType = buildingType === 'house' ? 'warrior' : 'monk';
    
    // Interaction settings from config
    this.interactionRadius = GameBalance.buildings.interactionRadius;
    this.cooldownTime = GameBalance.buildings.spawnCooldown;
    
    // State
    this.isOnCooldown = false;
    this.cooldownRemaining = 0;
    this.isPlayerInRange = false;
    
    // UI Elements
    this.promptText = null;
    this.cooldownBar = null;
    this.cooldownBarBg = null;
    
    this.createUI();
  }
  
  /**
   * Create UI elements (prompt and cooldown bar)
   */
  createUI() {
    // Interaction prompt (initially hidden)
    const allyName = this.allyType === 'warrior' ? 'Warrior' : 'Monk';
    this.promptText = this.scene.add.text(
      this.sprite.x,
      this.sprite.y - this.sprite.displayHeight - 20,
      `Press E to spawn ${allyName}`,
      {
        font: 'bold 14px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000cc',
        padding: { x: 8, y: 4 }
      }
    );
    this.promptText.setOrigin(0.5, 0.5);
    this.promptText.setDepth(1000);
    this.promptText.setVisible(false);
    
    // Cooldown bar background
    this.cooldownBarBg = this.scene.add.graphics();
    this.cooldownBarBg.setDepth(999);
    
    // Cooldown bar fill
    this.cooldownBar = this.scene.add.graphics();
    this.cooldownBar.setDepth(1000);
  }
  
  /**
   * Update - called every frame
   */
  update(time, delta) {
    if (!this.player || !this.player.active) return;
    
    // Update cooldown timer
    if (this.isOnCooldown) {
      this.cooldownRemaining -= delta;
      if (this.cooldownRemaining <= 0) {
        this.cooldownRemaining = 0;
        this.isOnCooldown = false;
      }
    }
    
    // Check proximity to player
    this.checkProximity();
    
    // Update UI
    this.updateUI();
  }
  
  /**
   * Check if player is within interaction radius
   */
  checkProximity() {
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.sprite.x,
      this.sprite.y
    );
    
    this.isPlayerInRange = distance <= this.interactionRadius;
  }
  
  /**
   * Update UI elements based on state
   */
  updateUI() {
    // Show/hide prompt based on range and cooldown
    if (this.isPlayerInRange && !this.isOnCooldown) {
      this.promptText.setVisible(true);
      const allyName = this.allyType === 'warrior' ? 'Warrior' : 'Monk';
      this.promptText.setText(`Press E to spawn ${allyName}`);
      this.promptText.setBackgroundColor('#00aa00');
    } else if (this.isPlayerInRange && this.isOnCooldown) {
      this.promptText.setVisible(true);
      const secondsLeft = Math.ceil(this.cooldownRemaining / 1000);
      this.promptText.setText(`Ready in ${secondsLeft}s`);
      this.promptText.setBackgroundColor('#aa0000');
    } else {
      this.promptText.setVisible(false);
    }
    
    // Update cooldown bar
    if (this.isOnCooldown) {
      this.drawCooldownBar();
    } else {
      this.cooldownBar.clear();
      this.cooldownBarBg.clear();
    }
    
    // Keep prompt above building (for camera movement)
    if (this.promptText.visible) {
      this.promptText.setPosition(
        this.sprite.x,
        this.sprite.y - this.sprite.displayHeight - 20
      );
    }
  }
  
  /**
   * Draw cooldown bar above building
   */
  drawCooldownBar() {
    const barWidth = 60;
    const barHeight = 6;
    const barX = this.sprite.x - barWidth / 2;
    const barY = this.sprite.y - this.sprite.displayHeight - 40;
    
    // Clear previous
    this.cooldownBarBg.clear();
    this.cooldownBar.clear();
    
    // Background (gray)
    this.cooldownBarBg.fillStyle(0x000000, 0.5);
    this.cooldownBarBg.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
    this.cooldownBarBg.fillStyle(0x555555, 1);
    this.cooldownBarBg.fillRect(barX, barY, barWidth, barHeight);
    
    // Fill (progress - yellow)
    const progress = 1 - (this.cooldownRemaining / this.cooldownTime);
    const fillWidth = barWidth * progress;
    this.cooldownBar.fillStyle(0xffaa00, 1);
    this.cooldownBar.fillRect(barX, barY, fillWidth, barHeight);
  }
  
  /**
   * Attempt interaction - spawn ally if conditions met
   * @returns {boolean} True if interaction succeeded
   */
  interact() {
    // Check if interaction is possible
    if (!this.isPlayerInRange || this.isOnCooldown) {
      return false;
    }
    
    // Spawn ally in front of building (slightly below)
    const spawnX = this.sprite.x;
    const spawnY = this.sprite.y + 50; // Spawn below building
    
    // Call scene's spawn method
    if (this.scene.spawnAlly) {
      this.scene.spawnAlly(this.allyType, spawnX, spawnY);
    }
    
    // Start cooldown
    this.startCooldown();
    
    // Visual feedback - particle effect
    this.scene.add.particles(spawnX, spawnY, 'shadow', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      quantity: 20,
      tint: this.allyType === 'warrior' ? 0x0088ff : 0x00ff88 // Blue for warrior, green for monk
    });
    
    return true;
  }
  
  /**
   * Start cooldown timer
   */
  startCooldown() {
    this.isOnCooldown = true;
    this.cooldownRemaining = this.cooldownTime;
  }
  
  /**
   * Cleanup
   */
  destroy() {
    if (this.promptText) this.promptText.destroy();
    if (this.cooldownBar) this.cooldownBar.destroy();
    if (this.cooldownBarBg) this.cooldownBarBg.destroy();
  }
}

