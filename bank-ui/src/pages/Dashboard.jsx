import { useEffect, useState } from 'react'
import { accountService } from '../api/accountService'
import { transactionService } from '../api/transactionService'
import StatCard from '../components/StatCard'

const currency = (n) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n || 0)

export default function Dashboard() {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [accRes, txRes] = await Promise.all([
          accountService.list(),
          transactionService.list()
        ])
        if (cancelled) return
        setAccounts(accRes.data || [])
        setTransactions((txRes.data || []).slice(0, 5))
      } catch (err) {
        if (!cancelled) setError('Could not reach the account or transaction service.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0)

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1 className="page-title">Dashboard</h1>
          </div>
        </div>

        {loading && <p className="loading-line">Fetching balances…</p>}
        {error && <div className="form-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="stat-grid">
              <StatCard label="Total balance" value={currency(totalBalance)} tone="positive" />
              <StatCard label="Open accounts" value={accounts.length} />
              <StatCard label="Recent transactions" value={transactions.length} />
            </div>

            <div className="panel">
              <h2 className="panel-title">Latest activity</h2>
              {transactions.length === 0 ? (
                <div className="empty-state">
                  <h3>No transactions yet</h3>
                  <p>Activity across your accounts will show up here.</p>
                </div>
              ) : (
                <div className="ledger">
                  {transactions.map((tx) => (
                    <div className="ledger-row" key={tx.id}>
                      <div>
                        <div className="ledger-title">{tx.description || tx.type || 'Transaction'}</div>
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
          </>
        )}
      </div>
    </div>
  )
}
