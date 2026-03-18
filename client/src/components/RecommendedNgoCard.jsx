export default function RecommendedNgoCard({ recommendedNgo }) {
  if (!recommendedNgo?.name) return null;

  const distanceText =
    typeof recommendedNgo.distanceKm === 'number' ? `${recommendedNgo.distanceKm.toFixed(2)} km` : 'N/A';

  return (
    <div
      style={{
        margin: '1rem 0 1.5rem',
        padding: '.9rem 1rem',
        borderRadius: 12,
        border: '1px solid #c6e6cf',
        background: '#f4fff6',
        color: '#1f2937',
        fontWeight: 600,
      }}
    >
      Recommended NGO: {recommendedNgo.name} (distance: {distanceText})
    </div>
  );
}