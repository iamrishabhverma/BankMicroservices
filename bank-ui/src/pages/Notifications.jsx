import { useEffect, useState } from 'react'
import { notificationService } from '../api/notificationService'

export default function Notifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await notificationService.list()
      setItems(data || [])
      setError('')
    } catch {
      setError('Could not reach notification-service.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    try {
      await notificationService.markRead(id)
    } catch {
      load()
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Alerts</p>
            <h1 className="page-title">Notifications</h1>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        {loading ? (
          <p className="loading-line">Fetching notifications…</p>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <h3>You're all caught up</h3>
            <p>Account and payment alerts will show up here.</p>
          </div>
        ) : (
          <div className="ledger">
            {items.map((n) => (
              <div className="ledger-row" key={n.id} style={{ opacity: n.read ? 0.55 : 1 }}>
                <div>
                  <div className="ledger-title">{n.title || n.message}</div>
                  <div className="ledger-meta">{n.createdAt || n.date}</div>
                </div>
                <span className="status-tag">{n.type || 'info'}</span>
                {!n.read && (
                  <button className="btn" onClick={() => markRead(n.id)} style={{ minWidth: 110 }}>
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
