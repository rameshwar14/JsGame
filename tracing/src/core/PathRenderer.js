export class PathRenderer {
    constructor(scene, config) {
        this.scene = scene;
        this.w = scene.scale.width;
        this.h = scene.scale.height;
        this.scale = Math.min(this.w / 1024, this.h / 768);
        
        this.config = config;
        this.path = config.path;
        this.isClosedShape = config.isClosedShape || false;
        
        // Draw layers
        this.bgGraphics = this.scene.add.graphics();
        this.guideGraphics = this.scene.add.graphics();
        
        this.render();
    }
    
    render() {
        this.drawPlayArea();
        this.drawPathGlow();
        
        if (this.isClosedShape) {
            this.drawShapePoints();
            this.drawShapeHome();
        } else {
            this.drawStartEndPlatforms();
        }
    }
    
    drawPlayArea() {
        this.scene.cameras.main.setBackgroundColor('#badff2');
        
        this.bgGraphics.lineStyle(6 * this.scale, 0xffffff, 1);
        this.bgGraphics.fillStyle(0xffffff, 0.2);

        const playAreaY = this.h * 0.12;
        const playAreaHeight = this.h * 0.84;
        this.bgGraphics.fillRoundedRect(this.w * 0.1, playAreaY, this.w * 0.8, playAreaHeight, 20 * this.scale);
        this.bgGraphics.strokeRoundedRect(this.w * 0.1, playAreaY, this.w * 0.8, playAreaHeight, 20 * this.scale);
    }
    
    drawPathGlow() {
        if (!this.isClosedShape) {
            // Golden style for lines
            this.guideGraphics.lineStyle(64 * this.scale, 0xffe066, 0.15);
            this.path.draw(this.guideGraphics);
            this.guideGraphics.lineStyle(46 * this.scale, 0xffe066, 0.3);
            this.path.draw(this.guideGraphics);
            this.guideGraphics.lineStyle(32 * this.scale, 0xf5b000, 0.7);
            this.path.draw(this.guideGraphics);
            this.guideGraphics.lineStyle(20 * this.scale, 0xffe066, 1);
            this.path.draw(this.guideGraphics);
        } else {
            // Shapes styling (just dots and tolerance path)
            this.guideGraphics.lineStyle(this.config.tolerance * 2, 0x00ffff, 0.05);
            this.guideGraphics.strokePath(this.path);
        }
    }
    
    drawStartEndPlatforms() {
        const points = this.path.getSpacedPoints(200);
        const startPoint = points[0];
        const endPoint = points[points.length - 1];

        // START
        this.guideGraphics.fillStyle(0x56b02a, 0.3);
        this.guideGraphics.fillEllipse(startPoint.x, startPoint.y, 120 * this.scale, 80 * this.scale);
        this.guideGraphics.fillStyle(0x56b02a, 0.6);
        this.guideGraphics.fillEllipse(startPoint.x, startPoint.y, 90 * this.scale, 60 * this.scale);
        this.guideGraphics.fillStyle(0x56b02a, 1);
        this.guideGraphics.fillEllipse(startPoint.x, startPoint.y, 60 * this.scale, 40 * this.scale);
        
        this.scene.add.text(startPoint.x, startPoint.y + (70 * this.scale), 'START', { fontFamily: 'Nunito', fontSize: Math.max(12, 24 * this.scale), color: '#006400' }).setOrigin(0.5);
        
        const turtleIcon = this.scene.add.image(startPoint.x, startPoint.y - (15 * this.scale), 'turtle').setScale(0.25 * this.scale).setOrigin(0.5);
        this.scene.tweens.add({
            targets: turtleIcon,
            y: startPoint.y - (30 * this.scale),
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // END
        this.guideGraphics.fillStyle(0xffffff, 0.3);
        this.guideGraphics.fillEllipse(endPoint.x, endPoint.y, 120 * this.scale, 80 * this.scale);
        this.guideGraphics.fillStyle(0xffffff, 0.5);
        this.guideGraphics.fillEllipse(endPoint.x, endPoint.y, 90 * this.scale, 60 * this.scale);
        this.guideGraphics.fillStyle(0xffffff, 1);
        this.guideGraphics.fillEllipse(endPoint.x, endPoint.y, 60 * this.scale, 40 * this.scale);
        
        this.scene.add.text(endPoint.x, endPoint.y + (70 * this.scale), 'Home', { fontFamily: 'Nunito', fontSize: Math.max(12, 24 * this.scale), color: '#8b0000' }).setOrigin(0.5);
        const homeIcon = this.scene.add.image(endPoint.x, endPoint.y - (15 * this.scale), 'home').setScale(0.5 * this.scale).setOrigin(0.5);
    }
    
    drawShapePoints() {
        this.pointsGraphics = this.scene.add.graphics();
        this.pointsGraphics.fillStyle(0xA9C4CF, 0.8);
        const visualPoints = this.path.getSpacedPoints(60);
        visualPoints.forEach(p => {
            this.pointsGraphics.fillCircle(p.x, p.y, Math.max(3, 6 * this.scale));
        });
    }
    
    drawShapeHome() {
        const endPoint = this.path.getEndPoint();
        const home = this.scene.add.graphics();
        home.fillStyle(0x10b981, 0.5);
        home.fillCircle(endPoint.x, endPoint.y, Math.max(10, 15 * this.scale));
        home.lineStyle(2, 0xffffff, 1);
        home.strokeCircle(endPoint.x, endPoint.y, Math.max(10, 15 * this.scale));
    }
    
    createCornerStars() {
        const stars = [];
        this.path.curves.forEach((curve) => {
            const p = curve.p0;
            const star = this.scene.add.image(p.x, p.y, 'lettuce').setScale(0.5 * this.scale).setOrigin(0.5).setDepth(10);
            stars.push({
                object: star,
                isCollected: false,
                x: p.x,
                y: p.y
            });
        });
        return stars;
    }
    
    clear() {
        this.bgGraphics.clear();
        this.guideGraphics.clear();
        if (this.pointsGraphics) this.pointsGraphics.clear();
    }
}
