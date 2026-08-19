import { useEffect, useState } from 'react'
import { accountService } from '../api/accountService'
import { transactionService } from '../api/transactionService'

const currency = (n) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n || 0)

export default function Transactions() {
  const [accounts, setAccounts] = useState([])
  const [accountId, setAccountId] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    accountService.list().then((res) => setAccounts(res.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    transactionService
      .list(accountId || undefined)
      .then((res) => { if (!cancelled) setTransactions(res.data || []) })
      .catch(() => { if (!cancelled) setError('Could not reach transaction-service.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [accountId])

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Ledger</p>
            <h1 className="page-title">Transactions</h1>
          </div>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            style={{
              background: 'var(--ink-900)',
              border: '1px solid var(--line-strong)',
              color: 'var(--paper)',
              padding: '9px 12px'
            }}
          >
            <option value="">All accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.nickname || a.type}</option>
            ))}
          </select>
        </div>

        {error && <div className="form-error">{error}</div>}
        {loading ? (
          <p className="loading-line">Fetching transactions…</p>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing here yet</h3>
            <p>Transactions for this account will appear as they post.</p>
          </div>
        ) : (
          <div className="ledger">
            {transactions.map((tx) => (
              <div className="ledger-row" key={tx.id}>
                <div>
                  <div className="ledger-title">{tx.description || tx.type}</div>
                  <div className="ledger-meta">{tx.date || tx.createdAt}</div>
                </div>
                <span className={`status-tag ${(tx.status || 'ok').toLowerCase()}`}>
                  {tx.status || 'complete'}
                </span>
                <div className={`ledger-amount ${tx.amount < 0 ? 'debit' : 'credit'}`}>
                  {currency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
