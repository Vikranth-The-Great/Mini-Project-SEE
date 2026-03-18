import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DeliverySidebar() {
  const { delivery, logoutDelivery } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutDelivery();
    navigate('/delivery/login');
  };

  return (
    <aside className="sidebar">
      <h2>Delivery Panel</h2>
      {delivery && <p style={{ color: '#aaa', fontSize: '.82rem', textAlign: 'center', marginBottom: '1rem' }}>Hi, {delivery.name}</p>}
      <Link to="/delivery">Available Pickups</Link>
      <Link to="/delivery/my-orders">My Orders</Link>
      <Link to="/delivery/map">Open Map</Link>
      <Link to="/delivery/notifications">Notifications</Link>
      <button
        onClick={handleLogout}
        style={{ marginTop: 'auto', background: '#e53935', color: 'white', width: '100%', borderRadius: 8 }}
      >
        Logout
      </button>
    </aside>
  );
}
