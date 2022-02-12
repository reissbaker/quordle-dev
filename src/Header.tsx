import { NavLink } from "solid-app-router";
import { Component, createMemo } from "solid-js";
import favicon48 from "./assets/favicon-48.png";
import { useGamesDataContext } from "./GameDataProvider";
import { HelpIcon, StatisticsIcon } from "./icons";
import { vibrate } from "./utils";

type HeaderProps = {
  onOpenTutorial: () => void;
  onOpenStatistics: () => void;
};
const Header: Component<HeaderProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  const dailySeed = createMemo(() => {
    return gamesData.daily.seed;
  });

  return (
    <nav class=" bg-gray-300 dark:bg-gray-900 w-screen border-b-2 border-white dark:border-gray-800">
      <div class="flex items-center max-w-[550px] m-auto px-4 py-2">
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
            class="bg-gray-400 dark:bg-gray-800 p-1 rounded-full text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white"
            onClick={props.onOpenStatistics}
          >
            <StatisticsIcon />
          </button>
          <button
            type="button"
            class="bg-gray-400 dark:bg-gray-800 p-1 rounded-full text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white ml-2"
            onClick={props.onOpenTutorial}
          >
            <HelpIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
