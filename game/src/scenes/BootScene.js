import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '20px Arial',
      fill: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.add.text(width / 2, height / 2, '0%', {
      font: '18px Arial',
      fill: '#ffffff'
    });
    percentText.setOrigin(0.5, 0.5);
    
    // Update loading bar
    this.load.on('progress', (value) => {
      percentText.setText(Math.floor(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Load map
    this.load.image('map', '/assets/map-2.png');
    
    // Load shadow
    this.load.image('shadow', '/assets/Shadow.png');
    
    // Load Black Warrior sprites (Player)
    this.load.spritesheet('black-warrior-idle', '/assets/black-warrior/Warrior_Idle.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('black-warrior-run', '/assets/black-warrior/Warrior_Run.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('black-warrior-attack1', '/assets/black-warrior/Warrior_Attack1.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('black-warrior-attack2', '/assets/black-warrior/Warrior_Attack2.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('black-warrior-guard', '/assets/black-warrior/Warrior_Guard.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    // Load Black Monk sprites (Player)
    // Idle: 1152x192 = 6 frames of 192x192
    this.load.spritesheet('black-monk-idle', '/assets/black-monk/Idle.png', {
      frameWidth: 192,
      frameHeight: 192
    });

    // Run: 768x192 = 4 frames of 192x192
    this.load.spritesheet('black-monk-run', '/assets/black-monk/Run.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    // Heal: 2112x192 = 11 frames of 192x192
    this.load.spritesheet('black-monk-heal', '/assets/black-monk/Heal.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    // Heal Effect: 2112x192 = 11 frames of 192x192
    this.load.spritesheet('black-monk-heal-effect', '/assets/black-monk/Heal_Effect.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    // Load Red Warrior sprites (Enemy)
    this.load.spritesheet('red-warrior-idle', '/assets/red-warrior/Warrior_Idle.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('red-warrior-run', '/assets/red-warrior/Warrior_Run.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('red-warrior-attack1', '/assets/red-warrior/Warrior_Attack1.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    // Load Red Archer sprites (Enemy)
    this.load.spritesheet('red-archer-idle', '/assets/red-archer/Archer_Idle.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('red-archer-shoot', '/assets/red-archer/Archer_Shoot.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.image('arrow', '/assets/red-archer/Arrow.png');
    
    // Load Buildings
    this.load.image('building-house1', '/assets/buildings/House1.png');
    this.load.image('building-house2', '/assets/buildings/House2.png');
    this.load.image('building-house3', '/assets/buildings/House3.png');
    this.load.image('building-tower', '/assets/buildings/Tower.png');
    this.load.image('building-castle', '/assets/buildings/Castle.png');
  }

  create() {
    // Start the main game scene
    this.scene.start('GameScene');
  }
}

