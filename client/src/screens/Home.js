import React, { useEffect, useState } from "react";
import "../App.css";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import Game from "./Game";
import { toast } from "react-toastify";

export let socket = io("http://localhost:5000");

export default function Home() {
  const [game, setGame] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [gameCode, setGameCode] = useState(null);
  const [offline, setOffline] = useState(false);

  const newGame = () => {
    socket.emit("newGame");
  };

  useEffect(() => {
    if (gameData) {
      setShowGame(true);
    }
  }, [gameData]);

  useEffect(() => {
    socket.on("unknownCode", () => toast.error("Unknown Code"));
    socket.on("tooManyPlyers", () =>
      toast.error("Already 2 players in the room")
    );
    socket.once("newGame", (data) => {
      setGameData(data);
      toast.info("New game started");
    });
    socket.once("joinGame", (data) => {
      setGameData(data);
      toast.info("Player 2 joined");
    });
  }, []);

  const joinGame = () => {
    socket.emit("joinGame", gameCode);
  };

  return (
    <>
      {showGame ? (
        <Game gameData={gameData} offline={offline} />
      ) : (
        <>
          <img className="img" src="Gamelogo.png" alt="logo" />
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
              <>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <input
                    type="checkbox"
                    style={{ width: "auto" }}
                    onChange={() => setOffline(true)}
                  />
                  <h3
                    style={{ color: "white", textAlign: "center", margin: "0" }}
                  >
                    Want to play locally?
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    newGame();
                  }}
                >
                  Start
                </button>
              </>
            ) : (
              <form>
                <input
                  type="text"
                  placeholder="GameID"
                  onChange={(e) => {
                    setGameCode(e.target.value);
                  }}
                ></input>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    joinGame();
                  }}
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
}
