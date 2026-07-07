import { Scene } from 'phaser';
import { LevelData } from '../core/LevelData';
import { PathRenderer } from '../core/PathRenderer';
import { Tracer } from '../core/Tracer';
import { UIManager } from '../core/UIManager';
import { AudioManager } from '../core/AudioManager';
import { SaveManager } from '../core/SaveManager';
import { gameEvents } from '../core/GameEvents';

export class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.category = data.category || 'Lines';
        this.levelIndex = data.levelIndex || 0;

        const saveData = SaveManager.load();
        this.score = saveData.score || 0;
    }

    create() {
        this.collectedLettuce = 0;
        const { width: w, height: h } = this.scale;
        const scale = Math.min(w / 1024, h / 768);

        const levelConfig = LevelData.getLevel(this.category, this.levelIndex, w, h);
        if (!levelConfig) {
            this.scene.start('Menu');
            return;
        }

        levelConfig.tolerance = (this.category === 'Shapes' ? 30 : 40) * scale;

        this.audioManager = new AudioManager(this);

        this.uiManager = new UIManager(this, {
            score: this.score,
            message: levelConfig.message || 'HELP THE TURTLE REACH HOME!',
            rewardIcon: this.category === 'Shapes' ? 'lettuce' : 'shell'
        });

        this.pathRenderer = new PathRenderer(this, levelConfig);

        if (this.category === 'Shapes') {
            levelConfig.cornerStars = this.pathRenderer.createCornerStars();
        }

        this.tracer = new Tracer(this, levelConfig);

        gameEvents.on('reward_collected', this.onRewardCollected, this);
        gameEvents.on('trace_complete', this.onTraceComplete, this);

        this.events.once('shutdown', this.shutdown, this);
    }

    onRewardCollected(starData) {
        this.collectedLettuce = (this.collectedLettuce || 0) + 1;
        this.tweens.add({
            targets: starData.object,
            x: this.uiManager.scoreText.x - 30,
            y: this.uiManager.scoreText.y,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 600,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                starData.object.destroy();
                this.score++;
                this.uiManager.updateScore(this.score);
            }
        });
    }

    onTraceComplete(accuracy) {
        let stars = 1;
        let earnedLettuce = 2;
        if (accuracy >= 0.85) {
            stars = 3;
            earnedLettuce = 5;
        } else if (accuracy >= 0.60) {
            stars = 2;
            earnedLettuce = 3;
        }

        // For shapes, we only give the lettuce they physically collected.
        let newTotalScore = 0;
        if (this.category === 'Shapes') {
            newTotalScore = SaveManager.updateScore(this.collectedLettuce || 0);
        } else {
            newTotalScore = SaveManager.updateScore(earnedLettuce);
        }

        if (this.category === 'Shapes') {
            this.pathRenderer.clear();
            this.time.delayedCall(500, () => {
                this.cameras.main.fadeOut(800, 255, 255, 255, () => {
                    const maxLevels = LevelData.getCategoryCount(this.category);
                    if (this.levelIndex + 1 < maxLevels) {
                        this.scene.start('GameScene', { category: this.category, levelIndex: this.levelIndex + 1 });
                    } else {
                        this.scene.start('Menu');
                    }
                });
            });
        } else {
            this.time.delayedCall(1000, () => {
                this.scene.start('GameOver', {
                    stars: stars,
                    levelIndex: this.levelIndex,
                    maxLevels: LevelData.getCategoryCount(this.category),
                    sceneName: 'GameScene',
                    category: this.category,
                    score: newTotalScore,
                    earnedScore: earnedLettuce
                });
            });
        }
    }

    shutdown() {
        gameEvents.off('reward_collected', this.onRewardCollected, this);
        gameEvents.off('trace_complete', this.onTraceComplete, this);
        if (this.tracer) this.tracer.destroy();
    }
}
