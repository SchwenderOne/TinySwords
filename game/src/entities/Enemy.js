import Phaser from 'phaser';
import { GameBalance } from '../config/GameBalance.js';
import FloatingText from '../utils/FloatingText.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  /**
   * Create a new enemy with archetype-based stats
   * @param {Phaser.Scene} scene - The game scene
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} archetypeName - Enemy archetype (e.g., 'E1_GRUNT', 'E9_HEALER')
   * @param {number} waveNumber - Current wave number (for scaling)
   * @param {CollisionMap} collisionMap - Terrain collision system
   * @param {boolean} isElite - Whether this is an elite variant
   */
  constructor(scene, x, y, archetypeName, waveNumber = 1, collisionMap = null, isElite = false) {
    // Get archetype config
    const archetype = GameBalance.enemyArchetypes[archetypeName];
    if (!archetype) {
      console.error(`Unknown archetype: ${archetypeName}`);
      return;
    }

    // Determine sprite key based on base unit
    const spriteKey = archetype.baseUnit === 'warrior'
      ? 'red-warrior-idle'
      : 'red-archer-idle';

    super(scene, x, y, spriteKey);

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.collisionMap = collisionMap;
    this.archetypeName = archetypeName;
    this.archetype = archetype;
    this.baseUnit = archetype.baseUnit;
    this.waveNumber = waveNumber;
    this.isElite = isElite;
    this.scene = scene;

    // ============================================================
    // STAT CALCULATION WITH WAVE SCALING
    // ============================================================
    const scaling = GameBalance.waveScaling;
    const baseHealth = scaling.baseEnemyHealth;
    const baseDamage = scaling.baseEnemyDamage;

    // Wave scaling: HP is exponential, DMG is linear
    const waveHealthMultiplier = Math.pow(scaling.hpPerWave, waveNumber - 1);
    const waveDamageBonus = scaling.dmgPerWave * (waveNumber - 1);

    // Base stats with archetype multiplier
    let health = baseHealth * archetype.hpMultiplier * waveHealthMultiplier;
    let damage = baseDamage * archetype.dmgMultiplier + waveDamageBonus;

    // Apply elite multipliers if elite
    if (isElite) {
      health *= scaling.eliteMultipliers.hp;
      damage *= scaling.eliteMultipliers.dmg;
    }

    this.health = health;
    this.maxHealth = health;
    this.attackDamage = damage;

    // Movement speed with archetype and wave scaling
    let moveSpeed = 100 * archetype.msMultiplier;
    // Add MS boost at specific waves
    if (scaling.msBoostWaves.includes(waveNumber)) {
      moveSpeed *= 1.01;
    }
    this.moveSpeed = this.baseUnit === 'archer' ? 0 : moveSpeed;

    // Range stats
    this.attackRange = this.baseUnit === 'archer' ? 400 : 100;
    if (archetype.special === 'reach') {
      this.attackRange += 20; // Spearmen have longer reach
    }

    this.detectionRange = this.baseUnit === 'archer' ? 450 : 300;
    this.armorReduction = archetype.arMultiplier; // Armor damage reduction

    // XP reward
    const baseXp = this.baseUnit === 'warrior' ? 50 : 30;
    this.xpReward = Math.floor(baseXp * archetype.xpWeight);
    if (isElite) {
      this.xpReward = Math.floor(this.xpReward * scaling.eliteMultipliers.xpBonus);
    }

    // AI state
    this.aiState = 'patrol'; // patrol, chase, attack
    this.target = null;
    this.patrolPoints = [];
    this.currentPatrolIndex = 0;
    this.attackCooldown = 0;
    this.isAttacking = false;
    this.facingDirection = 1;

    // Special ability tracking
    this.specialCooldown = 0;
    this.spawnedAllies = []; // For summoners - track spawned enemies
    this.healAuraTargets = new Set(); // For healers - track healed targets

    // Setup physics
    this.body.setSize(60, 80);
    this.body.setOffset(66, 50);

    // Visual differentiation based on archetype
    this.setScale(archetype.scale);
    this.setTint(archetype.tint);

    // Add special visual indicators
    if (isElite) {
      this.createEliteAura();
    }

    // Add shadow
    this.shadow = scene.add.image(x, y + 60, 'shadow');
    this.shadow.setScale(0.3 * archetype.scale);
    this.shadow.setAlpha(0.5);
    this.shadow.setDepth(0);

    // Create health bar (above enemy)
    const barWidth = 60;
    this.healthBarBg = scene.add.rectangle(x, y - 100, barWidth, 6, 0x000000);
    this.healthBarBg.setDepth(10);

    this.healthBarFill = scene.add.rectangle(x, y - 100, barWidth, 6, 0x00ff00);
    this.healthBarFill.setOrigin(0, 0.5);
    this.healthBarFill.setDepth(11);
    this.healthBarFill.x = this.healthBarBg.x - barWidth / 2;

    this.setDepth(2);

    // Create animations
    this.createAnimations();

    // Setup patrol points for melee units
    if (this.baseUnit === 'warrior') {
      this.setupPatrolPoints(x, y);
    }

    // Play idle animation
    const idleAnim = this.baseUnit === 'warrior' ? 'red-warrior-idle' : 'red-archer-idle';
    this.play(idleAnim);
  }

  // ============================================================
  // VISUAL EFFECTS
  // ============================================================

  createEliteAura() {
    // Create a glowing aura effect for elite enemies
    this.eliteAura = this.scene.add.circle(this.x, this.y, 80, this.archetype.tint);
    this.eliteAura.setAlpha(0.15);
    this.eliteAura.setDepth(1);
    this.eliteAura.setStrokeStyle(2, this.archetype.tint, 0.4);
  }

  updateEliteAura() {
    if (this.eliteAura && this.active) {
      this.eliteAura.setPosition(this.x, this.y);
      // Pulsing effect
      const pulse = Math.sin(this.scene.time.now() * 0.003) * 0.15 + 0.2;
      this.eliteAura.setAlpha(pulse);
    }
  }

  createAnimations() {
    const anims = this.scene.anims;

    if (this.baseUnit === 'warrior') {
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
    this.patrolPoints = [
      { x: startX, y: startY },
      { x: startX + 150, y: startY },
      { x: startX + 150, y: startY + 100 },
      { x: startX, y: startY + 100 }
    ];
  }

  updateHealthBar() {
    this.healthBarBg.x = this.x;
    this.healthBarBg.y = this.y - 100;
    this.healthBarFill.x = this.x - 30;
    this.healthBarFill.y = this.y - 100;

    const healthPercent = Math.max(0, this.health / this.maxHealth);
    this.healthBarFill.width = 60 * healthPercent;

    if (healthPercent > 0.6) {
      this.healthBarFill.setFillStyle(0x00ff00);
    } else if (healthPercent > 0.3) {
      this.healthBarFill.setFillStyle(0xffff00);
    } else {
      this.healthBarFill.setFillStyle(0xff0000);
    }
  }

  // ============================================================
  // MAIN UPDATE LOOP
  // ============================================================

  update(time, delta, player) {
    if (!this.active) return;

    this.shadow.setPosition(this.x, this.y + 60);
    this.updateHealthBar();

    if (this.isElite) {
      this.updateEliteAura();
    }

    // Update cooldowns
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
    if (this.specialCooldown > 0) {
      this.specialCooldown -= delta;
    }

    if (this.health <= 0) return;

    // Update special behaviors
    this.updateSpecialBehaviors(player, delta);

    // Update AI
    this.updateAI(player);
  }

  // ============================================================
  // SPECIAL BEHAVIORS
  // ============================================================

  updateSpecialBehaviors(player, delta) {
    switch (this.archetype.special) {
      case 'healer':
        this.updateHealerBehavior(player, delta);
        break;
      case 'summoner':
        this.updateSummonerBehavior(player, delta);
        break;
      case 'captain':
        this.updateCaptainBehavior(player, delta);
        break;
      case 'colossus':
        // Colossus behaviors handled in attack/chase
        break;
    }
  }

  updateHealerBehavior(player, delta) {
    // Healers emit a healing aura to nearby enemies
    const healRange = 150;
    const healAmount = 2; // HP per frame

    if (this.scene.enemies) {
      this.scene.enemies.children.forEach(enemy => {
        if (enemy === this || !enemy.active) return;

        const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
        if (distance < healRange && enemy.health < enemy.maxHealth) {
          enemy.health = Math.min(enemy.maxHealth, enemy.health + healAmount);
        }
      });
    }
  }

  updateSummonerBehavior(player, delta) {
    // Summoners spawn grunts periodically
    const spawnCooldown = 6000; // 6 seconds
    const maxSpawns = 3;

    if (this.specialCooldown <= 0 && this.scene.enemies.children.size - this.spawnedAllies.length < maxSpawns) {
      this.spawnMinion();
      this.specialCooldown = spawnCooldown;
    }

    // Clean up dead spawned allies
    this.spawnedAllies = this.spawnedAllies.filter(ally => ally && ally.active);
  }

  spawnMinion() {
    if (!this.active) return;

    const angle = Math.random() * Math.PI * 2;
    const distance = 60;
    const spawnX = this.x + Math.cos(angle) * distance;
    const spawnY = this.y + Math.sin(angle) * distance;

    const Enemy = this.constructor;
    const minion = new Enemy(
      this.scene,
      spawnX,
      spawnY,
      'E1_GRUNT',
      this.waveNumber,
      this.collisionMap,
      false
    );

    // Add to enemies group and setup collisions
    if (this.scene.enemies) {
      this.scene.enemies.add(minion);

      // Setup collisions with environment
      if (this.scene.buildingsGroup) {
        this.scene.physics.add.collider(minion, this.scene.buildingsGroup);
      }
      if (this.scene.treesGroup) {
        this.scene.physics.add.collider(minion, this.scene.treesGroup);
      }
    }

    this.spawnedAllies.push(minion);

    // Particle effect
    const particles = this.scene.add.particles(0xff00ff);
    const emitter = particles.createEmitter({
      speed: 100,
      angle: { min: 240, max: 300 },
      scale: { start: 1, end: 0 },
      lifespan: 400
    });
    emitter.emitParticleAt(spawnX, spawnY, 10);

    this.scene.time.delayedCall(500, () => particles.destroy());
  }

  updateCaptainBehavior(player, delta) {
    // Captains emit a buff aura to nearby enemies (+10% damage)
    const buffRange = 200;

    // This is handled when allies/enemies attack, they check nearby captains
  }

  // ============================================================
  // AI SYSTEM
  // ============================================================

  updateAI(player) {
    if (!player || !player.active) return;

    const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

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

    // Healers and summoners don't chase aggressively
    if ((this.archetype.special === 'healer' || this.archetype.special === 'summoner') &&
        distanceToPlayer > this.attackRange) {
      this.aiState = 'patrol';
    }

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
    if (this.baseUnit === 'archer') {
      this.body.setVelocity(0, 0);
      return;
    }

    const targetPoint = this.patrolPoints[this.currentPatrolIndex];
    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPoint.x, targetPoint.y);

    if (distance < 10) {
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    } else {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetPoint.x, targetPoint.y);
      const velocityX = Math.cos(angle) * this.moveSpeed;
      const velocityY = Math.sin(angle) * this.moveSpeed;

      this.body.setVelocity(velocityX, velocityY);

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
    if (this.baseUnit === 'archer') {
      this.body.setVelocity(0, 0);
      this.facingDirection = player.x > this.x ? 1 : -1;
      this.setFlipX(this.facingDirection < 0);
      return;
    }

    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const velocityX = Math.cos(angle) * this.moveSpeed;
    const velocityY = Math.sin(angle) * this.moveSpeed;

    this.body.setVelocity(velocityX, velocityY);

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
    this.facingDirection = player.x > this.x ? 1 : -1;
    this.setFlipX(this.facingDirection < 0);

    if (this.baseUnit === 'warrior') {
      if (!this.isAttacking) {
        this.isAttacking = true;
        this.play('red-warrior-attack1', true);
        this.attackCooldown = 1500;

        this.scene.time.delayedCall(200, () => {
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
      }
    } else {
      // Archer/ranged attacks
      this.isAttacking = true;
      this.play('red-archer-shoot');
      this.attackCooldown = 2000;

      this.scene.time.delayedCall(500, () => {
        if (this.active && this.body) {
          this.shootProjectile(player);
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

  shootProjectile(player) {
    if (!this.active || !player || !player.active) {
      return;
    }

    const projectile = this.scene.physics.add.sprite(this.x, this.y, 'arrow');
    projectile.setScale(0.5);
    projectile.setDepth(3);

    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    projectile.setRotation(angle);

    // Speed depends on archetype
    let speed = 300;
    if (this.archetype.special === 'mage') {
      speed = 200; // Mages are slower but AoE
    }

    projectile.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // Handle collision
    this.scene.physics.add.overlap(projectile, player, (projectile, player) => {
      if (player && player.active) {
        let damage = this.attackDamage;

        // Mage projectiles have reduced damage but AoE on hit
        if (this.archetype.special === 'mage') {
          damage *= 0.7;
          this.createAoEExplosion(projectile.x, projectile.y, damage, 80);
        }

        player.takeDamage(damage);
      }
      if (projectile && projectile.active) {
        projectile.destroy();
      }
    });

    this.scene.time.delayedCall(3000, () => {
      if (projectile && projectile.active) {
        projectile.destroy();
      }
    });
  }

  createAoEExplosion(x, y, damage, radius) {
    // Visual effect
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xff8800, 0.3);
    graphics.fillCircle(x, y, radius);
    graphics.setDepth(3);

    this.scene.add.existing(graphics);
    this.scene.time.delayedCall(300, () => graphics.destroy());

    // Damage nearby player if in range
    const player = this.scene.player;
    if (player && player.active) {
      const distance = Phaser.Math.Distance.Between(x, y, player.x, player.y);
      if (distance < radius) {
        player.takeDamage(damage * 0.5);
      }
    }
  }

  // ============================================================
  // DAMAGE & DEATH
  // ============================================================

  takeDamage(amount, knockbackDirection = 1) {
    // Armor reduction
    const reducedDamage = Math.max(1, amount - this.armorReduction);
    this.health -= reducedDamage;

    FloatingText.createDamage(this.scene, this.x, this.y - 50, Math.floor(reducedDamage));

    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) {
        this.clearTint();
        if (this.isElite) {
          this.setTint(this.archetype.tint);
        }
      }
    });

    this.body.setVelocity(knockbackDirection * 200, -100);
    this.scene.time.delayedCall(200, () => {
      if (this.body) {
        this.body.setVelocity(0, 0);
      }
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    // Bomber explosion on death
    if (this.archetype.special === 'bomber') {
      this.createBomberExplosion();
    }

    // Grant XP to player
    if (this.scene.player && this.scene.player.active) {
      this.scene.player.gainXP(this.xpReward);
    }

    // Health potion drop
    if (Math.random() < 0.3 && this.scene.spawnHealthPotion) {
      this.scene.spawnHealthPotion(this.x, this.y);
    }

    this.setActive(false);
    this.setVisible(false);
    this.shadow.setVisible(false);
    this.healthBarFill.setVisible(false);
    this.healthBarBg.setVisible(false);

    if (this.eliteAura) {
      this.eliteAura.setVisible(false);
    }

    if (this.scene.enemies) {
      this.scene.enemies.remove(this, true, true);
    }
  }

  createBomberExplosion() {
    const explosionRadius = 120;
    const explosionDamage = this.attackDamage * 2;

    // Visual effect
    const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xff0000, 0.4);
    graphics.fillCircle(this.x, this.y, explosionRadius);
    graphics.setDepth(5);
    graphics.setScale(0.5);

    this.scene.add.existing(graphics);

    this.scene.tweens.add({
      targets: graphics,
      scale: 1.5,
      alpha: 0,
      duration: 400,
      onComplete: () => graphics.destroy()
    });

    // Damage nearby player
    const player = this.scene.player;
    if (player && player.active) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (distance < explosionRadius) {
        player.takeDamage(explosionDamage);
        FloatingText.createDamage(this.scene, player.x, player.y - 50, Math.floor(explosionDamage));
      }
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
    if (this.eliteAura) {
      this.eliteAura.destroy();
    }
    super.destroy();
  }
}
