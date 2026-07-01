import { Scene } from 'phaser';
import * as Phaser from 'phaser';

export class Menu extends Scene {
    constructor() {
        super('Menu');
    }

    create() {
        const w = window.innerWidth;
        const h = window.innerHeight;


        const bg = this.add.image(w * 0.5, h * 0.5, 'background');
        const scale = Math.min(w / bg.width, h / bg.height);
        bg.setScale(scale);

        const titleStyle = { fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };
        this.add.text(window.innerWidth / 2, 100, 'Select Level', titleStyle).setOrigin(0.5);

        // Define the three buttons
        // 0: lines (Straight Line)
        // 1: Curve (Gentle Curve)
        // 2: shapes (Zigzag New)

        this.createButton(window.innerWidth / 2 - 256, window.innerHeight / 2, 'Lines', 0, this.drawStraightLine.bind(this), 'Lines');
        this.createButton(window.innerWidth / 2, window.innerHeight / 2, 'Curve', 1, this.drawCurve.bind(this), 'Lines');
        this.createButton(window.innerWidth / 2 + 256, window.innerHeight / 2, 'Shapes', 0, this.drawZigzag.bind(this), 'Shapes');




    }

    createButton(x, y, text, levelIndex, drawShapeFn, targetScene = 'Lines') {
        const container = this.add.container(x, y);

        // 3D Transparent Button Design (Glassmorphism / Beveled)
        const bg = this.add.graphics();

        // Drop shadow
        bg.fillStyle(0x000000, 0.4);
        bg.fillRoundedRect(-100 + 8, -120 + 8, 200, 240, 24);

        // Main button background
        bg.fillStyle(0xffffff, 0.2); // semi-transparent
        bg.fillRoundedRect(-100, -120, 200, 240, 24);

        // Border / Highlight for 3D effect
        bg.lineStyle(4, 0xffffff, 0.5);
        bg.strokeRoundedRect(-100, -120, 200, 240, 24);

        // Inner shadow / bottom border for 3D depth
        bg.lineStyle(6, 0x000000, 0.2);
        bg.beginPath();
        bg.moveTo(-80, 115);
        bg.lineTo(80, 115);
        bg.strokePath();

        container.add(bg);

        // Draw the shape icon
        const shapeGraphics = this.add.graphics();
        shapeGraphics.setPosition(-50, -50); // Offset to center in button
        drawShapeFn(shapeGraphics);
        container.add(shapeGraphics);

        // Text
        const textStyle = { fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
        const label = this.add.text(0, 70, text, textStyle).setOrigin(0.5);
        container.add(label);

        // Interactivity
        // Use a zone for the click area
        const zone = this.add.zone(0, 0, 200, 240).setInteractive({ useHandCursor: true });
        container.add(zone);

        zone.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
            bg.clear();
            // Hover state styling
            bg.fillStyle(0x000000, 0.4);
            bg.fillRoundedRect(-100 + 12, -120 + 12, 200, 240, 24);
            bg.fillStyle(0xffffff, 0.3);
            bg.fillRoundedRect(-100, -120, 200, 240, 24);
            bg.lineStyle(4, 0xffffff, 0.8);
            bg.strokeRoundedRect(-100, -120, 200, 240, 24);
        });

        zone.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            bg.clear();
            // Normal state styling
            bg.fillStyle(0x000000, 0.4);
            bg.fillRoundedRect(-100 + 8, -120 + 8, 200, 240, 24);
            bg.fillStyle(0xffffff, 0.2);
            bg.fillRoundedRect(-100, -120, 200, 240, 24);
            bg.lineStyle(4, 0xffffff, 0.5);
            bg.strokeRoundedRect(-100, -120, 200, 240, 24);
            bg.lineStyle(6, 0x000000, 0.2);
            bg.beginPath();
            bg.moveTo(-80, 115);
            bg.lineTo(80, 115);
            bg.strokePath();
        });

        zone.on('pointerdown', () => {
            this.tweens.add({
                targets: container,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    this.scene.start(targetScene, { levelIndex: levelIndex });
                }
            });
        });
    }



    drawStraightLine(g) {
        g.lineStyle(8, 0x4f8ef7, 1);
        g.beginPath();
        g.moveTo(10, 50);
        g.lineTo(90, 50);
        g.strokePath();

        g.fillStyle(0xffffff, 1);
        g.fillCircle(10, 50, 8);
        g.fillStyle(0xffd43b, 1);
        g.fillCircle(90, 50, 10);
    }

    drawCurve(g) {
        g.lineStyle(8, 0xa78bfa, 1);

        const path = new Phaser.Curves.Path(10, 80);
        path.quadraticBezierTo(90, 80, 50, 0); // (x, y, controlX, controlY)
        path.draw(g);

        g.fillStyle(0xffffff, 1);
        g.fillCircle(10, 80, 8);
        g.fillStyle(0xffd43b, 1);
        g.fillCircle(90, 80, 10);
    }

    drawZigzag(g) {
        g.lineStyle(8, 0xf59e0b, 1);
        g.beginPath();
        g.moveTo(10, 80);
        g.lineTo(36, 20);
        g.lineTo(62, 80);
        g.lineTo(90, 20);
        g.strokePath();

        g.fillStyle(0xffffff, 1);
        g.fillCircle(10, 80, 8);
        g.fillStyle(0xffd43b, 1);
        g.fillCircle(90, 20, 10);
    }
}
