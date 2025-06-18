import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userName = ref(localStorage.getItem('userName') || null)
  const token = ref(localStorage.getItem('token') || null)
  const userId = ref(localStorage.getItem('userId') || null)
  const permission = ref(localStorage.getItem('permission') === 'true') // ← NOVO

  function setUser(name, userToken, id, isAdmin = false) {
    userName.value = name
    token.value = userToken
    userId.value = id
    permission.value = isAdmin

    localStorage.setItem('userName', name)
    localStorage.setItem('token', userToken)
    localStorage.setItem('userId', id)
    localStorage.setItem('permission', isAdmin) // ← NOVO
  }

  function clearUser() {
    userName.value = null
    token.value = null
    userId.value = null
    permission.value = false

    localStorage.removeItem('userName')
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('permission') // ← NOVO
  }

  return {
    userName,
    token,
    userId,
    permission, // ← NOVO
    setUser,
    clearUser,
    isAuthenticated: computed(() => !!token.value)
  }
})
