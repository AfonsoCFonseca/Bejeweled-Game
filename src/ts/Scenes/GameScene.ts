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
        this.load.image('Border', 'assets/background_board_1.png');
        this.load.image('selectedTile', 'assets/selectedTile.png');
        this.load.image('ScoreBoard', 'assets/ScoreBoard.png');
        this.load.image('ScoreBorder', 'assets/ScoreBorder.png');
        
        this.load.spritesheet('pieces_spritesheet', 'assets/pieces.png', {
            frameWidth: TILE.WIDTH,
            frameHeight: TILE.HEIGHT
        });

        //this.menuGameOver = this.add.group();
    }

    create() {
        this.add.image(0, 0, 'background1').setDepth(1).setOrigin(0, 0);
        this.add.image(INITIAL_BOARD_SCREEN.WIDTH - TILE.WIDTH / 2, INITIAL_BOARD_SCREEN.HEIGHT - TILE.HEIGHT / 2, 'backgroundBoard').setDepth(1).setOrigin(0, 0);
        this.add.image(INITIAL_BOARD_SCREEN.WIDTH - TILE.WIDTH / 2 - 20, INITIAL_BOARD_SCREEN.HEIGHT - TILE.HEIGHT / 2 -20, 'Border').setDepth(1).setOrigin(0, 0);
        this.add.image(170, INITIAL_BOARD_SCREEN.HEIGHT - TILE.HEIGHT / 2 - 20, 'ScoreBoard').setDepth(1).setOrigin(0, 0);
        this.add.image(170 - 20, INITIAL_BOARD_SCREEN.HEIGHT - TILE.HEIGHT / 2 - 20, 'ScoreBorder').setDepth(1).setOrigin(0, 0);
        this.add.text(190, INITIAL_BOARD_SCREEN.HEIGHT, "Score: 2500", { font: 'bold 53px Geneva' }).setDepth(1);
        new GameManager();
    }

    startGame() {
       
    }

    update() {
       
    }
}