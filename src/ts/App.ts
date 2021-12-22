import 'phaser';

export class GameScene extends Phaser.Scene {
    //private playerCarsGroup: Phaser.GameObjects.Group;

    constructor() {
        super('GameScene')
    }

    preload() {
        //this.load.image('background_overlay', 'assets/background_overlay2.png');
        
        // this.load.spritesheet('cars_sheet', 'assets/cars_sheet.png', {
        //     frameWidth: gv.CAR.WIDTH,
        //     frameHeight: gv.CAR.HEIGHT
        // });

        //this.menuGameOver = this.add.group();
    }

    create() {
        return 3
    }

    startGame() {
       
    }

    update() {
       
    }
}

export const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1920,
        backgroundColor: '#000000'
    },
    physics: {
        default: 'arcade',
        arcade: {
        //debug: true,
        }
    },
    scene: [GameScene]
};

export const game = new Phaser.Game(config);
