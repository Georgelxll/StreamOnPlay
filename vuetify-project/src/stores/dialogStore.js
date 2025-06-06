import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialogs', {
  state: () => ({
    loginDialog: false,
    registerDialog: false,
  }),
  actions: {
    openLogin() {
      this.loginDialog = true
      console.log("Login dialog opened:", this.loginDialog) // Verifique no console
    },
    openRegister() {
      this.registerDialog = true
      console.log("Register dialog opened:", this.registerDialog) // Verifique no console
    },
  },
})