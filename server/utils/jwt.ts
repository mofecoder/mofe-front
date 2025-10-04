import * as jose from 'jose'
import { randomUUID } from 'node:crypto'

const alg = 'HS256'

export default async function issueJwtToken(
  secret: string,
  version: ApiVersion,
  uid: string
) {
  const encodedSecret = new TextEncoder().encode(secret)
  const jwt = new jose.SignJWT()
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('https://auth.bff.mofecoder.com')
    .setAudience(`api://${version}`)
    .setExpirationTime('15m')
    .setSubject(uid)
    .setJti(randomUUID())

  return await jwt.sign(encodedSecret)
}
