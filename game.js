let gameState, player, step;

const isValid = (i, index, n) => {
  if (n === 1) {
    if (i === 0) {
      if (index === i + 1 || index === i + 10) return true;
      else return false;
    } else if (i === 9) {
      if (index === i - 1 || index === i + 10) return true;
      else return false;
    } else if (i === 90) {
      console.log(index, i);
      if (index === i + 1 || index === i - 10) return true;
      else return false;
    } else if (i === 99) {
      if (index === i - 1 || index === i - 10) return true;
      else return false;
    }
  } else if (n === 2) {
    if (i % 10 === 0) {
      if (index === i - 1) return false;
      else return true;
    } else {
      if (index === i + 1) return false;
      else return true;
    }
  } else if (n === 3) {
    return true;
  }
};

const isValidFor3 = (index) => {
  return (
    index - 1 >= 0 &&
    index + 1 < gameState.length &&
    index + 10 < gameState.length &&
    index - 10 >= 0 &&
    index % 10 !== 0 &&
    index % 10 !== 9
  );
};

const isNotValidFor2 = (index) => {
  return index === 0 || index === 9 || index === 90 || index === 99;
};

const initializeGame = (data) => {
  gameState = data.gameState;
  player = data.player;
  step = data.step;
};

module.exports = {
  gameState,
  player,
  step,
  isValid,
  isNotValidFor2,
  isValidFor3,
  initializeGame,
};
