
const STOP_WORDS = ["i", "id", "i'd", "like", "to", "go", "for", "a", "an", "the", "of", "any",
  "nearby", "near", "me", "my", "budget", "is", "about", "feel", "having", "have", "today",
  "want", "some", "cup", "restaurants", "restaurant", "places", "place", "and", "in", "under"];

export function parseQuery(text) {
  const lower = text.toLowerCase();
  const match = lower.match(/\$?\s?(\d+(?:\.\d+)?)/);
  const budget = match ? parseFloat(match[1]) : null;
  const words = lower.replace(/[^a-z\s'-]/g, " ").split(/\s+/)
    .filter((w) => w && !STOP_WORDS.includes(w));

  return { budget, words };
}

// Search using preferences returned by Groq
export function searchBusinessesByPreferences(p, businesses) {
  let maxSpend = null;

  if (p.price === "cheap") maxSpend = 10;
  if (p.price === "moderate") maxSpend = 20;

  return businesses.filter((b) => {
    const cuisineMatch = !p.cuisine ||
      b.type.toLowerCase().includes(p.cuisine.toLowerCase()) ||
      b.cuisine.some((c) => c.toLowerCase().includes(p.cuisine.toLowerCase()));

    const priceMatch = maxSpend === null || b.avgSpend <= maxSpend;

    const atmosphereMatch = !p.atmosphere ||
      b.atmosphere.includes(p.atmosphere.toLowerCase());

    const wifiMatch = p.wifi !== true || b.wifi === true;

    const lateMatch = p.openLate !== true || b.openLate === true;

    const groupMatch = p.groupFriendly !== true || b.groupFriendly === true;

    return cuisineMatch && priceMatch && atmosphereMatch &&
      wifiMatch && lateMatch && groupMatch;
  }).sort((a, b) => a.distance - b.distance);
}

// Original keyword search, kept as a backup
export function searchBusinesses(text, businesses) {
  const { budget, words } = parseQuery(text);

  return businesses
    .filter((b) => {
      const haystack = [b.name, b.type, ...b.cuisine].join(" ").toLowerCase();
      const matchesWords = words.length === 0 || words.some((w) => haystack.includes(w));
      const matchesBudget = budget === null || b.avgSpend <= budget;
      return matchesWords && matchesBudget;
    })
    .sort((a, b) => a.distance - b.distance);
}
