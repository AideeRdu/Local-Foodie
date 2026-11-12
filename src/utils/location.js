// Ask the browser for the user's location
export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Location isn't supported in this browser"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    });
}

// Distance in miles between two points (Haversine formula)
export function distanceMiles(a, b) {
    const R = 3958.8;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}

// Replace each place's distance with the real one and sort nearest first
export function withRealDistances(list, userLoc) {
    if (!userLoc) return list;
    return list
        .map((b) => ({ ...b, distance: Math.round(distanceMiles(userLoc, b) * 10) / 10 }))
        .sort((a, b) => a.distance - b.distance);
}


// Common chains to hide, in case a location is missing its "brand" tag in OpenStreetMap
const CHAIN_NAMES = [
    "starbucks", "dunkin", "mcdonald", "burger king", "wendy", "taco bell", "subway",
    "chick-fil-a", "chipotle", "panera", "domino", "pizza hut", "papa john", "kfc",
    "popeyes", "bojangles", "arby", "sonic", "jersey mike", "jimmy john", "firehouse subs",
    "five guys", "panda express", "zaxby", "cook out", "applebee", "chili's", "olive garden",
    "red lobster", "outback", "texas roadhouse", "longhorn", "ihop", "denny", "waffle house",
    "cracker barrel", "krispy kreme", "dairy queen", "hardee", "cici", "little caesars",
    "qdoba", "moe's", "jason's deli", "mcalister", "smoothie king", "tropical smoothie",
    "panera bread", "buffalo wild wings", "red robin", "golden corral", "culver",
];

function isChain(tags) {
    if (tags.brand || tags["brand:wikidata"]) return true;
    const name = (tags.name || "").toLowerCase();
    return CHAIN_NAMES.some((chain) => name.includes(chain));
}

// Real, locally owned restaurants/cafes near a location from OpenStreetMap
export async function fetchNearbyPlaces({ lat, lng }, radiusMeters = 24000) {
    const query = `[out:json][timeout:25];
    node["amenity"~"restaurant|cafe|fast_food|ice_cream"]["name"](around:${radiusMeters},${lat},${lng});
    out;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "data=" + encodeURIComponent(query),
    });
    if (!res.ok) throw new Error("Couldn't load nearby places");
    const data = await res.json();

    return data.elements
        .filter((el) => !isChain(el.tags)) // keep local businesses only
        .map((el) => ({
            id: el.id,
            name: el.tags.name,
            type: el.tags.amenity === "cafe" ? "cafe" : "restaurant",
            cuisine: (el.tags.cuisine || "").split(";").filter(Boolean),
            avgSpend: null, // OpenStreetMap has no price data
            lat: el.lat,
            lng: el.lon,
            services: [],
            blurb: el.tags["addr:street"] || "",
            atmosphere: [],
            wifi: el.tags.internet_access === "wlan" || el.tags.internet_access === "yes",
            openLate: false,
            groupFriendly: false,
        }));
}