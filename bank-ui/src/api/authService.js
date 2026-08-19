import client from './client'

// Routes assumed to be forwarded by api-gateway to auth-service.
// Adjust the paths below if your gateway's route predicates differ.
export const authService = {
  login: (credentials) => client.post('/auth/login', credentials),
  register: (payload) => client.post('/auth/register', payload),
  me: () => client.get('/auth/me')
}
