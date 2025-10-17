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
    
    // Set attack damage for monks
    this.attackDamage = 15; // Monks now attack with ability 2
    this.attackRange = 120; // Attack range for slash effect
    
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
    
    // Attack animation - 4 frames @ 10 FPS
    if (!anims.exists('blue-monk-attack')) {
      anims.create({
        key: 'blue-monk-attack',
        frames: anims.generateFrameNumbers('blue-monk-attack', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
      });
    }
    
    // Heal animation (same as attack) - 4 frames @ 10 FPS
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
    // Check if leader needs healing first (priority)
    const leaderNeedsHealing = this.leader && !this.leader.isDead && 
                               (this.leader.health / this.leader.maxHealth) < 1.0;
    
    if (leaderNeedsHealing && this.attackCooldown <= 0) {
      // Healing has priority over combat - force back to follow state
      this.aiState = 'follow';
      this.checkForHealing();
      // Don't do anything else this frame
      return;
    }
    
    // Standard AI behavior when not healing
    if (this.aiState === 'follow') {
      this.followLeader();
      this.checkForEnemies();
    } else if (this.aiState === 'engage' && this.target) {
      this.engageTarget();
    }
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
   * Override performAttack - monks attack with slash2-effect (ability 2)
   */
  performAttack() {
    if (!this.target || this.target.isDead || this.isAttacking) return;
    
    this.isAttacking = true;
    this.attackCooldown = this.attackCooldownMax;
    
    // Stop movement during attack
    this.body.setVelocity(0, 0);
    
    // Play attack animation
    this.play('blue-monk-attack');
    
    // Calculate facing angle towards target
    const facingAngle = Math.atan2(
      this.target.y - this.y,
      this.target.x - this.x
    );
    
    // Spawn slash2-effect (ability 2 - Diagonal Strike)
    this.scene.time.delayedCall(200, () => {
      if (this.active && this.target && !this.target.isDead) {
        // Calculate position in front of monk
        const baseOffsetDistance = 30;
        const offsetX = Math.cos(facingAngle) * baseOffsetDistance;
        const offsetY = Math.sin(facingAngle) * baseOffsetDistance;
        
        // Create slash effect
        const slashSprite = this.scene.add.sprite(
          this.x + offsetX,
          this.y + offsetY,
          'slash2-frame1'
        );
        
        // Convert facing angle to degrees and apply rotation
        const facingDegrees = Phaser.Math.RadToDeg(facingAngle);
        
        slashSprite.setScale(0.3);
        slashSprite.setAngle(facingDegrees - 90); // Rotated 90° counter-clockwise like ability 2, plus facing direction
        slashSprite.setDepth(this.y + 100);
        slashSprite.setAlpha(0.8);
        slashSprite.setBlendMode(Phaser.BlendModes.ADD);
        
        // Play animation with double speed like ability 2
        const anim = this.scene.anims.get('slash2-effect');
        if (anim) {
          const animConfig = {
            key: 'slash2-effect_monk_' + Date.now(),
            frames: anim.frames.map(f => ({ key: f.textureKey })),
            frameRate: anim.frameRate * 2.0, // Double speed
            repeat: 0
          };
          this.scene.anims.create(animConfig);
          slashSprite.play(animConfig.key);
          
          slashSprite.once('animationcomplete', () => {
            this.scene.anims.remove(animConfig.key);
            slashSprite.destroy();
          });
        } else {
          slashSprite.play('slash2-effect');
          slashSprite.once('animationcomplete', () => {
            slashSprite.destroy();
          });
        }
        
        // Deal damage
        const distance = Phaser.Math.Distance.Between(
          this.x, this.y,
          this.target.x, this.target.y
        );
        
        if (distance <= this.attackRange) {
          this.target.takeDamage(this.attackDamage);
        }
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
}

