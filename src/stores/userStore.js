import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
    }),
    actions: {
        async envLogin(loginForm) {
            const usernameEnv = process.env.VUE_APP_LOGIN_USERNAME;
            const passwordEnv = process.env.VUE_APP_LOGIN_PASSWORD;

            if (
                loginForm.username === usernameEnv &&
                loginForm.password === passwordEnv
            ) {
                this.user = { name: usernameEnv };
                return 'SUCCESS';
            } else {
                throw new Error('Invalid credentials');
            }
        },

        clearAuth() {
            this.user = null;
        }
    },
});