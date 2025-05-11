// const socket = io(); // Connect to the server

// const chess = new Chess();
// const boardElement = document.querySelector('.chessboard');
// const turnIndicator = document.getElementById("turnIndicator");
// const whiteTimerElement = document.getElementById("whiteTimer");
// const blackTimerElement = document.getElementById("blackTimer");

// let draggedPiece = null;
// let sourceSq = null;
// let playerRole = null;
// let isPlayerTurn = false; // Track if it's the player's turn
// let whiteTime = 0;
// let blackTime = 0;
// let whiteInterval, blackInterval;
// let timerActive = false;

// // Start timer based on the current player's turn
// const startTimer = () => {
//     if (playerRole === 'w' && isPlayerTurn) {
//         whiteInterval = setInterval(() => {
//             whiteTime++;
//             whiteTimerElement.textContent = `${whiteTime}s`;
//         }, 1000);
//     } else if (playerRole === 'b' && isPlayerTurn) {
//         blackInterval = setInterval(() => {
//             blackTime++;
//             blackTimerElement.textContent = `${blackTime}s`;
//         }, 1000);
//     }
// };

// // Stop all timers
// const stopTimers = () => {
//     clearInterval(whiteInterval);
//     clearInterval(blackInterval);
// };

// // Update the turn indicator UI based on the current turn
// const updateTurnUI = () => {
//     if (chess.turn() === 'w') {
//         turnIndicator.textContent = "White's Turn";
//         turnIndicator.classList.add('text-white');
//         turnIndicator.classList.remove('text-black');
//         isPlayerTurn = (playerRole === 'w');
//         startTimer();
//     } else {
//         turnIndicator.textContent = "Black's Turn";
//         turnIndicator.classList.add('text-black');
//         turnIndicator.classList.remove('text-white');
//         isPlayerTurn = (playerRole === 'b');
//         startTimer();
//     }
// };

// // Render the board state and setup board interactions
// const renderBoard = () => {
//     const board = chess.board();
//     boardElement.innerHTML = ""; // Clear the board

//     board.forEach((row, rowindex) => {
//         row.forEach((square, squareindex) => {
//             const squareElement = document.createElement("div");
//             squareElement.classList.add('square', (rowindex + squareindex) % 2 === 0 ? "light" : "dark");
//             squareElement.dataset.row = rowindex;
//             squareElement.dataset.col = squareindex;

//             if (square) {
//                 const pieceElement = document.createElement("div");
//                 pieceElement.classList.add('piece', square.color === 'w' ? "white" : "black");
//                 pieceElement.innerText = getPieceUnicode(square);

//                 // Only allow dragging if it's the player's piece AND their turn
//                 const isDraggable = playerRole === square.color && chess.turn() === square.color;
//                 pieceElement.draggable = isDraggable;

//                 // Drag start event
//                 pieceElement.addEventListener('dragstart', (e) => {
//                     if (isDraggable) {
//                         draggedPiece = pieceElement;
//                         sourceSq = { row: rowindex, col: squareindex };
//                         e.dataTransfer.setData('text/plain', "");
//                     }
//                 });

//                 // Drag end event
//                 pieceElement.addEventListener('dragend', () => {
//                     draggedPiece = null;
//                     sourceSq = null;
//                 });

//                 squareElement.appendChild(pieceElement);
//             }

//             // Allow dragging over the square
//             squareElement.addEventListener('dragover', function (e) {
//                 e.preventDefault();
//             });

//             // Handle the drop event
//             squareElement.addEventListener('drop', function (e) {
//                 e.preventDefault();
//                 if (draggedPiece) {
//                     const targetSource = {
//                         row: parseInt(squareElement.dataset.row),
//                         col: parseInt(squareElement.dataset.col)
//                     };
//                     handleMove(sourceSq, targetSource);
//                 }
//             });

//             boardElement.appendChild(squareElement); // Append squareElement to boardElement
//         });
//     });

//     // Flip the board if the player is black
//     if (playerRole === 'b') {
//         boardElement.classList.add('flipped');
//     } else {
//         boardElement.classList.remove('flipped');
//     }
// };

// // Handle the move logic (check if valid, emit the move, etc.)
// const handleMove = (source, target) => {
//     const move = {
//         from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
//         to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
//         promotion: 'q'
//     };

//     const result = chess.move(move); // Try the move locally first
//     if (result) {
//         chess.undo(); // Undo it because server will apply it
//         socket.emit('move', move); // Emit valid move
//     } else {
//         alert("Invalid move!");
//     }
// };

// // Get piece unicode for chessboard display
// const getPieceUnicode = (piece) => {
//     const unicodePieces = {
//         p: '♟',
//         r: '♜',
//         n: '♞',
//         b: '♝',
//         q: '♛',
//         k: '♚',
//         P: '♙',
//         R: '♖',
//         N: '♘',
//         B: '♗',
//         Q: '♕',
//         K: '♔'
//     };
//     const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
//     return unicodePieces[key] || ""; // Return the unicode for the piece
// };

// // Listen for player role from the server
// socket.on('playerRole', function(role) {
//     playerRole = role;
//     renderBoard(); // Re-render the board based on the player role
//     updateTurnUI(); // Update turn UI
// });

// // Listen for spectator role from the server
// socket.on('spectatorRole', function() {
//     playerRole = null; // Clear player role for spectators
//     renderBoard(); // Re-render the board with no player role
// });

// // Listen for the board state (FEN) from the server
// socket.on('boardState', function(fen) {
//     chess.load(fen); // Load the FEN state into chess.js
//     renderBoard(); // Re-render the board after FEN load
//     updateTurnUI(); // Ensure the turn indicator is updated
// });

// // Listen for move updates from the server
// socket.on('move', function(move) {
//     chess.move(move); // Apply the move to the chess game state
//     renderBoard(); // Re-render the board after the move
//     updateTurnUI(); // Update turn UI after move
// });

// // Initial rendering of the board when the page loads
// renderBoard();


const socket = io();
const chess = new Chess();

const boardElement = document.querySelector('.chessboard');
const turnIndicator = document.getElementById("turnIndicator");
const whiteTimerElement = document.getElementById("whiteTimer");
const blackTimerElement = document.getElementById("blackTimer");
const capturedWhiteElement = document.getElementById("capturedWhite");
const capturedBlackElement = document.getElementById("capturedBlack");

const capturedWhite = [];
const capturedBlack = [];


let playerRole = null;
let isPlayerTurn = false;
let whiteTime = 0, blackTime = 0;
let whiteInterval, blackInterval;

let draggedPiece = null;
let sourceSq = null;
let selectedSquare = null;
let validMoves = [];


const startTimer = () => {
  stopTimers();
  if (chess.turn() === 'w' && playerRole === 'w') {
    whiteInterval = setInterval(() => {
      whiteTime++;
      whiteTimerElement.textContent = `${whiteTime}s`;
    }, 1000);
  } else if (chess.turn() === 'b' && playerRole === 'b') {
    blackInterval = setInterval(() => {
      blackTime++;
      blackTimerElement.textContent = `${blackTime}s`;
    }, 1000);
  }
};

const stopTimers = () => {
  clearInterval(whiteInterval);
  clearInterval(blackInterval);
};

const updateTurnUI = () => {
  stopTimers();
  const turn = chess.turn();
  isPlayerTurn = playerRole === turn;
  turnIndicator.textContent = turn === 'w' ? "White's Turn" : "Black's Turn";
  turnIndicator.className = turn === 'w' ? "text-white" : "text-black";
  if (isPlayerTurn) startTimer();
};

const renderCaptured = () => {
  capturedWhiteElement.innerHTML = "";
  capturedBlackElement.innerHTML = "";

  capturedWhite.forEach(piece => {
    const el = document.createElement("span");
    el.textContent = getPieceUnicode({ type: piece, color: 'b' });
    capturedWhiteElement.appendChild(el);
  });

  capturedBlack.forEach(piece => {
    const el = document.createElement("span");
    el.textContent = getPieceUnicode({ type: piece, color: 'w' });
    capturedBlackElement.appendChild(el);
  });
};

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";

  board.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      const squareName = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
      const squareEl = document.createElement("div");
      squareEl.classList.add("square", (rowIndex + colIndex) % 2 === 0 ? "light" : "dark");
      squareEl.dataset.row = rowIndex;
      squareEl.dataset.col = colIndex;

      if (square) {
        const pieceEl = document.createElement("div");
        pieceEl.classList.add("piece", square.color === 'w' ? "white" : "black");
        pieceEl.innerText = getPieceUnicode(square);

        const canInteract = playerRole === square.color && chess.turn() === square.color;
        pieceEl.draggable = canInteract;

        pieceEl.addEventListener('dragstart', (e) => {
          if (canInteract) {
            draggedPiece = pieceEl;
            sourceSq = { row: rowIndex, col: colIndex };
            e.dataTransfer.setData("text/plain", "");
          }
        });

        pieceEl.addEventListener('dragend', () => {
          draggedPiece = null;
          sourceSq = null;
        });

        pieceEl.addEventListener('click', () => {
          if (canInteract) {
            if (selectedSquare === squareName) {
              selectedSquare = null;
              validMoves = [];
            } else {
              selectedSquare = squareName;
              validMoves = chess.moves({ square: squareName, verbose: true }).map(m => m.to);
            }
            renderBoard();
          }
        });

        squareEl.appendChild(pieceEl);
      }

      squareEl.addEventListener('dragover', (e) => e.preventDefault());

      squareEl.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedPiece) {
          const target = {
            row: parseInt(squareEl.dataset.row),
            col: parseInt(squareEl.dataset.col)
          };
          handleMove(sourceSq, target);
        }
      });

      squareEl.addEventListener('click', () => {
        if (selectedSquare && validMoves.includes(squareName)) {
          const source = {
            row: 8 - parseInt(selectedSquare[1]),
            col: selectedSquare.charCodeAt(0) - 97
          };
          const target = { row: rowIndex, col: colIndex };
          handleMove(source, target);
          selectedSquare = null;
          validMoves = [];
        }
      });

      if (validMoves.includes(squareName)) {
        squareEl.classList.add("valid-move");
      }

      boardElement.appendChild(squareEl);
    });
  });

  boardElement.classList.toggle("flipped", playerRole === 'b');
  highlightCheck();
};

const highlightCheck = () => {
  if (chess.in_check()) {
    const kingColor = chess.turn();
    const board = chess.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'k' && piece.color === kingColor) {
          const squareEl = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
          if (squareEl) squareEl.classList.add("king-in-check");
        }
      }
    }
  }
};

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q'
    };

    const moveResult = chess.move(move);

    if (moveResult) {
        if (moveResult.captured) {
            if (moveResult.color === 'w') {
                capturedBlack.push(moveResult.captured); // Add captured piece to black's list
            } else {
                capturedWhite.push(moveResult.captured); // Add captured piece to white's list
            }
        }

        chess.undo(); // Server handles actual move
        socket.emit('move', move);
    } else {
        alert("Invalid move!");
    }

    renderCapturedPieces(); // Update the captured pieces on the front-end
};
const renderCapturedPieces = () => {
    const whiteContainer = document.getElementById("capturedWhite");
    const blackContainer = document.getElementById("capturedBlack");

    whiteContainer.innerHTML = "";
    blackContainer.innerHTML = "";

    // Render White Captured Pieces
    capturedWhite.forEach(piece => {
        const el = document.createElement("span");
        el.textContent = getPieceUnicode({ type: piece, color: 'b' });
        whiteContainer.appendChild(el);
    });

    // Render Black Captured Pieces
    capturedBlack.forEach(piece => {
        const el = document.createElement("span");
        el.textContent = getPieceUnicode({ type: piece, color: 'w' });
        blackContainer.appendChild(el);
    });
};



const getPieceUnicode = (piece) => {
  const pieces = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
    P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
  };
  const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
  return pieces[key];
};

function playSound(type) {
  const sounds = {
    move: document.getElementById("moveSound"),
    check: document.getElementById("checkSound"),
    gameover: document.getElementById("gameOverSound")
  };
  if (sounds[type]) {
    sounds[type].currentTime = 0;
    sounds[type].play();
  }
}

function showGameOver(resultText) {
  document.getElementById("gameResult").innerText = resultText;
  document.getElementById("gameOverDialog").classList.remove("hidden");
}

function closeGameDialog() {
  document.getElementById("gameOverDialog").classList.add("hidden");
}

function startNewGame() {
  socket.emit('request_new_game');
  window.location.reload();
}

function resignGame() {
  const color = chess.turn() === 'w' ? 'White' : 'Black';
  showGameOver(`${color} resigned. Game over.`);
  playSound('gameover');
}

// Socket events
socket.on('playerRole', (role) => {
  playerRole = role;
  renderBoard();
  updateTurnUI();
});

socket.on('spectatorRole', () => {
  playerRole = null;
  alert("You are viewing the game as a spectator(Viewer). You can only observe the game and cannot make moves.");
  renderBoard();
});


socket.on('boardState', (fen) => {
  chess.load(fen);
  renderBoard();
  updateTurnUI();
  renderCaptured();
});

socket.on('move', function(move) {
    // Check if a piece is captured
    const captured = chess.get(move.to);
    if (captured) {
        if (captured.color === 'w') {
            capturedWhite.push(captured); // Add captured piece to white's list
        } else {
            capturedBlack.push(captured); // Add captured piece to black's list
        }
    }

    chess.move(move); // Apply move
    renderBoard();
    updateTurnUI();
    renderCapturedPieces(); // Update captured pieces UI

    playSound('move'); // Play sound on move

    if (chess.in_checkmate()) {
        showGameOver(chess.turn() === 'w' ? "Black wins by checkmate" : "White wins by checkmate");
        playSound('gameover');
    } else if (chess.in_check()) {
        playSound('check');
    }
});
// Initial render
renderBoard();
