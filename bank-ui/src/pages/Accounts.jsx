import { useEffect, useState } from 'react'
import { accountService } from '../api/accountService'

const currency = (n) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n || 0)

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'CHECKING', nickname: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await accountService.list()
      setAccounts(data || [])
      setError('')
    } catch {
      setError('Could not reach account-service.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await accountService.create(form)
      setShowForm(false)
      setForm({ type: 'CHECKING', nickname: '' })
      await load()
    } catch {
      setError('Could not open the account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Holdings</p>
            <h1 className="page-title">Accounts</h1>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancel' : 'Open account'}
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        {showForm && (
          <div className="panel">
            <h2 className="panel-title">New account</h2>
            <form onSubmit={onSubmit}>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="type">Account type</label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--ink-900)',
                      border: '1px solid var(--line-strong)',
                      color: 'var(--paper)',
                      padding: '11px 12px'
                    }}
                  >
                    <option value="CHECKING">Checking</option>
                    <option value="SAVINGS">Savings</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="nickname">Nickname</label>
                  <input
                    id="nickname"
                    value={form.nickname}
                    onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                    placeholder="e.g. Everyday spending"
                  />
                </div>
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Opening…' : 'Open account'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="loading-line">Fetching accounts…</p>
        ) : accounts.length === 0 ? (
          <div className="empty-state">
            <h3>No accounts open</h3>
            <p>Open your first account to start tracking balances.</p>
          </div>
        ) : (
          <div className="ledger">
            {accounts.map((acc) => (
              <div className="ledger-row" key={acc.id}>
                <div>
                  <div className="ledger-title">{acc.nickname || acc.type}</div>
                  <div className="ledger-meta">#{acc.accountNumber || acc.id} · {acc.type}</div>
                </div>
                <span className="status-tag ok">{acc.status || 'active'}</span>
                <div className="ledger-amount credit">{currency(acc.balance)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
