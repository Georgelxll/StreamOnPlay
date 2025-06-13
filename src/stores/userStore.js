import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userName = ref(localStorage.getItem('userName') || null)
  const token = ref(localStorage.getItem('token') || null)
  
  function setUser(name, userToken) {
    userName.value = name
    token.value = userToken
    localStorage.setItem('userName', name)
    localStorage.setItem('token', userToken)
  }
  
  function clearUser() {
    userName.value = null
    token.value = null
    localStorage.removeItem('userName')
    localStorage.removeItem('token')
  }
  
  return { 
    userName,
    token,
    setUser,
    clearUser,
    isAuthenticated: computed(() => !!token.value)
  }
})