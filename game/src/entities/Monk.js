import Phaser from 'phaser';
import BaseCharacter from './BaseCharacter.js';
import { GameBalance } from '../config/GameBalance.js';

export default class Monk extends BaseCharacter {
  constructor(scene, x, y, collisionMap) {
    // Use monk stats (temporarily using warrior stats, will add monk config later)
    const stats = {
      health: 80,
      moveSpeed: 175,
      attackDamage: 0
    };
    
    // Call BaseCharacter constructor
    super(scene, x, y, 'black-monk-idle', stats);
    
    // Store collision map reference
    this.collisionMap = collisionMap;
    
    // Monk-specific properties
    this.isHealing = false;
    this.healCooldown = 0;
    this.healAmount = 30;
    this.healRange = 160;
    this.healRadius = 160;
    
    // Setup physics (override base offset)
    this.setCollideWorldBounds(false);
    this.body.setOffset(66, 50);
    
    // Create animations
    this.createAnimations();
    
    // Setup controls
    this.keys = scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });
    
    // Play idle animation
    this.play('black-monk-idle');
  }

  createAnimations() {
    const anims = this.scene.anims;
    
    // Idle animation - 6 frames @ 6 FPS
    if (!anims.exists('black-monk-idle')) {
      anims.create({
        key: 'black-monk-idle',
        frames: anims.generateFrameNumbers('black-monk-idle', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: -1
      });
    }
    
    // Run animation - 4 frames @ 8 FPS
    if (!anims.exists('black-monk-run')) {
      anims.create({
        key: 'black-monk-run',
        frames: anims.generateFrameNumbers('black-monk-run', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });
    }
    
    // Heal animation - 11 frames @ 12 FPS
    if (!anims.exists('black-monk-heal')) {
      anims.create({
        key: 'black-monk-heal',
        frames: anims.generateFrameNumbers('black-monk-heal', { start: 0, end: 10 }),
        frameRate: 12,
        repeat: 0
      });
    }
    
    // Heal effect animation - 11 frames @ 12 FPS
    if (!anims.exists('black-monk-heal-effect')) {
      anims.create({
        key: 'black-monk-heal-effect',
        frames: anims.generateFrameNumbers('black-monk-heal-effect', { start: 0, end: 10 }),
        frameRate: 12,
        repeat: 0
      });
    }
  }

  update(time, delta) {
    // Call base class update (handles shadow, depth sorting)
    super.update(time, delta);
    
    // Update heal cooldown
    if (this.healCooldown > 0) {
      this.healCooldown -= delta;
    }
    
    // Handle input
    this.handleInput();
  }

  handleInput() {
    // Don't move if healing
    if (this.isHealing) {
      this.body.setVelocity(0, 0);
      return;
    }
    
    // Heal ability (SPACE)
    if (this.keys.SPACE.isDown && this.healCooldown <= 0) {
      this.heal();
      return;
    }
    
    // Movement
    let velocityX = 0;
    let velocityY = 0;
    
    if (this.keys.A.isDown) {
      velocityX = -this.moveSpeed;
      this.facingDirection = -1;
      this.setFlipX(true);
    } else if (this.keys.D.isDown) {
      velocityX = this.moveSpeed;
      this.facingDirection = 1;
      this.setFlipX(false);
    }
    
    if (this.keys.W.isDown) {
      velocityY = -this.moveSpeed;
    } else if (this.keys.S.isDown) {
      velocityY = this.moveSpeed;
    }
    
    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }
    
    // Apply movement directly
    this.body.setVelocity(velocityX, velocityY);
    
    // Play appropriate animation
    if (velocityX !== 0 || velocityY !== 0) {
      if (this.anims.currentAnim?.key !== 'black-monk-run') {
        this.play('black-monk-run', true);
      }
    } else {
      if (this.anims.currentAnim?.key !== 'black-monk-idle') {
        this.play('black-monk-idle', true);
      }
    }
  }

  heal() {
    this.isHealing = true;
    this.healCooldown = 3000; // 3 second cooldown
    
    this.play('black-monk-heal');
    
    // Create heal effect
    const healEffect = this.scene.add.sprite(this.x, this.y, 'black-monk-heal-effect');
    healEffect.setDepth(3);
    healEffect.play('black-monk-heal-effect');
    
    // Trigger heal on frame 5-7
    this.scene.time.delayedCall(416, () => { // Frame 5 @ 12 FPS = ~416ms
      this.performHeal();
    });
    
    // Destroy effect when animation completes
    healEffect.once('animationcomplete', () => {
      healEffect.destroy();
    });
    
    // End heal state when animation completes
    this.once('animationcomplete', () => {
      this.isHealing = false;
      if (this.active) {
        this.play('black-monk-idle');
      }
    });
  }

  performHeal() {
    // Heal self using base class method
    super.heal(this.healAmount);
    
    // Heal nearby allies (player character if they exist)
    if (this.scene.player && this.scene.player !== this) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
      if (distance <= this.healRadius) {
        this.scene.player.heal(this.healAmount);
      }
    }
  }
  
  /**
   * Override levelUp to add monk-specific stat increases
   */
  levelUp() {
    // Call base class level up
    super.levelUp();
    
    // Monk-specific stat increases
    this.maxHealth += 15; // Less HP than warrior
    this.healAmount += 5; // Increase heal power
    
    // Override particle color to green for monk
    if (this.scene && this.scene.add) {
      this.scene.add.particles(this.x, this.y, 'shadow', {
        speed: { min: 100, max: 200 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 500,
        quantity: 20,
        tint: 0x00ff00 // Green for monk
      });
    }
  }
}

