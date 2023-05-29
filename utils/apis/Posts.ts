import { Post } from '~/types/post'
import { Api } from '~/types/api'

const getPosts = new Api<Post[], [number?]>(([cnt]) => {
  let url = '/posts'
  if (cnt) url += `?count=${cnt}`
  return url
})

export default {
  getPosts
}
