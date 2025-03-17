import type { Post } from '~/types/post'
import { Api } from '~/types/api'

const getPosts = new Api<Post[], [number?]>(([cnt]) => {
  let url = '/api/posts'
  if (cnt) url += `?count=${cnt}`
  return url
})

const getPost = new Api<Post, [number]>(([id]) => `/api/posts/${id}`)

const updatePost = new Api<Post, [number]>(([id]) => `/api/posts/${id}`, 'PUT')
const createPost = new Api<Post, []>('/api/posts', 'POST')

export default {
  getPosts,
  getPost,
  createPost,
  updatePost
}
