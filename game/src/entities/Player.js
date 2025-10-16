import Phaser from 'phaser';
import FloatingText from '../utils/FloatingText.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, collisionMap) {
    super(scene, x, y, 'black-warrior-idle');
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Store collision map reference
    this.collisionMap = collisionMap;
    
    // Player stats
    this.health = 100;
    this.maxHealth = 100;
    this.moveSpeed = 200;
    this.attackDamage = 20;
    this.isAttacking = false;
    this.isGuarding = false;
    this.attackCooldown = 0;
    this.lastAttackType = 'attack1';
    this.facingDirection = 1; // 1 = right, -1 = left
    
    // XP and Leveling
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = 100; // Level * 100
    
    // Setup physics
    this.setCollideWorldBounds(false); // We handle collision manually
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
    this.play('black-warrior-idle');
  }

  createAnimations() {
    const anims = this.scene.anims;
    
    // Idle animation - 8 frames @ 6 FPS
    if (!anims.exists('black-warrior-idle')) {
      anims.create({
        key: 'black-warrior-idle',
        frames: anims.generateFrameNumbers('black-warrior-idle', { start: 0, end: 7 }),
        frameRate: 6,
        repeat: -1
      });
    }
    
    // Run animation - 6 frames @ 10 FPS
    if (!anims.exists('black-warrior-run')) {
      anims.create({
        key: 'black-warrior-run',
        frames: anims.generateFrameNumbers('black-warrior-run', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
    }
    
    // Attack1 animation - 4 frames @ 12 FPS
    if (!anims.exists('black-warrior-attack1')) {
      anims.create({
        key: 'black-warrior-attack1',
        frames: anims.generateFrameNumbers('black-warrior-attack1', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0
      });
    }
    
    // Attack2 animation - 4 frames @ 10 FPS
    if (!anims.exists('black-warrior-attack2')) {
      anims.create({
        key: 'black-warrior-attack2',
        frames: anims.generateFrameNumbers('black-warrior-attack2', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
      });
    }
    
    // Guard animation - 6 frames @ 6 FPS
    if (!anims.exists('black-warrior-guard')) {
      anims.create({
        key: 'black-warrior-guard',
        frames: anims.generateFrameNumbers('black-warrior-guard', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: -1
      });
    }
  }

  update(time, delta) {
    // Update shadow position
    this.shadow.setPosition(this.x, this.y + 60);
    
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
    
    // Handle input
    this.handleInput();
  }

  handleInput() {
    // Don't move if attacking
    if (this.isAttacking) {
      this.body.setVelocity(0, 0);
      return;
    }
    
    // Guard state
    if (this.keys.SHIFT.isDown && !this.isGuarding) {
      this.isGuarding = true;
      this.play('black-warrior-guard', true);
      this.body.setVelocity(0, 0);
      return;
    } else if (this.keys.SHIFT.isUp && this.isGuarding) {
      this.isGuarding = false;
    }
    
    if (this.isGuarding) {
      this.body.setVelocity(0, 0);
      return;
    }
    
    // Attack
    if (this.keys.SPACE.isDown && this.attackCooldown <= 0) {
      this.attack();
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
    
    // Apply movement directly - collision map handles boundaries
    this.body.setVelocity(velocityX, velocityY);
    
    // Play appropriate animation
    if (velocityX !== 0 || velocityY !== 0) {
      if (this.anims.currentAnim?.key !== 'black-warrior-run') {
        this.play('black-warrior-run', true);
      }
    } else {
      if (this.anims.currentAnim?.key !== 'black-warrior-idle') {
        this.play('black-warrior-idle', true);
      }
    }
  }

  attack() {
    this.isAttacking = true;
    this.attackCooldown = 500; // 500ms cooldown
    
    // Alternate between attack1 and attack2
    const attackAnim = this.lastAttackType === 'attack1' ? 'black-warrior-attack2' : 'black-warrior-attack1';
    this.lastAttackType = attackAnim === 'black-warrior-attack1' ? 'attack1' : 'attack2';
    
    this.play(attackAnim);
    
    // Create hitbox after animation starts
    this.scene.time.delayedCall(166, () => { // Frame 2 of attack (12 FPS = ~83ms per frame, frame 2 = 166ms)
      this.createHitbox();
    });
    
    // End attack state when animation completes
    this.once('animationcomplete', () => {
      this.isAttacking = false;
      if (this.active) {
        this.play('black-warrior-idle');
      }
    });
  }

  createHitbox() {
    // Create a temporary hitbox sprite
    const hitboxX = this.x + (this.facingDirection * 60); // 40px in front + some offset
    const hitboxY = this.y;
    
    const hitbox = this.scene.physics.add.sprite(hitboxX, hitboxY, null);
    hitbox.body.setSize(80, 80);
    hitbox.visible = false;
    
    // Check overlap with enemies
    this.scene.physics.overlap(hitbox, this.scene.enemies, (hitbox, enemy) => {
      const damage = this.lastAttackType === 'attack1' ? 15 : 25;
      enemy.takeDamage(damage, this.facingDirection);
    });
    
    // Destroy hitbox after brief moment
    this.scene.time.delayedCall(50, () => {
      hitbox.destroy();
    });
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
    if (this.isGuarding) {
      amount *= 0.5; // 50% damage reduction when guarding
    }

    this.health -= amount;

    // Floating damage number
    FloatingText.createDamage(this.scene, this.x, this.y - 50, amount);

    // Visual feedback
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      // Check if player still exists before clearing tint
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
    
    // Stat increases
    this.maxHealth += 20;
    this.health = this.maxHealth; // Heal to full on level up
    this.attackDamage += 5;
    
    // Visual feedback
    FloatingText.createLevelUp(this.scene, this.x, this.y - 90, this.level);
    
    // Particle effect
    this.scene.add.particles(this.x, this.y, 'shadow', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 500,
      quantity: 20,
      tint: 0xffd700
    });
  }

  die() {
    // Death animation/logic
    this.setActive(false);
    this.setVisible(false);
    this.shadow.setVisible(false);
    console.log('Player died!');
  }

  destroy() {
    if (this.shadow) {
      this.shadow.destroy();
    }
    super.destroy();
  }
}

