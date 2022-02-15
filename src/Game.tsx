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
import { createResizeObserverPoly } from "./ResizeObserverPoly";
import Settings from "./Settings";
import Statistics from "./Statistics";
import Tutorial from "./Tutorial";
import { GameMode } from "./types";
import { gtagWrap, vibrate } from "./utils";

type SubPageWrapperProps = {
  open: boolean;
  fontSize: number;
};
const SubPageWrapper: Component<SubPageWrapperProps> = (props) => {
  return (
    <div
      class="absolute w-full h-full text-black dark:text-white bg-white dark:bg-gray-800 overflow-auto transition-all ease-in-out duration-500"
      classList={{
        "opacity-100 top-0": props.open,
        "opacity-0 top-[100%]": !props.open,
      }}
      style={{
        "font-size": props.fontSize + "px",
      }}
    >
      {props.children}
    </div>
  );
};

/**
 * Create resize observer is a helper primitive for binding resize events.
 *
 * @param opts.refs - Either an `Element`, an array of `Element`s, or a signal returning one of these.
 * @param opts.onResize - Function handler to trigger on resize
 * @return A callback that can be used to add refs to observe resizing
 *
 */

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
    <div class="flex flex-col flex-auto p-1">
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

  const tutorialOpen = createMemo(() => searchParams.overlay === "tutorial");
  const statisticsOpen = createMemo(
    () => searchParams.overlay === "statistics"
  );
  const settingsOpen = createMemo(() => searchParams.overlay === "settings");

  const refCallback = createResizeObserverPoly({
    onResize: ({ width }) => {
      if (width) {
        setFontSize(width / 15);
      }
    },
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
        mode={props.mode}
        onOpenTutorial={() => {
          vibrate(gamesData.vibration);
          gtagWrap("event", "tutorial", {
            mode: props.mode,
          });
          setSearchParams({ overlay: "tutorial" });
        }}
        onOpenStatistics={() => {
          vibrate(gamesData.vibration);
          gtagWrap("event", "statistics", {
            mode: props.mode,
          });
          setSearchParams({ overlay: "statistics" });
        }}
        onOpenSettings={() => {
          vibrate(gamesData.vibration);
          gtagWrap("event", "settings", {
            mode: props.mode,
          });
          setSearchParams({ overlay: "settings" });
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
        class="quordle-desktop-scrollbar max-w-[550px] m-auto w-full flex-auto"
        classList={{
          "overflow-hidden": tutorialOpen() || statisticsOpen(),
          "overflow-auto": !(tutorialOpen() || statisticsOpen()),
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
      <SubPageWrapper open={settingsOpen()} fontSize={fontSize()}>
        <Settings
          onCloseSettings={() => {
            vibrate(gamesData.vibration);
            setSearchParams({ overlay: undefined });
          }}
        />
      </SubPageWrapper>
      <SubPageWrapper open={statisticsOpen()} fontSize={fontSize()}>
        <Statistics
          mode={props.mode}
          onCloseStatistics={() => {
            vibrate(gamesData.vibration);
            setSearchParams({ overlay: undefined });
          }}
        />
      </SubPageWrapper>
      <SubPageWrapper open={tutorialOpen()} fontSize={fontSize()}>
        <Tutorial
          onCloseTutorial={() => {
            vibrate(gamesData.vibration);
            setSearchParams({ overlay: undefined });
          }}
        />
      </SubPageWrapper>
    </div>
  );
};

export default Game;
