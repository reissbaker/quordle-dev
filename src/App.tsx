import { Route, Routes } from "solid-app-router";
import { Component, createMemo, useContext } from "solid-js";
import Game from "./Game";
import { GamesDataContext } from "./GameDataProvider";
import NotFound from "./NotFound";

const App: Component = () => {
  const context = createMemo(() => useContext(GamesDataContext));
  return context() ? (
    <Routes>
      <Route path="/" element={<Game mode="daily" />} />
      <Route path="/practice" element={<Game mode="free" />} />
      <Route path="/*all" element={<NotFound />} />
    </Routes>
  ) : null;
};

export default App;
