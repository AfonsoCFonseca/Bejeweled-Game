import Piece from './Piece'
import Map, { map } from './Map'
import { convertTileToPosition, getRandomValueFromArray, isNumberInsideBoard, makeMovementAnimation, makeScaleAnimation, rndNumber } from '../Utils/utils';
import { gameScene, levelBarImg, scoreText, levelText } from '../Scenes/GameScene';
import { PositionInTile, ScoreTypes, TileNumbers } from '../game.interfaces';
import { INITIAL_BOARD_SCREEN, LEVEL_SCORE_TO_ADD, PIECE_TYPES, TILE } from '../Utils/gameValues';
//import * as gv from '../Utils/gameValues';
// eslint-disable-next-line import/prefer-default-export
export let gameManager: GameManager

export default class GameManager {
    public map: Map;
    lastPiece: Piece;
    currentPiece: Piece;
    score: number;
    level: number;
    scoreObjective: number;
    isPieceSelectedInFrame = false;

    constructor() {
        this.start();
        gameManager = this;
    }

    private start() {
        this.reset();
        this.map = new Map();
    }
    
    public reset() {
        this.level = 1;
        this.scoreObjective = this.level * LEVEL_SCORE_TO_ADD;
        this.score = 0;
        levelBarImg.scaleX = 0;
        scoreText.setText(`Score: ${this.score}`);
    }

    private levelUp() {
        this.level++;
        levelText.setText(`Level: ${this.level}`);
        levelBarImg.scaleX = 0;
        this.scoreObjective = this.level * LEVEL_SCORE_TO_ADD;
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

    private scoreIt(scoreToType: ScoreTypes) {
        let toScore = 100;
        switch (scoreToType) {
            case '3line': 
                toScore = 100;
                break;
            case '4line': 
                toScore = 100;
                break;
            case '5line': 
                toScore = 100;
                break;
            case '6line': 
                toScore = 100;
                break;
            case '4L':
                toScore = 100;
                break;
            case '3L':
                toScore = 100;
                break;
            default:
                console.log('No scoreType was found');
        }

        this.score += toScore;
        this.updateLevelBar();
        
        scoreText.setText(`Score: ${this.score}`);
    }

    private updateLevelBar() {
        const newScaleXVal = this.score / this.scoreObjective;
        gameScene.tweens.add({
            targets: levelBarImg,
            scaleX: newScaleXVal,
            ease: 'Linear',     
            duration: 500,
            repeat: 0
        });
    }

    private playExplodingBubbleSound() {
        gameScene.sound.play(`bubble${rndNumber(1, 3, true)}`);
        setTimeout(() => {
            gameScene.sound.play(`bubble${rndNumber(1, 3, true)}`);
        }, 150)
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
            const { matchArrOfPieces, finalMap } = map.checkMatch(map.getCurrentMap(), this.lastPiece);
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

    private async matchIt(pieces:Piece[]): Promise<null> {
        this.playExplodingBubbleSound();
        await makeScaleAnimation(pieces);
        pieces.forEach((piece) => piece.destroy());
        this.scoreIt('3line');
        if (this.score >= this.scoreObjective) this.levelUp();
        this.fallPieces(pieces);
        this.generateMore();
        return null;
    }

    private async fallPieces(piecesThatMatch:Piece[]) {
        let newPiecesThatMatch = piecesThatMatch.map((piece) => piece.currentTile);
        let currentMatchArr;

        newPiecesThatMatch.sort((a, b) => a.tileY - b.tileY);
        do {
            currentMatchArr = [];
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            newPiecesThatMatch.forEach(async ({ tileX, tileY }) => {
                let contador = 0;
                const currentMap = map.getCurrentMap();

                if (isNumberInsideBoard(tileY - contador)) {
                    do {
                        contador++;
                    } while (isNumberInsideBoard(tileY - contador) && !currentMap[tileX][tileY - contador]);

                    const pieceToReplace = currentMap[tileX][tileY - contador];
                    if (pieceToReplace) {
                        pieceToReplace.updatePiecePositionAndTile({ tileX, tileY });
                        makeMovementAnimation(pieceToReplace, convertTileToPosition({ tileX, tileY }), 200);
            
                        map.setPieceOnTile(null, { tileX, tileY: (tileY - contador) as TileNumbers });
                        currentMatchArr.push({ tileX, tileY: (tileY - contador) as TileNumbers });
                    }
                }
                newPiecesThatMatch = currentMatchArr.sort((a, b) => a.tileY - b.tileY);
            });
        } while (currentMatchArr.length > 0);
    }

    private generateMore() {
        const currentMap = map.getCurrentMap();
        const emptyTiles: PositionInTile[] = [];
        currentMap.forEach((line, tileX: TileNumbers) => line.forEach((piece, tileY: TileNumbers) => {
            if (!piece) emptyTiles.push({ tileX, tileY });
        }));

        emptyTiles.sort((a, b) => b.tileY - a.tileY);

        let contador = 1;
        let xValue: number;
        emptyTiles.forEach((tilePosition: PositionInTile) => {
            const pieceTypeLetter = getRandomValueFromArray(PIECE_TYPES);
            const newTilePosition = convertTileToPosition(tilePosition);
            if (xValue !== tilePosition.tileX) contador = 1;
            else {
                contador++;
            } 
            xValue = tilePosition.tileX;
            const yPositon = (INITIAL_BOARD_SCREEN.HEIGHT - (TILE.HEIGHT * contador));
            const newPosition = { x: newTilePosition.x, y: yPositon };
            const piece = new Piece(pieceTypeLetter, newPosition);
            map.setPieceOnTile(piece, tilePosition);
            makeMovementAnimation(piece, convertTileToPosition(tilePosition), 200);
        });
    }
}
