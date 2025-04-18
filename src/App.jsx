// React and Routing Imports
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

// Layout and Pages
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Podcasts from "../pages/Podcasts/Podcasts";
import Favourites from "../pages/Favorites/Favourites";
import PodcastDetail from "../pages/PodcastDetails/PodcastDetail";
import Completed from "../pages/Completed/Completed";

// Zustand Store for global audio player state
import useAudioPlayerStore from "./stores/useAudioPlayerStore";

function App() {
  // Grab isPlaying state from global audio player store
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);

  // Prevent accidental reload/close if audio is currently playing
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
