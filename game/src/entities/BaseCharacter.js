import Phaser from 'phaser';
import FloatingText from '../utils/FloatingText.js';
import { GameBalance } from '../config/GameBalance.js';

/**
 * BaseCharacter - Abstract base class for all characters
 * 
 * Handles shared logic for:
 * - Health management
 * - Damage/healing with visual feedback
 * - XP and leveling system
 * - Shadow rendering
 * - Death handling
 * 
 * Extend this class for:
 * - PlayableCharacter (player-controlled with input)
 * - AllyCharacter (AI-controlled allies)
 * - Potentially future enemy refactors
 */
export default class BaseCharacter extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene - The scene this character belongs to
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   * @param {string} spriteKey - The sprite/texture key for this character
   * @param {Object} stats - Character stats configuration
   * @param {number} stats.health - Starting/max health
   * @param {number} stats.moveSpeed - Movement speed
   * @param {number} [stats.attackDamage] - Attack damage (optional)
   */
  constructor(scene, x, y, spriteKey, stats) {
    super(scene, x, y, spriteKey);
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // ========== STATS ==========
    this.health = stats.health;
    this.maxHealth = stats.health;
    this.moveSpeed = stats.moveSpeed;
    this.attackDamage = stats.attackDamage || 0;
    
    // ========== LEVELING ==========
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = GameBalance.progression.xpPerLevel;
    
    // ========== STATE ==========
    this.isAttacking = false;
    this.isDead = false;
    this.facingLeft = false;
    
    // ========== PHYSICS SETUP ==========
    this.body.setSize(60, 80);
    this.body.setOffset(66, 90);
    
    // ========== SHADOW ==========
    this.shadow = scene.add.image(x, y + 60, 'shadow');
    this.shadow.setScale(0.3);
    this.shadow.setAlpha(0.5);
    this.shadow.setDepth(0); // Always bottom layer
    
    // ========== RENDERING ==========
    this.setDepth(this.y); // Y-position based depth sorting
  }
  
  /**
   * Base update method - call from child classes
   * Handles shadow positioning and depth sorting
   */
  update(time, delta) {
    // Update shadow position to follow character
    if (this.shadow && this.shadow.active) {
      this.shadow.setPosition(this.x, this.y + 60);
    }
    
    // Update depth for proper rendering order
    this.setDepth(this.y);
  }
  
  /**
   * Take damage with visual feedback
   * @param {number} amount - Amount of damage to take
   * @param {Object} [options] - Additional options
   * @param {number} [options.damageReduction] - Damage reduction multiplier (0-1)
   */
  takeDamage(amount, options = {}) {
    if (this.isDead) return;
    
    // Apply damage reduction if specified (e.g., from guard ability)
    if (options.damageReduction) {
      amount *= (1 - options.damageReduction);
    }
    
    this.health -= amount;
    
    // Floating damage number
    FloatingText.createDamage(this.scene, this.x, this.y - 50, amount);
    
    // Visual feedback - red tint
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) {
        this.clearTint();
      }
    });
    
    // Check for death
    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }
  
  /**
   * Heal with visual feedback
   * @param {number} amount - Amount of health to restore
   */
  heal(amount) {
    if (this.isDead) return;
    
    const actualHeal = Math.min(amount, this.maxHealth - this.health);
    if (actualHeal <= 0) return;
    
    this.health += actualHeal;
    
    // Floating heal number
    FloatingText.createHeal(this.scene, this.x, this.y - 50, actualHeal);
    
    // Visual feedback - green tint
    this.setTint(0x00ff00);
    this.scene.time.delayedCall(200, () => {
      if (this.active) {
        this.clearTint();
      }
    });
  }
  
  /**
   * Gain XP and check for level up
   * @param {number} amount - Amount of XP to gain
   */
  gainXP(amount) {
    if (this.level >= GameBalance.progression.maxLevel) {
      return; // Max level reached
    }
    
    this.xp += amount;
    FloatingText.createXP(this.scene, this.x, this.y - 70, amount);
    
    // Check for level up (handle multiple levels at once if needed)
    while (this.xp >= this.xpToNextLevel && this.level < GameBalance.progression.maxLevel) {
      this.levelUp();
    }
  }
  
  /**
   * Level up the character
   * Override in child classes for specific stat bonuses
   */
  levelUp() {
    if (this.level >= GameBalance.progression.maxLevel) {
      // Cap XP at max to prevent overflow
      this.xp = this.xpToNextLevel;
      return;
    }
    
    // Increment level
    this.level++;
    
    // Deduct used XP and calculate next level requirement
    this.xp -= this.xpToNextLevel;
    this.xpToNextLevel = this.level * GameBalance.progression.xpPerLevel;
    
    // Full heal on level up
    this.health = this.maxHealth;
    
    // Visual feedback
    FloatingText.createLevelUp(this.scene, this.x, this.y - 90, this.level);
    
    // Particle effect
    if (this.scene && this.scene.add) {
      this.scene.add.particles(this.x, this.y, 'shadow', {
        speed: { min: 100, max: 200 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 500,
        quantity: 20,
        tint: 0xffd700 // Gold color
      });
    }
  }
  
  /**
   * Handle character death
   * Override in child classes for specific death behavior
   */
  die() {
    if (this.isDead) return;
    
    this.isDead = true;
    this.setActive(false);
    this.setVisible(false);
    
    if (this.shadow) {
      this.shadow.setVisible(false);
    }
    
    // Stop all physics
    this.body.setVelocity(0, 0);
  }
  
  /**
   * Revive the character (used for character switching)
   */
  revive() {
    this.isDead = false;
    this.health = this.maxHealth;
    this.setActive(true);
    this.setVisible(true);
    
    if (this.shadow) {
      this.shadow.setVisible(true);
    }
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    if (this.shadow) {
      this.shadow.destroy();
    }
    super.destroy();
  }
}

