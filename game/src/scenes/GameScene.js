import Phaser from 'phaser';
import CollisionMap from '../utils/CollisionMap.js';
import Player from '../entities/Player.js';
import Monk from '../entities/Monk.js';
import Enemy from '../entities/Enemy.js';
import HealthPotion from '../entities/HealthPotion.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.currentCharacter = 'warrior'; // 'warrior' or 'monk'
    this.menuOpen = false;
    
    // Wave system
    this.currentWave = 1;
    this.maxWaves = 10;
    this.waveInProgress = false;
    this.betweenWaves = false;
  }

  create() {
    // Add background map
    const map = this.add.image(0, 0, 'map');
    map.setOrigin(0, 0);
    map.setDepth(0);
    
    // Get map dimensions
    const mapWidth = map.width;
    const mapHeight = map.height;
    
    // Set world bounds to map size
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    
    // Create collision map from the level image
    this.collisionMap = new CollisionMap(this, 'map');
    this.collisionMap.generateFromImage();

    // Place buildings on the island
    this.createBuildings();
    
    // Place decorations on the island
    this.createDecorations();

    // Player spawn point (center of green island)
    // Map is 6496x6640, island is in upper-left area
    // Island center scaled to actual map size: approximately x: 2310, y: 2040
    this.spawnX = 2310;
    this.spawnY = 2040;
    
    // Create initial player (warrior)
    this.player = new Player(this, this.spawnX, this.spawnY, this.collisionMap);
    
    // Create monk (starts inactive)
    this.monk = new Monk(this, this.spawnX, this.spawnY, this.collisionMap);
    this.monk.setActive(false);
    this.monk.setVisible(false);
    this.monk.shadow.setVisible(false);
    
    // Create enemies group
    this.enemies = this.physics.add.group();
    
    // Create health potions group
    this.healthPotions = [];
    
    // Start first wave
    this.startWave();
    
    // Add collision between player and enemies
    this.physics.add.collider(this.player, this.enemies);
    this.physics.add.collider(this.monk, this.enemies);
    
    // Add ESC key for character menu
    this.input.keyboard.on('keydown-ESC', () => {
      this.toggleCharacterMenu();
    });
    
    // Setup camera
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    
    // Display controls text
    this.createUI();
  }

  createBuildings() {
    // Island bounds: approximately x: 1500-3150, y: 1470-2610
    // Store buildings array for depth sorting
    this.buildings = [];
    
    // Castle - Central landmark in the back of the island
    const castle = this.add.image(2310, 1720, 'building-castle');
    castle.setDepth(1);
    castle.setOrigin(0.5, 1); // Anchor at bottom center
    this.buildings.push(castle);
    
    // Tower 1 - Left side defense
    const tower1 = this.add.image(1850, 2150, 'building-tower');
    tower1.setDepth(1);
    tower1.setOrigin(0.5, 1);
    this.buildings.push(tower1);
    
    // Tower 2 - Right side defense
    const tower2 = this.add.image(2750, 2150, 'building-tower');
    tower2.setDepth(1);
    tower2.setOrigin(0.5, 1);
    this.buildings.push(tower2);
    
    // House 1 - Front-facing cottage, left area
    const house1 = this.add.image(1750, 2450, 'building-house1');
    house1.setDepth(1);
    house1.setOrigin(0.5, 1);
    this.buildings.push(house1);
    
    // House 2 - Angled cottage, right area
    const house2 = this.add.image(2850, 2450, 'building-house2');
    house2.setDepth(1);
    house2.setOrigin(0.5, 1);
    this.buildings.push(house2);
    
    // House 3 - Rear-facing house, center-left
    const house3 = this.add.image(2100, 1950, 'building-house3');
    house3.setDepth(1);
    house3.setOrigin(0.5, 1);
    this.buildings.push(house3);
    
    // House 4 - Front-facing cottage, center-right
    const house4 = this.add.image(2500, 2300, 'building-house1');
    house4.setDepth(1);
    house4.setOrigin(0.5, 1);
    this.buildings.push(house4);
  }

  createDecorations() {
    // Island bounds: approximately x: 1500-3150, y: 1470-2610
    // Store decorations for depth sorting
    this.decorations = [];
    
    // Trees - Around the perimeter and scattered
    // Left side trees
    const tree1 = this.add.sprite(1600, 1750, 'tree1', 0);
    tree1.setOrigin(0.5, 1);
    tree1.setDepth(1);
    this.decorations.push(tree1);
    
    const tree2 = this.add.sprite(1550, 2200, 'tree2', 1);
    tree2.setOrigin(0.5, 1);
    tree2.setDepth(1);
    this.decorations.push(tree2);
    
    const tree3 = this.add.sprite(1700, 2500, 'tree1', 2);
    tree3.setOrigin(0.5, 1);
    tree3.setDepth(1);
    this.decorations.push(tree3);
    
    // Right side trees
    const tree4 = this.add.sprite(3000, 1750, 'tree2', 3);
    tree4.setOrigin(0.5, 1);
    tree4.setDepth(1);
    this.decorations.push(tree4);
    
    const tree5 = this.add.sprite(3050, 2200, 'tree1', 4);
    tree5.setOrigin(0.5, 1);
    tree5.setDepth(1);
    this.decorations.push(tree5);
    
    const tree6 = this.add.sprite(2900, 2500, 'tree2', 5);
    tree6.setOrigin(0.5, 1);
    tree6.setDepth(1);
    this.decorations.push(tree6);
    
    // Smaller trees (tree3/tree4) scattered
    const tree7 = this.add.sprite(2000, 1600, 'tree3', 0);
    tree7.setOrigin(0.5, 1);
    tree7.setDepth(1);
    this.decorations.push(tree7);
    
    const tree8 = this.add.sprite(2600, 1600, 'tree4', 1);
    tree8.setOrigin(0.5, 1);
    tree8.setDepth(1);
    this.decorations.push(tree8);
    
    // Bushes - Ground level decorations scattered around
    const bush1 = this.add.sprite(1900, 2100, 'bush1', 0);
    bush1.setOrigin(0.5, 1);
    bush1.setDepth(1);
    this.decorations.push(bush1);
    
    const bush2 = this.add.sprite(2200, 2350, 'bush2', 1);
    bush2.setOrigin(0.5, 1);
    bush2.setDepth(1);
    this.decorations.push(bush2);
    
    const bush3 = this.add.sprite(2700, 2100, 'bush3', 2);
    bush3.setOrigin(0.5, 1);
    bush3.setDepth(1);
    this.decorations.push(bush3);
    
    const bush4 = this.add.sprite(2350, 1850, 'bush1', 3);
    bush4.setOrigin(0.5, 1);
    bush4.setDepth(1);
    this.decorations.push(bush4);
    
    const bush5 = this.add.sprite(1850, 2350, 'bush2', 4);
    bush5.setOrigin(0.5, 1);
    bush5.setDepth(1);
    this.decorations.push(bush5);
    
    const bush6 = this.add.sprite(2750, 2350, 'bush3', 5);
    bush6.setOrigin(0.5, 1);
    bush6.setDepth(1);
    this.decorations.push(bush6);
    
    // Rocks - Small detail elements
    const rock1 = this.add.image(1700, 1950, 'rock1');
    rock1.setOrigin(0.5, 1);
    rock1.setDepth(0);
    
    const rock2 = this.add.image(2450, 2150, 'rock2');
    rock2.setOrigin(0.5, 1);
    rock2.setDepth(0);
    
    const rock3 = this.add.image(1950, 2250, 'rock3');
    rock3.setOrigin(0.5, 1);
    rock3.setDepth(0);
    
    const rock4 = this.add.image(2650, 1950, 'rock4');
    rock4.setOrigin(0.5, 1);
    rock4.setDepth(0);
    
    const rock5 = this.add.image(1600, 2450, 'rock1');
    rock5.setOrigin(0.5, 1);
    rock5.setDepth(0);
    
    const rock6 = this.add.image(2950, 2300, 'rock2');
    rock6.setOrigin(0.5, 1);
    rock6.setDepth(0);
  }

  spawnEnemy(type, x, y) {
    const enemy = new Enemy(this, x, y, type, this.collisionMap);
    this.enemies.add(enemy);
  }

  spawnHealthPotion(x, y) {
    const potion = new HealthPotion(this, x, y);
    this.healthPotions.push(potion);
  }

  createUI() {
    // Controls text
    const controlsText = this.add.text(10, 10, 
      'Controls:\nWASD - Move\nSPACE - Attack/Heal\nSHIFT - Guard\nESC - Switch Character', 
      {
        font: '14px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { x: 10, y: 10 }
      }
    );
    controlsText.setScrollFactor(0);
    controlsText.setDepth(100);
    
    // Player health text
    this.healthText = this.add.text(10, 140, '', {
      font: '16px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 }
    });
    this.healthText.setScrollFactor(0);
    this.healthText.setDepth(100);
    
    // Character indicator
    this.characterText = this.add.text(10, 170, '', {
      font: '16px Arial',
      fill: '#ffff00',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 }
    });
    this.characterText.setScrollFactor(0);
    this.characterText.setDepth(100);
    
    // Character Health Bar (top left)
    const healthBarWidth = 300;
    const healthBarHeight = 30;
    
    this.charHealthBarBg = this.add.rectangle(20, 10, healthBarWidth, healthBarHeight, 0x000000);
    this.charHealthBarBg.setOrigin(0, 0);
    this.charHealthBarBg.setScrollFactor(0);
    this.charHealthBarBg.setDepth(100);
    
    this.charHealthBarFill = this.add.rectangle(20, 10, healthBarWidth, healthBarHeight, 0x00ff00);
    this.charHealthBarFill.setOrigin(0, 0);
    this.charHealthBarFill.setScrollFactor(0);
    this.charHealthBarFill.setDepth(101);
    
    this.charHealthText = this.add.text(170, 25, '', {
      font: 'bold 18px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.charHealthText.setOrigin(0.5);
    this.charHealthText.setScrollFactor(0);
    this.charHealthText.setDepth(102);
    
    // Wave counter (top center)
    const width = this.cameras.main.width;
    this.waveText = this.add.text(width / 2, 20, '', {
      font: 'bold 24px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 20, y: 10 }
    });
    this.waveText.setOrigin(0.5, 0);
    this.waveText.setScrollFactor(0);
    this.waveText.setDepth(100);
    
    // XP Bar (bottom of screen)
    this.xpBarBg = this.add.rectangle(10, this.cameras.main.height - 50, 300, 30, 0x000000);
    this.xpBarBg.setOrigin(0, 0);
    this.xpBarBg.setScrollFactor(0);
    this.xpBarBg.setDepth(100);
    
    this.xpBar = this.add.rectangle(10, this.cameras.main.height - 50, 300, 30, 0xffff00);
    this.xpBar.setOrigin(0, 0);
    this.xpBar.setScrollFactor(0);
    this.xpBar.setDepth(101);
    
    this.xpText = this.add.text(160, this.cameras.main.height - 35, '', {
      font: 'bold 16px Arial',
      fill: '#000000'
    });
    this.xpText.setOrigin(0.5);
    this.xpText.setScrollFactor(0);
    this.xpText.setDepth(102);
    
    // Level text (left of XP bar)
    this.levelText = this.add.text(10, this.cameras.main.height - 80, '', {
      font: 'bold 18px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 }
    });
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(100);
  }

  startWave() {
    this.waveInProgress = true;
    this.betweenWaves = false;
    
    // Calculate enemy count and difficulty based on wave
    const warriorCount = Math.min(2 + Math.floor(this.currentWave / 2), 6);
    const archerCount = Math.min(1 + Math.floor(this.currentWave / 3), 4);
    
    // Spawn positions around the island
    const spawnPositions = [
      { x: 2880, y: 2040 },  // Right side
      { x: 1740, y: 2280 },  // Left-bottom
      { x: 2310, y: 1680 },  // Top-center
      { x: 2820, y: 1800 },  // Right-top
      { x: 1800, y: 1920 },  // Left-center
      { x: 2600, y: 2400 },  // Right-bottom
      { x: 1600, y: 1700 },  // Left-top
      { x: 2500, y: 1800 },  // Center-top
    ];
    
    // Spawn warriors
    for (let i = 0; i < warriorCount; i++) {
      const pos = spawnPositions[i % spawnPositions.length];
      this.spawnEnemy('warrior', pos.x, pos.y);
    }
    
    // Spawn archers
    for (let i = 0; i < archerCount; i++) {
      const pos = spawnPositions[(warriorCount + i) % spawnPositions.length];
      this.spawnEnemy('archer', pos.x, pos.y);
    }
    
    // Show wave start message
    this.showWaveMessage(`Wave ${this.currentWave} - Fight!`);
  }

  showWaveMessage(message) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const waveMessage = this.add.text(width / 2, height / 2, message, {
      font: 'bold 48px Arial',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 6
    });
    waveMessage.setOrigin(0.5);
    waveMessage.setScrollFactor(0);
    waveMessage.setDepth(200);
    
    // Fade out after 2 seconds
    this.tweens.add({
      targets: waveMessage,
      alpha: 0,
      duration: 1000,
      delay: 1000,
      onComplete: () => {
        waveMessage.destroy();
      }
    });
  }

  nextWave() {
    this.currentWave++;
    
    if (this.currentWave > this.maxWaves) {
      this.victory();
    } else {
      this.betweenWaves = true;
      this.showWaveMessage(`Wave ${this.currentWave} incoming in 5 seconds...`);
      
      // 5 second rest period
      this.time.delayedCall(5000, () => {
        if (!this.gameOverShown && !this.victoryShown) {
          this.startWave();
        }
      });
    }
  }

  toggleCharacterMenu() {
    if (this.menuOpen) {
      this.closeCharacterMenu();
    } else {
      this.openCharacterMenu();
    }
  }

  openCharacterMenu() {
    this.menuOpen = true;
    // Don't pause the scene - just stop character updates
    this.physics.pause();
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Semi-transparent background
    this.menuBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    this.menuBg.setScrollFactor(0);
    this.menuBg.setDepth(250);
    
    // Menu title
    this.menuTitle = this.add.text(width / 2, height / 2 - 100, 'SELECT CHARACTER', {
      font: '32px Arial',
      fill: '#ffffff'
    });
    this.menuTitle.setOrigin(0.5);
    this.menuTitle.setScrollFactor(0);
    this.menuTitle.setDepth(251);
    
    // Warrior button
    this.warriorBtn = this.add.text(width / 2, height / 2 - 20, '⚔️ WARRIOR', {
      font: '24px Arial',
      fill: this.currentCharacter === 'warrior' ? '#00ff00' : '#ffffff',
      backgroundColor: this.currentCharacter === 'warrior' ? '#004400' : '#444444',
      padding: { x: 20, y: 10 }
    });
    this.warriorBtn.setOrigin(0.5);
    this.warriorBtn.setScrollFactor(0);
    this.warriorBtn.setDepth(251);
    this.warriorBtn.setInteractive({ useHandCursor: true });
    this.warriorBtn.on('pointerdown', () => this.switchCharacter('warrior'));
    
    // Monk button
    this.monkBtn = this.add.text(width / 2, height / 2 + 40, '✨ MONK (HEALER)', {
      font: '24px Arial',
      fill: this.currentCharacter === 'monk' ? '#00ff00' : '#ffffff',
      backgroundColor: this.currentCharacter === 'monk' ? '#004400' : '#444444',
      padding: { x: 20, y: 10 }
    });
    this.monkBtn.setOrigin(0.5);
    this.monkBtn.setScrollFactor(0);
    this.monkBtn.setDepth(251);
    this.monkBtn.setInteractive({ useHandCursor: true });
    this.monkBtn.on('pointerdown', () => this.switchCharacter('monk'));
    
    // Close instruction
    this.closeText = this.add.text(width / 2, height / 2 + 100, 'Press ESC to close', {
      font: '16px Arial',
      fill: '#aaaaaa'
    });
    this.closeText.setOrigin(0.5);
    this.closeText.setScrollFactor(0);
    this.closeText.setDepth(251);
  }

  closeCharacterMenu() {
    this.menuOpen = false;
    // Resume physics
    this.physics.resume();
    
    if (this.menuBg) this.menuBg.destroy();
    if (this.menuTitle) this.menuTitle.destroy();
    if (this.warriorBtn) this.warriorBtn.destroy();
    if (this.monkBtn) this.monkBtn.destroy();
    if (this.closeText) this.closeText.destroy();
  }

  switchCharacter(type) {
    if (type === this.currentCharacter) {
      this.closeCharacterMenu();
      return;
    }
    
    // Get current active character
    const currentChar = this.currentCharacter === 'warrior' ? this.player : this.monk;
    const newChar = type === 'warrior' ? this.player : this.monk;
    
    // Transfer position
    newChar.x = currentChar.x;
    newChar.y = currentChar.y;
    newChar.shadow.setPosition(newChar.x, newChar.y + 60);
    
    // Ensure new character has health and physics enabled
    if (newChar.health <= 0) {
      newChar.health = newChar.maxHealth; // Restore health if dead
    }
    newChar.body.enable = true; // Ensure physics is enabled
    
    // Deactivate current character
    currentChar.setActive(false);
    currentChar.setVisible(false);
    currentChar.shadow.setVisible(false);
    
    // Activate new character
    newChar.setActive(true);
    newChar.setVisible(true);
    newChar.shadow.setVisible(true);
    
    // Update camera to follow new character
    this.cameras.main.stopFollow();
    this.cameras.main.startFollow(newChar, true, 0.1, 0.1);
    
    this.currentCharacter = type;
    this.closeCharacterMenu();
  }

  update(time, delta) {
    // Update active character
    const activeChar = this.currentCharacter === 'warrior' ? this.player : this.monk;
    
    if (activeChar && activeChar.active) {
      activeChar.update(time, delta);
      
      // Update health display
      this.healthText.setText(`HP: ${Math.max(0, activeChar.health)}/${activeChar.maxHealth}`);
      
      // Update character health bar
      const healthPercent = Math.max(0, Math.min(1, activeChar.health / activeChar.maxHealth));
      this.charHealthBarFill.width = 300 * healthPercent;
      
      // Change health bar color based on health percentage
      if (healthPercent > 0.6) {
        this.charHealthBarFill.setFillStyle(0x00ff00); // Green
      } else if (healthPercent > 0.3) {
        this.charHealthBarFill.setFillStyle(0xffff00); // Yellow
      } else {
        this.charHealthBarFill.setFillStyle(0xff0000); // Red
      }
      
      this.charHealthText.setText(`${Math.max(0, Math.round(activeChar.health))}/${activeChar.maxHealth} HP`);
      
      // Update character indicator
      const charName = this.currentCharacter === 'warrior' ? 'Warrior' : 'Monk';
      this.characterText.setText(`Character: ${charName}`);
      
      // Update wave counter
      this.waveText.setText(`Wave ${this.currentWave}/${this.maxWaves}`);
      
      // Update XP bar
      const xpPercent = activeChar.xp / activeChar.xpToNextLevel;
      this.xpBar.setScale(xpPercent, 1);
      this.xpText.setText(`${Math.round(activeChar.xp)}/${activeChar.xpToNextLevel} XP`);
      
      // Cap level display at 10
      const levelDisplay = activeChar.level >= 10 ? '10 (MAX)' : activeChar.level;
      this.levelText.setText(`Level ${levelDisplay}`);
    }
    
    // Update enemies (they target active character)
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.active) {
        enemy.update(time, delta, activeChar);
      }
    });

    // Update building depth sorting based on Y position
    this.buildings.forEach(building => {
      // Buildings in front of characters if character Y < building Y
      if (activeChar.y < building.y) {
        building.setDepth(3); // In front
      } else {
        building.setDepth(1); // Behind
      }
    });
    
    // Update decoration depth sorting based on Y position
    this.decorations.forEach(decoration => {
      // Decorations in front of characters if character Y < decoration Y
      if (activeChar.y < decoration.y) {
        decoration.setDepth(3); // In front
      } else {
        decoration.setDepth(1); // Behind
      }
    });
    
    // Update health potions
    this.healthPotions = this.healthPotions.filter(potion => {
      if (potion.active) {
        potion.update(activeChar);
        return true;
      }
      return false;
    });

    // Check game over (both characters dead)
    if (!this.player.active && !this.monk.active) {
      this.gameOver();
    }

    // Check wave completion (all enemies defeated)
    const activeEnemies = this.enemies.getChildren().filter(e => e.active);
    if (activeEnemies.length === 0 && this.waveInProgress && !this.betweenWaves && !this.victoryShown && !this.gameOverShown) {
      this.waveInProgress = false;
      this.nextWave();
    }
  }

  gameOver() {
    if (this.gameOverShown) return;
    this.gameOverShown = true;
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const gameOverText = this.add.text(width / 2, height / 2, 'GAME OVER', {
      font: '48px Arial',
      fill: '#ff0000',
      backgroundColor: '#000000'
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setScrollFactor(0);
    gameOverText.setDepth(200);
    
    const restartText = this.add.text(width / 2, height / 2 + 60, 'Press R to Restart', {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000'
    });
    restartText.setOrigin(0.5);
    restartText.setScrollFactor(0);
    restartText.setDepth(200);
    
    // Add restart key
    this.input.keyboard.once('keydown-R', () => {
      this.scene.restart();
      this.gameOverShown = false;
      this.victoryShown = false;
    });
  }

  victory() {
    if (this.victoryShown) return;
    this.victoryShown = true;
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const victoryText = this.add.text(width / 2, height / 2, 'VICTORY!', {
      font: '48px Arial',
      fill: '#00ff00',
      backgroundColor: '#000000'
    });
    victoryText.setOrigin(0.5);
    victoryText.setScrollFactor(0);
    victoryText.setDepth(200);
    
    const restartText = this.add.text(width / 2, height / 2 + 60, 'Press R to Restart', {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000'
    });
    restartText.setOrigin(0.5);
    restartText.setScrollFactor(0);
    restartText.setDepth(200);
    
    // Add restart key
    this.input.keyboard.once('keydown-R', () => {
      this.scene.restart();
      this.gameOverShown = false;
      this.victoryShown = false;
    });
  }
}

