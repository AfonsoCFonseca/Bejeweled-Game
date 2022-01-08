import 'phaser';
import { INITIAL_BOARD_SCREEN, TILE } from '../Utils/gameValues';
import GameManager, { gameManager } from '../Game/GameManager';

export let gameScene: Phaser.Scene;
export let scoreText, levelText;
export let levelBarImg: Phaser.GameObjects.Image;

export default class GameScene extends Phaser.Scene {
    //private playerCarsGroup: Phaser.GameObjects.Group;

    constructor() {
        super('GameScene');
        gameScene = this;
    }
    preload() {
        this.load.image('background1', 'assets/background1.jpeg');
        this.load.image('backgroundBoard', 'assets/background_board.png');
        this.load.image('Border', 'assets/Border.png');
        this.load.image('selectedTile', 'assets/selectedTile.png');
        this.load.image('ScoreBoard', 'assets/ScoreBoard.png');
        this.load.image('ScoreBorder', 'assets/ScoreBorder.png');
        this.load.image('LevelBarBackground', 'assets/levelBarBackground.png');
        this.load.image('LevelBar', 'assets/levelbar.jpg');
        this.load.image('ButtonReset', 'assets/buttonReset.png');
        this.load.image('ButtonMenu', 'assets/buttonMenu.png');
        this.load.image('RestartButton', 'assets/restartBtn.png');
        this.load.image('ScoreMenu', 'assets/scoreMenu.jpg');

        this.load.audio('bubble1', 'assets/bubble_single_1.mp3');
        this.load.audio('bubble2', 'assets/bubble_single_2.mp3');
        this.load.audio('bubble3', 'assets/bubble_single_3.mp3');
        this.load.audio('levelUpSound', 'assets/levelUpSound.mp3');
        
        this.load.spritesheet('pieces_spritesheet', 'assets/pieces.png', {
            frameWidth: TILE.WIDTH,
            frameHeight: TILE.HEIGHT
        });

        //this.menuGameOver = this.add.group();
    }

    create() {
        this.add.image(0, 0, 'background1').setDepth(0).setOrigin(0, 0);
        this.add.image(INITIAL_BOARD_SCREEN.WIDTH + 120, 1330 + 100, 'LevelBarBackground').setDepth(1).setOrigin(0, 0);
        levelBarImg = this.add.image(INITIAL_BOARD_SCREEN.WIDTH + 125, 1330 + 105, 'LevelBar').setDepth(1).setOrigin(0, 0);
        this.add.image(INITIAL_BOARD_SCREEN.WIDTH - TILE.WIDTH / 2, INITIAL_BOARD_SCREEN.HEIGHT - TILE.HEIGHT / 2, 'backgroundBoard').setDepth(1).setOrigin(0, 0);
        this.add.image(INITIAL_BOARD_SCREEN.WIDTH - TILE.WIDTH / 2 - 20, INITIAL_BOARD_SCREEN.HEIGHT - TILE.HEIGHT / 2 - 20, 'Border').setDepth(1).setOrigin(0, 0);
        this.add.image(170, INITIAL_BOARD_SCREEN.HEIGHT - TILE.HEIGHT / 2 - 20, 'ScoreBoard').setDepth(1).setOrigin(0, 0);
        this.add.image(170 - 20, INITIAL_BOARD_SCREEN.HEIGHT - TILE.HEIGHT / 2 - 20, 'ScoreBorder').setDepth(1).setOrigin(0, 0);

        const buttonReset = this.add.image(190, INITIAL_BOARD_SCREEN.HEIGHT + 120 ,'ButtonReset').setDepth(1).setOrigin(0, 0);
        buttonReset.setInteractive({ useHandCursor: true });
        buttonReset.on('pointerup', () => gameManager.reset());

        const buttonMenu = this.add.image(190, INITIAL_BOARD_SCREEN.HEIGHT + 220 ,'ButtonMenu').setDepth(1).setOrigin(0, 0);
        buttonMenu.setInteractive({ useHandCursor: true });
        buttonMenu.on('pointerup', () => this.scene.start('MenuScene'));

        scoreText = this.add.text(190, INITIAL_BOARD_SCREEN.HEIGHT + 30, 'Score: 0', { font: 'bold 53px Geneva' }).setDepth(1);
        levelText = this.add.text(190, INITIAL_BOARD_SCREEN.HEIGHT - 60, 'Level: 1', { font: 'bold 53px Geneva' }).setDepth(1);

        new GameManager();
    }
}
