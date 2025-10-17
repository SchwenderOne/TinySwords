import Phaser from 'phaser';
import CollisionMap from '../utils/CollisionMap.js';
import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import HealthPotion from '../entities/HealthPotion.js';
import AllyWarrior from '../entities/AllyWarrior.js';
import AllyMonk from '../entities/AllyMonk.js';
import InteractiveBuilding from '../entities/InteractiveBuilding.js';
import { UIBars } from '../utils/UIBars.js';
import { GameBalance } from '../config/GameBalance.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    
    // Wave system
    this.currentWave = 1;
    this.maxWaves = 5; // Changed from 10 to 5 for survivors-like gameplay
    this.waveInProgress = false;
    this.betweenWaves = false;
    
    // Interactive buildings
    this.interactiveBuildings = [];
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

    // Create physics groups for environment collisions
    this.buildingsGroup = this.physics.add.staticGroup();
    this.treesGroup = this.physics.add.staticGroup();

    // Place buildings on the island
    this.createBuildings();
    
    // Place decorations on the island
    this.createDecorations();

    // Player spawn point (center of green island)
    // Map is 6496x6640, island is in upper-left area
    // Island center scaled to actual map size: approximately x: 2310, y: 2040
    this.spawnX = 2310;
    this.spawnY = 2040;
    
    // Create player (warrior only)
    this.player = new Player(this, this.spawnX, this.spawnY, this.collisionMap);
    
    // Make buildings interactive (now that player exists)
    this.makeBuildingsInteractive();
    
    // Create enemies group
    this.enemies = this.physics.add.group();
    
    // Create allies group
    this.allies = this.physics.add.group();
    
    // Create health potions group
    this.healthPotions = [];
    
    // Start first wave
    this.startWave();
    
    // Add collision between player and enemies
    this.physics.add.collider(this.player, this.enemies);

    // Add collision between player and environment
    this.physics.add.collider(this.player, this.buildingsGroup);
    this.physics.add.collider(this.player, this.treesGroup);
    this.physics.add.collider(this.enemies, this.buildingsGroup);
    this.physics.add.collider(this.enemies, this.treesGroup);
    
    // Add collision for allies
    this.physics.add.collider(this.allies, this.enemies);
    this.physics.add.collider(this.allies, this.buildingsGroup);
    this.physics.add.collider(this.allies, this.treesGroup);
    this.physics.add.collider(this.allies, this.allies); // Allies collide with each other
    
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
    // Asset: 320×256px sprite
    // Collision Analysis: Bottom 62.5% (160px) is solid walls/structure
    const castle = this.physics.add.staticImage(2310, 1720, 'building-castle');
    castle.setOrigin(0.5, 1); // Anchor at bottom center
    castle.setDepth(1);
    castle.body.setSize(200, 160); // Width: 200px, Height: 160px (bottom 62.5%)
    castle.body.setOffset(60, -64); // offsetX=(320-200)/2=60, offsetY=96-160=-64 (flipped)
    this.buildingsGroup.add(castle);
    this.buildings.push(castle);

    // Tower 1 - Left side defense
    // Asset: 128×256px sprite
    // Collision Analysis: Bottom 78% (200px) is solid cylindrical tower body
    const tower1 = this.physics.add.staticImage(1850, 2150, 'building-tower');
    tower1.setOrigin(0.5, 1);
    tower1.setDepth(1);
    tower1.body.setSize(75, 200); // Width: 75px, Height: 200px (bottom 78%)
    tower1.body.setOffset(27, -144); // offsetX=(128-75)/2=27, offsetY=56-200=-144 (flipped)
    this.buildingsGroup.add(tower1);
    this.buildings.push(tower1);

    // Tower 2 - Right side defense
    // Asset: 128×256px sprite
    // Collision Analysis: Bottom 78% (200px) is solid cylindrical tower body
    const tower2 = this.physics.add.staticImage(2750, 2150, 'building-tower');
    tower2.setOrigin(0.5, 1);
    tower2.setDepth(1);
    tower2.body.setSize(75, 200); // Width: 75px, Height: 200px (bottom 78%)
    tower2.body.setOffset(27, -144); // offsetX=(128-75)/2=27, offsetY=56-200=-144 (flipped)
    this.buildingsGroup.add(tower2);
    this.buildings.push(tower2);

    // House 1 - Front-facing cottage, left area
    // Asset: 128×192px sprite
    // Collision Analysis: Bottom 68% (130px) is solid walls/doors
    const house1 = this.physics.add.staticImage(1750, 2450, 'building-house1');
    house1.setOrigin(0.5, 1);
    house1.setDepth(1);
    house1.body.setSize(85, 130); // Width: 85px, Height: 130px (bottom 68%)
    house1.body.setOffset(22, -68); // offsetX=(128-85)/2=22, offsetY=62-130=-68 (flipped)
    this.buildingsGroup.add(house1);
    this.buildings.push(house1);

    // House 2 - Angled cottage, right area
    // Asset: 128×192px sprite
    // Collision Analysis: Bottom 68% (130px) is solid walls/doors
    const house2 = this.physics.add.staticImage(2850, 2450, 'building-house2');
    house2.setOrigin(0.5, 1);
    house2.setDepth(1);
    house2.body.setSize(85, 130); // Width: 85px, Height: 130px (bottom 68%)
    house2.body.setOffset(22, -68); // offsetX=(128-85)/2=22, offsetY=62-130=-68 (flipped)
    this.buildingsGroup.add(house2);
    this.buildings.push(house2);

    // House 3 - Rear-facing house, center-left
    // Asset: 128×192px sprite
    // Collision Analysis: Bottom 68% (130px) is solid walls/doors
    const house3 = this.physics.add.staticImage(2100, 1950, 'building-house3');
    house3.setOrigin(0.5, 1);
    house3.setDepth(1);
    house3.body.setSize(85, 130); // Width: 85px, Height: 130px (bottom 68%)
    house3.body.setOffset(22, -68); // offsetX=(128-85)/2=22, offsetY=62-130=-68 (flipped)
    this.buildingsGroup.add(house3);
    this.buildings.push(house3);

    // House 4 - Front-facing cottage, center-right
    // Asset: 128×192px sprite
    // Collision Analysis: Bottom 68% (130px) is solid walls/doors
    const house4 = this.physics.add.staticImage(2500, 2300, 'building-house1');
    house4.setOrigin(0.5, 1);
    house4.setDepth(1);
    house4.body.setSize(85, 130); // Width: 85px, Height: 130px (bottom 68%)
    house4.body.setOffset(22, -68); // offsetX=(128-85)/2=22, offsetY=62-130=-68 (flipped)
    this.buildingsGroup.add(house4);
    this.buildings.push(house4);
    
    // Make buildings interactive (must be done after player is created)
    // This is called from create() after player exists
  }
  
  makeBuildingsInteractive() {
    // Towers spawn monks
    const tower1 = this.buildings.find(b => b.x === 1850 && b.y === 2150);
    const tower2 = this.buildings.find(b => b.x === 2750 && b.y === 2150);
    
    if (tower1) {
      this.interactiveBuildings.push(new InteractiveBuilding(this, tower1, 'tower', this.player));
    }
    if (tower2) {
      this.interactiveBuildings.push(new InteractiveBuilding(this, tower2, 'tower', this.player));
    }
    
    // Houses spawn warriors
    const house1 = this.buildings.find(b => b.x === 1750 && b.y === 2450);
    const house2 = this.buildings.find(b => b.x === 2850 && b.y === 2450);
    const house3 = this.buildings.find(b => b.x === 2100 && b.y === 1950);
    const house4 = this.buildings.find(b => b.x === 2500 && b.y === 2300);
    
    if (house1) {
      this.interactiveBuildings.push(new InteractiveBuilding(this, house1, 'house', this.player));
    }
    if (house2) {
      this.interactiveBuildings.push(new InteractiveBuilding(this, house2, 'house', this.player));
    }
    if (house3) {
      this.interactiveBuildings.push(new InteractiveBuilding(this, house3, 'house', this.player));
    }
    if (house4) {
      this.interactiveBuildings.push(new InteractiveBuilding(this, house4, 'house', this.player));
    }
  }

  createDecorations() {
    // Island bounds: approximately x: 1500-3150, y: 1470-2610
    // Store decorations for depth sorting
    this.decorations = [];

    // Trees - Around the perimeter and scattered (WITH COLLISION)
    // Large trees - Tree1/Tree2 are 192×256px sprites
    // Collision Analysis: Bottom 35% (90px) is trunk
    const tree1 = this.physics.add.staticSprite(1600, 1750, 'tree1', 0);
    tree1.setOrigin(0.5, 1);
    tree1.setDepth(1);
    tree1.body.setSize(50, 90); // Width: 50px, Height: 90px (trunk only)
    tree1.body.setOffset(71, 76); // offsetX=(192-50)/2=71, offsetY=166-90=76 (flipped)
    this.treesGroup.add(tree1);
    this.decorations.push(tree1);

    const tree2 = this.physics.add.staticSprite(1550, 2200, 'tree2', 1);
    tree2.setOrigin(0.5, 1);
    tree2.setDepth(1);
    tree2.body.setSize(50, 90); // Width: 50px, Height: 90px (trunk only)
    tree2.body.setOffset(71, 76); // offsetX=(192-50)/2=71, offsetY=166-90=76 (flipped)
    this.treesGroup.add(tree2);
    this.decorations.push(tree2);

    const tree3 = this.physics.add.staticSprite(1700, 2500, 'tree1', 2);
    tree3.setOrigin(0.5, 1);
    tree3.setDepth(1);
    tree3.body.setSize(50, 90); // Width: 50px, Height: 90px (trunk only)
    tree3.body.setOffset(71, 76); // offsetX=(192-50)/2=71, offsetY=166-90=76 (flipped)
    this.treesGroup.add(tree3);
    this.decorations.push(tree3);

    // Right side trees
    const tree4 = this.physics.add.staticSprite(3000, 1750, 'tree2', 3);
    tree4.setOrigin(0.5, 1);
    tree4.setDepth(1);
    tree4.body.setSize(50, 90); // Width: 50px, Height: 90px (trunk only)
    tree4.body.setOffset(71, 76); // offsetX=(192-50)/2=71, offsetY=166-90=76 (flipped)
    this.treesGroup.add(tree4);
    this.decorations.push(tree4);

    const tree5 = this.physics.add.staticSprite(3050, 2200, 'tree1', 4);
    tree5.setOrigin(0.5, 1);
    tree5.setDepth(1);
    tree5.body.setSize(50, 90); // Width: 50px, Height: 90px (trunk only)
    tree5.body.setOffset(71, 76); // offsetX=(192-50)/2=71, offsetY=166-90=76 (flipped)
    this.treesGroup.add(tree5);
    this.decorations.push(tree5);

    const tree6 = this.physics.add.staticSprite(2900, 2500, 'tree2', 5);
    tree6.setOrigin(0.5, 1);
    tree6.setDepth(1);
    tree6.body.setSize(50, 90); // Width: 50px, Height: 90px (trunk only)
    tree6.body.setOffset(71, 76); // offsetX=(192-50)/2=71, offsetY=166-90=76 (flipped)
    this.treesGroup.add(tree6);
    this.decorations.push(tree6);

    // Smaller trees - Tree3/Tree4 are 192×192px sprites
    // Collision Analysis: Bottom 36% (70px) is trunk
    const tree7 = this.physics.add.staticSprite(2000, 1600, 'tree3', 0);
    tree7.setOrigin(0.5, 1);
    tree7.setDepth(1);
    tree7.body.setSize(40, 70); // Width: 40px, Height: 70px (trunk only)
    tree7.body.setOffset(76, 52); // offsetX=(192-40)/2=76, offsetY=122-70=52 (flipped)
    this.treesGroup.add(tree7);
    this.decorations.push(tree7);

    const tree8 = this.physics.add.staticSprite(2600, 1600, 'tree4', 1);
    tree8.setOrigin(0.5, 1);
    tree8.setDepth(1);
    tree8.body.setSize(40, 70); // Width: 40px, Height: 70px (trunk only)
    tree8.body.setOffset(76, 52); // offsetX=(192-40)/2=76, offsetY=122-70=52 (flipped)
    this.treesGroup.add(tree8);
    this.decorations.push(tree8);

    // Bushes - Ground level decorations scattered around (NO COLLISION - walkable)
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

    // Rocks - Small detail elements (NO COLLISION - walkable)
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
  
  spawnAlly(type, x = null, y = null) {
    // If no coordinates provided, spawn near player
    if (x === null || y === null) {
      const offsetX = Phaser.Math.Between(-100, 100);
      const offsetY = Phaser.Math.Between(-100, 100);
      x = this.player.x + offsetX;
      y = this.player.y + offsetY;
    }
    
    let ally;
    if (type === 'warrior') {
      ally = new AllyWarrior(this, x, y, this.player);
    } else if (type === 'monk') {
      ally = new AllyMonk(this, x, y, this.player);
    }
    
    if (ally) {
      this.allies.add(ally);
    }
  }
  
  handleBuildingInteraction() {
    // Try to interact with each building
    for (const building of this.interactiveBuildings) {
      if (building.interact()) {
        // Successfully interacted, break
        break;
      }
    }
  }

  createUI() {
    // Controls text
    const controlsText = this.add.text(10, 10, 
      'Controls:\nWASD - Move\nSPACE - Attack\nSHIFT - Guard\nE - Interact with Buildings', 
      {
        font: '14px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { x: 10, y: 10 }
      }
    );
    controlsText.setScrollFactor(0);
    controlsText.setDepth(100);
    
    // Add E key interaction handler
    this.input.keyboard.on('keydown-E', () => {
      this.handleBuildingInteraction();
    });
    
    // Player health text
    this.healthText = this.add.text(10, 140, '', {
      font: '16px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 }
    });
    this.healthText.setScrollFactor(0);
    this.healthText.setDepth(100);
    
    // Initialize DOM-based UI bars
    this.uiBars = new UIBars();
    this.uiBars.show();
    
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
    
  }

  startWave() {
    this.waveInProgress = true;
    this.betweenWaves = false;
    
    // Calculate enemy count and difficulty based on wave
    const warriorCount = Math.min(2 + Math.floor(this.currentWave / 2), 6);
    const archerCount = Math.min(1 + Math.floor(this.currentWave / 3), 4);
    
    // Get castle gate position from config
    const gatePos = GameBalance.waves.castleGatePosition;
    const spawnRadius = GameBalance.waves.spawnRadius;
    
    // Spawn warriors in a circle around castle gate
    for (let i = 0; i < warriorCount; i++) {
      const angle = (Math.PI * 2 / warriorCount) * i;
      const x = gatePos.x + Math.cos(angle) * spawnRadius;
      const y = gatePos.y + Math.sin(angle) * spawnRadius;
      this.spawnEnemy('warrior', x, y);
    }
    
    // Spawn archers in outer ring (slightly further back)
    for (let i = 0; i < archerCount; i++) {
      const angle = (Math.PI * 2 / archerCount) * i + Math.PI / 4; // Offset by 45 degrees
      const x = gatePos.x + Math.cos(angle) * (spawnRadius + 50);
      const y = gatePos.y + Math.sin(angle) * (spawnRadius + 50);
      this.spawnEnemy('archer', x, y);
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

  // Character menu methods removed - single hero gameplay only

  update(time, delta) {
    // Update player
    if (this.player && this.player.active) {
      this.player.update(time, delta);
      
      // Update health display
      this.healthText.setText(`HP: ${Math.max(0, this.player.health)}/${this.player.maxHealth}`);
      
      // Update DOM-based health and XP bars
      this.uiBars.updateHealth(this.player.health, this.player.maxHealth);
      this.uiBars.updateXP(this.player.xp, this.player.xpToNextLevel, this.player.level);
      
      // Update wave counter
      this.waveText.setText(`Wave ${this.currentWave}/${this.maxWaves}`);
    }
    
    // Update enemies (they target player)
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.active) {
        enemy.update(time, delta, this.player);
      }
    });
    
    // Update allies (they follow player and assist in combat)
    this.allies.getChildren().forEach(ally => {
      if (ally.active) {
        ally.update(time, delta);
      }
    });
    
    // Update interactive buildings (proximity checks, cooldowns)
    this.interactiveBuildings.forEach(building => {
      building.update(time, delta);
    });

    // Dynamic depth sorting for all characters and environment
    // Characters get +1 depth boost to always render in front of buildings at same Y position

    // Set player depth based on Y position
    if (this.player && this.player.active) {
      this.player.setDepth(this.player.y + 1);
      if (this.player.shadow) this.player.shadow.setDepth(0);
    }

    // Set enemy depths based on Y position (also with +1 boost)
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.active) {
        enemy.setDepth(enemy.y + 1);
        if (enemy.shadow) enemy.shadow.setDepth(0);
        if (enemy.healthBarBg) enemy.healthBarBg.setDepth(enemy.y + 2);
        if (enemy.healthBarFill) enemy.healthBarFill.setDepth(enemy.y + 3);
      }
    });
    
    // Set ally depths based on Y position (same as enemies)
    this.allies.getChildren().forEach(ally => {
      if (ally.active) {
        ally.setDepth(ally.y + 1);
        if (ally.shadow) ally.shadow.setDepth(0);
      }
    });

    // Set building depths based on Y position minus height
    // This makes tall buildings render "earlier" so characters can appear in front
    this.buildings.forEach(building => {
      const buildingDepth = building.y - building.displayHeight;
      building.setDepth(buildingDepth);
    });

    // Set decoration depths based on Y position minus height
    // Trees are tall, so they need the same treatment as buildings
    this.decorations.forEach(decoration => {
      const decorationDepth = decoration.y - decoration.displayHeight;
      decoration.setDepth(decorationDepth);
    });
    
    // Update health potions
    this.healthPotions = this.healthPotions.filter(potion => {
      if (potion.active) {
        potion.update(this.player);
        return true;
      }
      return false;
    });

    // Check game over (player died)
    if (!this.player.active) {
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

