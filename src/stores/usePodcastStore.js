import { create } from "zustand";

const URL = `https://podcast-api.netlify.app`;

const usePodcastStore = create((set) => ({
  podcasts: [],
  genres: {},
  selectedGenre: "",
  sortOrder: "A-Z",
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true });

    try {
      const podcastRes = await fetch(`${URL}`);
      const data = await podcastRes.json();
      const allPods = data.podcasts || data;

      // Collect unique genre IDs
      const genreIds = new Set();
      allPods.forEach((podcast) => {
        podcast.genres.forEach((id) => genreIds.add(id));
      });

      // Fetch genre data
      const genreFetches = Array.from(genreIds).map(async (id) => {
        const genreRes = await fetch(`${URL}/genre/${id}`);
        const genreData = await genreRes.json();
        return { id, name: genreData.title };
      });

      const genreData = await Promise.all(genreFetches);
      const genresMap = {};
      genreData.forEach(({ id, name }) => {
        genresMap[id] = name;
      });

      set({ podcasts: allPods, genres: genresMap });
    } catch ({ error: err }) {
      set({ error: err });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedGenre: (genre) => set({ selectedGenre: genre }),
  setSortOrder: (order) => set({ sortOrder: order }),
}));

export default usePodcastStore;
