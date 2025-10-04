import * as firebase from 'firebase/auth'
import type { UserCredential } from 'firebase/auth'

export const useFirebaseAuth = () => {
  const { $firebaseAuth } = useNuxtApp()
  // const { productDomain } = useRuntimeConfig().public
  // const userStore = useUserStore()

  const signInProcess = async (credential: UserCredential) => {
    await credential.user.getIdToken()
      .then((idToken) => $fetch('/api/session/login', {
        method: 'POST',
        body: { idToken }
      }))
      .then(() => $firebaseAuth.signOut())
  }

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    await firebase.signInWithEmailAndPassword($firebaseAuth, email, password).then(signInProcess)
  }

  const googleProvider = new firebase.GoogleAuthProvider()
  googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email')
  googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile')

  const signInWithGoogle = async () => {
    await firebase.signInWithRedirect($firebaseAuth, googleProvider)
  }

  const githubProvider = new firebase.GithubAuthProvider()
  githubProvider.addScope('read:user')
  githubProvider.addScope('user:email')
  const signInWithGitHub = async () => {
    await firebase.signInWithRedirect($firebaseAuth, githubProvider)
  }

  const signOut = async () => {
    let response: Response
    try {
      response = await $fetch('/api/session/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error }
    }
    if (!response.ok) {
      throw new Error('Logout failed')
    }

    console.debug('Sign out success')
    return { success: true }
  }

  const user = computed(() => $firebaseAuth.currentUser)

  const signInWithPopup = async (provider: AuthProvider) => {
    const p = {
      google: googleProvider,
      github: githubProvider
    }[provider]
    return await firebase.signInWithPopup($firebaseAuth, p)
  }
  const getRedirectResult = async () => await firebase.getRedirectResult($firebaseAuth)

  return {
    signInWithEmailAndPassword,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    signInProcess,
    user,
    getRedirectResult,
    signInWithPopup
  }
}
