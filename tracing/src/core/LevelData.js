import Phaser from 'phaser';

export class LevelData {
    static getLinesLevels(w, h) {
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

        const multipleLines = new Phaser.Curves.Path(minX, midY);
        multipleLines.lineTo(w * 0.25, minY);
        multipleLines.lineTo(w * 0.45, maxY);
        multipleLines.lineTo(w * 0.65, minY);
        multipleLines.lineTo(maxX, midY);

        const curveLine = new Phaser.Curves.Path(minX, midY);
        curveLine.quadraticBezierTo(maxX, midY, midX, minY - (h * 0.1));

        const curve1 = new Phaser.Curves.Path(minX, midY);
        curve1.quadraticBezierTo(maxX, midY, midX, minY - (h * 0.25));
        const curve2 = new Phaser.Curves.Path(minX, midY);
        curve2.quadraticBezierTo(maxX, midY, midX, maxY + (h * 0.25));
        const curve4 = new Phaser.Curves.Path(minX, midY);
        curve4.quadraticBezierTo(maxX, midY, minX + (w * 0.25), minY - (h * 0.2));
        const curve5 = new Phaser.Curves.Path(minX, midY);
        curve5.quadraticBezierTo(maxX, midY, maxX - (w * 0.25), minY - (h * 0.2));
        const sCurve = new Phaser.Curves.Path(minX, midY);
        sCurve.cubicBezierTo(minX + (w * 0.3), minY, maxX - (w * 0.3), maxY, maxX, midY);
        const reverseSCurve = new Phaser.Curves.Path(minX, midY);
        reverseSCurve.cubicBezierTo(minX + (w * 0.3), maxY, maxX - (w * 0.3), minY, maxX, midY);

        return [
            { name: 'Diagonal Line Right Down', color: 0x4f8ef7, path: diagonalLineRightDown, isClosedShape: false },
            { name: 'Diagonal Line Left Up', color: 0x4f8ef7, path: diagonalLineLeftUp, isClosedShape: false },
            { name: 'Single Line', color: 0x4f8ef7, path: singleLine, isClosedShape: false },
            { name: 'Vertical Line', color: 0x4f8ef7, path: verticalLine, isClosedShape: false },
            { name: 'Diagonal Line Left Down', color: 0x4f8ef7, path: diagonalLineLeftDown, isClosedShape: false },
            { name: 'Two Lines', color: 0xa78bfa, path: twoLines, isClosedShape: false },
            { name: 'Multiple Lines', color: 0xf59e0b, path: multipleLines, isClosedShape: false },
            { name: 'Curve Line', color: 0xec4899, path: curveLine, isClosedShape: false },
            { name: 'Curve 1', color: 0xec4899, path: curve1, isClosedShape: false },
            { name: 'Curve 2', color: 0xec4899, path: curve2, isClosedShape: false },
            { name: 'Curve 4', color: 0xec4899, path: curve4, isClosedShape: false },
            { name: 'Curve 5', color: 0xec4899, path: curve5, isClosedShape: false },
            { name: 'S Curve', color: 0xec4899, path: sCurve, isClosedShape: false },
            { name: 'Reverse S Curve', color: 0xec4899, path: reverseSCurve, isClosedShape: false }
        ];
    }

    static getShapesLevels(w, h) {
        const cx = w * 0.5;
        const cy = (h * 0.30 + h * 0.80) / 2;
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

        return [
            { name: 'Triangle', color: 0xef4444, path: triangle, isClosedShape: true, message: 'Collect the lettuce!' },
            { name: 'Square', color: 0x3b82f6, path: square, isClosedShape: true, message: 'Collect the lettuce!' },
            { name: 'Rectangle', color: 0x10b981, path: rectangle, isClosedShape: true, message: 'Collect the lettuce!' },
            { name: 'Pentagon', color: 0xf59e0b, path: pentagon, isClosedShape: true, message: 'Collect the lettuce!' },
            { name: 'Hexagon', color: 0x8b5cf6, path: hexagon, isClosedShape: true, message: 'Collect the lettuce!' },
            { name: 'Heptagon', color: 0xec4899, path: heptagon, isClosedShape: true, message: 'Collect the lettuce!' },
            { name: 'Octagon', color: 0x06b6d4, path: octagon, isClosedShape: true, message: 'Collect the lettuce!' }
        ];
    }

    static getLevel(category, index, w, h) {
        const levels = category === 'Lines' ? this.getLinesLevels(w, h) : this.getShapesLevels(w, h);
        if (index >= 0 && index < levels.length) {
            return levels[index];
        }
        return null;
    }

    static getCategoryCount(category) {
        return category === 'Lines' ? 14 : 7;
    }
}
