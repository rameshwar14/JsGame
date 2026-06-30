import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(w * 0.1, h * 0.1, 'background');

        const logo = this.add.image(w / 2, h / 2 - 270, 'logo');

        this.tweens.add({
            targets: logo,
            y: 270,
            duration: 1000,
            ease: 'Bounce'
        });

        const instructions = [
            'Trace the glowing path!',
            '',
            'Click to Start Rameshwar!'
        ]

        this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 300, instructions, textStyle).setAlign('center').setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Menu');

        });
    }
}
