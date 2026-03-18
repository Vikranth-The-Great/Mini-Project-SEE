import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="lang-switcher">
      <label htmlFor="lang-select" className="lang-switcher__label">
        🌐 {t('language')}:
      </label>
      <select
        id="lang-select"
        className="lang-switcher__select"
        value={i18n.resolvedLanguage}
        onChange={handleChange}
        aria-label={t('select_language')}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
