import { Component } from "solid-js";
import { GameTileRenderer } from "./GameTile";
import { FacebookIcon, GithubIcon, RedditIcon, TwitterIcon } from "./icons";
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
        rowTemporalState="past"
      />
    ));
};

type TutorialProps = {
  onCloseTutorial: () => void;
};
const Tutorial: Component<TutorialProps> = (props) => {
  return (
    <div class="w-full h-full overflow-auto">
      <div class="max-w-[550px] w-full m-auto flex flex-row-reverse pr-4 pt-2">
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
        <div class="flex w-[100%] mb-2">
          <div class="flex w-[50%] mr-1">
            <TutorialWord word={TUTORIAL_WORDS[3]} />
          </div>
          <div class="flex w-[50%] ml-1">
            <TutorialWord word={TUTORIAL_WORDS[4]} />
          </div>
        </div>
        <div class="flex w-[100%] mt-2 mb-2">
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
        <div class="text-base mb-8">
          A new QUORDLE will be available each day!
        </div>
        <div class="text-sm mb-2 text-center">Created by Freddie Meyer</div>
        <div class="flex flex-row items-center justify-center mb-8">
          <a
            class="px-4"
            href="https://github.com/fireph/quordle"
            target="_blank"
          >
            <GithubIcon height={48} />
          </a>
          <a class="px-4" href="https://twitter.com/quordle" target="_blank">
            <TwitterIcon height={36} />
          </a>
          <a
            class="px-4"
            href="https://www.facebook.com/quordle"
            target="_blank"
          >
            <FacebookIcon height={48} />
          </a>
          <a
            class="px-4"
            href="https://www.reddit.com/r/Quordle/"
            target="_blank"
          >
            <RedditIcon height={40} />
          </a>
        </div>
        <div class="text-3xl my-4 text-center">History of Quordle</div>
        <div class="text-base mb-6">
          It all started on January 29, 2022 when I saw an article mentioning{" "}
          <a
            class="underline"
            href="https://zaratustra.itch.io/dordle"
            target="_blank"
          >
            Dordle
          </a>{" "}
          by Guilherme S. T&#246;ws and we all started playing it as a group. It
          was a blast to play something more difficult than Wordle, but we still
          found it uncommon to fail to guess both words in 7 attempts.
          <br />
          <br />
          In a moment of evil and genius,{" "}
          <a
            class="underline"
            href="https://github.com/DavidMah"
            target="_blank"
          >
            David Mah
          </a>{" "}
          hacked together the first prototype of Quordle on January 30th and
          linked it to the group chat. It was truly horrific code (it even had 2
          keyboards &#128517;), but I knew that I had to continue the madness.
          With hindsight, he really baited me into finishing his monstrous
          creation.
          <br />
          <br />
          Over the next 2 days I improved the code, removed the second keyboard,
          and added the color quadrant keyboard. I even added Google Analytics
          thinking it would be funny to see the stats for our friend group
          playing.
          <br />
          <br />
          At first it was just a few dozen players (there was a group of 20-30
          people in Ohio that were playing constantly the first few days). But
          then Quordle got written about in an article in{" "}
          <a
            class="underline"
            href="https://www.theguardian.com/games/2022/feb/06/worried-about-losing-wordle-here-are-some-alternatives-just-in-case"
            target="_blank"
          >
            The Guardian
          </a>{" "}
          and things exploded quickly from there. Now Quordle has over 60k
          players daily and has had over 160k total players.
          <br />
          <br />
          A shoutout to our friend that plays relentless while indoor cycling.
          You were the drive to create a better version and your passion made me
          realize it could be popular outside of our friend group. I am so glad
          the world has been thoroughly cursed by Quordle and can't wait to see
          how Quordle strategies evolve!
          <br />
          <br />I have no plans to monetize Quordle, I just enjoy watching
          everyone enjoy this insane game and couldn't have done it without
          Guilherme S. T&#246;ws and David Mah. If you have any ideas for
          Quordle or just want to chat, check out the socials posted above.
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
