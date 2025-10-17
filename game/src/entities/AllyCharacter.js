import Phaser from 'phaser';
import BaseCharacter from './BaseCharacter.js';

/**
 * AllyCharacter - Base class for AI-controlled allies
 * 
 * Features:
 * - AI state machine (follow/engage)
 * - Follows player leader
 * - Auto-engages enemies in range
 * - Returns to follow state when target is lost
 * 
 * Extend this class for:
 * - AllyWarrior (melee combat)
 * - AllyMonk (healer support)
 */
export default class AllyCharacter extends BaseCharacter {
  /**
   * @param {Phaser.Scene} scene - The scene this ally belongs to
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   * @param {string} spriteKey - The sprite/texture key for this ally
   * @param {Object} stats - Ally stats configuration
   * @param {Object} leader - The character to follow (usually player)
   */
  constructor(scene, x, y, spriteKey, stats, leader) {
    super(scene, x, y, spriteKey, stats);
    
    // ========== AI STATE ==========
    this.aiState = 'follow'; // 'follow' or 'engage'
    this.leader = leader; // Character to follow
    this.target = null; // Current enemy target
    
    // ========== AI PARAMETERS ==========
    this.followDistance = stats.followDistance || 120;
    this.assistRadius = stats.assistRadius || 200;
    this.attackRange = stats.attackRange || 80;
    
    // ========== COMBAT STATE ==========
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackCooldownMax = stats.attackCooldown || 1500;
    
    // ========== MOVEMENT ==========
    this.lastMovementX = 0; // For animation direction
  }
  
  /**
   * Main update loop - call from child classes
   */
  update(time, delta) {
    // Call base class update (handles shadow, depth sorting)
    super.update(time, delta);
    
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
    
    // Run AI logic
    if (!this.isDead && !this.isAttacking) {
      this.updateAI();
    } else if (this.isAttacking) {
      this.body.setVelocity(0, 0);
    }
  }
  
  /**
   * Core AI loop - manages state transitions
   */
  updateAI() {
    if (this.aiState === 'follow') {
      this.followLeader();
      this.checkForEnemies();
    } else if (this.aiState === 'engage') {
      this.engageTarget();
    }
  }
  
  /**
   * Follow the leader at a set distance
   */
  followLeader() {
    if (!this.leader || this.leader.isDead) {
      this.body.setVelocity(0, 0);
      return;
    }
    
    const distanceToLeader = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.leader.x, this.leader.y
    );
    
    // If too far from leader, move closer
    if (distanceToLeader > this.followDistance) {
      const angle = Phaser.Math.Angle.Between(
        this.x, this.y,
        this.leader.x, this.leader.y
      );
      
      const velocityX = Math.cos(angle) * this.moveSpeed;
      const velocityY = Math.sin(angle) * this.moveSpeed;
      
      this.body.setVelocity(velocityX, velocityY);
      
      // Track direction for sprite flipping
      this.lastMovementX = velocityX;
      if (velocityX < 0) {
        this.setFlipX(true);
      } else if (velocityX > 0) {
        this.setFlipX(false);
      }
      
      // Play run animation (override in child classes if needed)
      this.playMoveAnimation();
    } else {
      // Close enough - stop moving
      this.body.setVelocity(0, 0);
      this.playIdleAnimation();
    }
  }
  
  /**
   * Check for enemies within assist radius
   */
  checkForEnemies() {
    if (!this.scene.enemies) return;
    
    let closestEnemy = null;
    let closestDistance = this.assistRadius;
    
    // Find closest enemy within assist radius
    this.scene.enemies.getChildren().forEach(enemy => {
      if (enemy.active && !enemy.isDead) {
        const distance = Phaser.Math.Distance.Between(
          this.x, this.y,
          enemy.x, enemy.y
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      }
    });
    
    // Switch to engage state if enemy found
    if (closestEnemy) {
      this.target = closestEnemy;
      this.aiState = 'engage';
    }
  }
  
  /**
   * Engage current target enemy
   */
  engageTarget() {
    // Check if target is still valid
    if (!this.target || !this.target.active || this.target.isDead) {
      this.target = null;
      this.aiState = 'follow';
      this.body.setVelocity(0, 0);
      this.playIdleAnimation();
      return;
    }
    
    const distanceToTarget = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.target.x, this.target.y
    );
    
    // If target too far, return to follow state
    if (distanceToTarget > this.assistRadius * 1.5) {
      this.target = null;
      this.aiState = 'follow';
      this.body.setVelocity(0, 0);
      this.playIdleAnimation();
      return;
    }
    
    // If within attack range, attack
    if (distanceToTarget <= this.attackRange) {
      this.body.setVelocity(0, 0);
      this.attemptAttack();
    } else {
      // Move closer to target
      const angle = Phaser.Math.Angle.Between(
        this.x, this.y,
        this.target.x, this.target.y
      );
      
      const velocityX = Math.cos(angle) * this.moveSpeed;
      const velocityY = Math.sin(angle) * this.moveSpeed;
      
      this.body.setVelocity(velocityX, velocityY);
      
      // Track direction for sprite flipping
      this.lastMovementX = velocityX;
      if (velocityX < 0) {
        this.setFlipX(true);
      } else if (velocityX > 0) {
        this.setFlipX(false);
      }
      
      this.playMoveAnimation();
    }
  }
  
  /**
   * Attempt to attack if cooldown allows
   * Override in child classes for specific attack behavior
   */
  attemptAttack() {
    if (this.attackCooldown > 0) {
      this.playIdleAnimation();
      return;
    }
    
    // This should be overridden by child classes
    this.performAttack();
  }
  
  /**
   * Perform attack - OVERRIDE in child classes
   */
  performAttack() {
    // Default implementation - override in child classes
    console.warn('AllyCharacter.performAttack() should be overridden');
  }
  
  /**
   * Play idle animation - OVERRIDE in child classes
   */
  playIdleAnimation() {
    // Override in child classes
  }
  
  /**
   * Play move animation - OVERRIDE in child classes
   */
  playMoveAnimation() {
    // Override in child classes
  }
}

