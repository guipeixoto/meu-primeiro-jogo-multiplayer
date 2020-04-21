export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  };

  const observers = [];

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const { playerId } = command;
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
    });
  }

  function removePlayer(command) {
    const { playerId } = command;

    delete state.players[playerId];

    notifyAll({
      type: 'remove-player',
      playerId
    });
  }

  function addFruit(command) {
    const { fruitId, fruitX, fruitY } = command;

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
  }

  function removeFruit(command) {
    const { fruitId } = command;

    delete state.fruits[fruitId];
  }

  function movePlayer(command) {
    const acceptedMoves = {
      ArrowUp(player) {
        player.y = Math.max(player.y - 1, 0);
      },

      ArrowDown(player) {
        player.y = Math.min(player.y + 1, state.screen.height - 1);
      },

      ArrowLeft(player) {
        player.x = Math.max(player.x - 1, 0);
      },

      ArrowRight(player) {
        player.x = Math.min(player.x + 1, state.screen.width - 1);
      },
    };

    const { keyPressed, playerId } = command;
    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollition(playerId);
    }
  }

  function checkForFruitCollition(playerId) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      if (JSON.stringify(player) === JSON.stringify(fruit)) {
        removeFruit({ fruitId });
      }
    }
  }

  return {
    subscribe,
    setState,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    state,
  };
}