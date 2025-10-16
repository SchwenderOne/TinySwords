import Phaser from 'phaser';

export default class HealthPotion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'shadow'); // Using shadow as temp sprite
    
    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.healAmount = 30;
    this.setTint(0x00ff00); // Green tint for health
    this.setScale(0.5);
    
    // Physics
    this.body.setAllowGravity(false);
    
    // Floating animation
    scene.tweens.add({
      targets: this,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Rotating animation
    scene.tweens.add({
      targets: this,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: 'Linear'
    });
    
    // Pickup radius
    this.pickupRadius = 50;
  }
  
  update(player) {
    if (!player || !player.active) return;
    
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    
    if (distance < this.pickupRadius) {
      this.pickup(player);
    }
  }
  
  pickup(player) {
    // Heal player
    const healAmount = Math.min(this.healAmount, player.maxHealth - player.health);
    if (healAmount > 0) {
      player.heal(healAmount);
    }
    
    // Particle effect
    this.scene.add.particles(this.x, this.y, 'shadow', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.3, end: 0 },
      blendMode: 'ADD',
      lifespan: 300,
      quantity: 10,
      tint: 0x00ff00
    });
    
    // Remove from scene
    this.destroy();
  }
}

