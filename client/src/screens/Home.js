import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import Game from "./Game";

let socket = io("http://localhost:5000");

export default function Home() {
  const [game, setGame] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [gameCode, setGameCode] = useState(null);

  const newGame = () => {
    socket.emit("newGame");

    socket.on("gameCode", (data) => {
      setGameCode(data);
      console.log(data);
    });
  };

  useEffect(() => {
    if (gameCode) {
      setShowGame(true);
    }
  }, [gameCode]);

  const joinGame = () => {};
  return (
    <>
      {showGame ? (
        <Game gameCode={gameCode} />
      ) : (
        <>
          <div className="form">
            <h1>Spread to Win</h1>
            <div className="tabs">
              <div
                className={`tab-element ${game === 0 ? "active" : ""}`}
                onClick={() => setGame(0)}
              >
                New Game
              </div>
              <div
                className={`tab-element ${game === 1 ? "active" : ""}`}
                onClick={() => setGame(1)}
              >
                Join Game
              </div>
            </div>
            {game === 0 ? (
              <form>
                <input type="text" placeholder="Name"></input>
                <button onClick={newGame}>Start</button>
              </form>
            ) : (
              <form>
                <input type="text" placeholder="GameID"></input>
                <button onClick={joinGame}>Join</button>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
}
