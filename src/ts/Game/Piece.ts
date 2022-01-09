import { gameScene } from '../Scenes/GameScene'
import { PIECE_TYPES, PositionInPixel, PositionInTile } from '../game.interfaces';
import { convertPositionToTile, convertTileToPosition, getPieceTypeEnum, getPieceTypeNumber } from '../Utils/utils';
import { gameManager } from './GameManager';
import { map } from './Map';
import { game } from '../App';
export default class Piece extends Phaser.GameObjects.Sprite {
    public currentTile: PositionInTile;
    public currentPosition: PositionInPixel;
    private frameImg = null;
    public pieceType: PIECE_TYPES;
    public pieceTypeByLetter: string;

    constructor(typeByLetter: string, tilePos: PositionInPixel) {
        super(gameScene, tilePos.x, tilePos.y, 'pieces_spritesheet', getPieceTypeNumber(typeByLetter));
        this.pieceTypeByLetter = typeByLetter;
        this.pieceType = getPieceTypeEnum(typeByLetter);
        this.currentPosition = tilePos;
        this.currentTile = convertPositionToTile(this.currentPosition);
        gameScene.physics.add.existing(this);
        gameScene.physics.world.enable(this);
        gameScene.add.existing(this).setDepth(1).setOrigin(0.5, 0.5);
        this.setInteractive();

        this.on('pointerdown', () => this.isClicked());
    }

    private async isClicked() {
        if (!gameManager.isMoving) {
            const isAction = await gameManager.piecesMovement(this);
            if (!isAction) this.makeSelection();
        }
    }

    private makeSelection() {
        if (!gameManager.isPieceSelectedInFrame || this.frameImg === null) {
            this.frameImg = gameScene.add.image(this.currentPosition.x, this.currentPosition.y, 'selectedTile').setDepth(1).setOrigin(0.5, 0.5);
            gameManager.changeCurrentSelectedPiece(this);
        }
    }

    public async switch(chosenPiece: Piece) {
        await gameManager.makeTwoPieceAnimation(this, chosenPiece);

        const cTile = this.currentTile;
        this.updatePiecePositionAndTile(chosenPiece.currentTile);
        chosenPiece.updatePiecePositionAndTile(cTile);
    }

    updatePiecePositionAndTile = (tile: PositionInTile) => {
        this.currentTile = tile;
        this.currentPosition = convertTileToPosition(tile);
        map.setPieceOnTile(this, tile);
    };

    public clearFrame() {
        if (this.frameImg) {
            this.frameImg.destroy();
            this.frameImg = null;
        }
    }
}
