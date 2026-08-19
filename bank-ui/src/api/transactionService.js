import client from './client'

export const transactionService = {
  list: (accountId) =>
    client.get('/transactions', { params: accountId ? { accountId } : {} }),
  get: (id) => client.get(`/transactions/${id}`)
}
