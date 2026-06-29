import { Scene } from 'phaser';
import * as Phaser from 'phaser';

const singleLine = new Phaser.Curves.Path(100, 384);
singleLine.lineTo(924, 384);

const twoLines = new Phaser.Curves.Path(100, 500);
twoLines.lineTo(512, 200).lineTo(924, 500);

const multipleLines = new Phaser.Curves.Path(100, 384);
multipleLines.lineTo(306, 184).lineTo(512, 584).lineTo(718, 184).lineTo(924, 384);


const LEVELS = [
    { name: 'Single Line', color: 0x4f8ef7, path: singleLine },
    { name: 'Two Lines', color: 0xa78bfa, path: twoLines },
    { name: 'Multiple Lines', color: 0xf59e0b, path: multipleLines }
];
const TOLERANCE = 40;

export class Lines extends Scene {
    constructor() {
        super('Lines');
    }

    init(data) {
        this.levelIndex = data.levelIndex || 0;
    }

    create() {
        this.add.image(512, 384, 'background');

        const level = LEVELS[this.levelIndex];

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#red', stroke: '#000000', strokeThickness: 8 };
        this.add.text(512, 50, level.name, textStyle).setOrigin(0.5);

        // Draw the guide path
        this.guideGraphics = this.add.graphics();
        this.guideGraphics.lineStyle(24, level.color, 0.5);
        level.path.draw(this.guideGraphics);

        // --- START OF PATH PREPARATION ---

        // Extract exactly 200 evenly spaced points along the path. 
        // We use these points later to check how accurately the user traces the path.
        const points = level.path.getSpacedPoints(200);
        this.points = points;

        // The first point in the array is where the drawing should start
        const startPoint = points[0];
        // The last point in the array is the finish line
        const endPoint = points[points.length - 1];

        // Draw a white circle at the starting point to show the user where to begin
        this.guideGraphics.fillStyle(0xffffff, 0.8);
        this.guideGraphics.fillCircle(startPoint.x, startPoint.y, 20);

        // Draw a golden/yellow circle at the ending point to show the user where to finish
        this.guideGraphics.fillStyle(0xffd43b, 1);
        this.guideGraphics.fillCircle(endPoint.x, endPoint.y, 25);

        // --- START OF DRAWING SETUP ---

        // Create a separate graphics object for the user's drawing so it doesn't interfere with the guide path
        this.drawGraphics = this.add.graphics();
        // Set the user's drawing line to be white, with a thickness of 16
        this.drawGraphics.lineStyle(16, 0xffffff, 1);

        // Variables to keep track of the game's state
        this.isTracing = false; // Is the user currently pressing down and tracing?
        this.totalFrames = 0;   // How many times did the pointer move while tracing?
        this.goodFrames = 0;    // How many of those movements were close to the guide path?
        this.reachedEnd = false;// Did the user successfully trace to the end?

        // --- INPUT HANDLING: POINTER DOWN ---

        // When the user clicks or touches the screen
        this.input.on('pointerdown', (pointer) => {
            // Check if they clicked near the starting point (within double the tolerance distance)
            if (Phaser.Math.Distance.Between(pointer.x, pointer.y, startPoint.x, startPoint.y) < TOLERANCE * 2) {
                this.isTracing = true; // Start the tracing process

                // Clear any previous drawings
                this.drawGraphics.clear();
                this.drawGraphics.lineStyle(16, 0xffffff, 1);

                // Start a new line at the current pointer position
                this.drawGraphics.beginPath();
                this.drawGraphics.moveTo(pointer.x, pointer.y);

                // Reset accuracy trackers for a fresh attempt
                this.totalFrames = 0;
                this.goodFrames = 0;
                this.reachedEnd = false;
            }
        });

        // --- INPUT HANDLING: POINTER MOVE ---

        // As the user drags their finger or mouse across the screen
        this.input.on('pointermove', (pointer) => {
            // If they haven't properly started tracing, ignore the movement
            if (!this.isTracing) return;

            // Draw a line connecting the previous position to the new position
            this.drawGraphics.lineTo(pointer.x, pointer.y);
            this.drawGraphics.strokePath();

            // Calculate accuracy: Find how far the pointer is from the closest point on the guide path
            let minDistance = Number.MAX_VALUE;
            for (let i = 0; i < this.points.length; i++) {
                const p = this.points[i];
                // Calculate distance between current pointer and this specific point on the path
                const d = Phaser.Math.Distance.Between(pointer.x, pointer.y, p.x, p.y);
                if (d < minDistance) {
                    minDistance = d; // Keep track of the smallest distance found
                }
            }

            this.totalFrames++; // Increment total tracked movements

            // If the closest distance is within our acceptable TOLERANCE (40 pixels), count it as a "good" movement
            if (minDistance <= TOLERANCE) {
                this.goodFrames++;
            }

            // Check if the user has reached the end point (within double the tolerance distance)
            if (Phaser.Math.Distance.Between(pointer.x, pointer.y, endPoint.x, endPoint.y) < TOLERANCE * 2) {
                this.reachedEnd = true; // Mark as successfully reached
                this.finishLevel(); // Trigger the end level logic
            }
        });

        // --- INPUT HANDLING: POINTER UP ---

        // When the user lifts their finger or releases the mouse button
        this.input.on('pointerup', () => {
            // If they were tracing but lifted their finger before reaching the end
            if (this.isTracing && !this.reachedEnd) {
                this.isTracing = false; // Stop tracing
                // Failed to reach the end in one continuous motion, so clear the drawing so they can try again
                this.drawGraphics.clear();
            }
        });
    }

    finishLevel() {
        this.isTracing = false;
        this.input.off('pointerdown');
        this.input.off('pointermove');
        this.input.off('pointerup');

        let accuracy = 0;
        if (this.totalFrames > 0) {
            accuracy = this.goodFrames / this.totalFrames;
        }

        let stars = 1;
        if (accuracy >= 0.85) {
            stars = 3;
        } else if (accuracy >= 0.60) {
            stars = 2;
        }

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver', { stars: stars, levelIndex: this.levelIndex, maxLevels: LEVELS.length, sceneName: 'Lines' });
        });
    }
}
