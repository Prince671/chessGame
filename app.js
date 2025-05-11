const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');
const { log } = require('console');

const app = express();

const server = http.createServer(app); // creating the http server and passing it express server , so that both will connected
const io = socket(server);  // socket io is reponsible for the real time response and connection

const chess = new Chess();

let player = {};
let currentPlayer = "W"; // "w" stands for white, the first player join the game will assinged white side

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); // ✅ fixed __dirname escaping
// app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('index', { title: "Chess Game" });
});



io.on('connection', function (uniqueSocket) {  // "uniqueSocket", Gives the unique/personal Information of the user connecting to the server
    console.log("User Connected:", uniqueSocket.id);

    /*
    uniqueSocket.on("sending msg to server", function(){
        console.log("Msg req. FrontEnd");
        io.emit('response From BackEnd');  // emit() is used to show the response to all the user into that browerser
    })*/

    /*uniqueSocket.on('disconnect', function(){
        console.log("User Disconnected"); // this is used to acknownledge whether the user is disconnected or not
    })*/

    // Assign player roles
    if (!player.white) {
        player.white = uniqueSocket.id;
        uniqueSocket.emit('playerRole', 'w');
    }
    else if (!player.black) {
        player.black = uniqueSocket.id;
        uniqueSocket.emit('playerRole', 'b');
    }
    else {
        uniqueSocket.emit('spectatorRole');
    }

    // Send initial board state and turn info to each client
    uniqueSocket.emit('boardState', chess.fen());
    uniqueSocket.emit('turn', chess.turn());

    // checking if any user is leaving the window/application , so remove that user, checking their Id to remove them
    uniqueSocket.on('disconnect', function () {
        console.log("User Disconnected:", uniqueSocket.id);
        if (uniqueSocket.id === player.white) {
            delete player.white;
        }
        else if (uniqueSocket.id === player.black) {
            delete player.black;
        }
    });

    // Handling chess move
    uniqueSocket.on('move', (move) => {
        try {
            // Ensuring move is made by correct player
            if (chess.turn() === 'w' && uniqueSocket.id !== player.white) return;
            if (chess.turn() === 'b' && uniqueSocket.id !== player.black) return;

            const currentTurnBeforeMove = chess.turn(); // Store current turn before making move
            const result = chess.move(move);

            if (result) {
                currentPlayer = chess.turn(); // updating current player
                io.emit('move', move); // showing the move to all users connected 
                io.emit('boardState', chess.fen());
                io.emit('turn', currentPlayer); // broadcast new turn

                // ✅ fixed game over logic
                if (chess.isGameOver()) {
                    io.emit('gameOver', {
                        winner: currentTurnBeforeMove === 'w' ? 'White' : 'Black',
                        reason: chess.isCheckmate() ? 'checkmate' : 'draw'
                    });
                }
            }
            else {
                // console.log("Invalid Move", move);
                uniqueSocket.emit('invalidMove', move);
            }
        } catch (err) {
            console.log(err);
            // console.log("Invalid Move", move);
            uniqueSocket.emit('invalidMove', move); // fixed emit format
        }
    });
});

server.listen(3000, () => {
    console.log("server running on http://localhost:3000");
});

/*
// app.listen(3000,()=>{
//     console.log("server running");
// })
*/
