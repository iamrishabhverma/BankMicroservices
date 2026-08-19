export default function StatCard({ label, value, tone }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <div className={`stat-value ${tone || ''}`}>{value}</div>
    </div>
  )
}
