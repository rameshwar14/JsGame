import { gameEvents } from './GameEvents';

export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        
        // Setup event listeners if needed in the future
        // gameEvents.on('level_complete', () => this.play('success'));
    }

    play(key) {
        // If there is no key or the sound hasn't been loaded, return early
        if (!key || !this.scene.cache.audio.exists(key)) return;

        if (!this.sounds[key]) {
            this.sounds[key] = this.scene.sound.add(key);
        }
        this.sounds[key].play();
    }
}
