<template>
    <div>
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light custom-navbar shadow-sm">
            <div class="container-fluid">
                <!-- Sidebar Toggle -->
                <div class="d-flex align-items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" @click="toggleSidebar" class="menu-icon">
                        <path :d="mdiMenu"></path>
                    </svg>
                </div>

                <!-- Navbar Toggler (Small Screens) -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
                    aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Navbar Content -->
                <div class="collapse navbar-collapse" id="navbarContent">
                    <!-- Center: Menu Items -->
                    <ul class="navbar-nav mx-auto">
                        <li v-for="item in menuItems" :key="item.name" class="nav-item"
                            :class="{ dropdown: item.items }">
                            <!-- Dropdown Menu -->
                            <template v-if="item.items">
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
                            </template>

                            <!-- Regular Menu -->
                            <template v-else>
                                <router-link :to="item.to" class="nav-link"
                                    :class="{ 'active-link': isActiveRoute(item) }">
                                    {{ item.name }}
                                </router-link>
                            </template>
                        </li>
                    </ul>

                    <!-- Right: User Profile -->
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#"
                                data-bs-toggle="dropdown">
                                <i class="fas fa-user me-2"></i> {{ userName }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <a class="dropdown-item" @click="logout">
                                        <i class="fas fa-arrow-right-from-bracket me-2"></i> 로그아웃
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Breadcrumb Section -->
        <div class="breadcrumbs-container rounded mt-2 px-3 py-2">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
                        <router-link :to="item.route">{{ item.text }}</router-link>
                    </li>
                </ol>
            </nav>
        </div>
    </div>
</template>

<script>
import { useMenuStore } from '@/stores/menuStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useUserStore } from '@/stores/userStore';
import { mdiMenu } from '@mdi/js';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'TheHeader',
    setup() {
        const menuStore = useMenuStore();
        const userStore = useUserStore();
        const sidebarStore = useSidebarStore();
        const route = useRoute();
        const router = useRouter();

        // 모든 메뉴 가져오기
        const menuItems = computed(() => menuStore.menuItems);

        // 활성 경로 확인
        const isActiveRoute = (item) => {
            const currentPath = route.path;
            if (item.items) {
                return item.items.some(subItem => subItem.to && currentPath.startsWith(subItem.to));
            }
            return item.to === currentPath;
        };

        // 사이드바 토글
        const toggleSidebar = () => sidebarStore.toggleSidebar();

        // 브레드크럼
        const breadcrumbItems = computed(() => {
            const breadcrumb = [];
            const parentItems = menuItems.value.filter(item => item.items && item.items.some(subItem => subItem.to === route.path));
            parentItems.forEach(item => {
                breadcrumb.push({
                    route: item.to,
                    text: item.name,
                });
                if (item.items) {
                    item.items.forEach(subItem => {
                        if (subItem.to === route.path) {
                            breadcrumb.push({
                                route: subItem.to,
                                text: subItem.name,
                            });
                        }
                    });
                }
            });
            return breadcrumb;
        });

        // 유저 이름
        const userName = computed(() => userStore.user?.name || 'Guest');

        // 로그아웃 처리
        const logout = async () => {
            await router.push({ path: '/login' });
        };

        return {
            mdiMenu,
            menuItems,
            userName,
            breadcrumbItems,
            isActiveRoute,
            toggleSidebar,
            logout,
        };
    },
};
</script>
<style scoped>
.custom-navbar {
    background-color: #ffffff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    height: 56px;
}

.menu-icon {
    cursor: pointer;
    margin-right: 1rem;
}

.nav-link {
    color: #333;
    font-weight: 500;
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: color 0.3s, background-color 0.3s;
}

.nav-link.active-link {
    background-color: #373956;
    color: #fff !important;
    border-radius: 5px;
}

.navbar-toggler {
    border: none;
}

.breadcrumbs-container {
    border-radius: 8px;
    margin-top: 1rem;
}

.breadcrumb-item a {
    text-decoration: none;
    color: #6c757d;
    font-size: 0.9rem;
}

.breadcrumb-item a:hover {
    color: #343a40;
}

@media (max-width: 768px) {
    .nav-link {
        padding: 0.5rem;
        font-size: 0.9rem;
    }

    .navbar-nav {
        justify-content: center;
    }
}
</style>
