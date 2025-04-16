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

  const sortedPodcasts = [...filteredPodcasts].sort((a, b) => {
    switch (sortOrder) {
      case "A-Z":
        return a.title.localeCompare(b.title);
      case "Z-A":
        return b.title.localeCompare(a.title);
      case "Oldest":
        return new Date(a.updated) - new Date(b.updated);
      case "Newest":
        return new Date(b.updated) - new Date(a.updated);
      default:
        return 0;
    }
  });

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
          <option value="Oldest">Oldest</option>
          <option value="Newest">Newest</option>
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
                <p>
                  Last Updated: {new Date(podcast.updated).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
