const server = require("http").createServer();

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const {
  initializeGame,
  isNotValidFor2,
  isValid,
  isValidFor3,
} = require("./game");

const makeID = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

let states = {};
let clientRooms = {};

io.on("connection", (client) => {
  console.log("Connected");

  const newGame = () => {
    let roomName = makeID(5);

    clientRooms[client.id] = roomName;
    states[roomName] = initializeGame();

    client.join(roomName);
    client.number = 1;
    io.sockets.in(roomName).emit("newGame", {
      gameCode: roomName,
      gameState: states[roomName],
      id: 1,
    });
  };

  const joinGame = (roomName) => {
    const room = io.sockets.adapter.rooms.get(roomName);

    let numClients = 0;
    if (room) {
      numClients = room.size;
    }

    if (numClients === 0) {
      client.emit("unknownCode");
      return;
    } else if (numClients > 1) {
      client.emit("tooManyPlayers");
      return;
    }

    clientRooms[client.id] = roomName;
    let state = initializeGame();

    client.join(roomName);
    client.number = 2;
    let gameState = { ...state, player: 2 };
    io.sockets
      .in(roomName)
      .emit("joinGame", { gameCode: roomName, gameState, id: 2 });
  };

  const increaseBalls = (index, arr) => {
    let roomName = clientRooms[client.id];
    let n = undefined;
    if (index < 0 || index > 100) return;
    if (arr[index].n === 0) {
      arr[index] = { ...arr[index], n: 1, p: states[roomName].player };
    } else if (arr[index].n === 1) {
      if (isNotValidFor2(index)) {
        arr[index] = { ...arr[index], n: 0, p: 0 };
        n = 1;
      } else {
        arr[index] = { ...arr[index], n: 2, p: states[roomName].player };
      }
    } else if (arr[index].n === 2) {
      if (!isValidFor3(index)) {
        arr[index] = { ...arr[index], n: 0, p: 0 };
        n = 2;
      } else {
        arr[index] = { ...arr[index], n: 3, p: states[roomName].player };
      }
    } else if (arr[index].n === 3) {
      arr[index] = { ...arr[index], n: 0, p: 0 };
      n = 3;
    }
    states[roomName] = { ...states[roomName], grid: arr };
    io.sockets.in(roomName).emit("setGameState", arr);
    console.log(index, arr[index]);
    if (n) {
      if (isValid(index, index + 1, n)) increaseBalls(index + 1, arr);
      if (isValid(index, index - 1, n)) increaseBalls(index - 1, arr);
      if (isValid(index, index + 10, n)) increaseBalls(index + 10, arr);
      if (isValid(index, index - 10, n)) increaseBalls(index - 10, arr);
    }
  };

  client.on("newGame", newGame);
  client.on("joinGame", joinGame);

  client.on("increaseBalls", (data) => {
    increaseBalls(data.index, data.arr);
  });
  client.on("winner", (p) => {
    let roomName = clientRooms[client.id];
    io.sockets.in(roomName).emit("win", p);
  });
  client.on("played", (data) => {
    let roomName = clientRooms[client.id];
    let step = {
      current: data.step.current,
    };
    let state = { ...states[roomName], player: data.player, step };
    states[roomName] = state;
    io.sockets.in(roomName).emit("playerChange", data);
  });
});

server.listen(5000, () => {
  console.log("Server listening");
});
