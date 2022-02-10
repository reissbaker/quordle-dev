import { Component } from "solid-js";
import { GameTileRenderer } from "./GameTile";
import { BoxState } from "./types";

type TutorialWordType = [string, BoxState[]];
const TUTORIAL_WORDS: TutorialWordType[] = [
  ["CROWN", ["correct", "none", "none", "none", "none"]],
  ["BADGE", ["none", "diff", "none", "none", "none"]],
  ["COMFY", ["none", "none", "none", "none", "none"]],
  ["WORLD", ["none", "none", "none", "none", "none"]],
  ["WORLD", ["none", "none", "diff", "none", "correct"]],
  ["WORLD", ["none", "none", "none", "diff", "none"]],
  ["WORLD", ["none", "correct", "none", "none", "diff"]],
];

type TutorialWordProps = {
  word: TutorialWordType;
};
const TutorialWord: Component<TutorialWordProps> = (props) => {
  return props.word[0]
    .split("")
    .map((letter, i) => (
      <GameTileRenderer
        state={props.word[1][i]}
        letter={letter}
        gameRow={0}
        gameCol={i}
      />
    ));
};

type TutorialProps = {
  onCloseTutorial: () => void;
};
const Tutorial: Component<TutorialProps> = (props) => {
  return (
    <div class="w-full h-full overflow-auto">
      <div class="w-full flex flex-row-reverse pr-4 pt-2">
        <button
          type="button"
          class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white"
          onClick={props.onCloseTutorial}
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
        <div class="text-3xl mt-2 mb-1">
          Guess all four QUORDLE words in 9 tries.
        </div>
        <div class="text-base">
          Each guess must be a valid 5 letter word. Hit the enter button to
          submit. After each guess, the color of the tiles will change to show
          how close your guess was to the word.
        </div>
        <div class="text-3xl mt-4 mb-2">Examples</div>
        <div class="flex w-[50%] my-2">
          <TutorialWord word={TUTORIAL_WORDS[0]} />
        </div>
        <div class="text-base mb-6">
          The letter C is in the word and in the correct spot.
        </div>
        <div class="flex w-[50%] my-2">
          <TutorialWord word={TUTORIAL_WORDS[1]} />
        </div>
        <div class="text-base mb-6">
          The letter A is in the word but in the wrong spot.
        </div>
        <div class="flex w-[50%] my-2">
          <TutorialWord word={TUTORIAL_WORDS[2]} />
        </div>
        <div class="text-base mb-6">
          The letters C, O, M, F, Y are not in the word in any spot. When you
          type a guess in QUORDLE, you will guess that word for all four words
          that you are solving. All four words you are solving will be
          different.
        </div>
        <div class="flex w-[100%] mb-1">
          <div class="flex w-[50%] mr-1">
            <TutorialWord word={TUTORIAL_WORDS[3]} />
          </div>
          <div class="flex w-[50%] ml-1">
            <TutorialWord word={TUTORIAL_WORDS[4]} />
          </div>
        </div>
        <div class="flex w-[100%] mt-1 mb-2">
          <div class="flex w-[50%] mr-1">
            <TutorialWord word={TUTORIAL_WORDS[5]} />
          </div>
          <div class="flex w-[50%] ml-1">
            <TutorialWord word={TUTORIAL_WORDS[6]} />
          </div>
        </div>
        <div class="text-base">For the guess WORLD:</div>
        <ol class="text-base list-decimal ml-8 mb-6">
          <li>The top left word has none of the letters.</li>
          <li>
            The top right word has the R in the wrong spot and the D in the
            correct spot.
          </li>
          <li>The bottom left word has the L in the wrong spot.</li>
          <li>
            The bottom right word has the O in the right spot and the D in the
            wrong spot.
          </li>
        </ol>
        <div class="text-base mb-6">
          You have 9 guesses to get all 4 words correct. Good luck!
        </div>
        <div class="text-base mb-6">
          A new QUORDLE will be available each day!
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
