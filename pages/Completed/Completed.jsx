import { useState, useEffect } from "react";
import "./Completed.css";
export default function Completed() {
  const [completedEpisodes, setCompletedEpisodes] = useState([]);

  useEffect(() => {
    // Retrieve completed episodes from localStorage on component mount
    const storedCompletedEpisodes =
      JSON.parse(localStorage.getItem("completedEpisodes")) || [];
    // Update state with retrieved data
    setCompletedEpisodes(storedCompletedEpisodes);
  }, []);

  return (
    <div>
      <h2>Completed Episodes</h2>

      {/* Show message if no episodes have been completed */}
      {completedEpisodes.length === 0 ? (
        <p>No episodes have been completed yet.</p>
      ) : (
        // Display list of completed episodes
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
            // Remove from localStorage
            localStorage.removeItem("completedEpisodes");
            // Clear local state
            setCompletedEpisodes([]);
          }}
          className="clear-btn"
        >
          Clear Completed Episodes
        </button>
      )}
    </div>
  );
}
