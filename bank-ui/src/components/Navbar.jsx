import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand">
          <span className="brand-mark">Ledger</span>
          <span style={{ color: 'var(--paper-dim)', fontSize: 13 }}>
            bank microservices console
          </span>
        </div>
        <nav>
          <ul className="nav-links">
            <li><NavLink to="/" end>Dashboard</NavLink></li>
            <li><NavLink to="/accounts">Accounts</NavLink></li>
            <li><NavLink to="/transactions">Transactions</NavLink></li>
            <li><NavLink to="/payments">Payments</NavLink></li>
            <li><NavLink to="/notifications">Notifications</NavLink></li>
          </ul>
        </nav>
        <div className="nav-actions">
          {user && <span className="pill">{user.username || user.email}</span>}
          <button className="btn" onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    </header>
  )
}
