import { Route, Routes } from "solid-app-router";
import { Component, createEffect, createMemo, useContext } from "solid-js";
import Game from "./Game";
import { GamesDataContext } from "./GameDataProvider";
import NotFound from "./NotFound";

const App: Component = () => {
  const context = createMemo(() => useContext(GamesDataContext));

  createEffect(() => {
    if (context()?.[0].darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return context() ? (
    <Routes>
      <Route path="/" element={<Game mode="daily" />} />
      <Route path="/practice" element={<Game mode="free" />} />
      <Route path="/*all" element={<NotFound />} />
    </Routes>
  ) : null;
};

export default App;
