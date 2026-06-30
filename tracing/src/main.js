import { Boot } from './scenes/Boot';
import { Lines } from './scenes/Lines';
import { Game } from 'phaser';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Menu } from './scenes/Menu';
import { Preloader } from './scenes/Preloader';
import * as Phaser from 'phaser';

//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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
        Lines,
        GameOver
    ]
};

export default new Game(config);
