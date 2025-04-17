import { useState, useEffect } from "react";
import "./Completed.css";
export default function Completed() {
  const [completedEpisodes, setCompletedEpisodes] = useState([]);
  useEffect(() => {
    const storedCompletedEpisodes =
      JSON.parse(localStorage.getItem("completedEpisodes")) || [];
    setCompletedEpisodes(storedCompletedEpisodes);
  }, []);

  return (
    <div>
      <h2>Completed Episodes</h2>
      {completedEpisodes.length === 0 ? (
        <p>No episodes have been completed yet.</p>
      ) : (
        <ul>
          {completedEpisodes.map((episode, index) => (
            <li key={index}>
              <strong>{episode.podcastTitle}</strong>
              <p>{episode.title}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Button to clear completed episodes */}
      {completedEpisodes.length > 0 && (
        <button
          onClick={() => {
            localStorage.removeItem("completedEpisodes");
            setCompletedEpisodes([]); // Update the state
          }}
          className="clear-btn"
        >
          Clear Completed Episodes
        </button>
      )}
    </div>
  );
}
