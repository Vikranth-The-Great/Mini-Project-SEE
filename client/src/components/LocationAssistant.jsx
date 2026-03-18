import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const BENGALURU_FALLBACK = [12.9716, 77.5946];

function pickBestArea(addressObj, options) {
  const candidates = [
    addressObj.suburb,
    addressObj.neighbourhood,
    addressObj.city_district,
    addressObj.city,
    addressObj.town,
    addressObj.village,
    addressObj.county,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const found = options.find((opt) => opt.toLowerCase() === String(candidate).toLowerCase());
    if (found) return found;
  }

  for (const candidate of candidates) {
    const found = options.find((opt) => opt.toLowerCase().includes(String(candidate).toLowerCase()));
    if (found) return found;
  }

  return '';
}

export default function LocationAssistant({
  areaOptions = [],
  onResolved,
  title = 'Location Assistant',
  helperText = 'Share live location or click on map to choose a location manually.',
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [showMap, setShowMap] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [status, setStatus] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');

  const resolveCoordinates = async (latitude, longitude, source) => {
    setResolving(true);
    setStatus('Resolving selected coordinates...');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const address = data.display_name || '';
      const area = pickBestArea(data.address || {}, areaOptions);

      setResolvedAddress(address || 'Address unavailable');
      setStatus(source === 'gps' ? 'Live location captured.' : 'Map location captured.');

      onResolved?.({
        latitude,
        longitude,
        area,
        address,
      });
    } catch {
      setStatus('Could not fetch address details for selected coordinates.');
    } finally {
      setResolving(false);
    }
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported in this browser.');
      return;
    }

    setStatus('Requesting location permission...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          if (markerRef.current) markerRef.current.remove();
          markerRef.current = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
        }

        await resolveCoordinates(latitude, longitude, 'gps');
      },
      () => setStatus('Location permission denied. You can still choose manually on map.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!showMap || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(BENGALURU_FALLBACK, 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker([lat, lng]).addTo(map);
      await resolveCoordinates(lat, lng, 'map');
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [showMap]);

  return (
    <div className="location-assistant">
      <h4>{title}</h4>
      <p>{helperText}</p>

      <div className="location-assistant-actions">
        <button type="button" className="btn-secondary" onClick={handleUseLiveLocation} disabled={resolving}>
          {resolving ? 'Fetching...' : 'Share Live Location'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => setShowMap((v) => !v)}>
          {showMap ? 'Hide Map' : 'Point on Map'}
        </button>
      </div>

      {status && <div className="location-assistant-status">{status}</div>}
      {resolvedAddress && <div className="location-assistant-address">{resolvedAddress}</div>}

      {showMap && <div ref={mapRef} className="location-assistant-map" />}
    </div>
  );
}
