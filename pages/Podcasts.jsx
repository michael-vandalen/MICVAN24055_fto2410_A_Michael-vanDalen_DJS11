import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const URL = `https://podcast-api.netlify.app`;

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setPodcasts(data);
      });
  }, []);

  const podcastElement = podcasts.map((podcasts) => (
    <div key={podcasts.id} className="podcast-card">
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
