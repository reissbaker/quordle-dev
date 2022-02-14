import { NavLink } from "solid-app-router";
import Dismiss from "solid-dismiss";
import { Component, createSignal } from "solid-js";
import favicon48 from "./assets/favicon-48.png";
import { useGamesDataContext } from "./GameDataProvider";
import { ChevronDownIcon, DonateIcon, HelpIcon, StatisticsIcon } from "./icons";
import { GameMode } from "./types";
import { vibrate } from "./utils";

type HeaderProps = {
  mode: GameMode;
  onOpenTutorial: () => void;
  onOpenStatistics: () => void;
};
const Header: Component<HeaderProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  const [open, setOpen] = createSignal(false);
  const [btnEl, setBtnEl] = createSignal<HTMLButtonElement>();

  return (
    <nav class="bg-gray-300 dark:bg-gray-900 w-screen border-b-2 border-white dark:border-gray-800">
      <div class="flex items-center max-w-[550px] m-auto px-4 py-2 relative">
        <img src={favicon48} width="24" height="24" />
        <span class="ml-3 text-black dark:text-white">Quordle</span>
        <div class="flex-1">
          <div class="">
            <div class="flex ml-3">
              <NavLink
                href="/"
                activeClass="quordle-nav-active"
                class="quordle-nav"
                onClick={vibrate}
                end
              >
                Daily{/*#{dailySeed()}*/}
              </NavLink>
              <NavLink
                href="/practice"
                activeClass="quordle-nav-active"
                class="quordle-nav"
                onClick={vibrate}
                end
              >
                Practice
              </NavLink>
            </div>
          </div>
        </div>
        <div class="flex items-center sm:inset-auto sm:ml-6">
          <button
            type="button"
            class="bg-gray-400 dark:bg-gray-800 p-1 rounded-full text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white ml-2"
            onClick={props.onOpenTutorial}
          >
            <HelpIcon />
          </button>
          <button
            type="button"
            class="bg-gray-400 dark:bg-gray-800 p-1 rounded-full text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white ml-2"
            ref={(ref) => setBtnEl(ref)}
            onClick={() => vibrate()}
          >
            <ChevronDownIcon />
          </button>
        </div>
        <Dismiss menuButton={btnEl} open={open} setOpen={setOpen}>
          <div
            class="absolute bg-gray-100 dark:bg-gray-800 text-black dark:text-white z-20 right-4 rounded-lg border-2 border-gray-400"
            style={{
              top: (btnEl()?.getBoundingClientRect().bottom || 0) + 12 + "px",
            }}
          >
            <div class="flex items-center justify-center m-4">
              <label
                for="toggleDarkMode"
                class="flex items-center cursor-pointer"
              >
                <div class="relative">
                  <input
                    type="checkbox"
                    id="toggleDarkMode"
                    class="sr-only"
                    checked={gamesData.darkMode}
                    onClick={() => vibrate()}
                    onChange={(e) =>
                      gamesDataFuncs.setDarkMode(e.currentTarget.checked)
                    }
                  />
                  <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
                  <div
                    class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
                    classList={{
                      "translate-x-[100%] bg-emerald-500": gamesData.darkMode,
                    }}
                  ></div>
                </div>
                <div class="ml-3 text-black dark:text-white">Dark Mode</div>
              </label>
            </div>
            <button
              type="button"
              class="flex flex-row-reverse items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all w-full mb-4"
              onClick={() => {
                setOpen(false);
                props.onOpenStatistics();
              }}
            >
              <StatisticsIcon />
              <div class="mr-3 text-black dark:text-white">
                {props.mode === "daily" ? "Daily" : "Practice"} Stats
              </div>
            </button>
            <button
              type="button"
              class="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all w-full mb-4"
              onClick={() => {
                vibrate();
                setOpen(false);
              }}
            >
              <a
                class="flex flex-row-reverse items-center "
                href="https://www.patreon.com/quordle"
                target="_blank"
              >
                <DonateIcon />
                <div class="mr-3 text-black dark:text-white">Donate</div>
              </a>
            </button>
          </div>
        </Dismiss>
      </div>
    </nav>
  );
};

export default Header;
