import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RecommendedNgoCard from '../../components/RecommendedNgoCard';

export default function DeliveryConfirm() {
  const { state } = useLocation();
  const recommendedNgo = state?.recommendedNgo || null;

  return (
    <div>
      <Navbar />
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div className="card" style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: 'var(--green)', marginBottom: '.8rem' }}>Pickup Confirmed!</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Thank you for your generous donation! Our team will arrange a pickup from your address
            soon. You can track your donation status from your profile.
          </p>
          <RecommendedNgoCard recommendedNgo={recommendedNgo} />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/home">
              <button className="btn-primary">Return to Home</button>
            </Link>
            <Link to="/profile">
              <button style={{ background: '#e8f5e9', color: 'var(--green)', fontWeight: 600 }}>
                View My Donations
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
