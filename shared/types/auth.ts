export const AuthProviders = ['github', 'google'] as const
export type AuthProvider = typeof AuthProviders[number]
