// ============================================================
// Wave Tester System - Test all 20 waves without manual play
// ============================================================
// Usage: Press 'T' to toggle wave tester
// Press 'N' to skip to next wave
// Press 'M' to skip multiple waves fast

export class WaveTester {
  constructor(scene) {
    this.scene = scene;
    this.isTestMode = false;
    this.testSpeed = 1.0; // 1.0 = normal speed
    this.autoProgress = false;
    this.waveDelayMs = 0; // Delay before auto-progressing to next wave

    this.setupKeyboardControls();
    this.createTestUI();
  }

  setupKeyboardControls() {
    // T - Toggle test mode (auto-complete waves)
    this.scene.input.keyboard.on('keydown-T', () => {
      this.toggleTestMode();
    });

    // N - Skip to next wave immediately
    this.scene.input.keyboard.on('keydown-N', () => {
      if (!this.isTestMode) {
        this.skipToNextWave();
      }
    });

    // M - Fast-forward through multiple waves
    this.scene.input.keyboard.on('keydown-M', () => {
      if (!this.isTestMode) {
        this.fastForwardWaves();
      }
    });

    // K - Kill all enemies (complete wave instantly)
    this.scene.input.keyboard.on('keydown-K', () => {
      this.killAllEnemies();
    });
  }

  toggleTestMode() {
    this.isTestMode = !this.isTestMode;
    this.autoProgress = this.isTestMode;

    if (this.isTestMode) {
      console.log('🧪 WAVE TEST MODE ENABLED');
      console.log('Killing current wave enemies and auto-progressing...');
      this.testModeText.setText('TEST MODE: ON');
      this.testModeText.setColor('#00ff00');

      // Kill all current enemies immediately to start fresh
      this.killAllEnemies();

      // Then start auto-progression
      this.scene.time.delayedCall(100, () => {
        this.startTestMode();
      });
    } else {
      console.log('🧪 WAVE TEST MODE DISABLED');
      this.testModeText.setText('TEST MODE: OFF');
      this.testModeText.setColor('#ff0000');
      this.autoProgress = false;
    }
  }

  startTestMode() {
    // Monitor enemy count and auto-progress when empty
    const checkEnemies = setInterval(() => {
      if (!this.isTestMode) {
        clearInterval(checkEnemies);
        return;
      }

      const aliveEnemies = this.scene.enemies.getChildren().filter(e => e.active);
      const totalEnemies = aliveEnemies.length;

      this.enemyCountText.setText(`Enemies: ${totalEnemies}`);

      // Auto-progress to next wave when all enemies dead
      if (totalEnemies === 0 && this.scene.waveInProgress) {
        console.log(`✅ Wave ${this.scene.currentWave} complete! Moving to next...`);
        this.waveDelayMs = 100;

        this.scene.time.delayedCall(this.waveDelayMs, () => {
          if (this.isTestMode && this.scene.currentWave < this.scene.maxWaves) {
            this.scene.nextWave();
          } else if (this.isTestMode && this.scene.currentWave >= this.scene.maxWaves) {
            console.log('🎉 ALL 20 WAVES COMPLETED!');
            this.isTestMode = false;
            this.testModeText.setText('TEST MODE: OFF - ✅ ALL WAVES COMPLETE').setFillStyle(0x00ff00);
          }
        });
      }
    }, 100);
  }

  skipToNextWave() {
    console.log(`⏭️ Skipping to Wave ${this.scene.currentWave + 1}`);
    this.killAllEnemies();

    this.scene.time.delayedCall(200, () => {
      if (this.scene.currentWave < this.scene.maxWaves) {
        this.scene.nextWave();
      }
    });
  }

  fastForwardWaves() {
    // Ask user how many waves to skip
    const wavesToSkip = prompt(
      `Current wave: ${this.scene.currentWave}/${this.scene.maxWaves}\n\nSkip to which wave? (1-20)`,
      String(this.scene.currentWave + 5)
    );

    if (wavesToSkip === null) return;

    const targetWave = parseInt(wavesToSkip);
    if (isNaN(targetWave) || targetWave < 1 || targetWave > this.scene.maxWaves) {
      console.error('Invalid wave number');
      return;
    }

    if (targetWave === this.scene.currentWave) {
      console.log('Already on that wave');
      return;
    }

    console.log(`⚡ Fast-forwarding from Wave ${this.scene.currentWave} to Wave ${targetWave}`);
    this.killAllEnemies();

    this.scene.time.delayedCall(200, () => {
      while (this.scene.currentWave < targetWave) {
        this.scene.currentWave++;
      }
      this.scene.startWave();
      console.log(`✅ Jumped to Wave ${this.scene.currentWave}`);
    });
  }

  killAllEnemies() {
    const enemies = this.scene.enemies.getChildren();
    console.log(`💀 Killing ${enemies.length} enemies`);

    enemies.forEach(enemy => {
      if (enemy && enemy.active) {
        enemy.health = 0;
        enemy.die();
      }
    });
  }

  createTestUI() {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Test mode indicator
    this.testModeText = this.scene.add.text(10, 10, 'TEST MODE: OFF', {
      font: '14px Arial',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.testModeText.setScrollFactor(0);
    this.testModeText.setDepth(300);

    // Enemy count display
    this.enemyCountText = this.scene.add.text(10, 35, 'Enemies: 0', {
      font: '14px Arial',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.enemyCountText.setScrollFactor(0);
    this.enemyCountText.setDepth(300);

    // Instructions
    this.instructionsText = this.scene.add.text(10, 60,
      'Wave Tester: [T]=Toggle Auto | [N]=Next Wave | [M]=Jump Wave | [K]=Kill All',
      {
        font: '12px Arial',
        fill: '#00ff00',
        stroke: '#000000',
        strokeThickness: 1
      }
    );
    this.instructionsText.setScrollFactor(0);
    this.instructionsText.setDepth(300);
  }

  update() {
    // Update enemy count display
    if (this.instructionsText) {
      const aliveEnemies = this.scene.enemies.getChildren().filter(e => e.active);
      this.enemyCountText.setText(`Enemies: ${aliveEnemies.length}`);
    }
  }

  destroy() {
    if (this.testModeText) this.testModeText.destroy();
    if (this.enemyCountText) this.enemyCountText.destroy();
    if (this.instructionsText) this.instructionsText.destroy();
  }
}
