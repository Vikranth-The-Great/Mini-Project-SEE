import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import LocationAssistant from '../../components/LocationAssistant';

const AREAS = [
  'Indiranagar','Koramangala','Whitefield','Jayanagar','Rajajinagar',
  'Malleshwaram','Yelahanka','Electronic City','Bannerghatta Road','Marathahalli',
  'HSR Layout','BTM Layout','JP Nagar','Hebbal','Vijayanagar',
  'Basavanagudi','Sadashivanagar','RT Nagar','Padmanabhanagar','KR Puram',
];

export default function DonateForm() {
  const { user, userToken } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    name: user?.name || '',
    phoneno: '',
    food: '',
    type: 'veg',
    category: 'cooked-food',
    quantity: '',
    expiryDate: today,
    expiryTime: '',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLocationResolved = ({ area, address, latitude, longitude }) => {
    setForm((prev) => ({
      ...prev,
      location: area || prev.location,
      latitude: typeof latitude === 'number' ? latitude : prev.latitude,
      longitude: typeof longitude === 'number' ? longitude : prev.longitude,
      address: address
        ? `${address}${latitude && longitude ? ` (Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)})` : ''}`
        : prev.address,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // front-end expiry validation
    const now = new Date();
    const expiryDT = new Date(`${form.expiryDate}T${form.expiryTime}`);
    if (!form.expiryTime || expiryDT <= now) {
      return setError('Expiry date and time must be in the future.');
    }

    if (!/^\d{10}$/.test(form.phoneno)) {
      return setError('Phone number must be exactly 10 digits.');
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/donations', form, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      navigate('/delivery-confirm', {
        state: { recommendedNgo: data?.recommendedNgo || null },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container" style={{ maxWidth: 700 }}>
        <div className="card">
          <h2 style={{ color: 'var(--green)', marginBottom: '1.5rem' }}>🍱 {t('donate_food')}</h2>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>{t('food_name')}</label>
                <input name="food" value={form.food} onChange={handleChange} required placeholder="e.g. Rice, Biryani…" />
              </div>
              <div className="form-group">
                <label>{t('quantity')}</label>
                <input name="quantity" value={form.quantity} onChange={handleChange} required placeholder="e.g. 5 kg, 10 plates" />
              </div>
            </div>

            {/* Meal type */}
            <div className="form-group">
              <label>Meal Type</label>
              <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '.3rem' }}>
                {['veg', 'non-veg'].map((t) => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer' }}>
                    <input type="radio" name="type" value={t} checked={form.type === t} onChange={handleChange} style={{ width: 'auto' }} />
                    {t === 'veg' ? '🥦 Veg' : '🍗 Non-Veg'}
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>
              <div style={{ display: 'flex', gap: '1rem', paddingTop: '.3rem', flexWrap: 'wrap' }}>
                {[
                  { val: 'raw-food',    label: '🌾 Raw Food' },
                  { val: 'cooked-food', label: '🍲 Cooked Food' },
                  { val: 'packed-food', label: '📦 Packed Food' },
                ].map(({ val, label }) => (
                  <label
                    key={val}
                    style={{
                      cursor: 'pointer',
                      border: `2px solid ${form.category === val ? 'var(--green)' : '#ccc'}`,
                      borderRadius: 10, padding: '.5rem 1rem', fontSize: '.9rem',
                      background: form.category === val ? '#e8f5e9' : 'white',
                    }}
                  >
                    <input type="radio" name="category" value={val} checked={form.category === val} onChange={handleChange} style={{ display: 'none' }} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>{t('expiry_date')}</label>
                <input type="date" name="expiryDate" value={form.expiryDate} min={today} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>{t('expiry_time')}</label>
                <input type="time" name="expiryTime" value={form.expiryTime} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>{t('name')}</label>
                <input name="name" value={form.name} onChange={handleChange} required minLength={2} />
              </div>
              <div className="form-group">
                <label>{t('phone')}</label>
                <input name="phoneno" value={form.phoneno} onChange={handleChange} required pattern="\d{10}" placeholder="10 digit number" />
              </div>
            </div>

            <div className="form-group">
              <label>Area / Location</label>
              <select name="location" value={form.location} onChange={handleChange} required>
                <option value="">-- Select Area --</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Full Address</label>
              <textarea name="address" rows={3} value={form.address} onChange={handleChange} required placeholder="House/flat number, street, landmark…" />
            </div>

            <LocationAssistant
              areaOptions={AREAS}
              onResolved={handleLocationResolved}
              title="Pickup Location"
              helperText="Use your current location or pin the exact pickup point on map."
            />

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '.75rem', fontSize: '1rem' }}>
              {loading ? t('submitting') : `🚀 ${t('submit')}`}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
