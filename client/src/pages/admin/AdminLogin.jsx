import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { loginNgo } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/ngo/auth/login', form);
      loginNgo(data.token, data.admin || data.ngo);
      navigate('/ngo');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>🏢 NGO Partner Login</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <span className="pw-toggle" onClick={() => setShowPw((v) => !v)}>
                {showPw ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '.5rem' }}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.9rem', color: 'var(--muted)' }}>
          Need NGO access? <Link to="/ngo/signup" style={{ color: 'var(--green)', fontWeight: 600 }}>Create NGO Account</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '.4rem', fontSize: '.88rem', color: 'var(--muted)' }}>
          <Link to="/" style={{ color: 'var(--muted)' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
