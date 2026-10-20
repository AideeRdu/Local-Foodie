import { useState } from "react";
import SearchBar from "./components/SearchBar";
import BusinessCard from "./components/BusinessCard";
import MapView from "./components/MapView";
import businesses from "./data/businesses";
import { searchBusinesses } from "./utils/search";
import "./App.css";

export default function App() {
  const [results, setResults] = useState(null); // null = haven't searched yet
  const [selected, setSelected] = useState(null);

  const handleSearch = (text) => {
    const found = searchBusinesses(text, businesses);
    setResults(found);
    setSelected(found[0] || null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>The Local Foodie</h1>
        <p>Find nearby local restaurants and cafes. No sign-up needed.</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {results === null && <p className="hint">Type what you feel like eating, or tap an example above.</p>}
      {results && results.length === 0 && (
        <p className="hint">No matches. Try a different food, or raise your budget.</p>
      )}

      {results && results.length > 0 && (
        <main className="results">
          <section className="list">
            {results.map((b) => (
              <BusinessCard key={b.id} business={b} selected={selected?.id === b.id} onSelect={setSelected} />
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
