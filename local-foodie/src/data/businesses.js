// Sample data so the app works without a backend.
// Later: replace this with real data from an API (e.g. Google Places, Yelp).
const businesses = [
  { id: 1, name: "Bean & Barrel Coffee", type: "cafe", cuisine: ["coffee", "cafe", "pastries"],
    avgSpend: 8, distance: 0.4, lat: 35.2271, lng: -80.8431,
    services: ["Online orders", "DoorDash"], blurb: "Small-batch roasts and fresh-baked scones." },
  { id: 2, name: "Golden Dragon Kitchen", type: "restaurant", cuisine: ["chinese", "noodles", "dumplings"],
    avgSpend: 14, distance: 0.9, lat: 35.2301, lng: -80.8402,
    services: ["Online orders", "DoorDash", "Uber Eats"], blurb: "Family-run, hand-pulled noodles and dumplings." },
  { id: 3, name: "Sweet Scoop Creamery", type: "dessert", cuisine: ["ice cream", "dessert", "ice-cream"],
    avgSpend: 6, distance: 1.2, lat: 35.2244, lng: -80.8465,
    services: ["Uber Eats"], blurb: "Local dairy, 24 rotating flavors." },
  { id: 4, name: "Lucky Panda Bistro", type: "restaurant", cuisine: ["chinese", "szechuan"],
    avgSpend: 22, distance: 1.8, lat: 35.2335, lng: -80.8379,
    services: ["Online orders", "Uber Eats"], blurb: "Szechuan classics in a cozy dining room." },
  { id: 5, name: "Morning Glory Cafe", type: "cafe", cuisine: ["coffee", "cafe", "breakfast", "sandwiches"],
    avgSpend: 12, distance: 2.1, lat: 35.2218, lng: -80.8350,
    services: ["Online orders", "DoorDash", "Uber Eats"], blurb: "Breakfast all day and great espresso." },
];
export default businesses;
