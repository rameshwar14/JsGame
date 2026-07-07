import { Boot } from './scenes/Boot';
import { GameScene } from './scenes/GameScene';
import { Game } from 'phaser';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Menu } from './scenes/Menu';
import { Preloader } from './scenes/Preloader';
import * as Phaser from 'phaser';

//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#028af8',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        orientation: Phaser.Scale.LANDSCAPE
    },

    resolution: window.devicePixelRatio,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }
        }
    },

    scene: [
        Boot,
        Preloader,
        MainMenu,
        Menu,
        GameScene,
        GameOver
    ]
};

export default new Game(config);
