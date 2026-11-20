// Asks the user if they want to go to a place, then opens their map app.
export default function DirectionsDialog({ business, onClose }) {
    if (!business) return null;

    const { lat, lng, name } = business;
    const label = encodeURIComponent(name);

    const apps = [
        { name: "Google Maps", url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` },
        { name: "Apple Maps", url: `https://maps.apple.com/?daddr=${lat},${lng}&q=${label}` },
        { name: "Waze", url: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` },
    ];

    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div
                className="dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="directions-title"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="directions-title">Go to {name}?</h2>
                <p>Choose an app for directions:</p>

                <div className="dialog-apps">
                    {apps.map((app) => (
                        <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer" onClick={onClose}>
                            {app.name}
                        </a>
                    ))}
                </div>

                <button className="dialog-cancel" onClick={onClose}>
                    Not now
                </button>
            </div>
        </div>
    );
}