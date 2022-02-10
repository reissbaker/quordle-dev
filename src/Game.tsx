import createResizeObserver from "@solid-primitives/resize-observer";
import { useSearchParams } from "solid-app-router";
import { Component, createMemo, createSignal, onCleanup } from "solid-js";
import {
  GAME_COLS,
  GAME_ROWS,
  IS_IN_WEB_APP_IOS,
  NUM_GAMES_X,
  NUM_GAMES_Y,
} from "./constants";
import GameCompleteBanner from "./GameCompleteBanner";
import { useGamesDataContext } from "./GameDataProvider";
import GameShare from "./GameShare";
import GameSquare from "./GameTile";
import Header from "./Header";
import Keyboard from "./Keyboard";
import Tutorial from "./Tutorial";
import { GameMode } from "./types";
import { gtagWrap } from "./utils";

const NUM_GAMES_X_ARR = [...Array(NUM_GAMES_X).keys()];
const NUM_GAMES_Y_ARR = [...Array(NUM_GAMES_Y).keys()];
const GAME_ROWS_ARR = [...Array(GAME_ROWS).keys()];
const GAME_COLS_ARR = [...Array(GAME_COLS).keys()];

type GameQuadrantProps = {
  mode: GameMode;
  gameX: number;
  gameY: number;
};
const GameQuadrant: Component<GameQuadrantProps> = (props) => {
  return (
    <div
      class={`flex flex-col flex-auto ${
        props.gameX === 0 ? "mr-[4px]" : "ml-[4px]"
      } ${props.gameY === 0 ? "mb-[4px]" : "mt-[4px]"}`}
    >
      {GAME_ROWS_ARR.map((rowIndex) => (
        <div class="flex w-full">
          {GAME_COLS_ARR.map((colIndex) => (
            <GameSquare
              mode={props.mode}
              gameX={props.gameX}
              gameY={props.gameY}
              gameRow={rowIndex}
              gameCol={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

type GameProps = {
  mode: GameMode;
};
const Game: Component<GameProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  const [searchParams, setSearchParams] = useSearchParams();

  const [fontSize, setFontSize] = createSignal(35);

  const keyEventListener = (e: KeyboardEvent) => {
    gamesDataFuncs.sendKey(props.mode, e);
  };
  document.addEventListener("keydown", keyEventListener);
  onCleanup(() => document.removeEventListener("keydown", keyEventListener));

  const tutorialOpen = createMemo(() => searchParams.tutorial === "true");

  const refCallback = createResizeObserver({
    onResize: ({ width }) => setFontSize(width / 15),
  });

  return (
    <div
      class="w-full absolute flex flex-col overflow-hidden"
      classList={{
        "h-full": !IS_IN_WEB_APP_IOS,
        "h-[calc(100%-25px)] bottom-[25px]": IS_IN_WEB_APP_IOS,
      }}
    >
      <Header
        onOpenTutorial={() => {
          gtagWrap("event", "tutorial");
          setSearchParams({ tutorial: true });
        }}
      />
      <div
        class="max-w-[550px] m-auto w-full"
        style={{
          "font-size": fontSize() + "px",
        }}
      >
        {gamesDataFuncs.isGameComplete(props.mode) && (
          <GameCompleteBanner mode={props.mode} />
        )}
      </div>
      <div
        class="max-w-[550px] m-auto w-full flex-auto"
        classList={{
          "overflow-hidden": tutorialOpen(),
          "overflow-auto": !tutorialOpen(),
        }}
        style={{
          "font-size": fontSize() + "px",
        }}
        ref={refCallback}
      >
        <div class="w-full flex-col">
          {NUM_GAMES_Y_ARR.map((gameY) => (
            <div class="flex w-full">
              {NUM_GAMES_X_ARR.map((gameX) => (
                <GameQuadrant mode={props.mode} gameX={gameX} gameY={gameY} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        class="max-w-[550px] m-auto w-full"
        style={{
          "font-size": fontSize() + "px",
        }}
      >
        {gamesDataFuncs.isGameComplete(props.mode) ? (
          <GameShare mode={props.mode} />
        ) : (
          <Keyboard mode={props.mode} />
        )}
      </div>
      <div
        class="absolute w-full h-full bg-gray-800 overflow-auto transition-all ease-in-out duration-500"
        classList={{
          "opacity-100 top-0": tutorialOpen(),
          "opacity-0 top-[100%]": !tutorialOpen(),
        }}
        style={{
          "font-size": fontSize() + "px",
        }}
      >
        <Tutorial
          onCloseTutorial={() => setSearchParams({ tutorial: undefined })}
        />
      </div>
    </div>
  );
};

export default Game;
