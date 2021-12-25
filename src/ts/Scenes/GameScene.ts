import 'phaser';
import { INITIAL_BOARD_SCREEN, TILE } from '../Utils/gameValues';
import GameManager, { gameManager } from '../Game/GameManager';

export let gameScene: Phaser.Scene;

export default class GameScene extends Phaser.Scene {
    //private playerCarsGroup: Phaser.GameObjects.Group;

    constructor() {
        super('GameScene');
        gameScene = this;
    }
    preload() {
        this.load.image('background1', 'assets/background1.jpeg');
        this.load.image('backgroundBoard', 'assets/background_board.png');
        this.load.image('selectedTile', 'assets/selectedTile.png');
        
        this.load.spritesheet('pieces_spritesheet', 'assets/pieces.png', {
            frameWidth: TILE.WIDTH,
            frameHeight: TILE.HEIGHT
        });

        //this.menuGameOver = this.add.group();
    }

    create() {
        this.add.image(0, 0, 'background1').setDepth(1).setOrigin(0, 0);
        this.add.image(INITIAL_BOARD_SCREEN.WIDTH, INITIAL_BOARD_SCREEN.HEIGHT, 'backgroundBoard').setDepth(1).setOrigin(0, 0);
        new GameManager();
    }

    startGame() {
       
    }

    update() {
       
    }
}