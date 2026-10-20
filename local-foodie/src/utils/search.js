// Very simple "smart" search: pulls a budget and keywords out of plain English.
// Later: swap this function for a call to an AI API.
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
