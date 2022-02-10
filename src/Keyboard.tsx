import { Component, createMemo } from "solid-js";
import { ALPHABET, KEYBOARD_KEYS } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { BoxState, GameMode } from "./types";

type KeyProps = {
  mode: GameMode;
  x: number;
  y: number;
  key: string;
};
const Key: Component<KeyProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  const keyLower = createMemo(() => props.key.toLocaleLowerCase());

  const keyStyle = createMemo(() => {
    const guesses = gamesData[props.mode].guesses;

    let keyHasBeenGuessed = false;
    for (let g = 0; g < guesses.length; g++) {
      if (guesses[g].indexOf(keyLower()) >= 0) {
        keyHasBeenGuessed = true;
        break;
      }
    }

    if (!keyHasBeenGuessed) {
      return "";
    }

    const colorOptions: { [key in BoxState]: string } = {
      none: "#919191",
      diff: "#ffcc00",
      correct: "#00cc88",
    };
    const keyColors = [
      colorOptions.none,
      colorOptions.none,
      colorOptions.none,
      colorOptions.none,
    ];
    for (let c = 0; c < keyColors.length; c++) {
      const gameStates = gamesData[props.mode].states[c];
      for (let row = 0; row < gameStates.length; row++) {
        for (let col = 0; col < gameStates[row].length; col++) {
          if (
            keyLower() === guesses[row][col] &&
            (gameStates[row][col] === "correct" ||
              gameStates[row][col] === "diff")
          ) {
            if (gameStates[row][col] === "correct") {
              keyColors[c] = colorOptions.correct;
            } else if (
              gameStates[row][col] === "diff" &&
              keyColors[c] !== colorOptions.correct
            ) {
              keyColors[c] = colorOptions.diff;
            } else {
              keyColors[c] = colorOptions.none;
            }
          }
        }
      }
    }
    return (
      "background-image: linear-gradient(45deg, " +
      keyColors[0] +
      ", " +
      keyColors[0] +
      " 100%), linear-gradient(135deg, " +
      keyColors[2] +
      ", " +
      keyColors[2] +
      "), linear-gradient(225deg, " +
      keyColors[1] +
      ", " +
      keyColors[1] +
      ") , linear-gradient(225deg, " +
      keyColors[3] +
      ", " +
      keyColors[3] +
      "); color: black;"
    );
  });

  return (
    <button
      class="quordle-box quordle-key w-[10%]"
      classList={{
        "border-l-[1px]": props.x === 0,
        "border-t-[1px]": props.y === 0,
        "border-b-transparent": props.key === "enter3",
        "border-r-transparent": props.key === "enter1",
      }}
      style={keyStyle()}
      onClick={(e) => {
        e.preventDefault();
        gamesDataFuncs.sendKey(
          props.mode,
          new KeyboardEvent("keydown", {
            keyCode: props.key.startsWith("enter")
              ? 13
              : props.key === "bs"
              ? 8
              : ALPHABET.indexOf(props.key.toLocaleLowerCase()) + 65,
            key: props.key.startsWith("enter")
              ? "Enter"
              : props.key === "bs"
              ? "Backspace"
              : props.key.toLocaleLowerCase(),
          })
        );
      }}
    >
      <div
        class="quordle-box-content"
        textContent={
          props.key === "enter2"
            ? "\u23CE"
            : props.key === "bs"
            ? "\u232B"
            : props.key.startsWith("enter")
            ? ""
            : props.key
        }
      />
    </button>
  );
};

type KeyboardProps = {
  mode: GameMode;
};
const Keyboard: Component<KeyboardProps> = (props) => {
  return (
    <div class="w-full flex-col">
      {KEYBOARD_KEYS.map((row, y) => (
        <div class="flex w-full">
          {row.map((key, x) => (
            <Key mode={props.mode} x={x} y={y} key={key} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
