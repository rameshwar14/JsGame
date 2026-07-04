import { Scene } from 'phaser';
import * as Phaser from 'phaser';

const getLevels = (w, h) => {
    const minX = w * 0.25;
    const maxX = w * 0.75;
    const minY = h * 0.30;
    const maxY = h * 0.80;
    const midX = w * 0.5;
    const midY = (minY + maxY) / 2;

    const singleLine = new Phaser.Curves.Path(minX, midY);
    singleLine.lineTo(maxX, midY);

    const verticalLine = new Phaser.Curves.Path(midX, minY);
    verticalLine.lineTo(midX, maxY);

    const diagonalLineLeftDown = new Phaser.Curves.Path(minX, minY);
    diagonalLineLeftDown.lineTo(maxX, maxY);

    const diagonalLineRightDown = new Phaser.Curves.Path(maxX, minY);
    diagonalLineRightDown.lineTo(minX, maxY);

    const diagonalLineLeftUp = new Phaser.Curves.Path(minX, maxY);
    diagonalLineLeftUp.lineTo(maxX, minY);

    const twoLines = new Phaser.Curves.Path(minX, maxY);
    twoLines.lineTo(midX, minY + (h * 0.05));
    twoLines.lineTo(maxX, maxY);

    const curveLine = new Phaser.Curves.Path(minX, midY);
    curveLine.quadraticBezierTo(maxX, midY, midX, minY - (h * 0.1));

    const multipleLines = new Phaser.Curves.Path(minX, midY);
    multipleLines.lineTo(w * 0.25, minY);
    multipleLines.lineTo(w * 0.45, maxY);
    multipleLines.lineTo(w * 0.65, minY);
    multipleLines.lineTo(maxX, midY);

    return [
        //ingle Line
        { name: 'Diagonal Line Right Down', color: 0x4f8ef7, path: diagonalLineRightDown },
        { name: 'Diagonal Line Left Up', color: 0x4f8ef7, path: diagonalLineLeftUp },
        { name: 'Single Line', color: 0x4f8ef7, path: singleLine },
        { name: 'Vertical Line', color: 0x4f8ef7, path: verticalLine },
        { name: 'Diagonal Line Left Down', color: 0x4f8ef7, path: diagonalLineLeftDown },
        { name: 'Two Lines', color: 0xa78bfa, path: twoLines },
        { name: 'Curve Line', color: 0xec4899, path: curveLine },
        { name: 'Multiple Lines', color: 0xf59e0b, path: multipleLines }
    ];
};

export class Lines extends Scene {
    constructor() {
        super('Lines');
    }

    init(data) {
        this.levelIndex = data.levelIndex || 0;
        this.score = data.score || 0;
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
        // Position title outside the play area at the top
        this.add.text(w / 2, h * 0.06, 'HELP THE TURTLE REACH HOME!', textStyle).setOrigin(0.5);

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
        this.guideGraphics.fillStyle(0x56b02a, 0.3); // Dark green outer
        this.guideGraphics.fillEllipse(startPoint.x, startPoint.y, 120 * scale, 80 * scale);

        // 2. Middle Oval (Nested inside the outer one)
        this.guideGraphics.fillStyle(0x56b02a, 0.6); // Bright green middle
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

        // --- CLOSE BUTTON ---
        const closeBtnStyle = { fontFamily: 'Nunito', fontSize: Math.max(24, 38 * scale), color: '#ffffff', stroke: '#000000', strokeThickness: 4, shadow: { offsetX: 0, offsetY: 4, color: 'rgba(0, 0, 0, 0.25)', blur: 4, stroke: true, fill: true } };
        const closeBtn = this.add.text(w * 0.05, h * 0.06, '✖', closeBtnStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('Menu');
            });

        // --- SCORE UI ---
        const scoreContainer = this.add.container(w * 0.90, h * 0.06);
        const scoreIcon = this.add.image(0, 0, 'shell').setScale(0.6 * scale);
        const scoreStyle = { fontFamily: 'Nunito', fontSize: Math.max(20, 32 * scale), color: '#ffffff', stroke: '#2e6b12', strokeThickness: 4, shadow: { offsetX: 0, offsetY: 4, color: 'rgba(0, 0, 0, 0.25)', blur: 4, stroke: true, fill: true } };
        const scoreText = this.add.text(35 * scale, 0, this.score.toString(), scoreStyle).setOrigin(0, 0.5);
        this.scoreText = scoreText;
        scoreContainer.add([scoreIcon, scoreText]);


        this.guideGraphics.fillStyle(0xffffff, 0.3); // Dark green outer
        this.guideGraphics.fillEllipse(endPoint.x, endPoint.y, 120 * scale, 80 * scale);

        // 2. Middle Oval (Nested inside the outer one)
        this.guideGraphics.fillStyle(0xffffff, 0.5); // Bright green middle
        this.guideGraphics.fillEllipse(endPoint.x, endPoint.y, 90 * scale, 60 * scale);

        // 3. Innermost Oval (Smallest, nested inside the middle one)
        this.guideGraphics.fillStyle(0xffffff, 1); // Dark green center
        this.guideGraphics.fillEllipse(endPoint.x, endPoint.y, 60 * scale, 40 * scale);

        // END Text
        this.add.text(endPoint.x, endPoint.y + (70 * scale), 'Home', { fontFamily: 'Nunito', fontSize: Math.max(12, 24 * scale), color: '#8b0000' }).setOrigin(0.5);
        const homeIcon = this.add.image(endPoint.x, endPoint.y - (15 * scale), 'home').setScale(0.5 * scale).setOrigin(0.5);
        // Star Emoji with continuous rotation
        // const starIcon = this.add.text(endPoint.x, endPoint.y - (10 * scale), '⭐', { fontSize: `${Math.max(16, 36 * scale)}px` }).setOrigin(0.5);
        // this.tweens.add({
        //     targets: homeIcon,
        //     y: endPoint.y - (30 * scale), // Bounce up
        //     duration: 1200,
        //     yoyo: true,
        //     repeat: -1,
        //     ease: 'Sine.easeInOut'
        // });

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
                this.maxPointReached = 0;
                this.isClosedShape = Phaser.Math.Distance.Between(startPoint.x, startPoint.y, endPoint.x, endPoint.y) < 10;
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
            let closestIndex = 0;
            for (let i = 0; i < this.points.length; i++) {
                const p = this.points[i];
                // Calculate distance between current pointer and this specific point on the path
                const d = Phaser.Math.Distance.Between(pointer.x, pointer.y, p.x, p.y);
                if (d < minDistance) {
                    minDistance = d; // Keep track of the smallest distance found
                    closestIndex = i;
                }
            }

            if (closestIndex > (this.maxPointReached || 0)) {
                this.maxPointReached = closestIndex;
            }

            this.totalFrames++; // Increment total tracked movements

            // If the closest distance is within our acceptable TOLERANCE (40 pixels), count it as a "good" movement
            if (minDistance <= TOLERANCE) {
                this.goodFrames++;
            }

            // Check if the user has reached the end point (within double the tolerance distance)
            // For closed shapes, ensure they have traced at least 80% of the path to prevent instant completion
            const canComplete = !this.isClosedShape || this.maxPointReached > this.points.length * 0.8;

            if (canComplete && Phaser.Math.Distance.Between(pointer.x, pointer.y, endPoint.x, endPoint.y) < TOLERANCE) {
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
        let earnedLettuce = 2;
        if (accuracy >= 0.85) {
            stars = 3;
            earnedLettuce = 10;
        } else if (accuracy >= 0.60) {
            stars = 2;
            earnedLettuce = 5;
        }

        this.score += earnedLettuce;
        if (this.scoreText) {
            this.scoreText.setText(this.score.toString());
        }

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver', {
                stars: stars,
                levelIndex: this.levelIndex,
                maxLevels: this.LEVELS.length,
                sceneName: 'Lines',
                score: this.score
            });
        });
    }
}
