import { Scene } from 'phaser';
import * as Phaser from 'phaser';

const getLevels = (w, h) => {
    const singleLine = new Phaser.Curves.Path(w * 0.1, h * 0.5);
    singleLine.lineTo(w * 0.9, h * 0.5);

    const verticalLine = new Phaser.Curves.Path(w * 0.5, h * 0.15);
    verticalLine.lineTo(w * 0.5, h * 0.85);

    const diagonalLineLeftDown = new Phaser.Curves.Path(w * 0.1, h * 0.15);
    diagonalLineLeftDown.lineTo(w * 0.9, h * 0.85);

    const diagonalLineRightDown = new Phaser.Curves.Path(w * 0.9, h * 0.15);
    diagonalLineRightDown.lineTo(w * 0.1, h * 0.85);

    const diagonalLineLeftUp = new Phaser.Curves.Path(w * 0.1, h * 0.85);
    diagonalLineLeftUp.lineTo(w * 0.9, h * 0.15);

    const twoLines = new Phaser.Curves.Path(w * 0.1, h * 0.65);
    twoLines.lineTo(w * 0.45, h * 0.3);
    twoLines.quadraticBezierTo(w * 0.5, h * 0.2, w * 0.55, h * 0.3);
    twoLines.lineTo(w * 0.9, h * 0.65);

    const multipleLines = new Phaser.Curves.Path(w * 0.1, h * 0.5);
    multipleLines.lineTo(w * 0.25, h * 0.25);
    multipleLines.quadraticBezierTo(w * 0.3, h * 0.15, w * 0.35, h * 0.25);
    multipleLines.lineTo(w * 0.45, h * 0.75);
    multipleLines.quadraticBezierTo(w * 0.5, h * 0.85, w * 0.55, h * 0.75);
    multipleLines.lineTo(w * 0.65, h * 0.25);
    multipleLines.quadraticBezierTo(w * 0.7, h * 0.15, w * 0.75, h * 0.25);
    multipleLines.lineTo(w * 0.9, h * 0.5);

    return [
        { name: 'Diagonal Line Right Down', color: 0x4f8ef7, path: diagonalLineRightDown },
        { name: 'Diagonal Line Left Up', color: 0x4f8ef7, path: diagonalLineLeftUp },
        { name: 'Single Line', color: 0x4f8ef7, path: singleLine },
        { name: 'Vertical Line', color: 0x4f8ef7, path: verticalLine },
        { name: 'Diagonal Line Left Down', color: 0x4f8ef7, path: diagonalLineLeftDown },
        { name: 'Two Lines', color: 0xa78bfa, path: twoLines },
        { name: 'Multiple Lines', color: 0xf59e0b, path: multipleLines }
    ];
};

export class Lines extends Scene {
    constructor() {
        super('Lines');
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
        const TOLERANCE = 40 * scale;
        this.TOLERANCE = TOLERANCE;

        // Change the background color to match the UI (light blue)
        this.cameras.main.setBackgroundColor('#badff2');

        const level = LEVELS[this.levelIndex];

        const textStyle = {
            fontFamily: 'Nunito',
            fontSize: Math.max(16, 38 * scale),
            color: '#ffffff',
            stroke: '#414344ff',
            strokeThickness: 1,
            shadow: { offsetX: 0, offsetY: 6, color: 'rgba(0, 0, 0, 0.25)', blur: 8, stroke: true, fill: true }
        };
        this.add.text(w / 2, h * 0.1, 'HELP THE TURTLE REACH HOME!', textStyle).setOrigin(0.5);

        // Draw the guide path with a golden style and soft outer glow
        this.guideGraphics = this.add.graphics();

        // Outer glow layers (thick with low opacity)
        this.guideGraphics.lineStyle(64 * scale, 0xffe066, 0.15);
        level.path.draw(this.guideGraphics);

        this.guideGraphics.lineStyle(46 * scale, 0xffe066, 0.3);
        level.path.draw(this.guideGraphics);

        this.guideGraphics.lineStyle(32 * scale, 0xf5b000, 0.7);
        level.path.draw(this.guideGraphics);

        // Inner core gold path
        this.guideGraphics.lineStyle(20 * scale, 0xffe066, 1);
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

        // Draw START platform (Green)
        // 1. Outermost Oval (Largest)
        this.guideGraphics.fillStyle(0x56b02a, 1); // Dark green outer
        this.guideGraphics.fillEllipse(startPoint.x, startPoint.y, 120 * scale, 80 * scale);

        // 2. Middle Oval (Nested inside the outer one)
        this.guideGraphics.fillStyle(0x8df65a, 1); // Bright green middle
        this.guideGraphics.fillEllipse(startPoint.x, startPoint.y, 90 * scale, 60 * scale);

        // 3. Innermost Oval (Smallest, nested inside the middle one)
        this.guideGraphics.fillStyle(0x56b02a, 1); // Dark green center
        this.guideGraphics.fillEllipse(startPoint.x, startPoint.y, 60 * scale, 40 * scale);
        // START Text
        this.add.text(startPoint.x, startPoint.y + (70 * scale), 'START', { fontFamily: 'Nunito', fontSize: Math.max(12, 24 * scale), color: '#006400' }).setOrigin(0.5);
        // Turtle Image with slow bounce
        const turtleIcon = this.add.image(startPoint.x, startPoint.y - (15 * scale), 'turtle').setScale(0.25 * scale).setOrigin(0.5);
        this.tweens.add({
            targets: turtleIcon,
            y: startPoint.y - (30 * scale), // Bounce up
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Draw END platform (Red)



        this.guideGraphics.fillStyle(0xd93838, 1); // Dark green outer
        this.guideGraphics.fillEllipse(endPoint.x, endPoint.y, 120 * scale, 80 * scale);

        // 2. Middle Oval (Nested inside the outer one)
        this.guideGraphics.fillStyle(0xff8888, 1); // Bright green middle
        this.guideGraphics.fillEllipse(endPoint.x, endPoint.y, 90 * scale, 60 * scale);

        // 3. Innermost Oval (Smallest, nested inside the middle one)
        this.guideGraphics.fillStyle(0xd93838, 1); // Dark green center
        this.guideGraphics.fillEllipse(endPoint.x, endPoint.y, 60 * scale, 40 * scale);

        // END Text
        this.add.text(endPoint.x, endPoint.y + (70 * scale), 'END', { fontFamily: 'Nunito', fontSize: Math.max(12, 24 * scale), color: '#8b0000' }).setOrigin(0.5);
        // Star Emoji with continuous rotation
        const starIcon = this.add.text(endPoint.x, endPoint.y - (10 * scale), '⭐', { fontSize: `${Math.max(16, 36 * scale)}px` }).setOrigin(0.5);
        this.tweens.add({
            targets: starIcon,
            angle: 360, // Rotate a full 360 degrees
            duration: 3000, // Takes 3 seconds for one full spin
            repeat: -1, // Repeat infinitely
            ease: 'Linear' // Smooth continuous speed
        });

        // --- START OF DRAWING SETUP ---

        // Create a separate graphics object for the user's drawing so it doesn't interfere with the guide path
        this.drawGraphics = this.add.graphics();
        // Set the user's drawing line to be white, with a thickness of 16
        this.drawGraphics.lineStyle(16 * scale, 0xffffff, 1);

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
                this.drawGraphics.lineStyle(16 * scale, 0xffffff, 1);

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
            if (Phaser.Math.Distance.Between(pointer.x, pointer.y, endPoint.x, endPoint.y) < TOLERANCE) {
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
            this.scene.start('GameOver', { stars: stars, levelIndex: this.levelIndex, maxLevels: this.LEVELS.length, sceneName: 'Lines' });
        });
    }
}
