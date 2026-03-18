import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

export default function ContactPage() {
  const [form,    setForm]    = useState({ name: '', email: '', message: '' });
  const [status,  setStatus]  = useState(null); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await axios.post('/api/feedback', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="page-container" style={{ maxWidth: 900 }}>
        <h2 style={{ color: 'var(--green)', marginBottom: '1.5rem' }}>Contact Us</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Form */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Send us a message</h3>
            {status === 'success' && <div className="success-msg">Message sent! Thank you for reaching out.</div>}
            {status === 'error'   && <div className="error-msg">Something went wrong. Please try again.</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" rows={5} value={form.message} onChange={handleChange} required />
              </div>
              <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Info + FAQ */}
          <div>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '.8rem' }}>Contact Information</h3>
              <p>📧 <strong>Email:</strong> rvustudent@rvu.edu.in</p>
              <p>📞 <strong>Phone:</strong> 6363609253</p>
              <p>📍 <strong>Address:</strong> RV University, Bengaluru</p>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '.8rem' }}>FAQs</h3>
              <FAQ q="How to donate food?" a="Log in, click 'Donate' in the navbar, fill the form with food details, and submit." />
              <FAQ q="How will my donation be used?" a="A local NGO partner coordinates pickup and a delivery partner ensures it reaches those in need." />
              <FAQ q="What about expiration dates?" a="Only donate food that has not expired. The form validates expiry date automatically." />
            </div>
          </div>
        </div>
      </div>

      <Chatbot />
      <Footer />
    </div>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #eee', marginBottom: '.5rem' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: 'none', width: '100%', textAlign: 'left',
          fontWeight: 600, padding: '.5rem 0', fontSize: '.9rem',
          color: 'var(--text)',
        }}
      >
        {open ? '▾' : '▸'} {q}
      </button>
      {open && <p style={{ fontSize: '.88rem', color: 'var(--muted)', paddingBottom: '.5rem' }}>{a}</p>}
    </div>
  );
}
