import Piece from './Piece'
import Map, { map } from './Map'
import { convertTileToPosition, isNumberInsideBoard, makeMovementAnimation, makeScaleAnimation, rndNumber } from '../Utils/utils';
import { gameScene, levelBarImg, scoreText, levelText } from '../Scenes/GameScene';
import { ScoreTypes, TileNumbers } from '../game.interfaces';
import { LEVEL_SCORE_TO_ADD } from '../Utils/gameValues';
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
        scoreText.setText(`Score: ${this.score}`);
        this.updateLevelBar();
    }

    private levelUp() {
        this.level++;
        levelText.setText(`Level: ${this.level}`)
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
        levelBarImg.scaleX = this.score / this.scoreObjective;
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

    public async matchIt(pieces:Piece[]): Promise<null> {
        this.playExplodingBubbleSound();
        await makeScaleAnimation(pieces);
        pieces.forEach((piece) => piece.destroy());
        this.scoreIt('3line');
        if (this.score >= this.scoreObjective) this.levelUp();
        this.fallPiecesGenerateMore(pieces);
        return null;
    }

    public fallPiecesGenerateMore(piecesThatMatch:Piece[]) {
        let newPiecesThatMatch = piecesThatMatch.map((piece) => piece.currentTile);
        let currentMatchArr;

        newPiecesThatMatch.sort((a, b) => a.tileY - b.tileY);
        //newPiecesThatMatch.sort((a, b) => b.tileX - a.tileX);
        do {
            currentMatchArr = [];
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            newPiecesThatMatch.forEach(({ tileX, tileY }) => {
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
                //newPiecesThatMatch.sort((a, b) => b.tileX - a.tileX);
            });
        } while (currentMatchArr.length > 0);
    }
}
