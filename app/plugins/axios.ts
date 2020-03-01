import axios from 'axios'

const client = axios.create({
  baseURL: process.env.API_BASE
})

async function httpGet<T>(url: string, header = {}, body = {}): Promise<T> {
  const ret = await client.get<T>(url, {
    headers: header,
    data: body
  })
  return ret.data
}

export default client
export { httpGet }
