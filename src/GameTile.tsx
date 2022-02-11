import { Component, createMemo } from "solid-js";
import { ALLOWED_SET, ANSWERS_SET, NUM_GAMES_X } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { BoxState, GameMode } from "./types";

type GameTileState = BoxState | "invalid";
type TemporalState = "past" | "present" | "future" | "never";

type GameTileRendererProps = {
  gameRow: number;
  gameCol: number;
  state: GameTileState;
  letter: string;
  rowTemporalState: TemporalState;
};
export const GameTileRenderer: Component<GameTileRendererProps> = (props) => {
  return (
    <div
      class="quordle-box w-[20%]"
      classList={{
        "text-black bg-box-correct": props.state === "correct",
        "text-black bg-box-diff": props.state === "diff",
        "text-red-500": props.state === "invalid",
        "quordle-box-present": props.rowTemporalState === "present",
        "quordle-box-past": props.rowTemporalState === "past",
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

  const temporalState = createMemo((): TemporalState => {
    const gameData = gamesData[props.mode];
    const guesses = gameData.guesses;
    const answer = gameData.answers[gameIndex];
    const answerIndex = guesses.indexOf(answer);

    // Have we already answered this row? We will never guess post-answer
    if(answerIndex !== -1 && answerIndex <= props.gameRow) return "never";

    if(guesses.length > props.gameRow) return "past";

    if(props.gameRow === guesses.length) return "present";
    return "future";
  });

  return (
    <GameTileRenderer
      state={gameTileState()}
      letter={letter()}
      gameRow={props.gameRow}
      gameCol={props.gameCol}
      rowTemporalState={temporalState()}
    />
  );
};

export default GameTile;
