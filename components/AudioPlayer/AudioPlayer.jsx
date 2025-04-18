import { useEffect, useRef } from "react";
import useAudioPlayerStore from "../../src/stores/useAudioPlayerStore";
import "./AudioPlayer.css";

export default function AudioPlayer() {
  const { currentEpisode, clearCurrentEpisode } = useAudioPlayerStore();
  const audioRef = useRef(null);

  useEffect(() => {
    // When the current episode changes, load and play the new audio file
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
      // Check if this episode was already marked as completed
      if (
        !completedEpisodes.find((episode) => episode.id === currentEpisode.id)
      ) {
        // If not, add it to the completed list and update localStorage
        completedEpisodes.push(currentEpisode);
        localStorage.setItem(
          "completedEpisodes",
          JSON.stringify(completedEpisodes)
        );
      }
      clearCurrentEpisode();
    }
  };

  // If there’s no episode selected to play, don’t render anything
  if (!currentEpisode) return null;

  return (
    <div className="audio-player--container">
      {/* Display podcast and episode info */}
      <div className="audio-player--info">
        <strong>{currentEpisode.podcastTitle}</strong>
        <p>{currentEpisode.title}</p>
      </div>
      {/* HTML audio element with controls and on-ended handler */}
      <audio ref={audioRef} controls onEnded={handleAudioEnd}>
        <source src={currentEpisode.file} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {/* Button to close the audio player and stop playback */}
      <button className="audio-player--close-btn" onClick={clearCurrentEpisode}>
        ✕
      </button>
    </div>
  );
}
