import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div>
      <Navbar />

      <section className="hero" style={{ padding: '4rem 2rem' }}>
        <h1>Building a cleaner and kinder food system</h1>
        <p>
          FoodDonate is a community-driven platform based at RV University, Bengaluru. We connect
          surplus food donors with local NGO partners and delivery partners to reduce waste and hunger.
        </p>
      </section>

      <div className="page-container" style={{ maxWidth: 900 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <h3 style={{ color: 'var(--green)', marginBottom: '.8rem' }}>Our Mission</h3>
            <p>
              Every year, millions of tonnes of food go to waste while millions go hungry. Our mission
              is to bridge that gap — making food donation as easy as a few clicks.
            </p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--green)', marginBottom: '.8rem' }}>How We Work</h3>
            <p>
              Users donate, NGO partners coordinate pickups in their locality, and delivery volunteers
              ensure the food reaches the right hands — still fresh, still nourishing.
            </p>
          </div>
        </div>

        {/* Google Maps embed for RV University */}
        <h3 style={{ marginBottom: '1rem' }}>📍 Our Location</h3>
        <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <iframe
            title="RV University Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5899225896!2d77.4980!3d12.9228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3ee159cd6679%3A0x2e5b1c5ae2a43f8b!2sR.V.%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="380"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
