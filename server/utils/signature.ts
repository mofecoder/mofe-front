import { createHash, type KeyObject, sign } from 'node:crypto'

export function createRequestSignature(
  privateKey: KeyObject,
  timestamp: string,
  method: string,
  path: string,
  body?: Buffer | string
) {
  const bodyDigest = createHash('sha256').update(body || '').digest('hex')
  const dataToSign = [timestamp, method, path, bodyDigest].join('.')

  console.log('dataToSign: ', dataToSign)
  return sign(null, Buffer.from(dataToSign), privateKey).toString('base64')
}
