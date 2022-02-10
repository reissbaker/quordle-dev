import { Component, createMemo } from "solid-js";
import { ALLOWED_SET, ANSWERS_SET, NUM_GAMES_X } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { BoxState, GameMode } from "./types";

type GameTileState = BoxState | "invalid";

type GameTileRendererProps = {
  gameRow: number;
  gameCol: number;
  state: GameTileState;
  letter: string;
};
export const GameTileRenderer: Component<GameTileRendererProps> = (props) => {
  return (
    <div
      class="quordle-box w-[20%]"
      classList={{
        "border-t-[1px]": props.gameRow === 0,
        "border-l-[1px]": props.gameCol === 0,
        "text-black bg-box-correct": props.state === "correct",
        "text-black bg-box-diff": props.state === "diff",
        "text-red-500": props.state === "invalid",
      }}
    >
      <div class="quordle-box-content" textContent={props.letter} />
    </div>
  );
};

type GameTileProps = {
  mode: GameMode;
  gameX: number;
  gameY: number;
  gameCol: number;
  gameRow: number;
};
const GameTile: Component<GameTileProps> = (props) => {
  const gameIndex = props.gameX + props.gameY * NUM_GAMES_X;

  const [gamesData] = useGamesDataContext();

  const shouldRenderLetter = createMemo(() => {
    const gameData = gamesData[props.mode];
    const current = gameData.current;
    const guesses = gameData.guesses;
    const answer = gameData.answers[gameIndex];
    const answerIndex = guesses.indexOf(answer);
    return (
      props.gameRow <= answerIndex ||
      (answerIndex === -1 && props.gameRow < guesses.length) ||
      (answerIndex === -1 &&
        props.gameRow === guesses.length &&
        props.gameCol < current.length)
    );
  });

  const letter = createMemo(() => {
    const gameData = gamesData[props.mode];
    const guesses = gameData.guesses;
    const current = gameData.current;
    let letter: string = "";
    if (!shouldRenderLetter()) {
      return letter;
    } else if (props.gameRow < guesses.length) {
      letter = guesses[props.gameRow][props.gameCol];
    } else if (props.gameRow === guesses.length) {
      letter = current[props.gameCol];
    }
    return letter.toUpperCase();
  });

  const gameTileState = createMemo((): GameTileState => {
    const gameData = gamesData[props.mode];
    const guesses = gameData.guesses;
    const states = gameData.states;
    const current = gameData.current;
    if (shouldRenderLetter()) {
      if (props.gameRow < guesses.length) {
        return states[gameIndex][props.gameRow]?.[props.gameCol] || "none";
      } else if (
        props.gameRow === guesses.length &&
        current.length === 5 &&
        !ALLOWED_SET.has(current) &&
        !ANSWERS_SET.has(current)
      ) {
        return "invalid";
      }
    }
    return "none";
  });

  return (
    <GameTileRenderer
      state={gameTileState()}
      letter={letter()}
      gameRow={props.gameRow}
      gameCol={props.gameCol}
    />
  );
};

export default GameTile;
