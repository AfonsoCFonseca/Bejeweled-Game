# Bejeweled
Classic Bejeweled game in Phaser 3.0 written in Typescript with Jest unit test




<p align="center">
  <img src='https://github.com/AfonsoCFonseca/Bejeweled-Game/blob/main/screenshots/ImageBorderGithub.png'>
</p>


---------------------------------------------------------------
# How to Deploy
On the project terminal run: 
```
npm i;
npm run build;
node index
```
then access on your browser to: localhost:8080

To access a live version running on a server ( the server may take a few seconds to boot, before starting the game )

-> https://bejeweled1991.onrender.com/ <-
( also, it's a slow server )

# Structure
Build with 2 Game Scenes ( Menu and a gameplay scene ), a GameManger for handling general management tasks, a Map for the Board creation and storing the current Pieces and a Piece Class for each existing piece in the map

### GameManager ###
GameManager handle every method related to the game overall mechanics, such as animations, matches, scoring and level up

### Map ###
The Map is a more demanding script in terms of performance since is responsible for generating the map at the beginning and making sure no premade match is made from its generation, it keeps the map of Pieces updated and looks for matches every time a piece moves 

### Piece ###
The Piece stores every information of the actual piece, the type ( from letter to enum ) and the position in pixels and tile. In terms of action handles the click of the user, the movement afterwards and the request to update the map 


---------------------------------------------------------------
# Development
I've begun by creating a Map class with two dimension array to store every piece, each piece was represented by a Piece class that stores every information about that element, such as position in tile and piece type.
Afterwards, I implemented the generation of random pieces on the map and the click on each of them.
Made the first action by making a second click where I wish to move my previous selected piece. For that action was necessary a previous validation of the adjacent tiles to make sure that exists some type of match regarding the pieceType. If a match was found, I kept the pieces in the new current position and updated the map instance, if not, I switched it back to the first position.

Implemented some move animation to the switching pieces and scale animations to the matching pieces. Made a few tweaks to the UI, adding a border and a scoreboard.
After that, I had to upgrade the first generation of the map ( since the generations were creating some premade matches between pieces ) by using the same method of the user action but for every piece on the map, each time a match was found, I deleted the current map and started a new one.

When a piece is matched, it should delete itself and call the method to bring down the upper pieces on the Y axis, if there's an empty space above, it should call the next piece.
It was also necessary to implement the match system for the opposite piece that is moving when an action is made.

Created a level system that levels up every time the user reaches another 1200 score to the total score he has. For a better understanding of the progress in the game, I've added a UI bar to let the user know in which part of the level he is, depending on his score, I also, added text to inform the user of his current. Made a few improvements to the scoring system and created some exploding sounds for each time a match is made. The button reset was added to the UI for a fast reset of the board, level and score.

Every time a set of pieces match, I generate the exact number of pieces on the same Y axis with an X axis of (x * TILE.HEIGHT) + initial board height with a random generation of piece_type, then set the current empty tiles on the board to the generated ones and add animation so they move from the upper board to the desired location.

Improved the UI with small borders on the score and added a restart and menu button. Made the logic for the match sequence, each time a piece match with others the map changes and there's a validation required for two mechanics, looking for a match sequence and checking if exists any possible future match... I started matching the actual pieces and let the game over trigger to the end of the game. Also, added some sound to the level up trigger, created some UI scoring triggered where the match was made and with different colors, depending on the pieces that match.

The Game Over verification was the last core thing that I built. For every movement of the pieces and after the matches, I run method that checks every possible movemento for every piece to ensure that there's still some combinations left to do, if there isn't a game over screen is shown with the score and restart button

# Future Implementation
- a 4 or bigger match should create a special piece that explodes
- a L match should create a special piece that destroy all specific kind of pieces that match

---------------------------------------------------------------
# Sketches & Evolution

 <p float="left">
   <img width="255" height="235" src='https://github.com/AfonsoCFonseca/Bejeweled-Game/blob/main/screenshots/24_12.png' >
   <img width="255" height="235" src='https://github.com/AfonsoCFonseca/Bejeweled-Game/blob/main/screenshots/26_12_2.png' >
   <img width="255" height="235" src='https://github.com/AfonsoCFonseca/Bejeweled-Game/blob/main/screenshots/09_01_22.png' >
 </p>
