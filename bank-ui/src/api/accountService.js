import client from './client'

export const accountService = {
  list: () => client.get('/accounts'),
  get: (id) => client.get(`/accounts/${id}`),
  create: (payload) => client.post('/accounts', payload)
}
