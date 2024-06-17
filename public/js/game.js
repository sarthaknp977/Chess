// const socket = io();
// const chess = new Chess();
// const boardElement = document.querySelector(".chessBoard");

// let draggedPiece = null;
// let sourceSquare = null;
// let playerRole = null;

// const renderBoard = () => {
//     const board = chess.board();
//     boardElement.innerHTML = "";
//     board.forEach((row, rowIndex) => {
//         row.forEach((square, squareIndex) => {
//             const squareElement = document.createElement("div");
//             squareElement.classList.add("square",
//                 (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
//             );
//             squareElement.dataset.row = rowIndex;
//             squareElement.dataset.column = squareIndex;

//             if (square) {
//                 const pieceElement = document.createElement("div");
//                 pieceElement.classList.add("piece", square.color === "w" ? "white" : "black");
//                 pieceElement.innerText = getPieceUnicode(square);
//                 pieceElement.draggable = (playerRole === square.color);

//                 pieceElement.addEventListener("dragstart", (e) => {
//                     if (pieceElement.draggable) {
//                         draggedPiece = pieceElement;
//                         sourceSquare = { row: rowIndex, column: squareIndex };
//                         e.dataTransfer.setData("text/plain", "");
//                     }
//                 });
//                 pieceElement.addEventListener("dragend", (e) => {
//                     draggedPiece = null;
//                     sourceSquare = null;
//                 });

//                 squareElement.appendChild(pieceElement);

//             }

//             squareElement.addEventListener("dragover", function (e) {
//                 e.preventDefault();
//             });

//             squareElement.addEventListener("drop", function (e) {
//                 e.preventDefault();
//                 if (draggedPiece) {
//                     const targetSource = {
//                         row: parseInt(squareElement.dataset.row),
//                         column: parseInt(squareElement.dataset.column)

//                     };

//                     handleMove(sourceSquare, targetSource);
//                 }
//             });
//             boardElement.appendChild(squareElement);
//         })

//         if (playerRole === 'b') {
//             boardElement.classList.add('flip');

//         }
//         else {
//             boardElement.classList.remove('flip');
//         }
//     });

//     const highlightLegalMoves = (sourceSquare) => {
//         const legalMoves = chess.moves({ square: `${String.fromCharCode(97 + sourceSquare.column)}${8 - sourceSquare.row}`, verbose: true });
//         legalMoves.forEach(move => {
//             const targetRow = 8 - parseInt(move.to[1]);
//             const targetColumn = move.to.charCodeAt(0) - 97;
//             const targetSquareElement = document.querySelector(`.square[data-row='${targetRow}'][data-column='${targetColumn}']`);
//             if (targetSquareElement) {
//                 targetSquareElement.classList.add("highlight");
//             }
//         });
//     };

// };

// const handleMove = (source, target) => {
//     const move = {
//         from: `${String.fromCharCode(97 + source.column)}${8 - source.row}`,
//         to: `${String.fromCharCode(97 + target.column)}${8 - target.row}`,
//         promotion: 'q'
//     }
//     socket.emit("move", move);
// };

// const getPieceUnicode = (piece) => {
//     const unicodePieces = {

//         k: '♚',
//         q: '♛',
//         r: '♜',
//         b: '♝',
//         n: '♞',
//         p: '♙',

//         K: '♔',
//         Q: '♕',
//         R: '♖',
//         B: '♗',
//         N: '♘',
//         P: '♙'
//     };
//     return unicodePieces[piece.type] || "";
// };


// socket.on("playerRole", function (role) {
//     playerRole = role;
//     renderBoard();
// });

// socket.on("spectatorRole", function () {
//     playerRole = null;
//     renderBoard();
// });

// socket.on("boardState", function (fen) {
//     chess.load(fen);
//     renderBoard();
// });
// socket.on("move", function (fen) {
//     chess.move(fen);
//     renderBoard();
// });
// renderBoard();



// const socket = io();
// const chess = new Chess();
// const boardElement = document.querySelector(".chessBoard");

// let draggedPiece = null;
// let sourceSquare = null;
// let playerRole = null;

// // Render the chess board based on the current game state
// const renderBoard = () => {
//     // Your existing rendering logic here...
// };

// // Handle the drag-and-drop functionality for moving pieces
// const handleDragAndDrop = () => {
//     // Your existing drag-and-drop logic here...
// };

// // Handle the move based on the source and target squares
// const handleMove = (source, target) => {
//     // Your existing move handling logic here...
// };

// // Get the Unicode representation of a chess piece
// const getPieceUnicode = (piece) => {
//     // Your existing piece Unicode mapping logic here...
// };

// // Socket event handlers
// socket.on("playerRole", function (role) {
//     playerRole = role;
//     renderBoard();
// });

// socket.on("spectatorRole", function () {
//     playerRole = null;
//     renderBoard();
// });

// socket.on("boardState", function (fen) {
//     chess.load(fen);
//     renderBoard();
// });

// socket.on("move", function (fen) {
//     chess.move(fen);
//     renderBoard();
// });

// // Initial rendering of the board
// renderBoard();


const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessBoard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add("square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.column = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === "w" ? "white" : "black");
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = (playerRole === square.color);

                // Drag event listeners
                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, column: squareIndex };
                        highlightLegalMoves(sourceSquare);
                        e.dataTransfer.setData("text/plain", "");
                    }
                });
                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                    clearHighlights();
                });

                // Touch event listeners
                pieceElement.addEventListener("touchstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, column: squareIndex };
                        highlightLegalMoves(sourceSquare);
                        e.preventDefault();
                    }
                });

                pieceElement.addEventListener("touchmove", (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const targetSquareElement = document.elementFromPoint(touch.clientX, touch.clientY);
                    if (targetSquareElement && targetSquareElement.classList.contains("square")) {
                        document.querySelectorAll(".target").forEach(square => {
                            square.classList.remove("target");
                        });
                        targetSquareElement.classList.add("target");
                    }
                });

                pieceElement.addEventListener("touchend", (e) => {
                    if (draggedPiece) {
                        const touch = e.changedTouches[0];
                        const targetSquareElement = document.elementFromPoint(touch.clientX, touch.clientY);
                        if (targetSquareElement && targetSquareElement.classList.contains("square")) {
                            const targetSquare = {
                                row: parseInt(targetSquareElement.dataset.row),
                                column: parseInt(targetSquareElement.dataset.column)
                            };
                            handleMove(sourceSquare, targetSquare);
                        }
                    }
                    draggedPiece = null;
                    sourceSquare = null;
                    clearHighlights();
                });

                squareElement.appendChild(pieceElement);
            }

            // Drag event listeners
            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", function (e) {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        column: parseInt(squareElement.dataset.column)
                    };
                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    if (playerRole === 'b') {
        boardElement.classList.add('flip');
    } else {
        boardElement.classList.remove('flip');
    }
};

const highlightLegalMoves = (sourceSquare) => {
    const legalMoves = chess.moves({ square: `${String.fromCharCode(97 + sourceSquare.column)}${8 - sourceSquare.row}`, verbose: true });
    legalMoves.forEach(move => {
        const targetRow = 8 - parseInt(move.to[1]);
        const targetColumn = move.to.charCodeAt(0) - 97;
        const targetSquareElement = document.querySelector(`.square[data-row='${targetRow}'][data-column='${targetColumn}']`);
        if (targetSquareElement) {
            targetSquareElement.classList.add("highlight");
        }
    });
};

const clearHighlights = () => {
    document.querySelectorAll(".highlight").forEach(square => {
        square.classList.remove("highlight");
    });
    document.querySelectorAll(".target").forEach(square => {
        square.classList.remove("target");
    });
};

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.column)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.column)}${8 - target.row}`,
        promotion: 'q'
    };
    socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        k: '♚',
        q: '♛',
        r: '♜',
        b: '♝',
        n: '♞',
        p: '♙',
        K: '♔',
        Q: '♕',
        R: '♖',
        B: '♗',
        N: '♘',
        P: '♙'
    };
    return unicodePieces[piece.type] || "";
};

socket.on("playerRole", function (role) {
    playerRole = role;
    renderBoard();
});

socket.on("spectatorRole", function () {
    playerRole = null;
    renderBoard();
});

socket.on("boardState", function (fen) {
    chess.load(fen);
    renderBoard();
});

socket.on("move", function (fen) {
    chess.move(fen);
    renderBoard();
});

renderBoard();