import { Link } from "react-router-dom";
import { useEffect } from "react";
import usePodcastStore from "../src/stores/usePodcastStore";

export default function Podcasts() {
  const {
    podcasts,
    genres,
    selectedGenre,
    sortOrder,
    isLoading,
    error,
    fetchData,
    setSelectedGenre,
    setSortOrder,
  } = usePodcastStore();

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering by genre
  const filteredPodcasts = podcasts.filter((podcast) =>
    selectedGenre ? podcast.genres.includes(parseInt(selectedGenre)) : true
  );

  const sortedPodcasts = [...filteredPodcasts].sort((a, b) =>
    sortOrder === "A-Z"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  return (
    <div className="podcast--list-container">
      <h1>All Podcasts</h1>

      {/* Sort and filter Controls */}
      <div className="controls">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {Object.entries(genres).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="A-Z">Sort A-Z</option>
          <option value="Z-A">Sort Z-A</option>
        </select>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Something went wrong!</div>
      ) : (
        <div className="podcast--list">
          {sortedPodcasts.map((podcast) => (
            <div key={podcast.id} className="podcast--card">
              <Link to={`/podcasts/${podcast.id}`}>
                <img src={podcast.image} alt={podcast.title} />
                <h3>{podcast.title}</h3>
                <ul className="podcast--genres">
                  {podcast.genres.map((id) => (
                    <li key={id}>{genres[id] || `Genre ${id}`}</li>
                  ))}
                </ul>
                <p>Seasons: {podcast.seasons}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
