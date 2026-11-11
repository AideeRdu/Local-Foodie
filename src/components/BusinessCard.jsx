export default function BusinessCard({ business, selected, onSelect }) {
  const details = [
    business.avgSpend != null && `About $${business.avgSpend} per person`,
    business.distance != null && `${business.distance} mi away`,
  ].filter(Boolean).join(" · ");

  return (
    <article className={`card ${selected ? "card-selected" : ""}`}>
      <button className="card-main" onClick={() => onSelect(business)}>
        <h3>{business.name}</h3>
        {business.blurb && <p className="blurb">{business.blurb}</p>}
        {details && <p className="meta">{details}</p>}
      </button>
      {business.services.length > 0 && (
        <ul className="services">
          {business.services.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </article>
  );
}