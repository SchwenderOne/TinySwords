import Phaser from 'phaser';
import CollisionMap from '../utils/CollisionMap.js';
import Player from '../entities/Player.js';
import Monk from '../entities/Monk.js';
import Enemy from '../entities/Enemy.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.currentCharacter = 'warrior'; // 'warrior' or 'monk'
    this.menuOpen = false;
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
    
    // Spawn Red Warriors (2-3 patrolling the island)
    // Island bounds scaled: x: 1500-3150, y: 1470-2610
    this.spawnEnemy('warrior', 2880, 2040);  // Right side
    this.spawnEnemy('warrior', 1740, 2280);  // Left-bottom
    this.spawnEnemy('warrior', 2310, 1680);  // Top-center
    
    // Spawn Red Archers (1-2 stationary)
    this.spawnEnemy('archer', 2820, 1800);   // Right-top
    this.spawnEnemy('archer', 1800, 1920);   // Left-center
    
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

  spawnEnemy(type, x, y) {
    const enemy = new Enemy(this, x, y, type, this.collisionMap);
    this.enemies.add(enemy);
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
      
      // Update character indicator
      const charName = this.currentCharacter === 'warrior' ? 'Warrior' : 'Monk';
      this.characterText.setText(`Character: ${charName}`);
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

    // Check game over (both characters dead)
    if (!this.player.active && !this.monk.active) {
      this.gameOver();
    }

    // Check victory (all enemies defeated)
    const activeEnemies = this.enemies.getChildren().filter(e => e.active);
    if (activeEnemies.length === 0 && !this.victoryShown) {
      this.victory();
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

