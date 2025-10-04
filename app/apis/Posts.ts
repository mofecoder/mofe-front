import type { Post } from '~/types/post'
import { Api } from '~/types/api'

const getPosts = new Api<Post[], [number?]>('v1', ([cnt]) => {
  let url = '/api/posts'
  if (cnt) url += `?count=${cnt}`
  return url
})

const getPost = new Api<Post, [number]>('v1', ([id]) => `/api/posts/${id}`)

const updatePost = new Api<Post, [number]>('v1', ([id]) => `/api/posts/${id}`, 'PUT')
const createPost = new Api<Post, []>('v1', '/api/posts', 'POST')

export default {
  getPosts,
  getPost,
  createPost,
  updatePost
}
