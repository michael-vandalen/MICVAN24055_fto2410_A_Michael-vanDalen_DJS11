import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function PodcastDetail() {
  const params = useParams();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [podcast, setPodcast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchPodDetails = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `https://podcast-api.netlify.app/id/${params.id}`
        );
        const data = await res.json();
        setPodcast(data);
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
                {season.episodes.map((episode) => (
                  <div key={episode.episode} className="episode">
                    <h4>
                      Episode: {episode.episode}: {episode.title}
                    </h4>
                    <p>{episode.description}</p>
                    <audio controls src={episode.file}></audio>
                  </div>
                ))}
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
