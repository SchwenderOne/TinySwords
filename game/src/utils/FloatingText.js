/**
 * Utility class for creating floating damage/heal numbers
 */
export default class FloatingText {
  /**
   * Create a floating text that appears above a character
   * @param {Phaser.Scene} scene - The scene to add the text to
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} text - The text to display
   * @param {string} color - Color of the text (hex)
   * @param {number} duration - How long the text floats (ms)
   */
  static create(scene, x, y, text, color = '#ffffff', duration = 1000) {
    const floatingText = scene.add.text(x, y - 40, text, {
      font: 'bold 24px Arial',
      fill: color,
      stroke: '#000000',
      strokeThickness: 4
    });
    
    floatingText.setOrigin(0.5);
    floatingText.setDepth(100); // Above everything
    
    // Animate upward and fade out
    scene.tweens.add({
      targets: floatingText,
      y: y - 100,
      alpha: 0,
      duration: duration,
      ease: 'Power2',
      onComplete: () => {
        floatingText.destroy();
      }
    });
    
    return floatingText;
  }
  
  /**
   * Create a damage number (red)
   */
  static createDamage(scene, x, y, amount) {
    return FloatingText.create(scene, x, y, `-${Math.round(amount)}`, '#ff3333', 800);
  }
  
  /**
   * Create a heal number (green)
   */
  static createHeal(scene, x, y, amount) {
    return FloatingText.create(scene, x, y, `+${Math.round(amount)}`, '#33ff33', 800);
  }
  
  /**
   * Create XP gain number (yellow)
   */
  static createXP(scene, x, y, amount) {
    return FloatingText.create(scene, x, y, `+${Math.round(amount)} XP`, '#ffff00', 1000);
  }
  
  /**
   * Create level up text (gold)
   */
  static createLevelUp(scene, x, y, level) {
    return FloatingText.create(scene, x, y, `LEVEL ${level}!`, '#ffd700', 1500);
  }
}

