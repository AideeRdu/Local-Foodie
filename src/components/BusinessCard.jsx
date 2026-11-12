
import { useState, useEffect } from "react";
import { getVisitorId } from "../utils/visitor";

export default function BusinessCard({ business, selected, onSelect }) {
  const [visitCount, setVisitCount] = useState(0);
  const [visited, setVisited] = useState(false);
  const [loadingVisit, setLoadingVisit] = useState(false);

  // Get the current visit count

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const visitorId = getVisitorId();

        const params = new URLSearchParams({
          businessId: business.id,
          visitorId: visitorId
        });

        const response = await fetch(
          `http://localhost:3001/api/visits?${params}`
        );

        if (!response.ok) {
          throw new Error("Could not load visits");
        }

        const data = await response.json();

        setVisitCount(data.count);
        setVisited(data.visitedBefore);

      } catch (err) {
        console.error("Could not load visits:", err);
      }
    };

    loadVisits();
  }, [business.id]);


  // Record a visit
  const handleVisit = async (e) => {
    e.stopPropagation();

    if (visited || loadingVisit) return;

    setLoadingVisit(true);

    try {
      const response = await fetch("http://localhost:3001/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId: business.id,
          visitorId: getVisitorId(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not record visit");
      }

      setVisitCount(data.count);

      if (data.recorded) {
        setVisited(true);
      }
    } catch (err) {
      console.error("Could not record visit:", err);
    } finally {
      setLoadingVisit(false);
    }
  };

  return (
    <div
      className={`business-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(business)}
    >
      <h3>{business.name}</h3>

      <p>{business.type}</p>

      {business.cuisine && (
        <p>{business.cuisine.join(", ")}</p>
      )}

      {business.distance !== undefined && (
        <p>{business.distance.toFixed(1)} miles away</p>
      )}

      {business.avgSpend !== undefined && (
        <p>Average spending: ${business.avgSpend}</p>
      )}

      {business.blurb && (
        <p>{business.blurb}</p>
      )}

      <div className="visit-section">
          <p>
            <strong>{visitCount}</strong>
            <span> community visits</span>
          </p>

        <button
          onClick={handleVisit}
          disabled={visited || loadingVisit}
        >
          {loadingVisit
            ? "Recording..."
            : visited
              ? "Visit recorded"
              : "I've visited this place"}
        </button>
      </div>
    </div>
  );
}
