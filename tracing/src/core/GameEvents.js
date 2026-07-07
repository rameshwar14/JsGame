import Phaser from 'phaser';

class GameEvents extends Phaser.Events.EventEmitter {
    constructor() {
        super();
    }
}

// Export a singleton instance
export const gameEvents = new GameEvents();
