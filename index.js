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

let { gameState, player, step } = require("./game");

io.on("connection", (client) => {
  console.log("Connected");

  client.emit("init", { data: "hello from server" });

  client.on("gameState", (data) => {
    initializeGame(data);
  });

  client.on("increaseBalls", (data) => {
    increaseBalls(data.index, data.arr);
  });

  client.on("winner", (p) => {
    client.emit("win", p);
  });

  client.on("played", (data) => {
    player = data.player;
    step.current = data.step.current;
    client.emit("playerChange", data);
  });

  const increaseBalls = (index, arr) => {
    let n = undefined;
    if (index < 0 || index > 100) return;
    if (arr[index].n === 0) {
      arr[index] = { ...arr[index], n: 1, p: player };
    } else if (arr[index].n === 1) {
      if (isNotValidFor2(index)) {
        arr[index] = { ...arr[index], n: 0, p: 0 };
        n = 1;
      } else {
        arr[index] = { ...arr[index], n: 2, p: player };
      }
    } else if (arr[index].n === 2) {
      if (!isValidFor3(index)) {
        arr[index] = { ...arr[index], n: 0, p: 0 };
        n = 2;
      } else {
        arr[index] = { ...arr[index], n: 3, p: player };
      }
    } else if (arr[index].n === 3) {
      arr[index] = { ...arr[index], n: 0, p: 0 };
      n = 3;
    }
    gameState = arr;
    client.emit("setGameState", arr);
    if (n) {
      if (isValid(index, index + 1, n)) increaseBalls(index + 1, arr);
      if (isValid(index, index - 1, n)) increaseBalls(index - 1, arr);
      if (isValid(index, index + 10, n)) increaseBalls(index + 10, arr);
      if (isValid(index, index - 10, n)) increaseBalls(index - 10, arr);
    }
  };
});

server.listen(5000, () => {
  console.log("Server listening");
});
