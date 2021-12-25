import 'phaser';

export default class MenuScene extends Phaser.Scene {
    //private playerCarsGroup: Phaser.GameObjects.Group;

    constructor() {
        super('MenuScene')
    }

    preload() {
        this.load.image('background', 'assets/background.jpeg');

        //this.menuGameOver = this.add.group();
    }

    create() {
        this.add.image(0, 0, 'background').setDepth(1).setOrigin(0, 0);

        this.input.on('pointerup', function (pointer) {

            this.scene.start('GameScene');

        }, this);

        return 3
    }
}