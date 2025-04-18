import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

export default function SearchComponent() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Fetch podcast data and filter it based on input
  const fetchData = (value) => {
    fetch("https://podcast-api.netlify.app")
      .then((res) => res.json())
      .then((data) => {
        // Filter podcasts by title matching the search input
        const results = data.filter((podcast) =>
          podcast.title.toLowerCase().includes(value.toLowerCase())
        );
        setResults(results); // Update state with filtered results
      });
  };

  // Handle input change from the user
  const handleChange = (value) => {
    setInput(value);
    if (value.trim() !== "") fetchData(value); // Update input state
    else setResults([]); // clear results if input is cleared
  };

  return (
    <div>
      {/* Search input field with icon */}
      <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input
          placeholder="Type to search..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>

      {/* Display search results dropdown if input exists and results found */}
      {input && results.length > 0 && (
        <div className="results-list">
          {results.map((result, id) => (
            <div
              className="search-result"
              key={id}
              onClick={() => {
                navigate(`/podcasts/${result.id}`);
                setInput("");
                setResults([]);
              }}
            >
              {result.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
