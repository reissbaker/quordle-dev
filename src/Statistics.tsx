import { Component, createMemo } from "solid-js";
import { useGamesDataContext } from "./GameDataProvider";
import { GameMode } from "./types";

const winHistoryIndices = [3, 4, 5, 6, 7, 8];
const lossHistoryIndices = [9, 10, 11, 12];

type StatisticsProps = {
  mode: GameMode;
  onCloseStatistics: () => void;
};
const Statistics: Component<StatisticsProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  const winMaxValue = createMemo(() =>
    Math.max(...gamesData[props.mode].history.slice(3, 9), 1)
  );
  const lossMaxValue = createMemo(() =>
    Math.max(...gamesData[props.mode].history.slice(9), 1)
  );

  const numWins = createMemo(() =>
    gamesData[props.mode].history
      .slice(3, 9)
      .reduce((prev, num) => prev + num, 0)
  );

  const numLosses = createMemo(() =>
    gamesData[props.mode].history.slice(9).reduce((prev, num) => prev + num, 0)
  );

  const totalGames = createMemo(() => numWins() + numLosses());

  return (
    <div class="w-full h-full overflow-auto">
      <div class="w-full flex flex-row-reverse pr-4 pt-2">
        <button
          type="button"
          class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white"
          onClick={props.onCloseStatistics}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="max-w-[550px] m-auto w-full px-6">
        <div class="text-4xl mt-2 mb-4 text-center">
          {props.mode === "daily" ? "Daily" : "Practice"} Statistics
        </div>
        <div class="flex flex-row">
          <div class="flex flex-col text-center flex-1">
            <span class="text-xl">{numWins() + numLosses()}</span>
            <span class="text-base">Played</span>
          </div>
          <div class="flex flex-col text-center flex-1">
            <span class="text-xl">
              {(totalGames() > 0 ? numWins() / totalGames() : 0) * 100}
            </span>
            <span class="text-base">Win %</span>
          </div>
          <div class="flex flex-col text-center flex-1">
            <span class="text-xl">{gamesData[props.mode].currentStreak}</span>
            <span class="text-base">
              Current
              <br />
              Streak
            </span>
          </div>
          <div class="flex flex-col text-center flex-1">
            <span class="text-xl">{gamesData[props.mode].maxStreak}</span>
            <span class="text-base">
              Max
              <br />
              Streak
            </span>
          </div>
        </div>
        <div class="text-4xl mt-8 text-center">Win Distribution</div>
        <div class="text-lg mb-4 text-center">(# of guesses to complete)</div>
        <div class="text-lg">
          {winHistoryIndices.map((i) => (
            <div class="flex flex-row mb-1">
              <div class="mr-2">{i + 1}</div>
              <div
                class="min-w-min bg-gray-900 px-2"
                style={{
                  width:
                    (gamesData[props.mode].history[i] / winMaxValue()) * 100 +
                    "%",
                }}
              >
                {gamesData[props.mode].history[i]}
              </div>
            </div>
          ))}
        </div>
        <div class="text-4xl mt-8 text-center">Loss Distribution</div>
        <div class="text-lg mb-4 text-center">(# of words correct)</div>
        <div class="text-lg">
          {lossHistoryIndices.map((i) => (
            <div class="flex flex-row mb-1">
              <div class="mr-2">{i - 9}</div>
              <div
                class="min-w-min bg-gray-900 px-2"
                style={{
                  width:
                    (gamesData[props.mode].history[i] / lossMaxValue()) * 100 +
                    "%",
                }}
              >
                {gamesData[props.mode].history[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
