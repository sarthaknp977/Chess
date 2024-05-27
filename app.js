const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);
const chess = new Chess();
const players = { white: null, black: null };
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.render("index", { title: "Chess" });
});


io.on("connection", function (socket) {
    console.log("New connection");


    assignPlayerRole(socket);


    socket.on("disconnect", function () {
        handleDisconnect(socket);
    });


    socket.on("move", (move) => {
        handleMove(socket, move);
    });
});


function assignPlayerRole(socket) {
    if (!players.white) {
        players.white = socket.id;
        socket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit("playerRole", "b");
    } else {
        socket.emit("spectatorRole");
    }
}


function handleDisconnect(socket) {
    if (socket.id === players.white) {
        players.white = null;
    } else if (socket.id === players.black) {
        players.black = null;
    }
}


function handleMove(socket, move) {
    try {
        if (chess.turn() === "w" && socket.id !== players.white) return;
        if (chess.turn() === "b" && socket.id !== players.black) return;

        const result = chess.move(move);
        if (result) {
            currentPlayer = chess.turn();
            io.emit("move", move);
            io.emit("boardState", chess.fen());
        } else {
            console.log("Invalid Move: ", move);
            socket.emit("invalidMove", move);
        }
    } catch (err) {
        console.error("Error:", err);
        socket.emit("error", "Invalid move");
    }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log(`Server listening on port ${PORT}`);
});



// const express = require("express");
// const socket = require("socket.io");
// const http = require("http");
// const { Chess } = require("chess.js");
// const path = require("path");

// const app = express();

// const server = http.createServer(app);
// const io = socket(server);

// const chess = new Chess();
// let players = {};
// let currentPlayer = "w";

// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//     res.render("index", { title: "Chess" });
// });

// io.on("connection", function (uniqueSocket) {
//     console.log("Connected");

//     if (!players.white) {
//         players.white = uniqueSocket.id;
//         uniqueSocket.emit("playerRole", "w");
//     } else if (!players.black) {
//         players.black = uniqueSocket.id;
//         uniqueSocket.emit("playerRole", "b");
//     } else {
//         uniqueSocket.emit("spectatorRole");
//     }

//     uniqueSocket.on("disconnect", function () {
//         if (uniqueSocket.id === players.white) {
//             delete players.white;
//         } else if (uniqueSocket.id === players.white) {
//             delete players.black;
//         }
//     });
//     uniqueSocket.on("move", (move) => {
//         try {
//             if (chess.turn() === "w" && uniqueSocket.id !== players.white) return;
//             if (chess.turn() === "b" && uniqueSocket.id !== players.black) return;

//             const result = chess.move(move);
//             if (result) {
//                 currentPlayer = chess.turn();
//                 io.emit("move", move);
//                 io.emit("boardState", chess.fen());
//             }
//             else {
//                 console.log("Invalid Move : ", move);
//                 uniqueSocket.emit("invalidMove", move);
//             }
//         } catch (err) {
//             console.log(err);
//             uniqueSocket.emit("Invalid move : ", move);
//         }
//     })
// });

// server.listen(3000, function () {
//     console.log("listening on port 3000 ");

// })
