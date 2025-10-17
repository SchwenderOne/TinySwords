import Phaser from 'phaser';
import AllyCharacter from './AllyCharacter.js';
import { GameBalance } from '../config/GameBalance.js';

/**
 * AllyMonk - Healer support ally
 * 
 * Behaviors:
 * - Follows player closely
 * - Heals player when damaged
 * - Does not engage in combat
 * - Uses Blue Monk sprites
 */
export default class AllyMonk extends AllyCharacter {
  constructor(scene, x, y, leader) {
    // Get ally monk stats from config
    const stats = GameBalance.allies.monk;
    
    // Call AllyCharacter constructor
    super(scene, x, y, 'blue-monk-idle', {
      health: stats.health,
      moveSpeed: stats.moveSpeed,
      attackDamage: 0, // Monks don't attack
      attackRange: stats.healRange,
      followDistance: stats.followDistance,
      assistRadius: stats.healRange, // Use heal range for assist
      attackCooldown: stats.healCooldown
    }, leader);
    
    // Monk-specific properties
    this.healAmount = stats.healAmount;
    this.healRange = stats.healRange;
    this.lastHealCheck = 0;
    
    // Create animations
    this.createAnimations();
    
    // Play idle animation
    this.play('blue-monk-idle');
  }
  
  createAnimations() {
    const anims = this.scene.anims;
    
    // Idle animation - 8 frames @ 6 FPS
    if (!anims.exists('blue-monk-idle')) {
      anims.create({
        key: 'blue-monk-idle',
        frames: anims.generateFrameNumbers('blue-monk-idle', { start: 0, end: 7 }),
        frameRate: 6,
        repeat: -1
      });
    }
    
    // Run animation - 6 frames @ 10 FPS
    if (!anims.exists('blue-monk-run')) {
      anims.create({
        key: 'blue-monk-run',
        frames: anims.generateFrameNumbers('blue-monk-run', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
    }
    
    // Attack animation (used for healing) - 4 frames @ 10 FPS
    if (!anims.exists('blue-monk-heal')) {
      anims.create({
        key: 'blue-monk-heal',
        frames: anims.generateFrameNumbers('blue-monk-attack', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
      });
    }
  }
  
  /**
   * Override updateAI - monks have different behavior
   */
  updateAI() {
    // Always follow leader
    this.followLeader();
    
    // Check if leader needs healing
    this.checkForHealing();
  }
  
  /**
   * Check if leader needs healing
   */
  checkForHealing() {
    if (!this.leader || this.leader.isDead) return;
    if (this.attackCooldown > 0) return;
    
    // Check if leader is wounded
    const leaderHealthPercent = this.leader.health / this.leader.maxHealth;
    if (leaderHealthPercent >= 1.0) return; // Leader at full health
    
    // Check if in heal range
    const distanceToLeader = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.leader.x, this.leader.y
    );
    
    if (distanceToLeader <= this.healRange) {
      this.performHeal();
    }
  }
  
  /**
   * Perform healing on leader
   */
  performHeal() {
    if (!this.leader || this.leader.isDead || this.isAttacking) return;
    
    this.isAttacking = true;
    this.attackCooldown = this.attackCooldownMax;
    
    // Play heal animation
    this.play('blue-monk-heal');
    
    // Apply heal after animation starts
    this.scene.time.delayedCall(200, () => {
      if (this.active && this.leader && !this.leader.isDead) {
        this.leader.heal(this.healAmount);
        
        // Visual effect - healing particles
        this.scene.add.particles(this.leader.x, this.leader.y - 30, 'shadow', {
          speed: { min: 50, max: 100 },
          scale: { start: 0.3, end: 0 },
          blendMode: 'ADD',
          lifespan: 400,
          quantity: 10,
          tint: 0x00ff00 // Green color for healing
        });
      }
    });
    
    // End attack state when animation completes
    this.once('animationcomplete', () => {
      this.isAttacking = false;
      if (this.active) {
        this.playIdleAnimation();
      }
    });
  }
  
  /**
   * Play idle animation
   */
  playIdleAnimation() {
    if (this.anims.currentAnim?.key !== 'blue-monk-idle') {
      this.play('blue-monk-idle', true);
    }
  }
  
  /**
   * Play move animation
   */
  playMoveAnimation() {
    if (this.anims.currentAnim?.key !== 'blue-monk-run') {
      this.play('blue-monk-run', true);
    }
  }
  
  /**
   * Override performAttack - monks don't attack enemies
   */
  performAttack() {
    // Monks don't attack - they only heal
  }
}

