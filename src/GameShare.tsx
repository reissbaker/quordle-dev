import { Component, JSX } from "solid-js";
import { useGamesDataContext } from "./GameDataProvider";
import { ClipboardCopyIcon, ShareIcon, TwitterIcon } from "./icons";
import { getNumEmoji, shareGame } from "./share";
import { GameMode } from "./types";

type ShareButtonsProps = {
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  class?: string;
};
const ShareButton: Component<ShareButtonsProps> = (props) => {
  return (
    <button
      type="button"
      class={`text-lg min-h-[50px] text-white bg-blue-800 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${props.class}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

type GameShareProps = {
  mode: GameMode;
};
const GameShare: Component<GameShareProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  return (
    <div class="flex flex-col py-4 rounded-t-lg text-center bg-gray-900">
      <div class="text-2xl flex">
        <div class="flex flex-1 justify-end items-center">
          <span
            class="mr-4"
            classList={{
              "text-green-500": gamesData[props.mode].answersCorrect[0] >= 0,
              "text-red-500": gamesData[props.mode].answersCorrect[0] < 0,
            }}
          >
            {gamesData[props.mode].answers[0].toLocaleUpperCase()}
          </span>
          <span class="font-[Arial]">
            {getNumEmoji(gamesData[props.mode].answersCorrect[0])}
          </span>
        </div>
        <div class="flex flex-1 justify-start items-center">
          <span class="font-[Arial]">
            {getNumEmoji(gamesData[props.mode].answersCorrect[1])}
          </span>
          <span
            class="ml-4"
            classList={{
              "text-green-500": gamesData[props.mode].answersCorrect[1] >= 0,
              "text-red-500": gamesData[props.mode].answersCorrect[1] < 0,
            }}
          >
            {gamesData[props.mode].answers[1].toLocaleUpperCase()}
          </span>
        </div>
      </div>
      <div class="text-2xl flex">
        <div class="flex flex-1 justify-end items-center">
          <span
            class="mr-4"
            classList={{
              "text-green-500": gamesData[props.mode].answersCorrect[2] >= 0,
              "text-red-500": gamesData[props.mode].answersCorrect[2] < 0,
            }}
          >
            {gamesData[props.mode].answers[2].toLocaleUpperCase()}
          </span>
          <span class="font-[Arial]">
            {getNumEmoji(gamesData[props.mode].answersCorrect[2])}
          </span>
        </div>
        <div class="flex flex-1 justify-start items-center">
          <span class="font-[Arial]">
            {getNumEmoji(gamesData[props.mode].answersCorrect[3])}
          </span>
          <span
            class="ml-4"
            classList={{
              "text-green-500": gamesData[props.mode].answersCorrect[3] >= 0,
              "text-red-500": gamesData[props.mode].answersCorrect[3] < 0,
            }}
          >
            {gamesData[props.mode].answers[3].toLocaleUpperCase()}
          </span>
        </div>
      </div>
      {/* @ts-ignore */}
      {navigator.share && (
        <>
          <div class="flex items-center justify-center mt-2">
            <ShareButton
              onClick={() => {
                shareGame(props.mode, gamesData[props.mode], "share");
              }}
            >
              <div class="flex items-center justify-center">
                <ShareIcon />
                <div class="ml-2">Share</div>
              </div>
            </ShareButton>
            <ShareButton
              class="ml-2"
              onClick={() => {
                shareGame(props.mode, gamesData[props.mode], "image");
              }}
            >
              <div class="flex items-center justify-center">
                <TwitterIcon />
                <div class="ml-2">Share as Image</div>
              </div>
            </ShareButton>
          </div>
        </>
      )}
      {navigator.clipboard && (
        <div class="flex items-center justify-center mt-2">
          <ShareButton
            onClick={() => {
              shareGame(props.mode, gamesData[props.mode], "clipboard");
            }}
          >
            <div class="flex items-center justify-center">
              <ClipboardCopyIcon />
              <div class="ml-2">Copy to Clipboard</div>
            </div>
          </ShareButton>
        </div>
      )}
    </div>
  );
};

export default GameShare;
