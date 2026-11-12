import { useState, useEffect, useRef } from "react";
import SearchBar from "./components/SearchBar";
import BusinessCard from "./components/BusinessCard";
import MapView from "./components/MapView";
import { searchBusinessesByPreferences, searchBusinesses } from "./utils/search";
import { getUserLocation, withRealDistances, fetchNearbyPlaces } from "./utils/location";
import "./App.css";

export default function App() {
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");

  const [userLoc, setUserLoc] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState(null); // real places from OpenStreetMap
  const [radius, setRadius] = useState(5);
  const askedOnce = useRef(false);

  const showResults = (list) => {
    setResults(list);
    setSelected(list[0] || null);
  };

  const handleUseLocation = async () => {
    
    setLoading(true);
    setError("");
    try {
      setLoadingText("Finding your location...");
      const loc = await getUserLocation();
      setUserLoc(loc);

      setLoadingText("Finding restaurants and cafes near you...");
      const places = withRealDistances(
          await fetchNearbyPlaces(loc, radius * 1609.34),
          loc
        );
      setNearbyPlaces(places);
      showResults(places);

      if (places.length === 0) {
        setError("No restaurants or cafes found within a mile of you.");
      }
    } catch (err) {
      console.error(err);
      if (err.code === 1) {
        setError("Location access is blocked. Allow location for this site, then click \"Use my location\".");
      } else {
        setError("Couldn't load nearby places. Please try \"Use my location\" again.");
      }
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  // Ask for location automatically when the page opens (only once)
  useEffect(() => {
    if (askedOnce.current) return;
    askedOnce.current = true;
    handleUseLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (text) => {
    if (!nearbyPlaces) {
      setError("We need your location first. Click \"Use my location\" and allow access.");
      return;
    }

    setLoading(true);
    setLoadingText("Understanding your search...");
    setError("");

    try {
      // Send the search to the AI backend
      const response = await fetch("http://localhost:3001/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) {
        throw new Error("AI search failed");
      }

      const preferences = await response.json();
      console.log("AI preferences:", preferences);

      showResults(withRealDistances(searchBusinessesByPreferences(preferences, nearbyPlaces), userLoc));
    } catch (err) {
      console.error(err);
      setError("AI search failed. Using basic search instead.");
      showResults(withRealDistances(searchBusinesses(text, nearbyPlaces), userLoc));
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
    const handleRadiusChange = async () => {
    if (!userLoc) return;

    setLoading(true);
    setError("");
    setLoadingText("Updating search area...");

    try {
      const places = withRealDistances(
        await fetchNearbyPlaces(userLoc, radius * 1609.34),
        userLoc
      );

      setNearbyPlaces(places);
      showResults(places);

      if (places.length === 0) {
        setError(`No restaurants found within ${radius} miles.`);
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't update the search area.");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

    return (
      <div className="app">
        <header className="header">
          <h1>The Local Foodie</h1>
          <p>Find nearby local restaurants and cafes. No sign-up needed.</p>
        </header>

        {/* Search bar always visible */}
        <SearchBar onSearch={handleSearch} />

        {/* Location button */}
        <button
          className="location-btn"
          onClick={handleUseLocation}
          disabled={loading}
        >
          📍 {nearbyPlaces ? "Showing places near you (refresh)" : "Use my location"}
        </button>

        {/* Radius slider only appears when location is available */}
        {userLoc && (
          <div className="radius-control">
            <label>
              Search radius: <strong>{radius} miles</strong>
            </label>

            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />

            <button onClick={handleRadiusChange} disabled={loading}>
              Update Search Area
            </button>
          </div>
        )}

      {loading && <p className="hint">{loadingText}</p>}

      {error && <p className="hint">{error}</p>}

      {results && results.length === 0 && !error && (
        <p className="hint">No matches. Try a different search.</p>
      )}

      {results && results.length > 0 && (
        <main className="results">
          <section className="list">
            {results.map((b) => (
              <BusinessCard
                key={b.id}
                business={b}
                selected={selected?.id === b.id}
                onSelect={setSelected}
              />
            ))}
          </section>

          <section className="map-wrap">
            <MapView business={selected} />
          </section>
        </main>
      )}
    </div>
  );
}