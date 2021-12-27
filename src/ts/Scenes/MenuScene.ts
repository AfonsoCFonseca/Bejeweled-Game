import 'phaser';
import { BACKGROUND, HALF_SCREEN } from '../Utils/gameValues';

export default class MenuScene extends Phaser.Scene {
    //private playerCarsGroup: Phaser.GameObjects.Group;

    constructor() {
        super('MenuScene')
    }

    preload() {
        this.load.image('background', 'assets/background.jpeg');
        this.load.image('logo', 'assets/Bejeweled_title.png');

        //this.menuGameOver = this.add.group();
    }

    create() {
        this.add.image(0, 0, 'background').setDepth(1).setOrigin(0, 0);
        this.add.image(HALF_SCREEN.WIDTH - 640, 150, 'logo').setDepth(1).setOrigin(0, 0);

        this.add.text(100, 100, 'Press any key to start').setDepth(1);

        this.input.on('pointerup', function (pointer) {

            this.scene.start('GameScene');

        }, this);

        return 3
    }
}