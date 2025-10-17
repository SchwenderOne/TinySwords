import { GameBalance } from '../config/GameBalance.js';

/**
 * AbilitySystem - Manages player abilities, unlocks, and cooldowns
 * 
 * All 10 abilities are available for testing. In the final game,
 * abilities will be unlocked at specific levels.
 */
export default class AbilitySystem {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    
    // Define all 10 abilities with their properties
    this.abilities = {
      ability1: {
        id: 'ability1',
        name: 'Quick Slash',
        description: 'Fast horizontal slash',
        slashEffect: 'slash1-effect',
        damage: 25,
        cooldown: 2000, // 2 seconds
        currentCooldown: 0,
        unlocked: true, // All unlocked for testing
        key: 'ONE',
        keyCode: Phaser.Input.Keyboard.KeyCodes.ONE,
        range: 150,
        aoe: false
      },
      ability2: {
        id: 'ability2',
        name: 'Diagonal Strike',
        description: 'Sweeping diagonal attack',
        slashEffect: 'slash2-effect',
        damage: 30,
        cooldown: 3000, // 3 seconds
        currentCooldown: 0,
        unlocked: true,
        key: 'TWO',
        keyCode: Phaser.Input.Keyboard.KeyCodes.TWO,
        range: 160,
        aoe: false
      },
      ability3: {
        id: 'ability3',
        name: 'Vertical Smash',
        description: 'Powerful downward strike',
        slashEffect: 'slash3-effect',
        damage: 40,
        cooldown: 4000, // 4 seconds
        currentCooldown: 0,
        unlocked: true,
        key: 'THREE',
        keyCode: Phaser.Input.Keyboard.KeyCodes.THREE,
        range: 170,
        aoe: true,
        aoeRadius: 100
      },
      ability4: {
        id: 'ability4',
        name: 'Spinning Slash',
        description: '360-degree spinning attack',
        slashEffect: 'slash4-effect',
        damage: 35,
        cooldown: 5000, // 5 seconds
        currentCooldown: 0,
        unlocked: true,
        key: 'FOUR',
        keyCode: Phaser.Input.Keyboard.KeyCodes.FOUR,
        range: 180,
        aoe: true,
        aoeRadius: 120
      },
      ability5: {
        id: 'ability5',
        name: 'Power Strike',
        description: 'Devastating power attack',
        slashEffect: 'slash5-effect',
        damage: 50,
        cooldown: 6000, // 6 seconds
        currentCooldown: 0,
        unlocked: true,
        key: 'FIVE',
        keyCode: Phaser.Input.Keyboard.KeyCodes.FIVE,
        range: 190,
        aoe: false
      },
      ability6: {
        id: 'ability6',
        name: 'Cross Slash',
        description: 'X-shaped dual slash',
        slashEffect: 'slash6-effect',
        damage: 45,
        cooldown: 5500, // 5.5 seconds
        currentCooldown: 0,
        unlocked: true,
        key: 'SIX',
        keyCode: Phaser.Input.Keyboard.KeyCodes.SIX,
        range: 160,
        aoe: true,
        aoeRadius: 110
      },
      ability7: {
        id: 'ability7',
        name: 'Quick Jab',
        description: 'Lightning fast thrust',
        slashEffect: 'slash7-effect',
        damage: 20,
        cooldown: 1500, // 1.5 seconds
        currentCooldown: 0,
        unlocked: true,
        key: 'SEVEN',
        keyCode: Phaser.Input.Keyboard.KeyCodes.SEVEN,
        range: 140,
        aoe: false
      },
      ability8: {
        id: 'ability8',
        name: 'Circular Slash',
        description: 'Wide circular attack',
        slashEffect: 'slash8-effect',
        damage: 38,
        cooldown: 4500, // 4.5 seconds
        currentCooldown: 0,
        unlocked: true,
        key: 'EIGHT',
        keyCode: Phaser.Input.Keyboard.KeyCodes.EIGHT,
        range: 175,
        aoe: true,
        aoeRadius: 130
      },
      ability9: {
        id: 'ability9',
        name: 'Wave Slash',
        description: 'Ranged wave attack',
        slashEffect: 'slash9-effect',
        damage: 35,
        cooldown: 4000, // 4 seconds
        currentCooldown: 0,
        unlocked: true,
        key: 'NINE',
        keyCode: Phaser.Input.Keyboard.KeyCodes.NINE,
        range: 200,
        aoe: false
      },
      ability10: {
        id: 'ability10',
        name: 'Ultimate Strike',
        description: 'Devastating ultimate ability',
        slashEffect: 'slash10-effect',
        damage: 100,
        cooldown: 20000, // 20 seconds
        currentCooldown: 0,
        unlocked: true,
        key: 'ZERO',
        keyCode: Phaser.Input.Keyboard.KeyCodes.ZERO,
        range: 220,
        aoe: true,
        aoeRadius: 200
      }
    };
    
    // Setup keyboard input
    this.setupInput();
    
    // Active slash effect sprites
    this.activeSlashEffects = [];
  }
  
  setupInput() {
    // Create keyboard inputs for all abilities
    this.keys = {};
    Object.values(this.abilities).forEach(ability => {
      this.keys[ability.id] = this.scene.input.keyboard.addKey(ability.keyCode);
    });
  }
  
  update(time, delta) {
    // Update cooldowns
    Object.values(this.abilities).forEach(ability => {
      if (ability.currentCooldown > 0) {
        ability.currentCooldown -= delta;
        if (ability.currentCooldown < 0) {
          ability.currentCooldown = 0;
        }
      }
    });
    
    // Check for ability key presses
    Object.values(this.abilities).forEach(ability => {
      if (Phaser.Input.Keyboard.JustDown(this.keys[ability.id])) {
        this.useAbility(ability.id);
      }
    });
    
    // Clean up finished slash effects
    this.activeSlashEffects = this.activeSlashEffects.filter(sprite => sprite.active);
  }
  
  useAbility(abilityId) {
    const ability = this.abilities[abilityId];
    
    // Check if ability exists
    if (!ability) {
      console.warn(`Ability ${abilityId} not found`);
      return false;
    }
    
    // Check if unlocked
    if (!ability.unlocked) {
      console.log(`${ability.name} is locked!`);
      return false;
    }
    
    // Check cooldown
    if (ability.currentCooldown > 0) {
      console.log(`${ability.name} is on cooldown: ${(ability.currentCooldown / 1000).toFixed(1)}s`);
      return false;
    }
    
    // Check if player is dead
    if (this.player.isDead) {
      return false;
    }
    
    console.log(`Using ${ability.name}!`);
    
    // Start cooldown (only if cooldowns are enabled)
    if (this.scene.abilityCooldownsEnabled) {
      ability.currentCooldown = ability.cooldown;
    }
    
    // Play slash effect
    this.playSlashEffect(ability);
    
    // Deal damage to enemies
    this.damageEnemies(ability);
    
    return true;
  }
  
  playSlashEffect(ability) {
    // Get player facing direction (based on last movement)
    // Calculate base offset - some abilities need to be further out
    let baseOffsetDistance = 30; // Default - just slightly in front
    let offsetX = 0;
    let offsetY = 0;
    
    // Get facing angle - use stored angle from player
    let facingAngle = this.player.lastFacingAngle || 0;
    
    // Convert facing angle to degrees for rotation
    const facingDegrees = Phaser.Math.RadToDeg(facingAngle);
    
    // Handle each ability individually with custom settings
    switch(ability.id) {
      case 'ability1': // Quick Slash - 5x bigger, in front
        offsetX = Math.cos(facingAngle) * baseOffsetDistance;
        offsetY = Math.sin(facingAngle) * baseOffsetDistance;
        this.createSlashSprite(ability, offsetX, offsetY, 1.5, facingDegrees, 1.0, 1);
        break;
        
      case 'ability2': // Diagonal Strike - rotated 90° counter-clockwise, double speed
        offsetX = Math.cos(facingAngle) * baseOffsetDistance;
        offsetY = Math.sin(facingAngle) * baseOffsetDistance;
        this.createSlashSprite(ability, offsetX, offsetY, 0.3, facingDegrees - 90, 0.4, 1);
        break;
        
      case 'ability3': // Vertical Smash - further in front, rotated 45° clockwise
        const offset3 = 80; // Much further in front
        offsetX = Math.cos(facingAngle) * offset3;
        offsetY = Math.sin(facingAngle) * offset3;
        this.createSlashSprite(ability, offsetX, offsetY, 0.3, facingDegrees + 45, 1.0, 1);
        break;
        
      case 'ability4': // Spinning Slash - further in front, quicker, 3 times
        const offset4 = 70; // Character width distance in front
        const baseX = Math.cos(facingAngle) * offset4;
        const baseY = Math.sin(facingAngle) * offset4;
        for (let i = 0; i < 3; i++) {
          this.scene.time.delayedCall(i * 150, () => {
            this.createSlashSprite(ability, baseX, baseY, 0.3, facingDegrees, 2.0, 1);
          });
        }
        break;
        
      case 'ability5': // Power Strike - 4x bigger, in front
        offsetX = Math.cos(facingAngle) * baseOffsetDistance;
        offsetY = Math.sin(facingAngle) * baseOffsetDistance;
        this.createSlashSprite(ability, offsetX, offsetY, 1.2, facingDegrees, 1.0, 1);
        break;
        
      case 'ability6': // Cross Slash - in front
        offsetX = Math.cos(facingAngle) * baseOffsetDistance;
        offsetY = Math.sin(facingAngle) * baseOffsetDistance;
        this.createSlashSprite(ability, offsetX, offsetY, 0.3, facingDegrees, 1.0, 1);
        break;
        
      case 'ability7': // Quick Jab - further in front, 3 times with 45° rotation
        const offset7 = 70; // Character width distance in front
        const baseX7 = Math.cos(facingAngle) * offset7;
        const baseY7 = Math.sin(facingAngle) * offset7;
        for (let i = 0; i < 3; i++) {
          this.scene.time.delayedCall(i * 100, () => {
            this.createSlashSprite(ability, baseX7, baseY7, 0.3, facingDegrees + (i * 45), 1.0, 1);
          });
        }
        break;
        
      case 'ability8': // Circular Slash - chain explosion (5 hits like ability 10)
        const chainDistance8 = 100; // Distance between each explosion
        for (let i = 0; i < 5; i++) {
          this.scene.time.delayedCall(i * 150, () => {
            const chainOffsetX8 = Math.cos(facingAngle) * (baseOffsetDistance + (i * chainDistance8));
            const chainOffsetY8 = Math.sin(facingAngle) * (baseOffsetDistance + (i * chainDistance8));
            this.createSlashSprite(ability, chainOffsetX8, chainOffsetY8, 0.6, facingDegrees, 1.0, 1);
          });
        }
        break;
        
      case 'ability9': // Wave Slash - 3 quick hits at same position (like ability 4)
        const offset9 = 70; // Same distance as ability 4 and 7
        const baseX9 = Math.cos(facingAngle) * offset9;
        const baseY9 = Math.sin(facingAngle) * offset9;
        for (let i = 0; i < 3; i++) {
          this.scene.time.delayedCall(i * 100, () => { // 100ms delay for quick succession
            this.createSlashSprite(ability, baseX9, baseY9, 0.3, facingDegrees, 1.0, 1);
          });
        }
        break;
        
      case 'ability10': // Ultimate Strike - chain explosion (5 hits in line)
        const chainDistance = 100; // Distance between each explosion
        for (let i = 0; i < 5; i++) {
          this.scene.time.delayedCall(i * 150, () => {
            const chainOffsetX = Math.cos(facingAngle) * (baseOffsetDistance + (i * chainDistance));
            const chainOffsetY = Math.sin(facingAngle) * (baseOffsetDistance + (i * chainDistance));
            this.createSlashSprite(ability, chainOffsetX, chainOffsetY, 0.3, facingDegrees, 1.0, -1);
          });
        }
        break;
        
      default:
        offsetX = Math.cos(facingAngle) * baseOffsetDistance;
        offsetY = Math.sin(facingAngle) * baseOffsetDistance;
        this.createSlashSprite(ability, offsetX, offsetY, 0.3, 0, 1.0, 1);
    }
  }
  
  createSlashSprite(ability, offsetX, offsetY, scale, rotation, speedMultiplier, flipX) {
    // Create sprite for slash effect in front of player
    const slashSprite = this.scene.add.sprite(
      this.player.x + offsetX,
      this.player.y + offsetY,
      `${ability.slashEffect.split('-')[0]}-frame1` // Use first frame as texture
    );
    
    // Apply transformations
    slashSprite.setScale(scale);
    slashSprite.setAngle(rotation);
    if (flipX === -1) {
      slashSprite.setFlipX(true);
    }
    slashSprite.setDepth(this.player.y + 100); // Above everything
    slashSprite.setAlpha(0.8);
    slashSprite.setBlendMode(Phaser.BlendModes.ADD); // Additive blending for glow effect
    
    // Get the animation and adjust speed
    const anim = this.scene.anims.get(ability.slashEffect);
    if (anim) {
      // Create a temporary animation config with adjusted speed
      const animConfig = {
        key: ability.slashEffect + '_temp_' + Date.now(),
        frames: anim.frames.map(f => ({ key: f.textureKey })),
        frameRate: anim.frameRate * speedMultiplier,
        repeat: 0
      };
      this.scene.anims.create(animConfig);
      slashSprite.play(animConfig.key);
      
      // Clean up temp animation after completion
      slashSprite.once('animationcomplete', () => {
        this.scene.anims.remove(animConfig.key);
        slashSprite.destroy();
      });
    } else {
      // Fallback if animation not found
      slashSprite.play(ability.slashEffect);
      slashSprite.once('animationcomplete', () => {
        slashSprite.destroy();
      });
    }
    
    // Track active effect
    this.activeSlashEffects.push(slashSprite);
  }
  
  damageEnemies(ability) {
    // Get all enemies in the scene
    const enemies = this.scene.enemies.getChildren();
    
    enemies.forEach(enemy => {
      if (enemy.isDead) return;
      
      // Calculate distance to enemy
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );
      
      // Check if enemy is in range
      let inRange = false;
      
      if (ability.aoe) {
        // AOE abilities hit all enemies within aoeRadius
        inRange = distance <= ability.aoeRadius;
      } else {
        // Single target abilities need to be in range and facing the enemy
        inRange = distance <= ability.range;
      }
      
      if (inRange) {
        // Deal damage
        enemy.takeDamage(ability.damage);
        
        // Visual feedback - flash effect
        this.scene.tweens.add({
          targets: enemy,
          alpha: 0.5,
          duration: 50,
          yoyo: true,
          repeat: 2
        });
      }
    });
  }
  
  unlockAbility(abilityId) {
    const ability = this.abilities[abilityId];
    if (ability) {
      ability.unlocked = true;
      console.log(`${ability.name} unlocked!`);
      return true;
    }
    return false;
  }
  
  isOnCooldown(abilityId) {
    const ability = this.abilities[abilityId];
    return ability ? ability.currentCooldown > 0 : true;
  }
  
  getCooldownPercent(abilityId) {
    const ability = this.abilities[abilityId];
    if (!ability) return 0;
    return ability.currentCooldown / ability.cooldown;
  }
  
  getCooldownRemaining(abilityId) {
    const ability = this.abilities[abilityId];
    if (!ability) return 0;
    return ability.currentCooldown;
  }
  
  getAbility(abilityId) {
    return this.abilities[abilityId];
  }
  
  getAllAbilities() {
    return Object.values(this.abilities);
  }
  
  getUnlockedAbilities() {
    return Object.values(this.abilities).filter(a => a.unlocked);
  }
  
  resetAllCooldowns() {
    // Reset all ability cooldowns to 0
    Object.values(this.abilities).forEach(ability => {
      ability.currentCooldown = 0;
    });
    console.log('All ability cooldowns reset to 0');
  }
  
  destroy() {
    // Clean up active effects
    this.activeSlashEffects.forEach(sprite => {
      if (sprite.active) {
        sprite.destroy();
      }
    });
    this.activeSlashEffects = [];
  }
}

