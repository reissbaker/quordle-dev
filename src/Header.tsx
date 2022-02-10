import { NavLink } from "solid-app-router";
import { Component, createMemo } from "solid-js";
import favicon48 from "./assets/favicon-48.png";
import { useGamesDataContext } from "./GameDataProvider";
import { HelpIcon } from "./icons";

type HeaderProps = {
  onOpenTutorial: () => void;
};
const Header: Component<HeaderProps> = (props) => {
  const [gamesData, gamesDataFuncs] = useGamesDataContext();

  const dailySeed = createMemo(() => {
    return gamesData.daily.seed;
  });

  return (
    <nav class="bg-gray-900 w-screen flex items-center px-4 py-2">
      <img src={favicon48} width="24" height="24" />
      <span class="ml-3">Quordle</span>
      <div class="flex-1">
        <div class="">
          <div class="flex ml-3">
            <NavLink
              href="/"
              activeClass="quordle-nav-active"
              class="quordle-nav"
              end
            >
              Daily #{dailySeed}
            </NavLink>
            <NavLink
              href="/practice"
              activeClass="quordle-nav-active"
              class="quordle-nav"
              end
            >
              Practice
            </NavLink>
          </div>
        </div>
      </div>
      <div class="flex items-center sm:inset-auto sm:ml-6">
        <div>
          <button
            type="button"
            class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white"
            onClick={props.onOpenTutorial}
            id="help-button"
          >
            <HelpIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
