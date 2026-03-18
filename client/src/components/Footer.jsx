export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} FoodDonate — Turning extra meals into real impact.</p>
      <p style={{ marginTop: '.4rem' }}>
        <a href="mailto:rvustudent@rvu.edu.in">rvustudent@rvu.edu.in</a>
        &nbsp;|&nbsp;
        Phone: 6363609253
        &nbsp;|&nbsp;
        RV University, Bengaluru
      </p>
    </footer>
  );
}
