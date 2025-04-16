import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AudioPlayer from "../utils/AudioPlayer";

export default function Layout() {
  return (
    <div className="site-wrapper">
      <Header />
      <main>
        <Outlet />
        <AudioPlayer />
      </main>
      <Footer />
    </div>
  );
}
