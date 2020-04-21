export default function createKeyboardListener(document) {
  const state = {
    observers: [],
    playerId: null
  };

  function registerPlayerId(playerId) {
    state.playerId = playerId;
  }

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  document.addEventListener("keydown", handleKeydown);

  function handleKeydown({ key: keyPressed }) {
    const { playerId } = state;

    const command = {
      playerId,
      keyPressed,
    };

    notifyAll(command);
  }

  return {
    subscribe,
    registerPlayerId
  };
}