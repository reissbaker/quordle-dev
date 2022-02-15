import { Component, JSX } from "solid-js";
import { CAN_VIBRATE } from "./constants";
import { useGamesDataContext } from "./GameDataProvider";
import { vibrate } from "./utils";

type SettingToggleProps = {
  id: string;
  text: string;
  checked: boolean;
  colorblind: boolean;
  onClick?: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent>;
  onChange?: JSX.EventHandlerUnion<HTMLInputElement, Event>;
};
const SettingToggle: Component<SettingToggleProps> = (props) => {
  return (
    <div class="flex items-center m-4">
      <label for={props.id} class="flex items-center cursor-pointer">
        <div class="relative">
          <input
            type="checkbox"
            id={props.id}
            class="sr-only"
            checked={props.checked}
            onClick={props.onClick}
            onChange={props.onChange}
          />
          <div class="block bg-gray-500 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
          <div
            class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
            classList={{
              "translate-x-[100%]": props.checked,
              "bg-box-correct": props.checked && !props.colorblind,
              "bg-box-diff-alt": props.checked && props.colorblind,
            }}
          ></div>
        </div>
        <div class="ml-3 text-black dark:text-white">{props.text}</div>
      </label>
    </div>
  );
};

type SettingsProps = {
  onCloseSettings: () => void;
};
const Settings: Component<SettingsProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  return (
    <div class="w-full h-full overflow-auto">
      <div class="max-w-[550px] w-full m-auto flex flex-row-reverse pr-4 pt-2">
        <button
          type="button"
          class="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-900 hover:text-black dark:text-gray-400 dark:hover:text-white"
          onClick={props.onCloseSettings}
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
      <div class="max-w-[550px] m-auto w-full px-6 mb-8">
        <div class="text-4xl mt-2 mb-4 text-center">Settings</div>
        <div class="flex flex-col text-base">
          <SettingToggle
            id="toggleDarkMode"
            text="Dark Mode"
            checked={gamesData.darkMode}
            colorblind={gamesData.colorblind}
            onClick={() => vibrate(gamesData.vibration)}
            onChange={(e) =>
              gamesDataFuncs.setDarkMode(e.currentTarget.checked)
            }
          />
          <SettingToggle
            id="toggleColorblind"
            text="Colorblind Mode"
            checked={gamesData.colorblind}
            colorblind={gamesData.colorblind}
            onClick={() => vibrate(gamesData.vibration)}
            onChange={(e) =>
              gamesDataFuncs.setColorblind(e.currentTarget.checked)
            }
          />
          {CAN_VIBRATE && (
            <SettingToggle
              id="toggleVibration"
              text="Vibration"
              checked={gamesData.vibration}
              colorblind={gamesData.colorblind}
              onClick={() => vibrate(gamesData.vibration)}
              onChange={(e) =>
                gamesDataFuncs.setVibration(e.currentTarget.checked)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
