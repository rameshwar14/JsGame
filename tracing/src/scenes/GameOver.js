import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.stars = data.stars || 1;
        this.levelIndex = data.levelIndex || 0;
        this.maxLevels = data.maxLevels || 1;
        this.sceneName = data.sceneName || 'Lines';
        this.score = data.score || 0;
        this.earnedScore = data.earnedScore || 0;
    }

    create() {
        const textStyle = { fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');

        let starsText = '';
        for (let i = 0; i < this.stars; i++) {
            starsText += '⭐';
        }

        const scale = Math.min(window.innerWidth / 1024, window.innerHeight / 768);

        // Glowing Starburst behind the turtle
        const starburst = this.add.graphics({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        starburst.fillStyle(0xfff7cc, 0.6); // Soft glowing golden color
        
        // Draw a star shape
        const points = 12;
        const outerRadius = 220 * scale;
        const innerRadius = 140 * scale;
        
        starburst.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) starburst.moveTo(x, y);
            else starburst.lineTo(x, y);
        }
        starburst.closePath();
        starburst.fillPath();

        // Add soft inner glow (circle)
        starburst.fillStyle(0xffffff, 0.4);
        starburst.fillCircle(0, 0, 100 * scale);

        // Rotating tween
        this.tweens.add({
            targets: starburst,
            angle: 360,
            duration: 8000,
            repeat: -1,
            ease: 'Linear'
        });

        // Pulsing / zooming blur effect
        this.tweens.add({
            targets: starburst,
            scaleX: 1.15,
            scaleY: 1.15,
            alpha: 0.3,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'turtle_anim', 'turtle_3')
            .setScale(0.35 * scale)
            .setOrigin(0.5)
            .play('turtle_dance');

        const oldScore = this.score - this.earnedScore;
        const scoreContainer = this.add.container(window.innerWidth / 2, window.innerHeight / 2 - (180 * scale));

        const shellIcon = this.add.image(-40 * scale, 0, 'shell').setScale(0.6 * scale);
        const scoreValueStyle = { fontFamily: 'Arial Black', fontSize: Math.max(32, 48 * scale), color: '#ffffff', stroke: '#2e6b12', strokeThickness: 6 };
        const scoreTextObj = this.add.text(10 * scale, 0, oldScore.toString(), scoreValueStyle).setOrigin(0, 0.5);

        scoreContainer.add([shellIcon, scoreTextObj]);

        this.tweens.addCounter({
            from: oldScore,
            to: this.score,
            duration: 500,
            ease: 'Linear',
            onUpdate: (tween) => {
                scoreTextObj.setText(Math.round(tween.getValue()).toString());
            },
            onComplete: () => {
                this.tweens.add({
                    targets: scoreContainer,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 150,
                    yoyo: true
                });
            }
        });

        // this.add.text(window.innerWidth / 2, window.innerHeight / 2 + (50 * scale), `Level Complete!\n\n${starsText}`, textStyle).setAlign('center').setOrigin(0.5);

        let nextLevelIndex = this.levelIndex + 1;
        let isComplete = nextLevelIndex >= this.maxLevels;

        let continueText = isComplete ? 'Click to Play Again' : 'Click for Next Level';
        const smallStyle = { fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff', stroke: '#000000', strokeThickness: 6 };
        // this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 250, continueText, smallStyle).setAlign('center').setOrigin(0.5);

        this.input.once('pointerdown', () => {

            if (isComplete) {
                this.scene.start('MainMenu');
            } else {
                this.scene.start(this.sceneName, { levelIndex: nextLevelIndex, score: this.score });
            }

        });
    }
}
