import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Podcasts from "../pages/Podcasts";
import Favourites from "../pages/Favourites";
import PodcastDetail from "../pages/PodcastDetail";
import useAudioPlayerStore from "./stores/useAudioPlayerStore";
import Completed from "../pages/Completed";

function App() {
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPlaying]);

  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="podcasts" element={<Podcasts />} />
            <Route path="podcasts/:id" element={<PodcastDetail />} />
            <Route path="favourites" element={<Favourites />} />
            <Route path="completed" element={<Completed />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
