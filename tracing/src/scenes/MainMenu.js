import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const { width: w, height: h } = this.scale;
        const scale = Math.min(w / 1024, h / 768);

        const bg = this.add.image(w * 0.5, h * 0.5, 'background');
        const bgScale = Math.max(w / bg.width, h / bg.height);
        bg.setScale(bgScale);
        
        const logo = this.add.image(w / 2, -200, 'start_name');
        logo.setScale(scale);

        this.tweens.add({
            targets: logo,
            y: h * 0.3,
            duration: 1000,
            ease: 'Bounce'
        });

        const instructions = [
            'Trace the glowing path!',
        ];

        const textStyle = { fontFamily: 'Arial Black', fontSize: `${38 * scale}px`, color: '#ffffff', stroke: '#000000', strokeThickness: 8 * scale };
        this.add.text(w / 2, h * 0.6, instructions, textStyle).setAlign('center').setOrigin(0.5);

        this.createStartButton(w / 2, h * 0.8, 'PLAY', scale);
    }

    createStartButton(x, y, text, scale) {
        const container = this.add.container(x, y);
        container.setScale(scale);

        const bg = this.add.graphics();

        const drawButton = (isHover) => {
            bg.clear();

            // Drop shadow
            bg.fillStyle(0x000000, 0.25);
            bg.fillRoundedRect(-150 + (isHover ? 6 : 4), -60 + (isHover ? 10 : 8), 300, 120, 40);

            // Darker green for 3D bottom depth
            bg.fillStyle(0x56a61c, 1);
            bg.fillRoundedRect(-150, -55, 300, 120, 40);

            // Main bright green body
            bg.fillStyle(isHover ? 0x8df03c : 0x7ce825, 1);
            bg.fillRoundedRect(-150, -65, 300, 120, 40);

            // Top highlight (glare)
            bg.lineStyle(8, 0xffffff, isHover ? 0.6 : 0.4);
            bg.beginPath();
            bg.moveTo(-110, -55);
            bg.lineTo(110, -55);
            bg.strokePath();

            // Left small highlight dot
            bg.fillStyle(0xffffff, isHover ? 0.8 : 0.6);
            bg.fillCircle(-120, -45, 6);
        };

        drawButton(false);

        container.add(bg);

        // Text
        const textStyle = { fontFamily: 'Arial Black', fontSize: '48px', color: '#ffffff', stroke: '#478f14', strokeThickness: 10 };
        const label = this.add.text(0, -5, text, textStyle).setOrigin(0.5);
        container.add(label);

        // Interactivity
        const zone = this.add.zone(0, -5, 300, 120).setInteractive({ useHandCursor: true });
        container.add(zone);

        zone.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: scale * 1.05,
                scaleY: scale * 1.05,
                duration: 100
            });
            drawButton(true);
        });

        zone.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: scale,
                scaleY: scale,
                duration: 100
            });
            drawButton(false);
        });

        zone.on('pointerdown', () => {
            if (!this.scale.isFullscreen) {
                this.scale.startFullscreen();
            }
            try {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch((e) => console.warn(e));
                } else if (screen.lockOrientation) {
                    screen.lockOrientation('landscape');
                } else if (screen.mozLockOrientation) {
                    screen.mozLockOrientation('landscape');
                } else if (screen.msLockOrientation) {
                    screen.msLockOrientation('landscape');
                }
            } catch (e) {
                console.warn('Orientation lock failed', e);
            }
            this.scale.lockOrientation('landscape');

            this.tweens.add({
                targets: container,
                scaleX: scale * 0.95,
                scaleY: scale * 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('Menu');
                }
            });
        });
    }

}
