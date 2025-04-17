import { useEffect, useRef } from "react";
import useAudioPlayerStore from "../src/stores/useAudioPlayerStore";
import "./AudioPlayer.css";

export default function AudioPlayer() {
  const { currentEpisode, clearCurrentEpisode } = useAudioPlayerStore();
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentEpisode && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentEpisode]);

  // Mark the episode as completed when the audio ends
  const handleAudioEnd = () => {
    if (currentEpisode) {
      // Save the completed episode to localStorage
      const completedEpisodes =
        JSON.parse(localStorage.getItem("completedEpisodes")) || [];
      if (
        !completedEpisodes.find((episode) => episode.id === currentEpisode.id)
      ) {
        completedEpisodes.push(currentEpisode);
        localStorage.setItem(
          "completedEpisodes",
          JSON.stringify(completedEpisodes)
        );
      }
      clearCurrentEpisode();
    }
  };

  if (!currentEpisode) return null;

  return (
    <div className="audio-player--container">
      <div className="audio-player--info">
        <strong>{currentEpisode.podcastTitle}</strong>
        <p>{currentEpisode.title}</p>
      </div>
      <audio ref={audioRef} controls onEnded={handleAudioEnd}>
        <source src={currentEpisode.file} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button className="audio-player--close-btn" onClick={clearCurrentEpisode}>
        ✕
      </button>
    </div>
  );
}
