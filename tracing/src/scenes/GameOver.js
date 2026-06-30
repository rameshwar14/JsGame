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
    }

    create() {
        const textStyle = { fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');

        let starsText = '';
        for (let i = 0; i < this.stars; i++) {
            starsText += '⭐';
        }

        this.add.text(window.innerWidth / 2, window.innerHeight / 2, `Level Complete!\n\n${starsText}`, textStyle).setAlign('center').setOrigin(0.5);

        let nextLevelIndex = this.levelIndex + 1;
        let isComplete = nextLevelIndex >= this.maxLevels;

        let continueText = isComplete ? 'Click to Play Again' : 'Click for Next Level';
        const smallStyle = { fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff', stroke: '#000000', strokeThickness: 6 };
        this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 250, continueText, smallStyle).setAlign('center').setOrigin(0.5);

        this.input.once('pointerdown', () => {

            if (isComplete) {
                this.scene.start('MainMenu');
            } else {
                this.scene.start(this.sceneName, { levelIndex: nextLevelIndex });
            }

        });
    }
}
