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
    
    // Load health/XP bar assets
    this.load.image('health-bar-bg', '/assets/health-bar-bg.png');
    this.load.image('health-bar-fill', '/assets/health-bar-fill.png');
    this.load.image('xp-bar-fill', '/assets/xp-bar-fill.png');
    
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
    
    // Load Blue Warrior sprites (Ally)
    this.load.spritesheet('blue-warrior-idle', '/assets/blue-warrior/Warrior_Idle.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('blue-warrior-run', '/assets/blue-warrior/Warrior_Run.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('blue-warrior-attack1', '/assets/blue-warrior/Warrior_Attack1.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    // Load Blue Monk sprites (Ally)
    this.load.spritesheet('blue-monk-idle', '/assets/blue-monk/Idle.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('blue-monk-run', '/assets/blue-monk/Run.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    this.load.spritesheet('blue-monk-attack', '/assets/blue-monk/Heal.png', {
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
    
    this.load.spritesheet('red-warrior-guard', '/assets/red-warrior/Warrior_Guard.png', {
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

    // Load Red Lancer sprites (Enemy)
    this.load.spritesheet('red-lancer-idle', '/assets/red-lancer/Lancer_Idle.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    this.load.spritesheet('red-lancer-run', '/assets/red-lancer/Lancer_Run.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    this.load.spritesheet('red-lancer-attack', '/assets/red-lancer/Lancer_Right_Attack.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    // Load Blue Lancer sprites (Enemy)
    this.load.spritesheet('blue-lancer-idle', '/assets/blue-lancer/Lancer_Idle.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    this.load.spritesheet('blue-lancer-run', '/assets/blue-lancer/Lancer_Run.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    this.load.spritesheet('blue-lancer-attack', '/assets/blue-lancer/Lancer_Right_Attack.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    // Load Yellow Lancer sprites (Enemy)
    this.load.spritesheet('yellow-lancer-idle', '/assets/yellow-lancer/Lancer_Idle.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    this.load.spritesheet('yellow-lancer-run', '/assets/yellow-lancer/Lancer_Run.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    this.load.spritesheet('yellow-lancer-attack', '/assets/yellow-lancer/Lancer_Right_Attack.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    // Load Black Lancer sprites (Enemy)
    this.load.spritesheet('black-lancer-idle', '/assets/black-lancer/Lancer_Idle.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    this.load.spritesheet('black-lancer-run', '/assets/black-lancer/Lancer_Run.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    this.load.spritesheet('black-lancer-attack', '/assets/black-lancer/Lancer_Right_Attack.png', {
      frameWidth: 320,
      frameHeight: 320
    });

    // Load Buildings
    this.load.image('building-house1', '/assets/buildings/House1.png');
    this.load.image('building-house2', '/assets/buildings/House2.png');
    this.load.image('building-house3', '/assets/buildings/House3.png');
    this.load.image('building-tower', '/assets/buildings/Tower.png');
    this.load.image('building-castle', '/assets/buildings/Castle.png');
    
    // Load Decorations - Trees (sprite sheets with 8 frames each)
    this.load.spritesheet('tree1', '/assets/decorations/Tree1.png', {
      frameWidth: 192,
      frameHeight: 256
    });
    this.load.spritesheet('tree2', '/assets/decorations/Tree2.png', {
      frameWidth: 192,
      frameHeight: 256
    });
    this.load.spritesheet('tree3', '/assets/decorations/Tree3.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    this.load.spritesheet('tree4', '/assets/decorations/Tree4.png', {
      frameWidth: 192,
      frameHeight: 192
    });
    
    // Load Decorations - Bushes (sprite sheets with 8 frames each)
    this.load.spritesheet('bush1', '/assets/decorations/Bushe1.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('bush2', '/assets/decorations/Bushe2.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('bush3', '/assets/decorations/Bushe3.png', {
      frameWidth: 128,
      frameHeight: 128
    });
    
    // Load Decorations - Rocks (static images)
    this.load.image('rock1', '/assets/decorations/Rock1.png');
    this.load.image('rock2', '/assets/decorations/Rock2.png');
    this.load.image('rock3', '/assets/decorations/Rock3.png');
    this.load.image('rock4', '/assets/decorations/Rock4.png');
    
    // Load Slash Effects (1280x720 individual frames)
    // Slash 1 - 12 frames
    for (let i = 1; i <= 12; i++) {
      const frameNum = i.toString().padStart(5, '0');
      this.load.image(`slash1-frame${i}`, `/assets/slash-effects/slash1/skash_${frameNum}.png`);
    }
    
    // Slash 2 - 9 frames
    for (let i = 1; i <= 9; i++) {
      const frameNum = i.toString().padStart(5, '0');
      this.load.image(`slash2-frame${i}`, `/assets/slash-effects/slash2/slash2_${frameNum}.png`);
    }
    
    // Slash 3 - 12 frames
    for (let i = 1; i <= 12; i++) {
      const frameNum = i.toString().padStart(5, '0');
      this.load.image(`slash3-frame${i}`, `/assets/slash-effects/slash3/slash3_${frameNum}.png`);
    }
    
    // Slash 4 - 12 frames
    for (let i = 1; i <= 12; i++) {
      const frameNum = i.toString().padStart(5, '0');
      this.load.image(`slash4-frame${i}`, `/assets/slash-effects/slash4/slash4_${frameNum}.png`);
    }
    
    // Slash 5 - 11 frames (special naming: slash5-animation_00.png)
    for (let i = 0; i <= 10; i++) {
      const frameNum = i.toString().padStart(2, '0');
      this.load.image(`slash5-frame${i + 1}`, `/assets/slash-effects/slash5/slash5-animation_${frameNum}.png`);
    }
    
    // Slash 6 - 11 frames
    for (let i = 1; i <= 11; i++) {
      const frameNum = i.toString().padStart(5, '0');
      this.load.image(`slash6-frame${i}`, `/assets/slash-effects/slash6/slash6_${frameNum}.png`);
    }
    
    // Slash 7 - 6 frames
    for (let i = 1; i <= 6; i++) {
      const frameNum = i.toString().padStart(5, '0');
      this.load.image(`slash7-frame${i}`, `/assets/slash-effects/slash7/slash7_${frameNum}.png`);
    }
    
    // Slash 8 - 8 frames
    for (let i = 1; i <= 8; i++) {
      const frameNum = i.toString().padStart(5, '0');
      this.load.image(`slash8-frame${i}`, `/assets/slash-effects/slash8/slash8_${frameNum}.png`);
    }
    
    // Slash 9 - 9 frames
    for (let i = 1; i <= 9; i++) {
      const frameNum = i.toString().padStart(5, '0');
      this.load.image(`slash9-frame${i}`, `/assets/slash-effects/slash9/slash9_${frameNum}.png`);
    }
    
    // Slash 10 - 10 frames
    for (let i = 0; i <= 9; i++) {
      const frameNum = i.toString().padStart(2, '0');
      this.load.image(`slash10-frame${i}`, `/assets/slash-effects/slash10/slash10.spine_${frameNum}.png`);
    }
  }

  create() {
    // Create animations for slash effects
    this.createSlashAnimations();
    
    // Start the main game scene
    this.scene.start('GameScene');
  }
  
  createSlashAnimations() {
    // Slash 1 - Quick horizontal slash
    this.anims.create({
      key: 'slash1-effect',
      frames: Array.from({ length: 12 }, (_, i) => ({ key: `slash1-frame${i + 1}` })),
      frameRate: 24,
      repeat: 0
    });
    
    // Slash 2 - Diagonal sweep
    this.anims.create({
      key: 'slash2-effect',
      frames: Array.from({ length: 9 }, (_, i) => ({ key: `slash2-frame${i + 1}` })),
      frameRate: 20,
      repeat: 0
    });
    
    // Slash 3 - Vertical strike
    this.anims.create({
      key: 'slash3-effect',
      frames: Array.from({ length: 12 }, (_, i) => ({ key: `slash3-frame${i + 1}` })),
      frameRate: 24,
      repeat: 0
    });
    
    // Slash 4 - Spinning slash
    this.anims.create({
      key: 'slash4-effect',
      frames: Array.from({ length: 12 }, (_, i) => ({ key: `slash4-frame${i + 1}` })),
      frameRate: 24,
      repeat: 0
    });
    
    // Slash 5 - Power strike
    this.anims.create({
      key: 'slash5-effect',
      frames: Array.from({ length: 11 }, (_, i) => ({ key: `slash5-frame${i + 1}` })),
      frameRate: 22,
      repeat: 0
    });
    
    // Slash 6 - Cross slash
    this.anims.create({
      key: 'slash6-effect',
      frames: Array.from({ length: 11 }, (_, i) => ({ key: `slash6-frame${i + 1}` })),
      frameRate: 22,
      repeat: 0
    });
    
    // Slash 7 - Quick jab
    this.anims.create({
      key: 'slash7-effect',
      frames: Array.from({ length: 6 }, (_, i) => ({ key: `slash7-frame${i + 1}` })),
      frameRate: 18,
      repeat: 0
    });
    
    // Slash 8 - Circular slash
    this.anims.create({
      key: 'slash8-effect',
      frames: Array.from({ length: 8 }, (_, i) => ({ key: `slash8-frame${i + 1}` })),
      frameRate: 20,
      repeat: 0
    });
    
    // Slash 9 - Wave slash
    this.anims.create({
      key: 'slash9-effect',
      frames: Array.from({ length: 9 }, (_, i) => ({ key: `slash9-frame${i + 1}` })),
      frameRate: 20,
      repeat: 0
    });
    
    // Slash 10 - Ultimate strike
    this.anims.create({
      key: 'slash10-effect',
      frames: Array.from({ length: 10 }, (_, i) => ({ key: `slash10-frame${i}` })),
      frameRate: 20,
      repeat: 0
    });
  }
}

