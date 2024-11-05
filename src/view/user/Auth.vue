<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow-sm" style="max-width: 350px; width: 100%; border-radius: 6px;">
            <div class="card-body">
                <h3 class="text-center mb-4 logo-box">Initium</h3>
                <form @submit.prevent="login" novalidate :class="{ 'was-validated': validated }">
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input id="username" v-model="loginForm.username" type="text" class="form-control"
                            placeholder="Enter your username" required :class="{ 'is-invalid': errors.username }"
                            autocomplete="username" />
                        <div v-if="errors.username" class="invalid-feedback">
                            Username is required.
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input id="password" v-model="loginForm.password" type="password" class="form-control"
                            placeholder="Enter your password" required :class="{ 'is-invalid': errors.password }"
                            autocomplete="current-password" />
                        <div v-if="errors.password" class="invalid-feedback">
                            Password is required.
                        </div>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary w-100 mt-2 sign-in">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import router from '@/routes/route';
import { useUserStore } from '@/stores/userStore';
import Swal from 'sweetalert2';
import { ref } from 'vue';

export default {
    name: 'AuthLogin',
    setup() {
        const userStore = useUserStore();

        const loginForm = ref({
            username: '',
            password: ''
        });
        const validated = ref(false);
        const errors = ref({
            username: false,
            password: false
        });

        const validateForm = () => {
            errors.value.username = !loginForm.value.username;
            errors.value.password = !loginForm.value.password;
            return !errors.value.username && !errors.value.password;
        };

        const login = async () => {
            validated.value = true;
            if (!validateForm()) return;

            try {
                const response = await userStore.envLogin(loginForm.value);
                if (response === 'SUCCESS') {
                    Swal.fire({
                        icon: 'success',
                        title: '로그인 성공',
                        text: '로그인에 성공하였습니다. 화면을 전환합니다.',
                    }).then(() => {
                        router.push('/home');
                    });
                }
            } catch (error) {
                console.error('Login failed:', error);
                Swal.fire({
                    icon: 'error',
                    title: '로그인 실패',
                    text: '로그인에 실패하였습니다. 다시 시도하여 주세요.',
                });
            }
        };

        return {
            loginForm,
            validated,
            errors,
            login
        };
    }
};
</script>

<style scoped>
.logo-box {
    font-weight: bold;
}

.sign-in {
    border-radius: 0.375rem;
}
</style>
