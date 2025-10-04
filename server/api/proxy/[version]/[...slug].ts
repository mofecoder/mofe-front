import { FetchError } from 'ofetch'
import issueJwtToken from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { secret, apiBaseUrl } = config

  const apiVersion = getRouterParam(event, 'version') as ApiVersion
  const apiPath = getRouterParam(event, 'slug') || ''
  const urls = {
    v1: apiBaseUrl,
    v4: ''
  } satisfies Record<ApiVersion, string>
  const baseUrl = urls[apiVersion]
  const proxyPath = `${baseUrl}/${apiPath || ''}`

  const addHeaders: Record<string, string> = {}

  if (event.context.user?.uid) {
    const token = await issueJwtToken(secret, apiVersion, event.context.user.uid)
    addHeaders['Authorization'] = `Bearer ${token}`
  }

  try {
    return proxyRequest(
      event,
      proxyPath,
      { headers: addHeaders }
    )
  } catch (e) {
    if (e instanceof FetchError) {
      console.warn(e.message)
    } else {
      console.error(e)
    }
  }
})
