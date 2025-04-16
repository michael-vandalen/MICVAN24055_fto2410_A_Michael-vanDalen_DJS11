import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFavoriteStore from "../src/stores/useFavoriteStore";

export default function Favourites() {
  const { favorites, removeFavorite } = useFavoriteStore();
  const [episodes, setEpisodes] = useState([]);
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the episodes data based on the favorite episode IDs
    const fetchFavouriteEpisodes = async () => {
      try {
        const fetchedEpisodes = [];
        for (const fav of favorites) {
          // fav is an object now
          const [podcastId, season, episode] = fav.id.split("-");

          // Fetching the podcast details for each favorite episode
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

  const handleRemoveFavorite = (favIdToRemove) => {
    removeFavorite(favIdToRemove);
    setEpisodes((prev) =>
      prev.filter(
        (ep) => `${ep.podcastId}-${ep.season}-${ep.episode}` !== favIdToRemove
      )
    );
  };

  if (isLoading) {
    return <div>Loading favorite episodes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const groupedEpisodes = episodes
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
      <Link to="/podcasts">Back to Podcasts</Link>

      <h2>Favorite Episodes</h2>

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

      {favorites.length === 0 ? (
        <p>No favorite episodes found.</p>
      ) : (
        <div className="favorite--episodes">
          {Object.entries(groupedEpisodes).map(([showTitle, seasons]) => (
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
                          <h3>
                            {episode.podcastTitle && (
                              <span>{episode.podcastTitle} </span>
                            )}
                          </h3>
                          <h4>
                            {episode.seasonTitle} - Episode {episode.episode}:{" "}
                            {episode.title}
                          </h4>
                          <p>{episode.description}</p>
                          <audio controls src={episode.file}></audio>
                          {fav?.addedAt && (
                            <p className="timestamp">
                              Added on: {new Date(fav.addedAt).toLocaleString()}
                            </p>
                          )}
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
