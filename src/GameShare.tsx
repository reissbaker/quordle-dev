import { Component, createMemo, createSignal, JSX } from "solid-js";
import { CAN_SHARE_IMAGE, CAN_SHARE_TEXT } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { ClipboardCopyIcon, SaveIcon, ShareIcon, TwitterIcon } from "./icons";
import { getNumEmoji, getShareText, shareGame } from "./share";
import { GameMode } from "./types";
import { gtagWrap, vibrate } from "./utils";

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

  const [textAreaRef, setTextAreaRef] = createSignal<
    HTMLTextAreaElement | undefined
  >(undefined);

  const [showTextArea, setShowTextArea] = createSignal(false);

  const shareText = createMemo(
    () => getShareText(props.mode, gamesData[props.mode])[0]
  );

  return (
    <div class="flex flex-col rounded-t-lg text-center bg-gray-300 dark:bg-gray-900 border-t-2 p-4 border-white dark:border-gray-800">
      <div class="text-2xl flex">
        <div class="flex flex-1 justify-end items-center">
          <span
            class="mr-4"
            classList={{
              "text-green-600 dark:text-green-500":
                gamesData[props.mode].answersCorrect[0] >= 0,
              "text-rose-600": gamesData[props.mode].answersCorrect[0] < 0,
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
              "text-green-600 dark:text-green-500":
                gamesData[props.mode].answersCorrect[1] >= 0,
              "text-rose-600": gamesData[props.mode].answersCorrect[1] < 0,
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
              "text-green-600 dark:text-green-500":
                gamesData[props.mode].answersCorrect[2] >= 0,
              "text-rose-600": gamesData[props.mode].answersCorrect[2] < 0,
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
              "text-green-600 dark:text-green-500":
                gamesData[props.mode].answersCorrect[3] >= 0,
              "text-rose-600": gamesData[props.mode].answersCorrect[3] < 0,
            }}
          >
            {gamesData[props.mode].answers[3].toLocaleUpperCase()}
          </span>
        </div>
      </div>
      {CAN_SHARE_TEXT && (
        <>
          <div class="flex items-center justify-center mt-2">
            <ShareButton
              onClick={() => {
                vibrate();
                shareGame(props.mode, gamesData[props.mode], "share");
              }}
            >
              <div class="flex items-center justify-center">
                <ShareIcon />
                <div class="ml-2">Share</div>
              </div>
            </ShareButton>
            {CAN_SHARE_IMAGE ? (
              <ShareButton
                class="ml-2"
                onClick={() => {
                  vibrate();
                  shareGame(props.mode, gamesData[props.mode], "image");
                }}
              >
                <div class="flex items-center justify-center">
                  <TwitterIcon />
                  <div class="ml-2">Share as Image</div>
                </div>
              </ShareButton>
            ) : (
              <ShareButton
                class="ml-2"
                onClick={() => {
                  vibrate();
                  shareGame(props.mode, gamesData[props.mode], "image_save");
                }}
              >
                <div class="flex items-center justify-center">
                  <SaveIcon />
                  <div class="ml-2">Save as Image</div>
                </div>
              </ShareButton>
            )}
          </div>
        </>
      )}
      {textAreaRef() && (
        <div class="flex items-center justify-center mt-2">
          <ShareButton
            onClick={() => {
              vibrate();
              gtagWrap("event", "share", {
                mode: props.mode,
                share_type: "clipboard",
                daily_seed:
                  props.mode === "daily"
                    ? gamesData[props.mode].seed
                    : undefined,
              });
              setShowTextArea(true);
              const textArea = textAreaRef();
              if (textArea) {
                textArea.select();
                document.execCommand("copy");
                const selection = window.getSelection && window.getSelection();
                if (selection) {
                  selection.removeAllRanges();
                }
                textArea.blur();
              }
              alert("Copied results to clipboard!");
            }}
          >
            <div class="flex items-center justify-center">
              <ClipboardCopyIcon />
              <div class="ml-2">Copy to Clipboard</div>
            </div>
          </ShareButton>
        </div>
      )}
      <textarea
        class="font-[Courier] w-[100%] text-sm text-black dark:text-white bg-white dark:bg-gray-800 text-center rounded-lg mt-2 resize-none"
        classList={{
          "absolute top-[100%]": !showTextArea(),
        }}
        rows="8"
        readOnly
        ref={setTextAreaRef}
      >
        {shareText()}
      </textarea>
    </div>
  );
};

export default GameShare;
