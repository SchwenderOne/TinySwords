import Phaser from 'phaser';
import AllyCharacter from './AllyCharacter.js';
import { GameBalance } from '../config/GameBalance.js';

/**
 * AllyWarrior - Melee combat ally
 * 
 * Behaviors:
 * - Follows player
 * - Auto-engages enemies in range
 * - Melee attacks with cooldown
 * - Uses Blue Warrior sprites
 */
export default class AllyWarrior extends AllyCharacter {
  constructor(scene, x, y, leader) {
    // Get ally warrior stats from config
    const stats = GameBalance.allies.warrior;
    
    // Call AllyCharacter constructor
    super(scene, x, y, 'blue-warrior-idle', {
      health: stats.health,
      moveSpeed: stats.moveSpeed,
      attackDamage: stats.damage,
      attackRange: stats.attackRange,
      followDistance: stats.followDistance,
      assistRadius: stats.assistRadius,
      attackCooldown: 1500 // 1.5 second attack cooldown
    }, leader);
    
    // Create animations
    this.createAnimations();
    
    // Play idle animation
    this.play('blue-warrior-idle');
  }
  
  createAnimations() {
    const anims = this.scene.anims;
    
    // Idle animation - 8 frames @ 6 FPS
    if (!anims.exists('blue-warrior-idle')) {
      anims.create({
        key: 'blue-warrior-idle',
        frames: anims.generateFrameNumbers('blue-warrior-idle', { start: 0, end: 7 }),
        frameRate: 6,
        repeat: -1
      });
    }
    
    // Run animation - 6 frames @ 10 FPS
    if (!anims.exists('blue-warrior-run')) {
      anims.create({
        key: 'blue-warrior-run',
        frames: anims.generateFrameNumbers('blue-warrior-run', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
    }
    
    // Attack animation - 4 frames @ 12 FPS
    if (!anims.exists('blue-warrior-attack')) {
      anims.create({
        key: 'blue-warrior-attack',
        frames: anims.generateFrameNumbers('blue-warrior-attack1', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0
      });
    }
  }
  
  /**
   * Play idle animation
   */
  playIdleAnimation() {
    if (this.anims.currentAnim?.key !== 'blue-warrior-idle') {
      this.play('blue-warrior-idle', true);
    }
  }
  
  /**
   * Play move animation
   */
  playMoveAnimation() {
    if (this.anims.currentAnim?.key !== 'blue-warrior-run') {
      this.play('blue-warrior-run', true);
    }
  }
  
  /**
   * Perform melee attack
   */
  performAttack() {
    if (!this.target || this.isAttacking) return;
    
    this.isAttacking = true;
    this.attackCooldown = this.attackCooldownMax;
    
    // Play attack animation
    this.play('blue-warrior-attack');
    
    // Create hitbox after animation starts
    this.scene.time.delayedCall(166, () => { // Frame 2 of attack
      if (this.active && this.target && this.target.active) {
        this.createHitbox();
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
   * Create attack hitbox
   */
  createHitbox() {
    if (!this.target || !this.target.active) return;
    
    // Create hitbox in direction of target
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      this.target.x, this.target.y
    );
    
    const hitboxX = this.x + Math.cos(angle) * 60;
    const hitboxY = this.y + Math.sin(angle) * 60;
    
    const hitbox = this.scene.physics.add.sprite(hitboxX, hitboxY, null);
    hitbox.body.setSize(80, 80);
    hitbox.visible = false;
    
    // Check overlap with target enemy
    if (this.scene.physics.overlap(hitbox, this.target)) {
      const pushDirection = Math.cos(angle) > 0 ? 1 : -1;
      this.target.takeDamage(this.attackDamage, pushDirection);
    }
    
    // Destroy hitbox after brief moment
    this.scene.time.delayedCall(50, () => {
      hitbox.destroy();
    });
  }
}

