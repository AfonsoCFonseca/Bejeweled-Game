import { gameScene } from '../Scenes/GameScene'
import { PositionInPixel, PositionInTile } from '../game.interfaces';
import { convertToPositionInTile } from '../Utils/utils';
import { gameManager } from './GameManager';
import { map } from './Map';
import { game } from '../App';
export default class Piece extends Phaser.GameObjects.Sprite {
    private currentTile: PositionInTile;
    private currentPosition: PositionInPixel;
    private frameImg = null;

    constructor(typeNumber: number, tilePos: PositionInPixel) {
        super(gameScene, tilePos.x, tilePos.y, 'pieces_spritesheet', typeNumber);
        this.currentPosition = tilePos;
        this.currentTile = convertToPositionInTile(this.currentPosition);
        gameScene.physics.add.existing(this);
        gameScene.physics.world.enable(this);
        gameScene.add.existing(this).setDepth(1).setOrigin(0, 0);
        this.setInteractive();

        this.on('pointerdown', () => this.isClicked());
    }

    private isClicked() {
        const isAction = this.makeAction();
        if (!isAction) this.makeSelection();
    }

    private makeAction(): boolean {
        if (gameManager.isPieceSelectedInFrame && map.isPieceAdjacent(this)) {
            gameManager.clearPreviousSelectedPiece();
            return true;
        }
        return false;
    }

    private makeSelection() {
        if (!gameManager.isPieceSelectedInFrame && this.frameImg === null) {
            this.frameImg = gameScene.add.image(this.currentPosition.x, this.currentPosition.y, 'selectedTile').setDepth(1).setOrigin(0, 0);
            gameManager.changeCurrentSelectedPiece(this);
        }
    }

    public clearFrame() {
        this.frameImg.destroy();
        this.frameImg = null;
    }

    public tile() {
        return {
            currentTile: this.currentTile,
            currentPosition: this.currentPosition
        }
    }
}
