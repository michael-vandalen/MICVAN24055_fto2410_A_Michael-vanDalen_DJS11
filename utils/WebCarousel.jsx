import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import usePodcastStore from "../src/stores/usePodcastStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WebCarousel() {
  const { podcasts, fetchData } = usePodcastStore();

  const navigate = useNavigate();
  const navigateToPodcastDetail = (id) => {
    navigate(`/podcasts/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const featuredPodcasts = podcasts.slice(0, 8);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={false}
      arrows={true}
      showDots={false}
      containerClass="carousel-container"
      itemClass="carousel-item"
    >
      {featuredPodcasts.map((podcast) => (
        <div key={podcast.id} className="podcast-card">
          <img
            src={podcast.image}
            alt={podcast.title}
            className="podcast-image"
          />
          <h3 className="podcast-title">{podcast.title}</h3>
          <h4>
            <strong>Seasons: </strong>
            {podcast.seasons}
          </h4>
          <button
            className="podcast-button"
            onClick={() => navigateToPodcastDetail(podcast.id)}
          >
            View Podcast
          </button>
        </div>
      ))}
    </Carousel>
  );
}
