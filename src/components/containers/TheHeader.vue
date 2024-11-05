<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light custom-navbar w-100">
            <button @click="toggleSidebar" class="navbar-toggler sidebar-toggle" type="button">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path :d="mdiIcons.menu"></path>
                </svg>
            </button>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav-collapse">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse justify-content-end" id="nav-collapse">
                <ul class="navbar-nav ml-auto">
                    <li v-for="item in dropdownMenuItems" :key="item.name" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            {{ item.name }}
                        </a>
                        <ul class="dropdown-menu">
                            <li v-for="subItem in item.items" :key="subItem.name">
                                <router-link :to="subItem.to" class="dropdown-item"
                                    :class="{ 'active-link': isActiveRoute(subItem) }">
                                    {{ subItem.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <li v-for="item in regularMenuItems" :key="item.name" class="nav-item">
                        <router-link :to="item.to" class="nav-link" :class="{ 'active-link': isActiveRoute(item) }"
                            exact>
                            {{ item.name }}
                        </router-link>
                    </li>
                </ul>

                <ul class="navbar-nav ml-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            <i class="fas fa-user"></i> {{ userName }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <a class="dropdown-item" @click="logout">
                                    <i class="fas fa-arrow-right-from-bracket"></i> 로그아웃
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="breadcrumbs-container">
            <div class="breadcrumbs-line"></div>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
                        <router-link :to="item.route">{{ item.text }}</router-link>
                    </li>
                </ol>
            </nav>
            <div class="breadcrumbs-line"></div>
        </div>
    </div>
</template>

<script>
import mdiIcons from '@/assets/icons/mdi.js';
import { useMenuStore } from '@/stores/menuStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/userStore';
import Swal from 'sweetalert2';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'TheHeader',
    setup() {
        const userStore = useUserStore();
        const sidebarStore = useSidebarStore();
        const menuStore = useMenuStore();
        const route = useRoute();
        const router = useRouter();

        const dropdownMenuItems = computed(() => menuStore.menuItems.filter(item => item.items));
        const regularMenuItems = computed(() => menuStore.menuItems.filter(item => !item.items));

        const breadcrumbItems = computed(() => {
            const currentPath = route.path;
            const paths = currentPath.split('/').filter(p => p);
            const menuMap = menuStore.flattenedMenu;
            let breadcrumbs = [{ text: '홈', route: { path: '/' } }];

            paths.forEach((p, index) => {
                const subPath = '/' + paths.slice(0, index + 1).join('/');
                breadcrumbs.push({ text: menuMap[subPath] || p, route: { path: subPath } });
            });

            return breadcrumbs;
        });

        const userName = computed(() => (userStore.user ? userStore.user.name : 'No User'));

        const toggleSidebar = () => sidebarStore.toggleSidebar();

        const logout = async () => {
            await userStore.clearAuth();
            Swal.fire({
                title: '로그아웃',
                icon: 'success',
            }).then(() => {
                localStorage.removeItem('isSidebarActive');
                router.push({ path: '/login' });
            });
        };

        const isActiveRoute = (item) => {
            const currentPath = route.path;
            if (item.items) {
                return item.items.some(subItem => currentPath.startsWith(subItem.to));
            }
            return currentPath === item.to;
        };

        return {
            mdiIcons,
            dropdownMenuItems,
            regularMenuItems,
            breadcrumbItems,
            userName,
            toggleSidebar,
            logout,
            isActiveRoute,
        };
    },
};
</script>

<style scoped>
.custom-navbar {
    height: 56px;
}

.nav-link {
    color: #000;
    text-align: center;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
}

.nav-link.active-link,
.nav-link.router-link-exact-active,
.dropdown-item.active-link,
.dropdown-item:focus,
.dropdown-item:active {
    background-color: #373956 !important;
    color: #fff !important;
    border-radius: 5px;
}

.sidebar-toggle {
    margin-left: 10px;
    cursor: pointer;
    color: #343a40;
}

.breadcrumbs-container {
    margin-top: 0;
}

.breadcrumbs-container>nav {
    margin-left: 1%;
    margin-top: 1%;
}

.breadcrumbs-line {
    height: 1px;
    background-color: #e0e0e0;
    margin-top: 0px;
}

@media (max-width: 1200px) {
    .nav-link {
        font-size: 0.9rem;
    }

    .custom-navbar {
        padding: 0 10px;
    }

    .breadcrumbs-container>nav {
        margin-left: 0.5%;
        margin-top: 0.5%;
    }
}
</style>
