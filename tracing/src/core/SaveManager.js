export class SaveManager {
    static SAVE_KEY = 'linetracing_save_data';

    static load() {
        try {
            const data = localStorage.getItem(this.SAVE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('Failed to load save data', e);
        }
        // Default save data
        return {
            score: 0,
            unlockedLevels: { 'Lines': 1, 'Shapes': 1 }
        };
    }

    static save(data) {
        try {
            console.log("saving data", data);
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save data', e);
        }
    }

    static updateScore(addedScore) {
        console.log("adding score", addedScore);
        const data = this.load();
        data.score = (data.score || 0) + addedScore;
        this.save(data);
        return data.score;
    }
}
