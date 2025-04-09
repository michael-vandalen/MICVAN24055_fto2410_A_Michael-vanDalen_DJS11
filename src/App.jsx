import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Podcasts from "../pages/Podcasts";
import Favourites from "../pages/Favourites";
import About from "../pages/About";
import PodcastDetail from "../pages/PodcastDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="podcasts" element={<Podcasts />} />
            <Route path="podcasts/:id" element={<PodcastDetail />} />
            <Route path="favourites" element={<Favourites />} />
            <Route path="about" element={<About />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
