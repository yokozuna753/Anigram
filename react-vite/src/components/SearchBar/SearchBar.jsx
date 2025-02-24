import { useState, useEffect, useRef } from "react";
import { thunkLoadAnime } from "../../redux/anime";
import { useDispatch } from "react-redux";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  // Handle search input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch anime data when search term changes
  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.length < 3) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setShowResults(true);

      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
            searchTerm
          )}&limit=5`
        );
        const data = await response.json();
        setResults(data.data || []);
      } catch (error) {
        console.error("Error fetching anime:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search requests
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchData();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchTerm);
    // Navigate or set state based on the search term
    setShowResults(false);
  };

  // Handle clicking on a search result
  const handleResultClick = (anime) => {
    setSearchTerm(anime.title_english);
    setShowResults(false);
    console.log("Selected anime:", anime);
    // You can add navigation to the anime details page here
    dispatch(thunkLoadAnime(anime))
  };

  return (
    <div className="search-container" style={{ position: "relative" }}>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          style={{ width: "230px" }}
          placeholder="Search for Anime or Friends"
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => searchTerm.length >= 3 && setShowResults(true)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Search results dropdown */}
      {showResults && (
        <div
          ref={resultsRef}
          className="search-results"
          style={{
            position: "absolute",
            width: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 10,
          }}
        >
          {isLoading ? (
            <div style={{ padding: "10px", textAlign: "center" }}>
              Loading...
            </div>
          ) : results.length > 0 ? (
            results.map((anime) => (
              <div
                key={anime.mal_id}
                onClick={() => handleResultClick(anime)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                  e.currentTarget.style.cursor = "pointer";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <img
                  src={anime.images.jpg.small_image_url}
                  alt={anime.title}
                  style={{
                    width: "40px",
                    height: "56px",
                    marginRight: "10px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div style={{ fontWeight: "bold" }}>
                    {anime.title_english}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    {anime.year ? `${anime.year} • ` : ""}
                    {anime.type || ""}
                  </div>
                </div>
              </div>
            ))
          ) : searchTerm.length >= 3 ? (
            <div style={{ padding: "10px", textAlign: "center" }}>
              No results found
            </div>
          ) : (
            <div style={{ padding: "10px", textAlign: "center" }}>
              Type at least 3 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
