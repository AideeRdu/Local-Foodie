import { useState } from "react";

const EXAMPLES = ["I'd like a cup of coffee", "Any Chinese restaurants nearby?", "I feel like having ice-cream today", "My budget is about $15.00"];

export default function SearchBar({ onSearch }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(text);
  };

  const tryExample = (example) => {
    setText(example);
    onSearch(example);
  };

  return (
    <div className="search">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What are you craving?"
          aria-label="Search for food nearby"
        />
        <button type="submit">Search</button>
      </form>
      <div className="examples">
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" className="chip" onClick={() => tryExample(ex)}>
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
