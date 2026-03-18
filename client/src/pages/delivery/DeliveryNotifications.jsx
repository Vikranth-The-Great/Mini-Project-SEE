import { useEffect, useState } from 'react';
import axios from 'axios';
import DeliverySidebar from '../../components/DeliverySidebar';
import { useAuth } from '../../context/AuthContext';

export default function DeliveryNotifications() {
  const { deliveryToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = { headers: { Authorization: `Bearer ${deliveryToken}` } };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/notifications/my', auth);
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    await axios.put('/api/notifications/read-all', {}, auth);
    setRows((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="dashboard-layout">
      <DeliverySidebar />
      <main className="main-content">
        <h1 style={{ marginBottom: '1rem' }}>🔔 Delivery Notifications</h1>

        <div className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <p style={{ color: 'var(--muted)' }}>Review claimed-order alerts and other dispatch updates.</p>
          <button className="btn-primary" onClick={markAllRead}>Mark All Read</button>
        </div>

        <div className="card">
          {loading ? (
            <p style={{ color: 'var(--muted)' }}>Loading notifications…</p>
          ) : rows.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No notifications yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '.55rem' }}>
              {rows.map((n) => (
                <div
                  key={n._id}
                  style={{
                    border: '1px solid #e5e5e5',
                    borderLeft: `4px solid ${n.isRead ? '#c7c7c7' : 'var(--green)'}`,
                    borderRadius: 8,
                    padding: '.6rem .75rem',
                    background: n.isRead ? '#fafafa' : '#f5fff8',
                  }}
                >
                  <div style={{ fontSize: '.92rem', fontWeight: 600 }}>{n.message}</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: '.2rem' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
