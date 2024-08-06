import { sign } from 'jsonwebtoken'

import { env } from '__configs/environment'

export function generateSessionCredential(
  role: SessionCredentialRoles,
  sub: string,
) {
  const token = sign({ sub, role }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7 days',
  })

  return `Bearer ${token}`
}
