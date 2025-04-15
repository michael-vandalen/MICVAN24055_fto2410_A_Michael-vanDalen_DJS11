import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function PodcastDetail() {
  const params = useParams();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [podcast, setPodcast] = useState(null);
  const [genreNames, setGenreNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [favourites, setFavourites] = useState(() => {
    const stored = localStorage.getItem("favouriteEpisodes");
    return stored ? JSON.parse(stored) : [];
  });

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

  const toggleFavourite = (episodeId) => {
    let updatedFavourites;

    // Check if the episodeId is already in the favourites
    const existingFavourite = favourites.find((fav) => fav.id === episodeId);

    if (existingFavourite) {
      // If the episode is already a favorite, remove it
      updatedFavourites = favourites.filter((fav) => fav.id !== episodeId);
    } else {
      // If it's not a favorite, add it with the current date and time
      updatedFavourites = [
        ...favourites,
        { id: episodeId, addedAt: new Date().toISOString() },
      ];
    }

    // Update state and localStorage
    setFavourites(updatedFavourites);
    localStorage.setItem(
      "favouriteEpisodes",
      JSON.stringify(updatedFavourites)
    );
  };

  return (
    <div className="podcast--details-container">
      <Link to={"/podcasts"} relative="path" className="back--button">
        <span>Back to Podcasts</span>
      </Link>

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
                  const isFavorite = favourites.some(
                    (fav) => fav.id === episodeId
                  );
                  return (
                    <div key={episode.episode} className="episode">
                      <h4>
                        Episode: {episode.episode}: {episode.title}
                      </h4>
                      <p>{episode.description}</p>
                      <audio controls src={episode.file}></audio>
                      <button
                        onClick={() => toggleFavourite(episodeId)}
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
