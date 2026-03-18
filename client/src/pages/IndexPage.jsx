import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #06C167 0%, #049e52 100%)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.8rem', marginBottom: '.5rem' }}>🥗 FoodDonate</h1>
      <p style={{ fontSize: '1.15rem', maxWidth: 520, marginBottom: '2.5rem', opacity: 0.9 }}>
        A platform to reduce food waste and feed the underprivileged. Choose your role to get started.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <RoleCard
          icon="🙋"
          title="User"
          desc="Donate surplus food and track your impact."
          to="/signin"
          color="#ffffff22"
        />
        <RoleCard
          icon="🛠️"
          title="NGO Partner"
          desc="Coordinate and track incoming donations in your area."
          to="/ngo/signin"
          color="#ffffff22"
        />
        <RoleCard
          icon="🚴"
          title="Delivery"
          desc="Pick up and deliver food to those in need."
          to="/delivery/login"
          color="#ffffff22"
        />
      </div>

      <Link to="/find-food" style={{ marginTop: '1.75rem', textDecoration: 'none' }}>
        <button
          className="btn-primary"
          style={{
            background: 'white',
            color: '#049e52',
            border: 'none',
            padding: '.75rem 1.5rem',
            borderRadius: 10,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Find Free Food Near You
        </button>
      </Link>
    </div>
  );
}

function RoleCard({ icon, title, desc, to, color }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: color,
          border: '2px solid rgba(255,255,255,.4)',
          borderRadius: 16,
          padding: '2rem 1.8rem',
          width: 220,
          color: 'white',
          cursor: 'pointer',
          transition: 'transform .2s, background .2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.35)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = color)}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>{icon}</div>
        <h3 style={{ marginBottom: '.4rem', fontSize: '1.2rem' }}>{title}</h3>
        <p style={{ fontSize: '.88rem', opacity: .85 }}>{desc}</p>
      </div>
    </Link>
  );
}
