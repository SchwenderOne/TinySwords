import Phaser from 'phaser';
import BaseCharacter from './BaseCharacter.js';
import { GameBalance } from '../config/GameBalance.js';

export default class Player extends BaseCharacter {
  constructor(scene, x, y, collisionMap) {
    // Get warrior stats from config
    const stats = GameBalance.player.warrior;
    
    // Call BaseCharacter constructor with stats
    super(scene, x, y, 'black-warrior-idle', {
      health: stats.startHealth,
      moveSpeed: stats.moveSpeed,
      attackDamage: stats.startDamage
    });
    
    // Store collision map reference
    this.collisionMap = collisionMap;
    
    // Player-specific state
    this.isGuarding = false;
    this.attackCooldown = 0;
    this.lastAttackType = 'attack1';
    this.lastMovementX = 0;
    this.lastMovementY = 0;
    
    // Setup physics (override base offset for player)
    this.setCollideWorldBounds(false); // We handle collision manually
    this.body.setOffset(66, 50); // Player-specific offset
    
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
    // Call base class update (handles shadow, depth sorting)
    super.update(time, delta);
    
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
    
    // Track movement for attack direction
    if (this.keys.A.isDown) {
      velocityX = -this.moveSpeed;
      this.facingDirection = -1;
      this.setFlipX(true);
      this.lastMovementX = -1;
      this.lastMovementY = 0;
    } else if (this.keys.D.isDown) {
      velocityX = this.moveSpeed;
      this.facingDirection = 1;
      this.setFlipX(false);
      this.lastMovementX = 1;
      this.lastMovementY = 0;
    }
    
    if (this.keys.W.isDown) {
      velocityY = -this.moveSpeed;
      this.facingVertical = -1;
      // Only set vertical movement if no horizontal movement
      if (velocityX === 0) {
        this.lastMovementX = 0;
        this.lastMovementY = -1;
      }
    } else if (this.keys.S.isDown) {
      velocityY = this.moveSpeed;
      this.facingVertical = 1;
      // Only set vertical movement if no horizontal movement
      if (velocityX === 0) {
        this.lastMovementX = 0;
        this.lastMovementY = 1;
      }
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
    // Determine hitbox position based on last movement direction
    let hitboxX = this.x;
    let hitboxY = this.y;
    let pushDirection = this.facingDirection; // Default to horizontal
    
    // Prioritize the last movement direction for attack
    if (this.lastMovementY !== 0) {
      // Vertical attack (up or down)
      hitboxY = this.y + (this.lastMovementY * 60);
      pushDirection = this.lastMovementY; // Use vertical direction for knockback
    } else {
      // Horizontal attack (left or right)
      hitboxX = this.x + (this.lastMovementX * 60);
      pushDirection = this.lastMovementX;
    }
    
    const hitbox = this.scene.physics.add.sprite(hitboxX, hitboxY, null);
    hitbox.body.setSize(80, 80);
    hitbox.visible = false;
    
    // Check overlap with enemies
    this.scene.physics.overlap(hitbox, this.scene.enemies, (hitbox, enemy) => {
      const damage = this.lastAttackType === 'attack1' ? 15 : 25;
      enemy.takeDamage(damage, pushDirection);
    });
    
    // Destroy hitbox after brief moment
    this.scene.time.delayedCall(50, () => {
      hitbox.destroy();
    });
  }

  /**
   * Override takeDamage to apply guard damage reduction
   */
  takeDamage(amount) {
    // Apply guard damage reduction if active
    const reduction = this.isGuarding ? GameBalance.player.warrior.guardDamageReduction : 0;
    super.takeDamage(amount, { damageReduction: reduction });
  }
  
  /**
   * Override levelUp to add warrior-specific stat increases
   */
  levelUp() {
    // Call base class level up (handles XP, level increment, visual feedback)
    super.levelUp();
    
    // Warrior-specific stat increases
    const stats = GameBalance.player.warrior;
    this.maxHealth += stats.healthPerLevel;
    this.attackDamage += stats.damagePerLevel;
    
    // Health is already set to maxHealth by base class
  }
}

