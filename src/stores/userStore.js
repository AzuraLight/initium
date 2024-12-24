import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        // 유저 정보 로컬 스토리지에 저장
        user: JSON.parse(localStorage.getItem('user')) || null,
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
                localStorage.setItem('user', JSON.stringify(this.user));
                return 'SUCCESS';
            } else {
                throw new Error('Invalid credentials');
            }
        },

        clearAuth() {
            this.user = null;
            localStorage.removeItem('user');
        }
    },
});