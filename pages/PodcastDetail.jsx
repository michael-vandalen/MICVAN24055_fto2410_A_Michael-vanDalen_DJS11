import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PodcastDetail() {
  const params = useParams();
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    fetch(`https://podcast-api.netlify.app/id/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPodcast(data);
      });
  }, [params.id]);

  return (
    <div className="podcast--details-container">
      {podcast ? (
        <div className="podcast--details">
          <img src={podcast.image} />
          <h2>{podcast.title}</h2>
          <p>{podcast.description}</p>
        </div>
      ) : (
        <h2>Loading</h2>
      )}
    </div>
  );
}
