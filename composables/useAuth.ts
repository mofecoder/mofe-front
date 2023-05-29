import { AuthUser } from '~/types/AuthUser'
import { Ref } from 'vue'

type UserType = AuthUser | null
type AuthResponse =
  | {
      success: false
      errors: string[]
    }
  | {
      success?: true
      data: AuthUser
    }
export const useAuth = () => {
  const cookie = useCookie('auth')
  const user = useState<UserType>('loginUser', () => null)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const login =
    (user: Ref<UserType>) => async (userName: string, password: string) => {
      const { data } = await useApi<AuthResponse>('/auth/sign_in', {
        body: { name: userName, password }
      })

      if (data.value && data.value.success) {
        user.value = data.value.data
      }
    }

  const signUp =
    (user: Ref<UserType>) =>
    async (
      email: string,
      userName: string,
      password: string,
      passwordConfirmation: string
    ) => {
      const { data } = await useApi<AuthResponse>('/auth', {
        body: {
          name: userName,
          email,
          password,
          passwordConfirmation
        }
      })

      if (data.value && data.value.success) {
        user.value = data.value.data
      }
    }

  const signOut = (user: Ref<UserType>) => async () => {
    await useApi('/auth/sign_out', { method: 'delete' })
    user.value = null
  }

  return {
    user,
    isAdmin,
    login: login(user),
    signUp: signUp(user)
  }
}
