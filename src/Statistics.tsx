import { Component, createMemo, createSignal } from "solid-js";
import { GAME_ROWS, NUM_GAMES } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { GameMode } from "./types";

const winHistoryIndices = [...Array(GAME_ROWS - (NUM_GAMES - 1)).keys()].map(
  (x) => x + (NUM_GAMES - 1)
);
const lossHistoryIndices = [...Array(NUM_GAMES).keys()]
  .map((x) => x + GAME_ROWS)
  .reverse();

type StatisticsProps = {
  mode: GameMode;
  onCloseStatistics: () => void;
};
const Statistics: Component<StatisticsProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  const [lossDistributionOpen, setLossDistributionOpen] = createSignal(false);

  const winMaxValue = createMemo(() =>
    Math.max(
      ...gamesData[props.mode].history.slice(NUM_GAMES - 1, GAME_ROWS),
      1
    )
  );
  const lossMaxValue = createMemo(() =>
    Math.max(...gamesData[props.mode].history.slice(GAME_ROWS), 1)
  );

  const numWins = createMemo(() =>
    gamesData[props.mode].history
      .slice(NUM_GAMES - 1, GAME_ROWS)
      .reduce((prev, num) => prev + num, 0)
  );

  const numLosses = createMemo(() =>
    gamesData[props.mode].history
      .slice(GAME_ROWS)
      .reduce((prev, num) => prev + num, 0)
  );

  const totalGames = createMemo(() => numWins() + numLosses());

  const currentGameNumCorrect = createMemo(() =>
    gamesData[props.mode].answersCorrect.reduce(
      (prev, correct) => (prev += correct >= 0 ? 1 : 0),
      0
    )
  );
  const currentGameMaxCorrect = createMemo(() =>
    Math.max(...gamesData[props.mode].answersCorrect)
  );
  const currentGameWin = createMemo(
    () =>
      gamesDataFuncs.isGameComplete(props.mode) &&
      currentGameNumCorrect() === NUM_GAMES
  );
  const currentGameLoss = createMemo(
    () =>
      gamesDataFuncs.isGameComplete(props.mode) &&
      currentGameNumCorrect() < NUM_GAMES
  );

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
            <span class="text-base text-gray-300">Played</span>
          </div>
          <div class="flex flex-col text-center flex-1">
            <span class="text-xl">
              {Math.round(
                (totalGames() > 0 ? numWins() / totalGames() : 0) * 100
              )}
            </span>
            <span class="text-base text-gray-300">Win %</span>
          </div>
          <div class="flex flex-col text-center flex-1">
            <span class="text-xl">{gamesData[props.mode].currentStreak}</span>
            <span class="text-base text-gray-300">
              Current
              <br />
              Streak
            </span>
          </div>
          <div class="flex flex-col text-center flex-1">
            <span class="text-xl">{gamesData[props.mode].maxStreak}</span>
            <span class="text-base text-gray-300">
              Max
              <br />
              Streak
            </span>
          </div>
        </div>
        <div class="text-4xl mt-8 text-center">Win Distribution</div>
        <div class="text-lg mb-4 text-center">
          (total # guesses to complete all 4 words)
        </div>
        <div class="text-lg">
          {winHistoryIndices.map((i) => (
            <div class="flex flex-row mb-1">
              <div class="mr-2">{i + 1}</div>
              <div
                class="min-w-min text-right px-2"
                classList={{
                  "bg-box-correct text-black":
                    currentGameWin() && currentGameMaxCorrect() === i,
                  "bg-gray-700 text-white": !(
                    currentGameWin() && currentGameMaxCorrect() === i
                  ),
                }}
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
        {numLosses() > 0 && (
          <>
            <div class="flex flex-row text-base mt-6 mb-1 px-2">
              <div class="flex-1">Win - {numWins()}</div>
              <div class="flex-1 text-right">{numLosses()} - Loss</div>
            </div>
            <div
              class="text-black text-base font-bold flex flex-row items-center cursor-pointer"
              onClick={() => setLossDistributionOpen(!lossDistributionOpen())}
            >
              <div
                class="bg-box-correct h-6 rounded-l-xl"
                style={{ width: (numWins() / totalGames()) * 100 + "%" }}
              />
              <div
                class="bg-rose-900 text-right h-6 rounded-r-xl"
                style={{ width: (numLosses() / totalGames()) * 100 + "%" }}
              />
            </div>
          </>
        )}
        {lossDistributionOpen() && (
          <>
            <div class="text-4xl mt-8 text-center">Loss Distribution</div>
            <div class="text-lg mb-4 text-center">(# words missed)</div>
            <div class="text-lg">
              {lossHistoryIndices.map((i) => (
                <div class="flex flex-row mb-1">
                  <div class="mr-2">{NUM_GAMES - (i - GAME_ROWS)}</div>
                  <div
                    class="min-w-min text-right px-2"
                    classList={{
                      "bg-rose-900":
                        currentGameLoss() &&
                        currentGameNumCorrect() === i - GAME_ROWS,
                      "bg-gray-700": !(
                        currentGameLoss() &&
                        currentGameNumCorrect() === i - GAME_ROWS
                      ),
                    }}
                    style={{
                      width:
                        (gamesData[props.mode].history[i] / lossMaxValue()) *
                          100 +
                        "%",
                    }}
                  >
                    {gamesData[props.mode].history[i]}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistics;
