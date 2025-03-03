import { useState, useEffect, useRef } from "react";
import { thunkLoadAnime } from "../../redux/anime";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchType, setSearchType] = useState("anime"); // 'anime' or 'user'
  const [allUsers, setAllUsers] = useState([]); // Store all users
  const resultsRef = useRef(null);
  const inputRef = useRef(null);
  const animeState = useSelector((state) => state.anime);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all users once when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/");
        const data = await response.json();
        setAllUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Determine search type based on first character
    if (value && value.startsWith("@")) {
      setSearchType("user");
    } else {
      setSearchType("anime");
    }
  };

  useEffect(() => {
    // Clear search results when navigating
    return () => {
      setSearchTerm("");
      setResults([]);
      setShowResults(false);
    };
  }, [location.pathname]);

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

  // Fetch or filter data when search term changes
  useEffect(() => {
    // For anime search, require at least 3 characters
    if (searchType === "anime" && searchTerm.length < 3) {
      setResults([]);
      return;
    }

    // For user search, require at least 2 characters after @
    if (searchType === "user" && searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setShowResults(true);

      try {
        if (searchType === "anime") {
          // Fetch anime from external API
          const response = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
              searchTerm
            )}&limit=5`
          );
          const data = await response.json();
          setResults(data.data || []);
        } else {
          // Filter users on the frontend
          const userQuery = searchTerm.substring(1).toLowerCase(); // Remove the @ symbol and lowercase for case-insensitive matching
          const filteredUsers = allUsers
            .filter((user) => user.username.toLowerCase().includes(userQuery))
            .slice(0, 5); // Limit to 5 results
          setResults(filteredUsers);
        }
      } catch (error) {
        console.error(`Error processing ${searchType} search:`, error);
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
  }, [searchTerm, searchType, allUsers]);

  // Handle clicking on a search result
  const handleResultClick = async (result) => {
    if (searchType === "anime") {
      // Existing anime click handler
      //* console.log("Selected anime:", result);
      // console.log('MAL _   ID ===>', animeState[result.mal_id]); 

      if (animeState[`anime_${result.mal_id}`]) {
        // console.log(animeState[`anime_${result.mal_id}`]);
        console.log('ERROR HERE: =>   ', animeState);
        let encoded_search_term = animeState && animeState[`anime_${result.mal_id}`] && animeState[`anime_${result.mal_id}`]['title'] && encodeURIComponent(animeState[`anime_${result.mal_id}`]['title'])
        navigate(
          `/anime/${animeState[`anime_${result.mal_id}`]['id']}/${encoded_search_term}/${
            animeState[`anime_${result.mal_id}`]['mal_id']
          }`
        );
      } else {
        const anime = await dispatch(thunkLoadAnime(result));

        console.log('ANIME FROM ERROR: ', anime);
        if (anime) {
          let encoded_search_term = anime && anime['title'] && encodeURIComponent(anime["title"]);
          navigate(
            `/anime/${anime.id}/${encoded_search_term}/${anime["mal_id"]}`
          );
        }
      }
    } else {
      // User click handler
      // console.log("Selected user:", result);
      navigate(`/user/${result.id}/details`);
    }

    // Clear search after selection
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="search-container" style={{ position: "relative" }}>
      <input
        ref={inputRef}
        style={{ width: "230px" }}
        placeholder="Search for Anime or @Users"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => {
          if (
            (searchType === "anime" && searchTerm.length >= 3) ||
            (searchType === "user" && searchTerm.length >= 2)
          ) {
            setShowResults(true);
          }
        }}
      />

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
            results.map((result, index) => (
              <div
                key={
                  searchType === "anime"
                    ? `${result.mal_id}-${index}`
                    : `user-${result.id}-${index}`
                }
                onClick={() => handleResultClick(result)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  color: "black"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                  e.currentTarget.style.cursor = "pointer";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {searchType === "anime" ? (
                  // Anime result display
                  <>
                    <img
                      src={result.images.jpg.small_image_url}
                      alt={result.title}
                      style={{
                        width: "40px",
                        height: "56px",
                        marginRight: "10px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: "bold" }}>
                        {result.title_english}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>
                        {result.year ? `${result.year} • ` : ""}
                        {result.type || ""}
                      </div>
                    </div>
                  </>
                ) : (
                  // User result display
                  <>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#ddd",
                        marginRight: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      {result.profile_pic ? (
                        <img
                          src={result.profile_pic}
                          alt={result.username}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "18px" }}>
                          {result.username[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: "bold" }}>
                        @{result.username}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : searchTerm.length >= (searchType === "anime" ? 3 : 2) ? (
            <div style={{ padding: "10px", textAlign: "center" }}>
              No results found
            </div>
          ) : (
            <div style={{ padding: "10px", textAlign: "center" }}>
              {searchType === "anime"
                ? "Type at least 3 characters to search for anime"
                : "Type at least 2 characters after @ to search for users"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
