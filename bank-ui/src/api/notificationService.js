import client from './client'

// NOTE: your api-gateway config doesn't have a route for notification-service
// yet (no `- id: notification-service` block with a Path=/api/notifications/**
// predicate). Add one before this will work — otherwise these calls 404 at
// the gateway. Once added, double-check whether it needs AuthenticationFilter
// like the other protected routes do.
export const notificationService = {
  list: () => client.get('/notifications'),
  markRead: (id) => client.patch(`/notifications/${id}/read`)
}
