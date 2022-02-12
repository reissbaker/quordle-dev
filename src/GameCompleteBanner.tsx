import { Component, createMemo, createSignal, JSX, onCleanup } from "solid-js";
import { GAME_PERIOD_MS, START_DATE } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { PlusIcon } from "./icons";
import { GameMode } from "./types";
import { padNumber, timeUntil, vibrate } from "./utils";

const timeBetween = (date1: Date, date2: Date) => {
  let delta = Math.floor(Math.abs(date2.getTime() - date1.getTime()) / 1000);

  if (delta >= 3600) {
    return timeUntil(date1, date2);
  }

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  const seconds = delta % 60;

  return `in ${padNumber(minutes, 2)}m ${padNumber(seconds, 2)}s`;
};

type NewGameButtonProps = {
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  class?: string;
};
const NewGameButton: Component<NewGameButtonProps> = (props) => {
  return (
    <button
      type="button"
      class={`text-lg min-h-[50px] text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 text-center dark:bg-gray-700 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-gray-800 dark:focus:ring-gray-900 ${props.class}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

type GameCompleteBannerProps = {
  mode: GameMode;
};
const GameCompleteBanner: Component<GameCompleteBannerProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  const numWordsCorrect = createMemo(() =>
    gamesData[props.mode].answersCorrect.reduce(
      (prev, correct) => (prev += correct >= 0 ? 1 : 0),
      0
    )
  );

  const nextDailyTime = createMemo(() => {
    return new Date(
      START_DATE.getTime() + (gamesData[props.mode].seed + 1) * GAME_PERIOD_MS
    );
  });

  const [currentDate, setCurrentDate] = createSignal(new Date());

  const timer = setInterval(() => setCurrentDate(new Date()), 1000);
  onCleanup(() => clearInterval(timer));

  return (
    <div class="p-4 rounded-b-lg text-center bg-gray-900 border-b-2 border-gray-800">
      <div
        class="text-4xl pb-2"
        classList={{
          "text-green-500": numWordsCorrect() === 4,
          "text-yellow-400": numWordsCorrect() === 3,
          "text-orange-500": numWordsCorrect() === 2,
          "text-red-500": numWordsCorrect() <= 1,
        }}
      >
        {numWordsCorrect() === 4
          ? "Quordle Complete!"
          : numWordsCorrect() === 3
          ? "So Close!"
          : "Better Luck Next Time!"}
      </div>
      {props.mode === "free" ? (
        <NewGameButton
          onClick={() => {
            vibrate();
            gamesDataFuncs.resetFree();
          }}
        >
          <div class="flex items-center justify-center">
            <PlusIcon />
            <div class="ml-2">New Practice Game</div>
          </div>
        </NewGameButton>
      ) : (
        <div>Next Daily {timeBetween(currentDate(), nextDailyTime())}</div>
      )}
    </div>
  );
};

export default GameCompleteBanner;
