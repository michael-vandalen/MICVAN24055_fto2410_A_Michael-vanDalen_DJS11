import { create } from "zustand";

const useAudioPlayerStore = create((set) => ({
  currentEpisode: null,
  isPlaying: false,
  setCurrentEpisode: (episode) =>
    set({ currentEpisode: episode, isPlaying: true }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  clearCurrentEpisode: () => set({ currentEpisode: null }),
}));

export default useAudioPlayerStore;
