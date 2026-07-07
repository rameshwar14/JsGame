import { Scene } from 'phaser';
import * as Phaser from 'phaser';

const getLevels = (w, h) => {
    const minX = w * 0.25;
    const maxX = w * 0.75;
    const minY = h * 0.30;
    const maxY = h * 0.80;
    const cx = w * 0.5;
    const cy = (minY + maxY) / 2;

    // const cx = w * 0.5;
    // const cx = h * 0.5;
    const radius = Math.min(w, h) * 0.3;

    const createPolygonPath = (sides, offsetAngle = -Math.PI / 2) => {
        let path = null;
        for (let i = 0; i <= sides; i++) {
            const angle = (i * 2 * Math.PI) / sides + offsetAngle;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            if (i === 0) {
                path = new Phaser.Curves.Path(x, y);
            } else {
                path.lineTo(x, y);
            }
        }
        return path;
    };

    const createRectanglePath = (wRect, hRect, offsetX, offsetY) => {
        const path = new Phaser.Curves.Path(offsetX, offsetY);
        path.lineTo(offsetX + wRect, offsetY);
        path.lineTo(offsetX + wRect, offsetY + hRect);
        path.lineTo(offsetX, offsetY + hRect);
        path.lineTo(offsetX, offsetY);
        return path;
    };

    const triangle = createPolygonPath(3);
    const square = createPolygonPath(4);
    const rectangle = createRectanglePath(w * 0.6, h * 0.3, w * 0.2, h * 0.35);
    const pentagon = createPolygonPath(5);
    const hexagon = createPolygonPath(6);
    const heptagon = createPolygonPath(7);
    const octagon = createPolygonPath(8);



    const star3 = new Phaser.Curves.Path(w * 0.5, h * 0.15);
    star3.lineTo(w * 0.65, h * 0.6);
    star3.lineTo(w * 0.35, h * 0.6);
    star3.lineTo(w * 0.5, h * 0.15);

    const star5 = new Phaser.Curves.Path(w * 0.5, h * 0.15);
    star5.lineTo(w * 0.7, h * 0.4);
    star5.lineTo(w * 0.55, h * 0.4);
    star5.lineTo(w * 0.8, h * 0.65);
    star5.lineTo(w * 0.6, h * 0.65);
    star5.lineTo(w * 0.5, h * 0.9);
    star5.lineTo(w * 0.4, h * 0.65);
    star5.lineTo(w * 0.2, h * 0.65);
    star5.lineTo(w * 0.35, h * 0.4);
    star5.lineTo(w * 0.25, h * 0.4);
    star5.lineTo(w * 0.5, h * 0.15);

    return [
        // Simple polygons
        { name: 'Triangle', color: 0xef4444, path: triangle },
        { name: 'Square', color: 0x3b82f6, path: square },
        { name: 'Rectangle', color: 0x10b981, path: rectangle },
        { name: 'Pentagon', color: 0xf59e0b, path: pentagon },
        { name: 'Hexagon', color: 0x8b5cf6, path: hexagon },
        { name: 'Heptagon', color: 0xec4899, path: heptagon },
        { name: 'Octagon', color: 0x06b6d4, path: octagon },

        // { name: 'Star 3', color: 0xffd700, path: star3 },
        // { name: 'Star 5', color: 0xff8c00, path: star5 }
    ];
};

export class Shapes extends Scene {
    constructor() {
        super('Shapes');
    }

    init(data) {
        this.levelIndex = data.levelIndex || 0;
    }

    create() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const scale = Math.min(w / 1024, h / 768);
        const LEVELS = getLevels(w, h);
        this.LEVELS = LEVELS;
        const TOLERANCE = 30 * scale;
        this.TOLERANCE = TOLERANCE;

        // Change the background color to match the UI (light blue)
        this.cameras.main.setBackgroundColor('#badff2');

        // Draw the play area border
        const borderGraphics = this.add.graphics();
        borderGraphics.lineStyle(6 * scale, 0xffffff, 1);
        borderGraphics.fillStyle(0xffffff, 0.2);

        // The play area sits below the top UI
        const playAreaY = h * 0.12;
        const playAreaHeight = h * 0.84;
        borderGraphics.fillRoundedRect(w * 0.1, playAreaY, w * 0.8, playAreaHeight, 20 * scale);
        borderGraphics.strokeRoundedRect(w * 0.1, playAreaY, w * 0.8, playAreaHeight, 20 * scale);
        const level = LEVELS[this.levelIndex];

        const textStyle = {
            fontFamily: 'Nunito',
            fontSize: Math.max(16, 38 * scale),
            color: '#ffffff',
            stroke: '#414344ff',
            strokeThickness: 1,
            shadow: { offsetX: 0, offsetY: 6, color: 'rgba(0, 0, 0, 0.25)', blur: 8, stroke: true, fill: true }
        };
        this.add.text(w / 2, h * 0.01, 'Collect the lettuce!', textStyle).setOrigin(0.5);

        this.pathGraphics = this.add.graphics();
        const startPoint = level.path.getStartPoint();
        const endPoint = level.path.getEndPoint();

        const tolerancePath = this.add.graphics();
        tolerancePath.lineStyle(TOLERANCE * 2, 0x00ffff, 0.05);
        tolerancePath.strokePath(level.path);

        // Removed the solid stroke path so it only shows dots
        const maxT = level.path.getLength();

        // High resolution points for accurate collision detection
        const points = level.path.getPoints(600);
        this.points = points;
        this.maxPointReached = 0;
        this.reachedEnd = false;

        this.pointsGraphics = this.add.graphics();
        this.pointsGraphics.fillStyle(0xA9C4CF, 0.8);

        // Draw visual spaced dots
        const visualPoints = level.path.getSpacedPoints(60);
        visualPoints.forEach(p => {
            this.pointsGraphics.fillCircle(p.x, p.y, Math.max(3, 6 * scale));
        });

        // Draw an arrow indicating direction near the start


        const home = this.add.graphics();
        home.fillStyle(0x10b981, 0.5); // Green color for home
        home.fillCircle(endPoint.x, endPoint.y, Math.max(10, 15 * scale));
        home.lineStyle(2, 0xffffff, 1);
        home.strokeCircle(endPoint.x, endPoint.y, Math.max(10, 15 * scale));

        this.physics.add.existing(home, true);

        this.add.text(w * 0.5, h * 0.95, level.name.toUpperCase(), textStyle).setOrigin(0.5).setDepth(5);

        // --- STAR COUNTER & CORNERS ---
        this.collectedStars = 0;
        const counterStyle = { fontFamily: 'Nunito', fontSize: Math.max(20, 32 * scale), color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
        this.starCounterText = this.add.text(w * 0.95, h * 0.1, '0', counterStyle).setOrigin(1, 0.5);
        this.starCounterIcon = this.add.image(w * 0.95 - (30 * scale), h * 0.1, 'lettuce').setScale(0.5 * scale).setOrigin(1, 0.5);

        // --- CLOSE BUTTON ---
        const closeBtnStyle = { fontFamily: 'Nunito', fontSize: Math.max(24, 38 * scale), color: '#ffffff', stroke: '#000000', strokeThickness: 4, shadow: { offsetX: 0, offsetY: 4, color: 'rgba(0, 0, 0, 0.25)', blur: 4, stroke: true, fill: true } };
        const closeBtn = this.add.text(w * 0.05, h * 0.1, '✖', closeBtnStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('Menu');
            });

        // Extract corners from the path
        this.cornerStars = [];
        level.path.curves.forEach((curve) => {
            const p = curve.p0;
            // Create a lettuce image at this corner
            const star = this.add.image(p.x, p.y, 'lettuce').setScale(0.5 * scale).setOrigin(0.5).setDepth(10);

            this.cornerStars.push({
                object: star,
                isCollected: false,
                x: p.x,
                y: p.y
            });
        });

        // --- START OF DRAWING SETUP ---

        this.drawGraphics = this.add.graphics();
        this.drawGraphics.lineStyle(16 * scale, 0xffffff, 1);

        this.isTracing = false;
        this.totalFrames = 0;
        this.goodFrames = 0;
        this.reachedEnd = false;
        this.maxPointReached = 0;
        this.isClosedShape = Phaser.Math.Distance.Between(startPoint.x, startPoint.y, endPoint.x, endPoint.y) < 10;

        this.input.on('pointerdown', (pointer) => {
            if (Phaser.Math.Distance.Between(pointer.x, pointer.y, startPoint.x, startPoint.y) < TOLERANCE * 2) {
                this.isTracing = true;

                this.drawGraphics.clear();
                this.drawGraphics.lineStyle(16 * scale, 0xffffff, 1);
                this.drawGraphics.beginPath();
                this.drawGraphics.moveTo(pointer.x, pointer.y);

                this.totalFrames = 0;
                this.goodFrames = 0;
                this.reachedEnd = false;
                this.maxPointReached = 0;
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (!this.isTracing) return;

            this.drawGraphics.lineTo(pointer.x, pointer.y);
            this.drawGraphics.strokePath();

            let minDistance = Number.MAX_VALUE;
            let closestIndex = 0;
            for (let i = 0; i < this.points.length; i++) {
                const p = this.points[i];
                const d = Phaser.Math.Distance.Between(pointer.x, pointer.y, p.x, p.y);
                if (d < minDistance) {
                    minDistance = d;
                    closestIndex = i;
                }
            }

            if (closestIndex > this.maxPointReached) {
                // Prevent jumping backwards across the start/end seam of a closed shape
                if (closestIndex - this.maxPointReached < this.points.length * 0.5) {
                    this.maxPointReached = closestIndex;
                } else {
                    // User traced backwards across the seam (counter-clockwise from start)
                    this.isTracing = false;
                    this.drawGraphics.clear();
                    return;
                }
            } else if (closestIndex < this.maxPointReached) {
                // User traced backwards along the path
                if (this.maxPointReached - closestIndex > 20) {
                    this.isTracing = false;
                    this.drawGraphics.clear();
                    return;
                }
            }

            this.totalFrames++;

            if (minDistance <= TOLERANCE) {
                this.goodFrames++;
            }

            // Check for star collection
            this.cornerStars.forEach(starData => {
                if (!starData.isCollected) {
                    const distToStar = Phaser.Math.Distance.Between(pointer.x, pointer.y, starData.x, starData.y);
                    if (distToStar < TOLERANCE * 3) {
                        starData.isCollected = true;

                        // Tween the star to the counter
                        this.tweens.add({
                            targets: starData.object,
                            x: this.starCounterText.x - 30, // Approximate center of counter text
                            y: this.starCounterText.y,
                            scaleX: 1.5,
                            scaleY: 1.5,
                            duration: 600,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                starData.object.destroy();
                                this.collectedStars++;
                                this.starCounterText.setText(this.collectedStars.toString());

                                // Optional: pulse the counter
                                this.tweens.add({
                                    targets: this.starCounterText,
                                    scaleX: 1.2,
                                    scaleY: 1.2,
                                    duration: 100,
                                    yoyo: true
                                });
                            }
                        });
                    }
                }
            });

            const canComplete = !this.isClosedShape || this.maxPointReached > this.points.length * 0.8;

            if (canComplete && Phaser.Math.Distance.Between(pointer.x, pointer.y, endPoint.x, endPoint.y) < TOLERANCE) {
                this.reachedEnd = true;
                this.finishLevel();
            }
        });

        this.input.on('pointerup', () => {
            if (this.isTracing && !this.reachedEnd) {
                this.isTracing = false;
                this.drawGraphics.clear();
            }
        });
    }

    finishLevel() {
        // Hide the path and points
        this.pathGraphics.clear();
        this.pointsGraphics.clear();

        // Reset the flag
        this.reachedEnd = false;

        this.time.delayedCall(500, () => {
            this.cameras.main.fadeOut(800, 255, 255, 255, () => {
                if (this.levelIndex + 1 < this.LEVELS.length) {
                    this.scene.start('Shapes', { levelIndex: this.levelIndex + 1 });
                } else {
                    this.scene.start('Menu');
                }
            });
        });
    }
}