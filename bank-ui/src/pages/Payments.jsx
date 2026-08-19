import { useEffect, useState } from 'react'
import { accountService } from '../api/accountService'
import { paymentService } from '../api/paymentService'

const currency = (n) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n || 0)

export default function Payments() {
  const [accounts, setAccounts] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    fromAccountId: '',
    payee: '',
    amount: '',
    memo: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [accRes, payRes] = await Promise.all([
        accountService.list(),
        paymentService.list()
      ])
      setAccounts(accRes.data || [])
      setPayments(payRes.data || [])
      setError('')
    } catch {
      setError('Could not reach payment-service.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess('')
    setError('')
    try {
      await paymentService.create({ ...form, amount: Number(form.amount) })
      setSuccess('Payment submitted.')
      setForm({ fromAccountId: '', payee: '', amount: '', memo: '' })
      await load()
    } catch {
      setError('Could not submit the payment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Send money</p>
            <h1 className="page-title">Payments</h1>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">New payment</h2>
          {error && <div className="form-error">{error}</div>}
          {success && (
            <div className="form-error" style={{ background: 'rgba(111,162,135,0.12)', borderColor: 'rgba(111,162,135,0.4)', color: 'var(--sage)' }}>
              {success}
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="fromAccountId">From account</label>
                <select
                  id="fromAccountId"
                  name="fromAccountId"
                  value={form.fromAccountId}
                  onChange={onChange}
                  required
                  style={{ width: '100%', background: 'var(--ink-900)', border: '1px solid var(--line-strong)', color: 'var(--paper)', padding: '11px 12px' }}
                >
                  <option value="" disabled>Select account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.nickname || a.type} — {currency(a.balance)}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="payee">Payee</label>
                <input id="payee" name="payee" value={form.payee} onChange={onChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="amount">Amount</label>
                <input id="amount" name="amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={onChange} required />
              </div>
              <div className="field">
                <label htmlFor="memo">Memo (optional)</label>
                <input id="memo" name="memo" value={form.memo} onChange={onChange} />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send payment'}
            </button>
          </form>
        </div>

        <div className="panel">
          <h2 className="panel-title">Payment history</h2>
          {loading ? (
            <p className="loading-line">Fetching payments…</p>
          ) : payments.length === 0 ? (
            <div className="empty-state">
              <h3>No payments sent</h3>
              <p>Payments you send will be listed here.</p>
            </div>
          ) : (
            <div className="ledger">
              {payments.map((p) => (
                <div className="ledger-row" key={p.id}>
                  <div>
                    <div className="ledger-title">{p.payee}</div>
                    <div className="ledger-meta">{p.memo || p.date || p.createdAt}</div>
                  </div>
                  <span className={`status-tag ${(p.status || 'pending').toLowerCase()}`}>
                    {p.status || 'pending'}
                  </span>
                  <div className="ledger-amount debit">{currency(p.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
