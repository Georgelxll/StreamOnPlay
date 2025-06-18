import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userName = ref(localStorage.getItem('userName') || null)
  const token = ref(localStorage.getItem('token') || null)
  const userId = ref(localStorage.getItem('userId') || null) // ← NOVO

  function setUser(name, userToken, id) {
    userName.value = name
    token.value = userToken
    userId.value = id
    localStorage.setItem('userName', name)
    localStorage.setItem('token', userToken)
    localStorage.setItem('userId', id) // ← NOVO
  }

  function clearUser() {
    userName.value = null
    token.value = null
    userId.value = null
    localStorage.removeItem('userName')
    localStorage.removeItem('token')
    localStorage.removeItem('userId') // ← NOVO
  }

  return {
    userName,
    token,
    userId, // ← NOVO
    setUser,
    clearUser,
    isAuthenticated: computed(() => !!token.value)
  }
})
