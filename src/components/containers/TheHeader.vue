<template>
    <div>
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light custom-navbar">
            <div class="container-fluid d-flex align-items-center justify-content-between">
                <!-- Left: Sidebar Toggle -->
                <div class="d-flex align-items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" @click="toggleSidebar" class="menu-icon">
                        <path :d="mdiMenu"></path>
                    </svg>
                </div>

                <!-- Center: Menu Links -->
                <div class="collapse navbar-collapse justify-content-center" id="nav-collapse">
                    <ul class="navbar-nav">
                        <li v-for="item in regularMenuItems" :key="item.name" class="nav-item">
                            <router-link :to="item.to" class="nav-link" :class="{ 'active-link': isActiveRoute(item) }">
                                {{ item.name }}
                            </router-link>
                        </li>
                    </ul>
                </div>

                <!-- Right: User Profile -->
                <div class="d-flex align-items-center">
                    <ul class="navbar-nav">
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
            </div>
        </nav>

        <!-- Breadcrumb Section -->
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
import { useMenuStore } from '@/stores/menuStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/userStore';
import { mdiMenu } from '@mdi/js';
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';
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

        const isExpanded = ref({});
        const isActiveRoute = (item) => {
            const currentPath = route.path;
            if (item.items) {
                return item.items.some(subItem => currentPath.startsWith(subItem.to));
            }
            return currentPath === item.to;
        };

        const toggleCollapse = (key) => {
            isExpanded.value[key] = !isExpanded.value[key];
        };

        return {
            mdiMenu,
            dropdownMenuItems,
            regularMenuItems,
            breadcrumbItems,
            userName,
            isSidebarActive: sidebarStore.isSidebarActive,
            toggleSidebar,
            logout,
            isActiveRoute,
            toggleCollapse,
            isExpanded
        };
    },
};
</script>


<style scoped>
.menu-icon {
    cursor: pointer;
}

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
    width: 90%;
    margin: auto;
}

.navbar-nav .dropdown-menu {
    right: 0;
    left: auto;
    transform: translateX(-1%);
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

.breadcrumb-item a {
    text-decoration: none;
}

@media (max-width: 1200px) {
    .nav-link {
        font-size: 0.9rem;
    }

    .custom-navbar {
        padding: 0 10px;
    }

    .navbar-nav .dropdown-menu {
        transform: translateX(-20%);

    }

    .breadcrumbs-container>nav {
        margin-left: 0.5%;
        margin-top: 0.5%;
    }
}
</style>