import client from './client'

// api-gateway routes payment-service under /api/transfers/**, not /api/payments/**
export const paymentService = {
  list: () => client.get('/transfers'),
  create: (payload) => client.post('/transfers', payload)
}
