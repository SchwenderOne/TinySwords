/**
 * UIBars - Manages DOM-based health and XP bars
 * Uses HTML/CSS overlay for guaranteed visibility
 */
export class UIBars {
  constructor() {
    this.healthBar = document.getElementById('health-bar');
    this.healthText = document.getElementById('health-text');
    this.xpBar = document.getElementById('xp-bar');
    this.xpText = document.getElementById('xp-text');
  }

  /**
   * Update health bar
   * @param {number} currentHealth - Current health value
   * @param {number} maxHealth - Maximum health value
   */
  updateHealth(currentHealth, maxHealth) {
    const percent = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
    this.healthBar.style.width = `${percent}%`;
    this.healthText.textContent = `${Math.round(currentHealth)}/${maxHealth} HP`;
  }

  /**
   * Update XP bar
   * @param {number} currentXP - Current XP value
   * @param {number} xpToNext - XP needed for next level
   * @param {number} level - Current level
   */
  updateXP(currentXP, xpToNext, level) {
    const percent = Math.max(0, Math.min(100, (currentXP / xpToNext) * 100));
    this.xpBar.style.width = `${percent}%`;
    const levelDisplay = level >= 10 ? 'MAX' : level;
    this.xpText.textContent = `LVL ${levelDisplay}`;
  }

  /**
   * Show bars
   */
  show() {
    const overlay = document.getElementById('ui-overlay');
    if (overlay) overlay.style.display = 'block';
  }

  /**
   * Hide bars
   */
  hide() {
    const overlay = document.getElementById('ui-overlay');
    if (overlay) overlay.style.display = 'none';
  }
}

