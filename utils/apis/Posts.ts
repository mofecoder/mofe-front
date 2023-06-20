import { Post } from '~/types/post'
import { Api } from '~/types/api'

const getPosts = new Api<Post[], [number?]>(([cnt]) => {
  let url = '/posts'
  if (cnt) url += `?count=${cnt}`
  return url
})

const getPost = new Api<Post, [number]>(([id]) => `/posts/${id}`)

const updatePost = new Api<Post, [number]>(([id]) => `/posts/${id}`, 'PUT')
const createPost = new Api<Post, []>('/posts', 'POST')

export default {
  getPosts,
  getPost,
  createPost,
  updatePost
}
