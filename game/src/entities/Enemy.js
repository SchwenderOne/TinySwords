import Phaser from 'phaser';
import FloatingText from '../utils/FloatingText.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type, collisionMap) {
    const spriteKey = type === 'warrior' ? 'red-warrior-idle' : 'red-archer-idle';
    super(scene, x, y, spriteKey);
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.collisionMap = collisionMap;
    this.enemyType = type;
    
    // Enemy stats
    if (type === 'warrior') {
      this.health = 100;
      this.maxHealth = 100;
      this.moveSpeed = 120;
      this.attackRange = 60;
      this.attackDamage = 10;
      this.detectionRange = 300;
    } else { // archer
      this.health = 60;
      this.maxHealth = 60;
      this.moveSpeed = 0; // Archers are stationary
      this.attackRange = 400;
      this.attackDamage = 8;
      this.detectionRange = 450;
    }
    
    // AI state
    this.aiState = 'patrol'; // patrol, chase, attack
    this.target = null;
    this.patrolPoints = [];
    this.currentPatrolIndex = 0;
    this.attackCooldown = 0;
    this.isAttacking = false; // Track if currently in attack animation
    this.facingDirection = 1;
    
    // Setup physics
    // Smaller collision box for tighter, more accurate collisions
    this.body.setSize(60, 80);
    this.body.setOffset(66, 90);
    
    // Add shadow
    this.shadow = scene.add.image(x, y + 60, 'shadow');
    this.shadow.setScale(0.3);
    this.shadow.setAlpha(0.5);
    this.shadow.setDepth(0);
    
    // Create health bar (above enemy)
    this.healthBarBg = scene.add.rectangle(x, y - 100, 60, 6, 0x000000);
    this.healthBarBg.setDepth(10);
    
    this.healthBarFill = scene.add.rectangle(x, y - 100, 60, 6, 0x00ff00);
    this.healthBarFill.setOrigin(0, 0.5);
    this.healthBarFill.setDepth(11);
    this.healthBarFill.x = this.healthBarBg.x - 30; // Align to left of background
    
    this.setDepth(2);
    
    // Create animations
    this.createAnimations();
    
    // Setup patrol points for warriors
    if (type === 'warrior') {
      this.setupPatrolPoints(x, y);
    }
    
    // Play idle animation
    const idleAnim = type === 'warrior' ? 'red-warrior-idle' : 'red-archer-idle';
    this.play(idleAnim);
  }

  createAnimations() {
    const anims = this.scene.anims;
    
    if (this.enemyType === 'warrior') {
      // Warrior animations
      if (!anims.exists('red-warrior-idle')) {
        anims.create({
          key: 'red-warrior-idle',
          frames: anims.generateFrameNumbers('red-warrior-idle', { start: 0, end: 7 }),
          frameRate: 6,
          repeat: -1
        });
      }
      
      if (!anims.exists('red-warrior-run')) {
        anims.create({
          key: 'red-warrior-run',
          frames: anims.generateFrameNumbers('red-warrior-run', { start: 0, end: 5 }),
          frameRate: 10,
          repeat: -1
        });
      }
      
      if (!anims.exists('red-warrior-attack1')) {
        anims.create({
          key: 'red-warrior-attack1',
          frames: anims.generateFrameNumbers('red-warrior-attack1', { start: 0, end: 3 }),
          frameRate: 12,
          repeat: 0
        });
      }
      
      if (!anims.exists('red-warrior-guard')) {
        anims.create({
          key: 'red-warrior-guard',
          frames: anims.generateFrameNumbers('red-warrior-guard', { start: 0, end: 3 }),
          frameRate: 8,
          repeat: 0
        });
      }
    } else {
      // Archer animations
      if (!anims.exists('red-archer-idle')) {
        anims.create({
          key: 'red-archer-idle',
          frames: anims.generateFrameNumbers('red-archer-idle', { start: 0, end: 5 }),
          frameRate: 6,
          repeat: -1
        });
      }
      
      if (!anims.exists('red-archer-shoot')) {
        anims.create({
          key: 'red-archer-shoot',
          frames: anims.generateFrameNumbers('red-archer-shoot', { start: 0, end: 7 }),
          frameRate: 12,
          repeat: 0
        });
      }
    }
  }

  setupPatrolPoints(startX, startY) {
    // Create patrol points around starting position
    this.patrolPoints = [
      { x: startX, y: startY },
      { x: startX + 150, y: startY },
      { x: startX + 150, y: startY + 100 },
      { x: startX, y: startY + 100 }
    ];
  }

  updateHealthBar() {
    // Update health bar position
    this.healthBarBg.x = this.x;
    this.healthBarBg.y = this.y - 100;
    this.healthBarFill.x = this.x - 30;
    this.healthBarFill.y = this.y - 100;
    
    // Update health bar width based on current health
    const healthPercent = Math.max(0, this.health / this.maxHealth);
    this.healthBarFill.width = 60 * healthPercent;
    
    // Change color based on health percentage
    if (healthPercent > 0.6) {
      this.healthBarFill.setFillStyle(0x00ff00); // Green
    } else if (healthPercent > 0.3) {
      this.healthBarFill.setFillStyle(0xffff00); // Yellow
    } else {
      this.healthBarFill.setFillStyle(0xff0000); // Red
    }
  }

  update(time, delta, player) {
    // Update shadow position
    this.shadow.setPosition(this.x, this.y + 60);
    
    // Update health bar position
    this.updateHealthBar();
    
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
    
    // Don't update AI if dead
    if (this.health <= 0) return;
    
    // Update AI
    this.updateAI(player);
  }

  updateAI(player) {
    if (!player || !player.active) return;
    
    const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    
    // Don't change state while attacking
    if (this.isAttacking) {
      return;
    }
    
    // State transitions
    if (distanceToPlayer <= this.attackRange && this.attackCooldown <= 0) {
      this.aiState = 'attack';
    } else if (distanceToPlayer <= this.detectionRange) {
      this.aiState = 'chase';
    } else {
      this.aiState = 'patrol';
    }
    
    // Execute state behavior
    switch (this.aiState) {
      case 'patrol':
        this.patrol();
        break;
      case 'chase':
        this.chase(player);
        break;
      case 'attack':
        this.attackTarget(player);
        break;
    }
  }

  patrol() {
    if (this.enemyType === 'archer') {
      // Archers don't patrol
      this.body.setVelocity(0, 0);
      return;
    }
    
    const targetPoint = this.patrolPoints[this.currentPatrolIndex];
    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPoint.x, targetPoint.y);
    
    if (distance < 10) {
      // Reached patrol point, move to next
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    } else {
      // Move towards patrol point
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetPoint.x, targetPoint.y);
      const velocityX = Math.cos(angle) * this.moveSpeed;
      const velocityY = Math.sin(angle) * this.moveSpeed;
      
      this.body.setVelocity(velocityX, velocityY);
      
      // Update facing direction and animation
      if (velocityX > 0) {
        this.facingDirection = 1;
        this.setFlipX(false);
      } else if (velocityX < 0) {
        this.facingDirection = -1;
        this.setFlipX(true);
      }
      
      if (this.anims.currentAnim?.key !== 'red-warrior-run') {
        this.play('red-warrior-run', true);
      }
    }
  }

  chase(player) {
    if (this.enemyType === 'archer') {
      // Archers don't chase, just face the player
      this.body.setVelocity(0, 0);
      this.facingDirection = player.x > this.x ? 1 : -1;
      this.setFlipX(this.facingDirection < 0);
      return;
    }
    
    // Move towards player
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const velocityX = Math.cos(angle) * this.moveSpeed;
    const velocityY = Math.sin(angle) * this.moveSpeed;
    
    this.body.setVelocity(velocityX, velocityY);
    
    // Update facing direction
    if (velocityX > 0) {
      this.facingDirection = 1;
      this.setFlipX(false);
    } else if (velocityX < 0) {
      this.facingDirection = -1;
      this.setFlipX(true);
    }
    
    if (this.anims.currentAnim?.key !== 'red-warrior-run') {
      this.play('red-warrior-run', true);
    }
  }

  attackTarget(player) {
    this.body.setVelocity(0, 0);
    
    // Face the player
    this.facingDirection = player.x > this.x ? 1 : -1;
    this.setFlipX(this.facingDirection < 0);
    
    // Attack
    if (this.enemyType === 'warrior') {
      this.isAttacking = true;
      this.play('red-warrior-attack1');
      this.attackCooldown = 1000; // 1 second cooldown
      
      // Deal damage to player on frame 2
      this.scene.time.delayedCall(166, () => {
        // Only attack if both warrior and player are still alive
        if (this.active && player && player.active) {
          const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
          if (distance <= this.attackRange) {
            player.takeDamage(this.attackDamage);
          }
        }
      });
      
      this.once('animationcomplete', () => {
        if (this.active) {
          this.play('red-warrior-idle');
          this.isAttacking = false;
        }
      });
    } else {
      // Archer shoot
      this.isAttacking = true;
      this.play('red-archer-shoot');
      this.attackCooldown = 2000; // 2 second cooldown
      
      // Spawn arrow on frame 6
      this.scene.time.delayedCall(500, () => {
        // Only shoot if archer is still alive
        if (this.active && this.body) {
          this.shootArrow(player);
        }
      });
      
      this.once('animationcomplete', () => {
        if (this.active) {
          this.play('red-archer-idle');
          this.isAttacking = false;
        }
      });
    }
  }

  shootArrow(player) {
    if (!this.active || !player || !player.active) {
      return; // Don't shoot if archer or player is dead
    }
    
    const arrow = this.scene.physics.add.sprite(this.x, this.y, 'arrow');
    arrow.setScale(0.5);
    arrow.setDepth(3);
    
    // Calculate direction to player
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    arrow.setRotation(angle);
    
    // Set velocity
    const speed = 300;
    arrow.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    
    // Check collision with player
    this.scene.physics.add.overlap(arrow, player, (arrow, player) => {
      if (player && player.active) {
        player.takeDamage(this.attackDamage);
      }
      if (arrow && arrow.active) {
        arrow.destroy();
      }
    });
    
    // Destroy arrow after 3 seconds
    this.scene.time.delayedCall(3000, () => {
      if (arrow && arrow.active) {
        arrow.destroy();
      }
    });
  }

  takeDamage(amount, knockbackDirection = 1) {
    this.health -= amount;

    // Floating damage number
    FloatingText.createDamage(this.scene, this.x, this.y - 50, amount);

    // Visual feedback
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      // Check if enemy still exists before clearing tint
      if (this.active) {
        this.clearTint();
      }
    });

    // Knockback
    this.body.setVelocity(knockbackDirection * 200, -100);
    this.scene.time.delayedCall(200, () => {
      // Check if enemy still exists before clearing velocity
      if (this.body) {
        this.body.setVelocity(0, 0);
      }
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    // Grant XP to active character
    const xpAmount = this.type === 'warrior' ? 50 : 30; // Warriors give more XP
    const activeChar = this.scene.currentCharacter === 'warrior' ? this.scene.player : this.scene.monk;
    if (activeChar && activeChar.active) {
      activeChar.gainXP(xpAmount);
    }
    
    // 30% chance to drop health potion
    if (Math.random() < 0.3 && this.scene.spawnHealthPotion) {
      this.scene.spawnHealthPotion(this.x, this.y);
    }
    
    this.setActive(false);
    this.setVisible(false);
    this.shadow.setVisible(false);
    this.healthBarFill.setVisible(false);
    this.healthBarBg.setVisible(false);
    
    // Remove from enemies group
    if (this.scene.enemies) {
      this.scene.enemies.remove(this, true, true);
    }
  }

  destroy() {
    if (this.shadow) {
      this.shadow.destroy();
    }
    if (this.healthBarFill) {
      this.healthBarFill.destroy();
    }
    if (this.healthBarBg) {
      this.healthBarBg.destroy();
    }
    super.destroy();
  }
}

