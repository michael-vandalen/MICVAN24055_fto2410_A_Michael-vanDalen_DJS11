import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFavouriteStore from "../../src/stores/useFavoriteStore";
import useAudioPlayerStore from "../../src/stores/useAudioPlayerStore";
import "./PodcastDetails.css";

export default function PodcastDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [podcast, setPodcast] = useState(null);
  const [genreNames, setGenreNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const setCurrentEpisode = useAudioPlayerStore(
    (state) => state.setCurrentEpisode
  );
  const { favorites, addFavorite, removeFavorite, isFavorite } =
    useFavouriteStore();

  useEffect(() => {
    window.scrollTo(0, 0); // Show details always starts at top of page
    const fetchPodDetails = async () => {
      setIsLoading(true);

      try {
        // Fetching Podcasts
        const res = await fetch(
          `https://podcast-api.netlify.app/id/${params.id}`
        );
        const data = await res.json();
        setPodcast(data);

        // Fetch Genre
        setGenreNames((data.genres || []).filter((g) => g !== "All"));
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPodDetails();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong! Please try again.</div>;
  }

  const toggleFavorite = (episodeId) => {
    isFavorite(episodeId) ? removeFavorite(episodeId) : addFavorite(episodeId);
  };

  return (
    <div className="podcast--details-container">
      <button className="back--button" onClick={() => navigate(-1)}>
        <span>Back</span>
      </button>

      {podcast ? (
        <div className="podcast--details">
          <img src={podcast.image} alt={podcast.title} />
          <h2>{podcast.title}</h2>
          <p>{podcast.description}</p>
          <p>
            <strong>Genres:</strong> {genreNames.join(", ")}
          </p>

          <div className="selected--tab">
            {podcast.seasons?.map((season) => (
              <button
                key={season.season}
                onClick={() => setSelectedSeason(season.season)}
                className={`season--tab ${
                  selectedSeason === season.season ? "active" : ""
                }`}
              >
                {season.title}
              </button>
            ))}
          </div>

          {podcast.seasons?.map((season) =>
            season.season === selectedSeason ? (
              <div key={season.season} className="episodes">
                {season.episodes.map((episode) => {
                  const episodeId = `${podcast.id}-${season.season}-${episode.episode}`;
                  const isFavorite = favorites.some(
                    (fav) => fav.id === episodeId
                  );
                  return (
                    <div key={episode.episode} className="episode">
                      <h4>
                        Episode: {episode.episode}: {episode.title}
                      </h4>
                      <p>{episode.description}</p>
                      <button
                        onClick={() =>
                          setCurrentEpisode({
                            title: episode.title,
                            podcastTitle: podcast.title,
                            file: episode.file,
                          })
                        }
                        className="play--btn"
                      >
                        ▶️ Play
                      </button>

                      <button
                        onClick={() => toggleFavorite(episodeId)}
                        className={`favorite-btn ${
                          isFavorite ? "favorited" : "not-favorited"
                        }`}
                      >
                        {isFavorite ? "★ Favorited" : "☆ Favorite"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null
          )}
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}
