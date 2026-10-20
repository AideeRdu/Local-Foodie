export default function BusinessCard({ business, selected, onSelect }) {
  return (
    <article className={`card ${selected ? "card-selected" : ""}`}>
      <button className="card-main" onClick={() => onSelect(business)}>
        <h3>{business.name}</h3>
        <p className="blurb">{business.blurb}</p>
        <p className="meta">
          About ${business.avgSpend} per person &middot; {business.distance} mi away
        </p>
      </button>
      <ul className="services">
        {business.services.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </article>
  );
}
