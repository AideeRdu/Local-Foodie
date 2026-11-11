
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import BusinessCard from "./components/BusinessCard";
import MapView from "./components/MapView";
import businesses from "./data/businesses";
import { searchBusinessesByPreferences, searchBusinesses } from "./utils/search";
import "./App.css";

export default function App() {
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (text) => {
    setLoading(true);
    setError("");

    try {
      // Send the search to the Gemini backend
      const response = await fetch("http://localhost:3001/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: text })
      });

      if (!response.ok) {
        throw new Error("AI search failed");
      }

      // Get preferences from Gemini
      const preferences = await response.json();

      console.log("Gemini preferences:", preferences);

      // Filter restaurants using the AI preferences
      const found = searchBusinessesByPreferences(preferences, businesses);

      setResults(found);
      setSelected(found[0] || null);

    } catch (error) {
      console.error(error);
      setError("AI search failed. Using basic search instead.");

      // Use original search if AI is unavailable
      const found = searchBusinesses(text, businesses);
      setResults(found);
      setSelected(found[0] || null);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>The Local Foodie</h1>
        <p>Find nearby local restaurants and cafes. No sign-up needed.</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {loading && <p className="hint">Understanding your search...</p>}

      {error && <p className="hint">{error}</p>}

      {results === null && (
        <p className="hint">Type what you feel like eating, or tap an example above.</p>
      )}

      {results && results.length === 0 && (
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
