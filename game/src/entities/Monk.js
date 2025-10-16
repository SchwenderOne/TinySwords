import Phaser from 'phaser';
import FloatingText from '../utils/FloatingText.js';

export default class Monk extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, collisionMap) {
    super(scene, x, y, 'black-monk-idle');
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Store collision map reference
    this.collisionMap = collisionMap;
    
    // Monk stats
    this.health = 80; // Less health than warrior
    this.maxHealth = 80;
    this.moveSpeed = 175; // Slightly slower than warrior
    this.attackDamage = 0; // Monks don't attack
    this.isHealing = false;
    this.healCooldown = 0;
    this.healAmount = 30;
    this.healRange = 160;
    this.facingDirection = 1; // 1 = right, -1 = left
    
    // XP and Leveling (shared with Warrior through scene)
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = 100;
    
    // Heal properties
    this.healRadius = 160;
    this.healAmount = 30;
    
    // Setup physics
    this.setCollideWorldBounds(false);
    // Smaller collision box for tighter, more accurate collisions
    this.body.setSize(60, 80);
    this.body.setOffset(66, 90);
    
    // Create animations
    this.createAnimations();
    
    // Add shadow
    this.shadow = scene.add.image(x, y + 60, 'shadow');
    this.shadow.setScale(0.3);
    this.shadow.setAlpha(0.5);
    this.shadow.setDepth(0);
    
    this.setDepth(2);
    
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
    // Update shadow position
    this.shadow.setPosition(this.x, this.y + 60);
    
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
    // Heal self
    this.health = Math.min(this.health + this.healAmount, this.maxHealth);
    
    // Visual feedback
    this.setTint(0x00ff00);
    this.scene.time.delayedCall(200, () => {
      if (this.active) {
        this.clearTint();
      }
    });
    
    // Heal nearby allies (player character if they exist)
    if (this.scene.player && this.scene.player !== this) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
      if (distance <= this.healRadius) {
        this.scene.player.heal(this.healAmount);
      }
    }
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);

    // Floating heal number
    FloatingText.createHeal(this.scene, this.x, this.y - 50, amount);

    // Visual feedback
    this.setTint(0x00ff00);
    this.scene.time.delayedCall(200, () => {
      if (this.active) {
        this.clearTint();
      }
    });
  }

  takeDamage(amount) {
    this.health -= amount;

    // Floating damage number
    FloatingText.createDamage(this.scene, this.x, this.y - 50, amount);

    // Visual feedback
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) {
        this.clearTint();
      }
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  gainXP(amount) {
    this.xp += amount;
    
    // Show XP gain
    FloatingText.createXP(this.scene, this.x, this.y - 70, amount);
    
    // Check for level up
    while (this.xp >= this.xpToNextLevel) {
      this.levelUp();
    }
  }
  
  levelUp() {
    this.level++;
    this.xp -= this.xpToNextLevel;
    this.xpToNextLevel = this.level * 100;
    
    // Stat increases (Monk gets more HP, less attack)
    this.maxHealth += 15;
    this.health = this.maxHealth; // Heal to full on level up
    this.healAmount += 5; // Increase heal power
    
    // Visual feedback
    FloatingText.createLevelUp(this.scene, this.x, this.y - 90, this.level);
    
    // Particle effect
    this.scene.add.particles(this.x, this.y, 'shadow', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      quantity: 20,
      tint: 0x00ff00 // Green for monk
    });
  }

  die() {
    this.setActive(false);
    this.setVisible(false);
    this.shadow.setVisible(false);
    this.body.enable = false; // Disable physics body
  }

  destroy() {
    if (this.shadow) {
      this.shadow.destroy();
    }
    super.destroy();
  }
}

