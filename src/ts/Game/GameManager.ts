import Piece from './Piece'
import Map, { map } from './Map'
import { convertTileToPosition, isNumberInsideBoard, makeMovementAnimation, makeScaleAnimation } from '../Utils/utils';
import { gameScene } from '../Scenes/GameScene';
import { PositionInTile, TileNumbers } from '../game.interfaces';
//import * as gv from '../Utils/gameValues';
// eslint-disable-next-line import/prefer-default-export
export let gameManager: GameManager

export default class GameManager {
    public map: Map;
    lastPiece: Piece;
    currentPiece: Piece;
    isPieceSelectedInFrame = false;

    constructor() {
        this.start();
        gameManager = this;
    }

    private start() {
        this.map = new Map();
    }

    public changeCurrentSelectedPiece(newPiece:Piece):Piece {
        if (this.currentPiece) {
            this.lastPiece = this.currentPiece;
            this.lastPiece.clearFrame();
        }
        this.currentPiece = newPiece;
        this.isPieceSelectedInFrame = true;
        return this.currentPiece;
    }

    public resetPiecesForAction() {
        this.lastPiece = this.currentPiece;
        this.currentPiece = null;
        this.lastPiece.clearFrame();
        this.isPieceSelectedInFrame = false;
    }

    public async makeTwoPieceAnimation(currentPiece: Piece, lastPiece: Piece): Promise<null> {
        makeMovementAnimation(lastPiece, {
            x: currentPiece.currentPosition.x,
            y: currentPiece.currentPosition.y
        }, 300);
        await makeMovementAnimation(currentPiece, {
            x: lastPiece.currentPosition.x,
            y: lastPiece.currentPosition.y
        }, 300);

        return null;
    }

    public async piecesMovement(pieceToSwitch:Piece) {
        if (this.isPieceSelectedInFrame && map.isPieceAdjacent(pieceToSwitch)) {
            this.resetPiecesForAction();
            await pieceToSwitch.switch(this.lastPiece);
            let { matchArrOfPieces, finalMap } = map.checkMatch(map.getCurrentMap(), this.lastPiece);
            if (finalMap && finalMap.length > 0) map.setCurrentMap(finalMap);

            let opositePieceMatchArr = [];
            const opositePieceResponse = map.checkMatch(map.getCurrentMap(), pieceToSwitch);
            if (opositePieceResponse.finalMap && opositePieceResponse.finalMap.length > 0) {
                map.setCurrentMap(opositePieceResponse.finalMap);
                opositePieceMatchArr = opositePieceResponse.matchArrOfPieces;
            }

            if (matchArrOfPieces.length >= 3) {
                this.matchIt(matchArrOfPieces);
            }
            if (opositePieceMatchArr.length >= 3) {
                this.matchIt(opositePieceMatchArr);
            } 
            if (opositePieceMatchArr.length <= 0 && matchArrOfPieces.length <= 0) {
                await pieceToSwitch.switch(this.lastPiece);
            }

            return true;
        }
        return false;
    }

    public async matchIt(pieces:Piece[]): Promise<null> {
        await makeScaleAnimation(pieces);
        pieces.forEach((piece) => piece.destroy());
        return null;
    }

    public generateMorePieces(piecesThatMatch:Piece[]) {
        let newPiecesThatMatch = piecesThatMatch.map((piece) => piece.currentTile);
        do {
            const currentMatchArr = [];
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            newPiecesThatMatch.forEach(({ tileX, tileY }) => {
                let contador = 0;
                const currentMap = map.getCurrentMap();
                do {
                    contador++;
                } while (!currentMap[tileX][tileY - contador]);
    
                const pieceToReplace = currentMap[tileX][tileY - contador];
                pieceToReplace.updatePiecePositionAndTile({ tileX, tileY });
                makeMovementAnimation(pieceToReplace, convertTileToPosition({ tileX, tileY }), 200);
    
                map.setPieceOnTile(null, { tileX, tileY: (tileY - contador) as TileNumbers });
                if (isNumberInsideBoard(tileY - contador)) {
                    currentMatchArr.push({ tileX, tileY: (tileY - contador) as TileNumbers });
                }
                newPiecesThatMatch = currentMatchArr;
            });
        } while (newPiecesThatMatch.length > 0);
    }
}
