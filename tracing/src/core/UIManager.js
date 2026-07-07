import { gameEvents } from './GameEvents';

export class UIManager {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.score = config.score || 0;
        this.message = config.message || 'HELP THE TURTLE REACH HOME!';
        this.rewardIcon = config.rewardIcon || 'shell';
        
        const w = scene.scale.width;
        const h = scene.scale.height;
        this.scale = Math.min(w / 1024, h / 768);
        this.w = w;
        this.h = h;

        this.createUI();
    }

    createUI() {
        const textStyle = {
            fontFamily: 'Nunito',
            fontSize: Math.max(16, 38 * this.scale),
            color: '#ffffff',
            stroke: '#414344ff',
            strokeThickness: 1,
            shadow: { offsetX: 0, offsetY: 6, color: 'rgba(0, 0, 0, 0.25)', blur: 8, stroke: true, fill: true }
        };

        // Title Message
        this.titleText = this.scene.add.text(this.w / 2, this.h * 0.06, this.message, textStyle).setOrigin(0.5);

        // Close Button
        const closeBtnStyle = { 
            fontFamily: 'Nunito', 
            fontSize: Math.max(24, 38 * this.scale), 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 4, 
            shadow: { offsetX: 0, offsetY: 4, color: 'rgba(0, 0, 0, 0.25)', blur: 4, stroke: true, fill: true } 
        };
        this.closeBtn = this.scene.add.text(this.w * 0.05, this.h * 0.06, '✖', closeBtnStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.scene.start('Menu');
            });

        // Score UI
        this.scoreContainer = this.scene.add.container(this.w * 0.90, this.h * 0.06);
        this.scoreIcon = this.scene.add.image(0, 0, this.rewardIcon).setScale(0.6 * this.scale);
        const scoreStyle = { 
            fontFamily: 'Nunito', 
            fontSize: Math.max(20, 32 * this.scale), 
            color: '#ffffff', 
            stroke: '#2e6b12', 
            strokeThickness: 4, 
            shadow: { offsetX: 0, offsetY: 4, color: 'rgba(0, 0, 0, 0.25)', blur: 4, stroke: true, fill: true } 
        };
        this.scoreText = this.scene.add.text(35 * this.scale, 0, this.score.toString(), scoreStyle).setOrigin(0, 0.5);
        this.scoreContainer.add([this.scoreIcon, this.scoreText]);
    }

    updateScore(newScore) {
        this.score = newScore;
        if (this.scoreText) {
            this.scoreText.setText(this.score.toString());
            
            this.scene.tweens.add({
                targets: this.scoreText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 100,
                yoyo: true
            });
        }
    }
}
