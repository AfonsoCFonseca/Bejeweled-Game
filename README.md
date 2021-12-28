# Bejeweled
Classic Bejeweled game in Phaser 3.0 written in Typescript with Jest unit test




<p align="center">
  <img src='https://github.com/AfonsoCFonseca/Bejeweled-Game/blob/master/screenshots/ImageBorderGithub.png'>
</p>


---------------------------------------------------------------
# Unit Testing
First installed Jest, created the jest.config.js with some special configuration so it can work with canvas
Followed the instructions from this link for Jest installation
https://tnodes.medium.com/setting-up-jest-with-react-and-phaser-422b174ec87e

jest, jest-canvas-mock, jest-ts is necessary

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

When a piece is matched, it should delete itself and call the method to bring down the upper pieces on the Y axis, if there's an empty space above, it shoudl call the next piece.
It was also necessary to implement the match system for the oposide piece that is moving when an action is made.

# Future Implementation
upgrade piece after a 4> piece match
upgrade piece after a L piece match

---------------------------------------------------------------
# Scratches & Evolution

 <p float="left">
   <img width="186" height="235" src='https://github.com/AfonsoCFonseca/Bejeweled-Game/blob/master/screenshots/24_12.png' >
   <img width="186" height="235" src='https://github.com/AfonsoCFonseca/Bejeweled-Game/blob/master/screenshots/26_12.png' >
   <img width="186" height="235" src='https://github.com/AfonsoCFonseca/Bejeweled-Game/blob/master/screenshots/26_12_2.png' >
 </p>
