import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFavoriteStore from "../../src/stores/useFavoriteStore";
import "./Favorites.css";
import useAudioPlayerStore from "../../src/stores/useAudioPlayerStore";

export default function Favourites() {
  const navigate = useNavigate();
  // Zustand actions
  const { favorites, removeFavorite } = useFavoriteStore();
  const setCurrentEpisode = useAudioPlayerStore(
    (state) => state.setCurrentEpisode
  );
  const [episodes, setEpisodes] = useState([]);
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch details for all favorite episodes
    const fetchFavouriteEpisodes = async () => {
      try {
        const fetchedEpisodes = [];
        for (const fav of favorites) {
          const [podcastId, season, episode] = fav.id.split("-");

          // Fetch full podcast details to extract episode info
          const res = await fetch(
            `https://podcast-api.netlify.app/id/${podcastId}`
          );
          const data = await res.json();

          // Find the season and episode
          const seasonData = data.seasons.find((s) => s.season == season);
          const episodeData = seasonData?.episodes.find(
            (ep) => ep.episode == episode
          );

          if (episodeData) {
            fetchedEpisodes.push({
              ...episodeData,
              podcastId,
              season,
              seasonTitle: seasonData?.title || `Season ${season}`,
              podcastTitle: data.title,
              addedAt: fav.addedAt,
            });
          }
        }
        setEpisodes(fetchedEpisodes);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchFavouriteEpisodes();
    } else {
      setIsLoading(false); // No favourites stored
    }
  }, [favorites]);

  // Remove a favorite from store and UI
  const handleRemoveFavorite = (favIdToRemove) => {
    removeFavorite(favIdToRemove);
    setEpisodes((prev) =>
      prev.filter(
        (ep) => `${ep.podcastId}-${ep.season}-${ep.episode}` !== favIdToRemove
      )
    );
  };

  // Loading and error handling
  if (isLoading) {
    return <div>Loading favorite episodes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Sort and group episodes by podcast and season
  const sortedPodcasts = episodes
    .sort((a, b) => {
      switch (sortOrder) {
        case "A-Z":
          return a.title.localeCompare(b.title);
        case "Z-A":
          return b.title.localeCompare(a.title);
        case "Oldest":
          return new Date(a.addedAt) - new Date(b.addedAt);
        case "Newest":
          return new Date(b.addedAt) - new Date(a.addedAt);
        default:
          return 0;
      }
    })
    .reduce((acc, episode) => {
      const show = episode.podcastTitle || "Unknown Show";
      const season = episode.seasonTitle || `Season ${episode.season}`;

      if (!acc[show]) acc[show] = {};
      if (!acc[show][season]) acc[show][season] = [];

      acc[show][season].push(episode);
      return acc;
    }, {});

  return (
    <div>
      {/* Back button to return to previous page */}
      <button className="back--button" onClick={() => navigate(-1)}>
        <span>Back</span>
      </button>

      <h2>Favorite Episodes</h2>

      {/* Sort dropdown */}
      <div className="sort--order">
        <label htmlFor="sort--select">Sort by:</label>
        <select
          id="sort--select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Oldest">Oldest Added</option>
          <option value="Newest">Newest Added</option>
        </select>
      </div>

      {/* Display message if no favorites exist */}
      {favorites.length === 0 ? (
        <p>No favorite episodes found.</p>
      ) : (
        <div className="favorite--episodes">
          {Object.entries(sortedPodcasts).map(([showTitle, seasons]) => (
            <div key={showTitle} className="podcast--group">
              <h2>{showTitle}</h2>

              {Object.entries(seasons).map(
                ([seasonTitle, episodesInSeason]) => (
                  <div key={seasonTitle} className="season--group">
                    <h3>{seasonTitle}</h3>

                    {episodesInSeason.map((episode, index) => {
                      const favId = `${episode.podcastId}-${episode.season}-${episode.episode}`;
                      const fav = favorites.find((f) => f.id === favId);

                      return (
                        <div key={index} className="episode">
                          <h4>
                            Episode {episode.episode}: {episode.title}
                          </h4>
                          <p>{episode.description}</p>

                          {/* Play button */}
                          <button
                            onClick={() =>
                              setCurrentEpisode({
                                title: episode.title,
                                podcastTitle: showTitle,
                                file: episode.file,
                              })
                            }
                            className="play--btn"
                          >
                            ▶️ Play
                          </button>

                          {/* Show when episode was added */}
                          {fav?.addedAt && (
                            <p className="timestamp">
                              Added on: {new Date(fav.addedAt).toLocaleString()}
                            </p>
                          )}

                          {/* Remove from favorites */}
                          <button
                            onClick={() => handleRemoveFavorite(favId)}
                            className="remove--btn"
                          >
                            Remove from Favorites
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
