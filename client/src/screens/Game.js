import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import Ball from "../components/Ball";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "./Home";

export default function Game(props) {
  const [gameState, setGameState] = useState(props.gameData.gameState.grid);
  const [player, setPlayer] = useState(1);
  const step = useRef(props.gameData.gameState.player);
  const [playerId, setPlayerId] = useState(0);
  const audio = useRef(new Audio("audio.mp3"));

  const increaseBalls = (index, arr = [...gameState]) => {
    socket.emit("increaseBalls", {
      index,
      arr,
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
    socket.on("joinGame", () => {
      setPlayerId(props.gameData.id);
    });
    if ((playerId === 0 && props.gameData.id === 2) || props.offline)
      setPlayerId(2);
    socket.on("playerChange", (data) => {
      setPlayer(data.player);
      step.current = data.step.current;
    });
    socket.once("win", (p) => {
      toast.success(
        `Player ${p} won, ${
          props.offline
            ? ""
            : playerId === p
            ? "Congratulation!"
            : "Played Well!"
        }`,
        {
          onClose: () => {
            window.location.reload();
          },
        }
      );
      setPlayerId(0);
    });
    socket.on("setGameState", (arr) => {
      setGameState(arr);
    });
  }, []);

  useEffect(() => {
    if (playerId !== 0) audio.current.play();
  }, [gameState]);

  return (
    <>
      {!props.offline ? (
        <h4 style={{ color: "white", textAlign: "center" }}>
          Game Code (Share this to play online): {props.gameData.gameCode}
        </h4>
      ) : undefined}
      <div
        style={{
          color: `${player === 1 ? "#ff5c5c" : "#5cabff"}`,
          textAlign: "center",
          marginTop: "5px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {`Player ${player} turn`}{" "}
        {props.offline ? "" : player === playerId ? "(Make your move)" : ""}
      </div>
      <div className="game">
        {gameState.map((state, index) => (
          <div
            className="box"
            key={index}
            onClick={() => {
              if (
                (state.p === 0 || state.p === player) &&
                (props.offline || playerId === player)
              ) {
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
