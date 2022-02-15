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
  activeCol: number;
  colorblind: boolean;
};
export const GameTileRenderer: Component<GameTileRendererProps> = (props) => {
  return (
    <div
      class="quordle-box w-[20%] pb-[calc(20%-0.25rem)]"
      classList={{
        "bg-box-correct": props.state === "correct" && !props.colorblind,
        "bg-box-correct-alt": props.state === "correct" && props.colorblind,
        "bg-box-diff": props.state === "diff" && !props.colorblind,
        "bg-box-diff-alt": props.state === "diff" && props.colorblind,
        "bg-gray-200 dark:bg-gray-700":
          props.state === "none" && props.rowTemporalState === "past",
        "bg-gray-300 dark:bg-gray-600": props.rowTemporalState === "present",
        "bg-gray-100 dark:bg-gray-900":
          props.rowTemporalState === "future" ||
          props.rowTemporalState === "never",
        "text-black": props.state === "correct" || props.state === "diff",
        "text-rose-600": props.state === "invalid",
        "text-black dark:text-white": props.state === "none",
        "quordle-heartbeat-anim dark:quordle-heartbeat-anim-dark":
          props.activeCol === props.gameCol &&
          props.rowTemporalState === "present",
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

  const activeCol = createMemo((): number => {
    const gameData = gamesData[props.mode];
    const current = gameData.current;
    return current.length;
  });

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
    const answerIndex = gameData.answersCorrect[gameIndex];

    // Have we already answered this row? We will never guess post-answer
    if (answerIndex !== -1 && answerIndex < props.gameRow) return "never";

    if (guesses.length > props.gameRow) return "past";

    if (props.gameRow === guesses.length) return "present";
    return "future";
  });

  return (
    <GameTileRenderer
      state={gameTileState()}
      letter={letter()}
      gameRow={props.gameRow}
      gameCol={props.gameCol}
      rowTemporalState={temporalState()}
      activeCol={activeCol()}
      colorblind={gamesData.colorblind}
    />
  );
};

export default GameTile;
