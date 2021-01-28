import { httpDelete, httpGet, httpPost, httpPut } from '../utils/axios'
import { Post } from '../types/post'

type PostParams = Pick<Post, 'title' | 'content' | 'publicStatus'>

export default class {
  async index(count: number | null = null) {
    let url = '/posts'
    if (count) url += `?count=${count}`
    return await httpGet<Post[]>(url)
  }

  async show(id: number) {
    return await httpGet<Post>(`/posts/${id}`)
  }

  async create(params: PostParams) {
    return await httpPost<Post>('/posts', {}, { post: params })
  }

  async update(id: number, params: Partial<PostParams>) {
    await httpPut(`/posts/${id}`, {}, { post: params })
  }

  async destroy(id: number) {
    await httpDelete(`/posts/${id}`)
  }
}
