import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const URL = `https://podcast-api.netlify.app`;

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchPod = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`${URL}`);
        const data = await res.json();
        setPodcasts(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPod();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong! Please try again.</div>;
  }
  // Variable for sorting alphabetically
  const sortedPodcast = [...podcasts].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  const podcastElement = sortedPodcast.map((podcasts) => (
    <div key={podcasts.id} className="podcast--card">
      <Link to={`/podcasts/${podcasts.id}`}>
        <img src={podcasts.image} />
        <h3>{podcasts.title}</h3>
        <p>Seasons: {podcasts.seasons}</p>
      </Link>
    </div>
  ));

  return (
    <div className="podcast--list-container">
      <h1>All Podcasts</h1>
      <div className="podcast--list">{podcastElement}</div>
    </div>
  );
}
