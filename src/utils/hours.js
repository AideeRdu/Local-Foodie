// Turn OpenStreetMap opening hours into friendlier text.
// Example: "Mo-Fr 07:00-17:00; Sa 08:00-14:00"
//   -> ["Mon–Fri 7:00 AM – 5:00 PM", "Sat 8:00 AM – 2:00 PM"]

const DAY_NAMES = {
    Mo: "Mon", Tu: "Tue", We: "Wed", Th: "Thu", Fr: "Fri", Sa: "Sat", Su: "Sun", PH: "Holidays",
};

function to12Hour(time) {
    const [h, m] = time.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return time;
    if (h === 24 && m === 0) return "Midnight";
    const suffix = h >= 12 && h < 24 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatHours(raw) {
    if (!raw) return [];
    if (raw.trim() === "24/7") return ["Open 24 hours"];

    return raw
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) =>
            part
                .replace(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/g, (_, a, b) => `${to12Hour(a)} – ${to12Hour(b)}`)
                .replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su|PH)\b/g, (d) => DAY_NAMES[d])
                .replace(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)-(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/g, "$1–$2")
                .replace(/\boff\b/gi, "Closed")
        );
}