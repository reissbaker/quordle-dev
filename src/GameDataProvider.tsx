import MersenneTwister from "mersenne-twister";
import { Component, createContext, createEffect, useContext } from "solid-js";
import {
  createStore,
  DeepReadonly,
  produce,
  SetStoreFunction,
  Store,
} from "solid-js/store";
import {
  ALLOWED_SET,
  ALPHABET,
  ANSWERS,
  ANSWERS_SET,
  BLACKLIST_SET,
  GAME_COLS,
  GAME_PERIOD_MS,
  GAME_ROWS,
  NUM_GAMES,
  START_DATE,
} from "./constants";
import {
  BoxState,
  GameData,
  GameMode,
  GamesData,
  GamesDataProviderFuncs,
} from "./types";
import { gtagWrap } from "./utils";

export const generateBoxStatesFromGuess = (
  guess: string,
  answer: string
): BoxState[] => {
  const ans = answer.split("");
  const gue = guess.split("");
  const states: BoxState[] = new Array(GAME_COLS).fill("none");
  const guessLetters: { [letter: string]: number } = {};

  for (let column = 0; column < GAME_COLS; column++) {
    guessLetters[gue[column]] = 0;
  }
  for (let column = 0; column < GAME_COLS; column++) {
    if (ans[column] === gue[column]) {
      ans[column] = " ";
      guessLetters[gue[column]] = 2;
      gue[column] = " ";
      states[column] = "correct";
    }
  }
  for (let column = 0; column < GAME_COLS; column++) {
    if (
      ans.indexOf(gue[column]) !== -1 &&
      ans[column] !== gue[column] &&
      gue[column] !== " "
    ) {
      if (guessLetters[gue[column]] != 2) {
        guessLetters[gue[column]] = 1;
      }
      ans[ans.indexOf(gue[column])] = " ";
      states[column] = "diff";
    }
  }

  return states;
};

export const generateAllGamesBoxStates = (
  guesses: string[],
  answers: string[]
): BoxState[][][] => {
  const states: BoxState[][][] = [[], [], [], []];
  for (let i = 0; i < answers.length; i++) {
    const guessIndex = guesses.indexOf(answers[i]);
    for (let g = 0; g < guesses.length; g++) {
      if (g <= guessIndex || guessIndex === -1) {
        states[i].push(generateBoxStatesFromGuess(guesses[g], answers[i]));
      }
    }
  }
  return states;
};

export const generateWordsFromSeed = (seed: number): string[] => {
  let answers: string[] | undefined;
  const rnd = new MersenneTwister(seed);
  rnd.random_int31();
  rnd.random_int31();
  rnd.random_int31();
  rnd.random_int31();
  do {
    answers = [
      ANSWERS[rnd.random_int31() % ANSWERS.length],
      ANSWERS[rnd.random_int31() % ANSWERS.length],
      ANSWERS[rnd.random_int31() % ANSWERS.length],
      ANSWERS[rnd.random_int31() % ANSWERS.length],
    ];
  } while (
    answers[0] === answers[1] ||
    answers[0] === answers[2] ||
    answers[0] === answers[3] ||
    answers[1] === answers[2] ||
    answers[1] === answers[3] ||
    answers[2] === answers[3] ||
    BLACKLIST_SET.has(answers[0]) ||
    BLACKLIST_SET.has(answers[1]) ||
    BLACKLIST_SET.has(answers[2]) ||
    BLACKLIST_SET.has(answers[3])
  );
  return answers;
};

function createLocalStore(): [Store<GamesData>, SetStoreFunction<GamesData>] {
  const date = new Date();
  const currentDailySeed =
    ((date.getTime() - START_DATE.getTime()) / GAME_PERIOD_MS) >> 0;
  const gamesData: GamesData = {
    daily: {
      seed: 0,
      guesses: [],
      answers: [],
      current: "",
      states: [[], [], [], []],
      answersCorrect: [-1, -1, -1, -1],
      history: new Array(GAME_ROWS + 4).fill(0),
      currentStreak: 0,
      maxStreak: 0,
    },
    free: {
      seed: 0,
      guesses: [],
      answers: [],
      current: "",
      states: [[], [], [], []],
      answersCorrect: [-1, -1, -1, -1],
      history: new Array(GAME_ROWS + 4).fill(0),
      currentStreak: 0,
      maxStreak: 0,
    },
    darkMode: true,
  };
  const osDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  try {
    const darkMode = window.localStorage.getItem("dark_mode");
    if (darkMode === null) {
      gamesData.darkMode = osDarkMode;
    } else {
      gamesData.darkMode = darkMode === "true";
    }
  } catch (e) {
    gamesData.darkMode = osDarkMode;
  }
  (["daily", "free"] as GameMode[]).forEach((mode) => {
    let gameData: GameData;
    try {
      const lastSeed = Number(window.localStorage.getItem("last_" + mode));
      const guesses = window.localStorage.getItem(mode + "_guesses") || "";
      const historyStr = window.localStorage.getItem(mode + "_history");
      const history = historyStr
        ? historyStr.split(",").map(Number)
        : new Array(GAME_ROWS + 4).fill(0);
      const currentStreak = Number(
        window.localStorage.getItem(mode + "_current_streak") || 0
      );
      const maxStreak = Number(
        window.localStorage.getItem(mode + "_max_streak") || 0
      );
      if (lastSeed && (mode === "free" || lastSeed === currentDailySeed)) {
        const guessesArr = guesses ? guesses.split(",") : [];
        const answers = generateWordsFromSeed(lastSeed);
        gameData = {
          seed: lastSeed,
          guesses: guessesArr,
          answers,
          current: "",
          states: generateAllGamesBoxStates(guessesArr, answers),
          answersCorrect: [0, 1, 2, 3].map((i) =>
            guessesArr.indexOf(answers[i])
          ),
          history,
          currentStreak,
          maxStreak,
        };
        gtagWrap("event", "restore", {
          mode: mode,
          daily_seed: mode === "daily" ? lastSeed : undefined,
        });
      } else {
        const seed = mode === "daily" ? currentDailySeed : date.getTime();
        const answers = generateWordsFromSeed(seed);
        gameData = {
          seed: seed,
          guesses: [],
          answers,
          current: "",
          states: generateAllGamesBoxStates([], answers),
          answersCorrect: [-1, -1, -1, -1],
          history,
          currentStreak,
          maxStreak,
        };
        gtagWrap("event", "start", {
          mode: mode,
          daily_seed: mode === "daily" ? seed : undefined,
        });
      }
    } catch (e) {
      const seed = mode === "daily" ? currentDailySeed : date.getTime();
      const answers = generateWordsFromSeed(seed);
      gameData = {
        seed: seed,
        guesses: [],
        answers,
        current: "",
        states: generateAllGamesBoxStates([], answers),
        answersCorrect: [-1, -1, -1, -1],
        history: new Array(GAME_ROWS + 4).fill(0),
        currentStreak: 0,
        maxStreak: 0,
      };
      gtagWrap("event", "start", {
        mode: mode,
        daily_seed: mode === "daily" ? seed : undefined,
      });
    }
    gamesData[mode] = gameData;
  });

  const [state, setState] = createStore<GamesData>(gamesData);

  createEffect(() => {
    try {
      window.localStorage.setItem("dark_mode", String(state.darkMode));
      (["daily", "free"] as GameMode[]).forEach((mode) => {
        window.localStorage.setItem("last_" + mode, String(state[mode].seed));
        window.localStorage.setItem(
          mode + "_guesses",
          state[mode].guesses.join(",")
        );
        window.localStorage.setItem(
          mode + "_history",
          state[mode].history.join(",")
        );
        window.localStorage.setItem(
          mode + "_current_streak",
          String(state[mode].currentStreak)
        );
        window.localStorage.setItem(
          mode + "_max_streak",
          String(state[mode].maxStreak)
        );
      });
    } catch (e) {
      // Do nothing if there is no local storage
    }
  });
  return [state, setState];
}

export const GamesDataContext =
  createContext<[DeepReadonly<GamesData>, GamesDataProviderFuncs]>();

type GamesDataProviderProps = {};
const GamesDataProvider: Component<GamesDataProviderProps> = (props) => {
  const [state, setState] = createLocalStore();
  const isGameComplete = (mode: GameMode) => {
    return (
      state[mode].guesses.length === GAME_ROWS ||
      state[mode].answers.filter(
        (answer) => state[mode].guesses.indexOf(answer) >= 0
      ).length === 4
    );
  };
  const addLetter = (mode: GameMode, letter: string) => {
    setState(
      produce((s) => {
        if (s[mode].current.length < 5 && !isGameComplete(mode)) {
          s[mode].current += letter;
        }
      })
    );
  };
  const deleteLetter = (mode: GameMode) => {
    setState(
      produce((s) => {
        if (s[mode].current.length > 0 && !isGameComplete(mode)) {
          s[mode].current = s[mode].current.slice(0, -1);
        }
      })
    );
  };
  const submitCurrent = (mode: GameMode) => {
    setState(
      produce((s) => {
        if (
          s[mode].current.length === 5 &&
          (ANSWERS_SET.has(s[mode].current) ||
            ALLOWED_SET.has(s[mode].current)) &&
          !isGameComplete(mode)
        ) {
          const guess = s[mode].current;
          s[mode].guesses.push(guess);
          s[mode].current = "";
          for (let i = 0; i < NUM_GAMES; i++) {
            const answerIndex = s[mode].guesses.indexOf(s[mode].answers[i]);
            if (
              answerIndex === -1 ||
              answerIndex === s[mode].guesses.length - 1
            ) {
              s[mode].states[i].push(
                generateBoxStatesFromGuess(guess, s[mode].answers[i])
              );
            }
            s[mode].answersCorrect[i] = s[mode].guesses.indexOf(
              s[mode].answers[i]
            );
          }
          gtagWrap("event", "guess", {
            mode: mode,
            daily_seed: mode === "daily" ? s[mode].seed : undefined,
            word: guess,
          });
          if (isGameComplete(mode)) {
            const totalCorrect = s[mode].answersCorrect.reduce(
              (prev, correct) => (prev += correct >= 0 ? 1 : 0),
              0
            );
            if (totalCorrect === 4) {
              const maxGuessIndex = Math.max(...s[mode].answersCorrect);
              s[mode].history[maxGuessIndex]++;
              s[mode].currentStreak++;
              if (s[mode].currentStreak > s[mode].maxStreak) {
                s[mode].maxStreak = s[mode].currentStreak;
              }
              gtagWrap("event", "win", {
                mode: mode,
                daily_seed: mode === "daily" ? s[mode].seed : undefined,
                guesses: s[mode].guesses,
                num_guesses: maxGuessIndex + 1,
              });
            } else {
              s[mode].history[GAME_ROWS + totalCorrect]++;
              if (s[mode].currentStreak > 0) {
                gtagWrap("event", "streak_reset", {
                  mode: mode,
                  daily_seed: mode === "daily" ? s[mode].seed : undefined,
                  current_streak: s[mode].currentStreak,
                  max_streak: s[mode].maxStreak,
                });
              }
              s[mode].currentStreak = 0;
              gtagWrap("event", "loss", {
                mode: mode,
                daily_seed: mode === "daily" ? s[mode].seed : undefined,
                guesses: s[mode].guesses,
                total_correct: totalCorrect,
              });
            }
          }
        }
      })
    );
  };
  const store: [DeepReadonly<GamesData>, GamesDataProviderFuncs] = [
    state,
    {
      setDarkMode(darkMode: boolean) {
        setState(
          produce((s) => {
            s.darkMode = darkMode;
          })
        );
      },
      sendKey(mode: GameMode, e: KeyboardEvent) {
        if (e.ctrlKey) return;
        if (e.key === "Backspace") {
          deleteLetter(mode);
        } else if (e.key === "Enter") {
          submitCurrent(mode);
        } else {
          const key = e.key.toLocaleLowerCase();
          if (ALPHABET.indexOf(key) == -1) return;
          addLetter(mode, key);
        }
      },
      isGameComplete,
      addLetter,
      deleteLetter,
      submitCurrent,
      resetDailyIfOld() {
        const date = new Date();
        const currentDailySeed =
          ((date.getTime() - START_DATE.getTime()) / GAME_PERIOD_MS) >> 0;
        if (currentDailySeed !== state.daily.seed) {
          setState(
            produce((s) => {
              s.daily.seed = currentDailySeed;
              s.daily.guesses = [];
              s.daily.answers = generateWordsFromSeed(currentDailySeed);
              s.daily.current = "";
              s.daily.states = [[], [], [], []];
              s.daily.answersCorrect = [-1, -1, -1, -1];
            })
          );
        }
      },
      resetFree() {
        const newSeed = new Date().getTime();
        setState(
          produce((s) => {
            s.free.seed = newSeed;
            s.free.guesses = [];
            s.free.answers = generateWordsFromSeed(newSeed);
            s.free.current = "";
            s.free.states = [[], [], [], []];
            s.free.answersCorrect = [-1, -1, -1, -1];
          })
        );
      },
    },
  ];

  setInterval(() => {
    store[1].resetDailyIfOld();
  }, 1000);

  return (
    <GamesDataContext.Provider value={store}>
      {props.children}
    </GamesDataContext.Provider>
  );
};

export const useGamesDataContext = () => {
  const context = useContext(GamesDataContext);
  if (!context || !context.length)
    throw new Error("GamesDataContext has been used outside provider");
  return context;
};

export default GamesDataProvider;
