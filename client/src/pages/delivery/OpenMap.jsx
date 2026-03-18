import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import DeliverySidebar from '../../components/DeliverySidebar';
import { useAuth } from '../../context/AuthContext';

export default function OpenMap() {
  const { deliveryToken } = useAuth();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markerLayerRef = useRef(null);
  const [city, setCity] = useState('Detecting...');
  const [address, setAddress] = useState('Detecting...');
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [routeData, setRouteData] = useState({ optimizedOrder: [], unroutableOrders: [], totalDistanceKm: 0 });
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');

  const loadOptimizedRoute = async ({ lat = null, lng = null } = {}) => {
    setRouteLoading(true);
    setRouteError('');
    try {
      const params = {};
      if (typeof lat === 'number' && typeof lng === 'number') {
        params.startLat = lat;
        params.startLng = lng;
      }

      const { data } = await axios.get('/api/donations/my-deliveries/optimized-route', {
        params,
        headers: { Authorization: `Bearer ${deliveryToken}` },
      });
      setRouteData(data);
    } catch (err) {
      setRouteError(err.response?.data?.message || 'Could not load optimized route.');
    } finally {
      setRouteLoading(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([12.9716, 77.5946], 12); // Bengaluru fallback
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    if (!navigator.geolocation) {
      setCity('Unavailable');
      setAddress('Geolocation not supported by this browser.');
      loadOptimizedRoute();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        map.setView([latitude, longitude], 14);
        L.marker([latitude, longitude]).addTo(map).bindPopup('You are here').openPopup();

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const a = data.address || {};
          setCity(a.city || a.town || a.village || 'Unknown city');
          setAddress(data.display_name || 'Address unavailable');
        } catch {
          setCity('Unknown');
          setAddress('Could not fetch address details');
        }

        await loadOptimizedRoute({ lat: latitude, lng: longitude });
      },
      () => {
        setCity('Permission denied');
        setAddress('Enable location permission to show live map details.');
        loadOptimizedRoute();
      }
    );

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerLayerRef.current) {
      markerLayerRef.current.remove();
      markerLayerRef.current = null;
    }
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    const markerLayer = L.layerGroup().addTo(map);
    markerLayerRef.current = markerLayer;

    const points = [];
    if (routeData?.startPoint?.latitude && routeData?.startPoint?.longitude) {
      const s = routeData.startPoint;
      points.push([s.latitude, s.longitude]);
      L.circleMarker([s.latitude, s.longitude], {
        radius: 8,
        weight: 2,
        color: '#1565c0',
        fillColor: '#42a5f5',
        fillOpacity: 0.9,
      })
        .addTo(markerLayer)
        .bindPopup('Start point');
    }

    (routeData.optimizedOrder || []).forEach((stop) => {
      if (typeof stop.latitude !== 'number' || typeof stop.longitude !== 'number') return;
      points.push([stop.latitude, stop.longitude]);
      const label = `<b>Stop ${stop.sequence}</b><br/>${stop.donorName}<br/>${stop.address || stop.location || ''}`;
      L.marker([stop.latitude, stop.longitude]).addTo(markerLayer).bindPopup(label);
    });

    if (points.length >= 2) {
      routeLayerRef.current = L.polyline(points, {
        color: '#2e7d32',
        weight: 4,
        opacity: 0.85,
      }).addTo(map);
      map.fitBounds(routeLayerRef.current.getBounds(), { padding: [30, 30] });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    }
  }, [routeData]);

  const refreshRoute = () => {
    if (typeof coords.lat === 'number' && typeof coords.lng === 'number') {
      loadOptimizedRoute({ lat: coords.lat, lng: coords.lng });
    } else {
      loadOptimizedRoute();
    }
  };

  return (
    <div className="dashboard-layout">
      <DeliverySidebar />
      <main className="main-content">
        <h1 style={{ marginBottom: '1rem' }}>🗺️ Optimized Route Map</h1>

        <div className="stats-grid">
          <div className="stat-box"><h3 style={{ fontSize: '1rem' }}>City</h3><p>{city}</p></div>
          <div className="stat-box"><h3 style={{ fontSize: '1rem' }}>Live Address</h3><p>{address}</p></div>
          <div className="stat-box">
            <h3 style={{ fontSize: '1rem' }}>Coordinates</h3>
            <p>{coords.lat && coords.lng ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Unavailable'}</p>
          </div>
          <div className="stat-box">
            <h3 style={{ fontSize: '1rem' }}>Route Stops</h3>
            <p>{routeData.optimizedOrder?.length || 0}</p>
          </div>
          <div className="stat-box">
            <h3 style={{ fontSize: '1rem' }}>Total Route Distance</h3>
            <p>{typeof routeData.totalDistanceKm === 'number' ? `${routeData.totalDistanceKm} km` : 'N/A'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '.7rem', marginBottom: '.9rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigator.clipboard?.writeText(address || '')}
            disabled={!address || address === 'Detecting...'}
          >
            Copy Live Address
          </button>
          <a
            className="btn-secondary"
            href={coords.lat && coords.lng ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : '#'}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (!coords.lat || !coords.lng) e.preventDefault();
            }}
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Open in Google Maps
          </a>
          <button type="button" className="btn-primary" onClick={refreshRoute} disabled={routeLoading}>
            {routeLoading ? 'Optimizing…' : 'Refresh Optimized Route'}
          </button>
        </div>

        {routeError && <div className="error-msg" style={{ marginBottom: '.9rem' }}>{routeError}</div>}

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '.75rem' }}>Suggested Visit Order (Shortest Path)</h3>
          {routeLoading ? (
            <p style={{ color: 'var(--muted)' }}>Calculating route…</p>
          ) : routeData.optimizedOrder?.length ? (
            <ol style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '.45rem' }}>
              {routeData.optimizedOrder.map((stop) => (
                <li key={stop.donationId}>
                  <strong>{stop.donorName}</strong> - {stop.location || 'Unknown location'}
                  {' '}({stop.address || 'No address'})
                  {' '}[+{stop.distanceFromPreviousKm} km]
                </li>
              ))}
            </ol>
          ) : (
            <p style={{ color: 'var(--muted)' }}>No active assigned orders to optimize.</p>
          )}

          {!!routeData.unroutableOrders?.length && (
            <div style={{ marginTop: '.8rem', color: 'var(--muted)' }}>
              {routeData.unroutableOrders.length} order(s) skipped due to missing coordinates.
            </div>
          )}
        </div>

        <div className="card">
          <div id="map" ref={mapRef} />
        </div>
      </main>
    </div>
  );
}
