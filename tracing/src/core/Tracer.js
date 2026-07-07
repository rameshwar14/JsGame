import Phaser from 'phaser';
import { gameEvents } from './GameEvents';

export class Tracer {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        
        this.path = config.path;
        this.isClosedShape = config.isClosedShape || false;
        this.tolerance = config.tolerance;
        
        const w = scene.scale.width;
        const h = scene.scale.height;
        this.scale = Math.min(w / 1024, h / 768);
        
        // High resolution points for accurate collision detection
        this.points = this.path.getPoints(this.isClosedShape ? 600 : 200);
        
        this.startPoint = this.path.getStartPoint();
        this.endPoint = this.path.getEndPoint();
        
        this.drawGraphics = this.scene.add.graphics();
        this.drawGraphics.setDepth(20);
        
        this.isTracing = false;
        this.totalFrames = 0;
        this.goodFrames = 0;
        this.reachedEnd = false;
        this.maxPointReached = 0;
        
        // Optional array of corner stars to collect
        this.cornerStars = config.cornerStars || [];
        
        this.setupInput();
    }
    
    setupInput() {
        this.onPointerDown = this.handlePointerDown.bind(this);
        this.onPointerMove = this.handlePointerMove.bind(this);
        this.onPointerUp = this.handlePointerUp.bind(this);

        this.scene.input.on('pointerdown', this.onPointerDown);
        this.scene.input.on('pointermove', this.onPointerMove);
        this.scene.input.on('pointerup', this.onPointerUp);
    }
    
    handlePointerDown(pointer) {
        if (Phaser.Math.Distance.Between(pointer.x, pointer.y, this.startPoint.x, this.startPoint.y) < this.tolerance * 2) {
            this.isTracing = true;

            this.drawGraphics.clear();
            this.drawGraphics.lineStyle(16 * this.scale, 0xffffff, 1);
            this.drawGraphics.beginPath();
            this.drawGraphics.moveTo(pointer.x, pointer.y);

            this.totalFrames = 0;
            this.goodFrames = 0;
            this.reachedEnd = false;
            this.maxPointReached = 0;
            
            // Stars are handled by the scene and destroyed when collected.
            // We should not reset their collected status, otherwise invisible stars can be collected again on retry.
        }
    }
    
    handlePointerMove(pointer) {
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

        if (this.isClosedShape) {
            if (closestIndex > this.maxPointReached) {
                // Prevent jumping backwards across the start/end seam of a closed shape
                if (closestIndex - this.maxPointReached < this.points.length * 0.5) {
                    this.maxPointReached = closestIndex;
                } else {
                    // User traced backwards across the seam
                    this.failTrace();
                    return;
                }
            } else if (closestIndex < this.maxPointReached) {
                // User traced backwards along the path
                if (this.maxPointReached - closestIndex > 20) {
                    this.failTrace();
                    return;
                }
            }
        } else {
            if (closestIndex > (this.maxPointReached || 0)) {
                this.maxPointReached = closestIndex;
            }
        }

        this.totalFrames++;

        if (minDistance <= this.tolerance) {
            this.goodFrames++;
        }

        // Check for star collection
        if (this.cornerStars) {
            this.cornerStars.forEach(starData => {
                if (!starData.isCollected) {
                    const distToStar = Phaser.Math.Distance.Between(pointer.x, pointer.y, starData.x, starData.y);
                    if (distToStar < this.tolerance * 3) {
                        starData.isCollected = true;
                        gameEvents.emit('reward_collected', starData);
                    }
                }
            });
        }

        const canComplete = !this.isClosedShape || this.maxPointReached > this.points.length * 0.8;
        if (canComplete && Phaser.Math.Distance.Between(pointer.x, pointer.y, this.endPoint.x, this.endPoint.y) < this.tolerance) {
            this.reachedEnd = true;
            this.finishTrace();
        }
    }
    
    handlePointerUp() {
        if (this.isTracing && !this.reachedEnd) {
            this.failTrace();
        }
    }
    
    failTrace() {
        this.isTracing = false;
        this.drawGraphics.clear();
    }
    
    finishTrace() {
        this.isTracing = false;
        this.scene.input.off('pointerdown', this.onPointerDown);
        this.scene.input.off('pointermove', this.onPointerMove);
        this.scene.input.off('pointerup', this.onPointerUp);

        let accuracy = 0;
        if (this.totalFrames > 0) {
            accuracy = this.goodFrames / this.totalFrames;
        }

        gameEvents.emit('trace_complete', accuracy);
    }

    destroy() {
        this.scene.input.off('pointerdown', this.onPointerDown);
        this.scene.input.off('pointermove', this.onPointerMove);
        this.scene.input.off('pointerup', this.onPointerUp);
        if (this.drawGraphics) {
            this.drawGraphics.destroy();
        }
    }
}
