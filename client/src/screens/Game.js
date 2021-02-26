import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import Ball from "../components/Ball";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

let socket = io("http://localhost:5000");

export default function Game() {
  const [gameState, setGameState] = useState([
    ...Array(100).fill({ n: 0, p: 0 }),
  ]);
  const [player, setPlayer] = useState(1);
  const step = useRef(0);

  const increaseBalls = (index, arr = [...gameState]) => {
    socket.emit("increaseBalls", { index, arr });

    socket.on("setGameState", (arr) => {
      setGameState(arr);
    });
  };

  useEffect(() => {
    if (step.current > 2) {
      let p = player === 1 ? 2 : 1;
      for (let i = 0; i < 100; i++) {
        let state = gameState[i];
        if (state.p === 0 || state.p === p) continue;
        else return;
      }
      socket.emit("winner", p);
    }
  }, [player]);

  useEffect(() => {
    console.log("Hello World");
    socket.on("init", (data) => {
      console.log(data);
      socket.emit("gameState", { gameState, player, step });
    });
    socket.on("playerChange", (data) => {
      setPlayer(data.player);
      step.current = data.step.current;
    });
    socket.on("win", (p) => {
      toast.success(`Player ${p} won`, {
        onClose: () => {
          socket.emit("gameState", {
            gameState: [...Array(100).fill({ n: 0, p: 0 })],
            player: 1,
            step: { current: 0 },
          });
          setGameState([...Array(100).fill({ n: 0, p: 0 })]);
          setPlayer(1);
          step.current = 0;
        },
      });
    });
  }, []);

  return (
    <>
      <div
        style={{
          color: `${player === 1 ? "#ff5c5c" : "#5cabff"}`,
          textAlign: "center",
          marginTop: "5px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >{`Player ${player} turn`}</div>
      <div className="game">
        {gameState.map((state, index) => (
          <div
            className="box"
            key={index}
            title={index}
            onClick={() => {
              if (state.p === 0 || state.p === player) {
                increaseBalls(index);
                socket.emit("played", {
                  step: { current: step.current + 1 },
                  player: player === 1 ? 2 : 1,
                });
              }
            }}
          >
            {state.n > 0 ? (
              state.n > 1 ? (
                state.n > 2 ? (
                  <>
                    <Ball number={"ball1"} player={state.p} />
                    <Ball number={"ball2"} player={state.p} />
                    <Ball number={"ball3"} player={state.p} />
                  </>
                ) : (
                  <>
                    <Ball number={"ball1"} player={state.p} />
                    <Ball number={"ball2"} player={state.p} />
                  </>
                )
              ) : (
                <Ball number={"ball1"} player={state.p} />
              )
            ) : undefined}
          </div>
        ))}
      </div>
    </>
  );
}
