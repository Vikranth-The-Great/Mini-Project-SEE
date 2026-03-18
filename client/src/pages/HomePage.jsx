import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <h1>Turn extra meals into real impact 🌿</h1>
        <p>
          Every plate counts. Donate surplus food and we'll make sure it reaches someone who truly
          needs it — fresh, fast, and with care.
        </p>
        <Link to="/donate">
          <button className="btn-primary" style={{ padding: '.75rem 2rem', fontSize: '1.05rem' }}>
            Donate Food Now
          </button>
        </Link>
        <Link to="/find-food" style={{ marginTop: '.8rem', display: 'inline-block' }}>
          <button className="btn-secondary" style={{ padding: '.65rem 1.6rem', fontSize: '.98rem' }}>
            Find Free Food Near You
          </button>
        </Link>
      </section>

      {/* Impact */}
      <section className="page-container">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--green)' }}>Our Impact</h2>
        <div className="stats-grid" style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="stat-box"><h3>500+</h3><p>Meals Donated</p></div>
          <div className="stat-box"><h3>50+</h3><p>Volunteers</p></div>
          <div className="stat-box"><h3>20+</h3><p>Locations Covered</p></div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#e8f5e9', padding: '3rem 1rem' }}>
        <div className="page-container" style={{ maxWidth: 900 }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Doorstep Pickup</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <Step num="1" title="Fill Donation Form" desc="Provide food details, quantity, expiry, and your address." />
            <Step num="2" title="NGO Reviews"       desc="A local NGO partner claims your donation and schedules a pickup." />
            <Step num="3" title="Delivery Partner"  desc="A delivery volunteer picks it up from your doorstep." />
            <Step num="4" title="Fed with Love"     desc="The food reaches someone in need — thanks to you!" />
          </div>
        </div>
      </section>

      <Chatbot />
      <Footer />
    </div>
  );
}

function Step({ num, title, desc }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--green)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', fontWeight: 700, margin: '0 auto 1rem',
        }}
      >
        {num}
      </div>
      <h4 style={{ marginBottom: '.4rem' }}>{title}</h4>
      <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>{desc}</p>
    </div>
  );
}
