import "../App.css";
import styled, { keyframes } from "styled-components";

const animate = (color) => keyframes`
    0% {
    background: radial-gradient(circle at 5px 5px, ${color}, #000);
  }
  25% {
    background: radial-gradient(circle at 7px 5px, ${color}, #000);
  }
  50% {
    background: radial-gradient(circle at 9px 5px, ${color}, #000);
  }
  75% {
    background: radial-gradient(circle at 11px 5px, ${color}, #000);
  }
  100% {
    background: radial-gradient(circle at 13px 5px, ${color}, #000);
  }
`;

const move = keyframes`
  0%{
    transform: translate(-5px,-5px);
  }
  100%{
    transform: translate(0 ,0)
  }
`;

const Ball = styled.div.attrs((props) => ({
  id: props.number,
}))`
  width: 40%;
  height: 45%;
  border-radius: 50%;
  margin: 5px auto;
  background: radial-gradient(
    circle at 5px 5px,
    ${(props) => (props.player === 2 ? " #5cabff" : "#ff5c5c")},
    #000
  );
  animation: ${(props) =>
        props.player === 2 ? animate("#5cabff") : animate("#ff5c5c")}
      2s linear infinite alternate-reverse,
    ${move} 0.2s linear 1;
`;

export default Ball;
