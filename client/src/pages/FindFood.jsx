import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BENGALURU_FALLBACK = [12.9716, 77.5946];

const formatTimeRange = (start, end) => {
  if (!start || !end) return 'Time unavailable';
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 'Time unavailable';

  const fmt = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${fmt.format(s)} - ${fmt.format(e)}`;
};

export default function FindFood() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);

  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAvailability = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ngos/food-availability');
      if (!res.ok) throw new Error('Could not fetch food availability');
      const data = await res.json();
      setSpots(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not fetch food availability');
      setSpots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(BENGALURU_FALLBACK, 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    loadAvailability();
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerLayer = markerLayerRef.current;
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();

    const points = [];

    for (const spot of spots) {
      if (typeof spot.latitude !== 'number' || typeof spot.longitude !== 'number') continue;

      points.push([spot.latitude, spot.longitude]);

      const popupHtml = `
        <div style="min-width: 220px;">
          <h4 style="margin: 0 0 6px 0;">${spot.ngoName}</h4>
          <p style="margin: 0 0 4px 0;"><strong>Address:</strong> ${spot.address || 'N/A'}</p>
          <p style="margin: 0 0 4px 0;"><strong>Meals Available:</strong> ${spot.mealsRemaining}</p>
          <p style="margin: 0;"><strong>Time:</strong> ${formatTimeRange(spot.distributionStartTime, spot.distributionEndTime)}</p>
        </div>
      `;

      L.marker([spot.latitude, spot.longitude]).addTo(markerLayer).bindPopup(popupHtml);
    }

    if (points.length > 1) {
      map.fitBounds(points, { padding: [30, 30] });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.setView(BENGALURU_FALLBACK, 12);
    }
  }, [spots]);

  return (
    <div>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 1080 }}>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h2 style={{ marginBottom: '.5rem' }}>Find Free Food Near You</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
            Live view of NGOs currently distributing available meals.
          </p>

          <div style={{ display: 'flex', gap: '.65rem', marginBottom: '.9rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn-primary" onClick={loadAvailability} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Availability'}
            </button>
            <span style={{ color: 'var(--muted)', alignSelf: 'center' }}>
              {spots.length} active NGO spot(s)
            </span>
          </div>

          {error && <div className="error-msg" style={{ marginBottom: '.9rem' }}>{error}</div>}

          <div id="find-food-map" ref={mapRef} style={{ height: 500, width: '100%', borderRadius: 12 }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
