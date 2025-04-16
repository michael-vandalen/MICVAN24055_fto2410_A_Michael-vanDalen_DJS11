import { useEffect, useRef } from "react";
import useAudioPlayerStore from "../src/stores/useAudioPlayerStore";

export default function AudioPlayer() {
  const { currentEpisode } = useAudioPlayerStore();
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentEpisode && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentEpisode]);

  if (!currentEpisode) return null;

  return (
    <div className="audio-player--container">
      <div className="audio-player--info">
        <strong>{currentEpisode.title}</strong>
        <p>{currentEpisode.podcastTitle}</p>
      </div>
      <audio ref={audioRef} controls>
        <source src={currentEpisode.file} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
