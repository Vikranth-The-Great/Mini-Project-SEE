import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { userToken, user, logoutUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">🥗 FoodDonate</Link>
      <div className="navbar-links">
        <Link to="/home">{t('home')}</Link>
        <Link to="/about">About Project</Link>
        <Link to="/contact">{t('contact')}</Link>
        {userToken ? (
          <>
            <Link to="/profile">{t('profile')}</Link>
            <Link to="/donate">{t('donate_food')}</Link>
            <button className="btn-primary" onClick={handleLogout} style={{ padding: '.35rem .9rem' }}>
              {t('logout')}
            </button>
          </>
        ) : (
          <Link to="/signin">
            <button className="btn-primary" style={{ padding: '.35rem .9rem' }}>{t('login')}</button>
          </Link>
        )}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
