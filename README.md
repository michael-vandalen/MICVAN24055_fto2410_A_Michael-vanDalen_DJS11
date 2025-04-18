# 🎧 Loop - Podcast App

Welcome to **LOOP**, a modern podcast web application that lets users browse, search, and listen to a variety of podcasts. Users can favorite episodes, track completed ones, and enjoy a fully responsive experience.

---

## 📌 Features

- 🔍 **Search**: Fuzzy search to find podcasts by title
- 🎙️ **Podcast Details**: View seasons and episodes of each podcast
- ❤️ **Favorites**: Mark and manage favorite episodes
- ✅ **Completed Episodes**: Tracks and displays episodes you finished listening to
- 🎵 **Audio Player**: Inline player with play/pause and close functionality
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop views
- ⚡ **State Management**: Uses Zustand for global state
- 💾 **Persistence**: Stores favorites and completed status in `localStorage`

---

## Projct Setup

src/
│
├── components/ # Shared UI components (Header, Layout, etc.)
├── pages/  
│ ├── Home/ # Landing page
│ ├── Podcasts/ # Podcasts list page
│ ├── PodcastDetails/ # Detail page per podcast
│ ├── Favorites/ # Favorite episodes
│ └── Completed/ # Completed episodes page
│
├── stores/ # Zustand stores
├── assets/ # Images, logos, icons
├── App.jsx # Main routing config
└── main.jsx # App entry point

## Languages Used

- React (Vite)

- Zustand for state management

- React Router v6 for navigation

- CSS Modules / Plain CSS for styling

- localStorage for persistence

## Future Improvements

- User authentication

- Dark Mode Toggle

- Offline listening

## License

MIT License © Michael van Dalen

Project planning link: https://www.figma.com/design/MmytjSJPh3h7UqAjMdnhO5/Untitled?node-id=0-1&t=xt2iJWce5Y2g1rv3-1.

Project presentation link: https://docs.google.com/presentation/d/1P1JvS9LjxjOFgtY88TeoFc8zY2jJSe5u6sEi1nJ8twU/edit?usp=sharing
