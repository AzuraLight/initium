<template>
  <div>
    <!-- Navbar -->
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light shadow-sm custom-navbar"
    >
      <div class="container-fluid">
        <!-- Brand -->
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img src="/logo.svg" alt="Logo" class="logo me-2" />
          <span class="brand-name">MyApp</span>
        </router-link>

        <!-- Navbar Toggler -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Content -->
        <div class="collapse navbar-collapse" id="navbarContent">
          <!-- Left: Navigation Links -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li
              v-for="item in menuItems"
              :key="item.name"
              class="nav-item dropdown"
            >
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ item.name }}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li v-for="subItem in item.items" :key="subItem.name">
                  <router-link
                    :to="subItem.to"
                    class="dropdown-item"
                    :class="{ 'active-link': isActiveRoute(subItem) }"
                  >
                    {{ subItem.name }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>

          <!-- Right: User Profile -->
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item">
              <router-link to="/notifications" class="nav-link">
                <i class="fas fa-bell"></i>
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img :src="userAvatar" alt="Avatar" class="avatar me-2" />
                <span>{{ userName }}</span>
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <router-link to="/profile" class="dropdown-item">
                    <i class="fas fa-user me-2"></i> Profile
                  </router-link>
                </li>
                <li>
                  <a class="dropdown-item" @click="logout">
                    <i class="fas fa-sign-out-alt me-2"></i> Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Breadcrumb Section -->
    <div class="breadcrumbs-container px-4 py-2">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li
            v-for="(item, index) in breadcrumbItems"
            :key="index"
            class="breadcrumb-item"
            :class="{ active: index === breadcrumbItems.length - 1 }"
          >
            <template v-if="index !== breadcrumbItems.length - 1">
              <router-link :to="item.route">{{ item.text }}</router-link>
            </template>
            <template v-else>
              {{ item.text }}
            </template>
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
import avatarImg from '@/assets/avatar.svg';

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
        return item.items.some(
          (subItem) => subItem.to && currentPath.startsWith(subItem.to)
        );
      }
      return item.to === currentPath;
    };

    // 사이드바 토글
    const toggleSidebar = () => sidebarStore.toggleSidebar();

    // 브레드크럼
    const breadcrumbItems = computed(() => {
      const breadcrumb = [];
      const parentItems = menuItems.value.filter(
        (item) =>
          item.items && item.items.some((subItem) => subItem.to === route.path)
      );
      parentItems.forEach((item) => {
        breadcrumb.push({
          route: item.to,
          text: item.name,
        });
        if (item.items) {
          item.items.forEach((subItem) => {
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

    // 유저 아바타 이미지 설정
    const userAvatar = computed(() => userStore.user?.avatar || avatarImg);

    // 로그아웃 처리
    const logout = async () => {
      await router.push({ path: '/login' });
    };

    return {
      mdiMenu,
      menuItems,
      userName,
      userAvatar,
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
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 32px;
  height: 32px;
}

.brand-name {
  font-weight: bold;
  font-size: 1.2rem;
  color: #343a40;
}

.nav-link {
  color: #495057;
  transition: color 0.3s, background-color 0.3s;
}

.nav-link:hover {
  color: #1d72b8;
}

.nav-link.active-link {
  background-color: #1d72b8;
  color: #fff !important;
  border-radius: 5px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.breadcrumbs-container {
  margin-top: 1rem;
}

.breadcrumb-item a {
  color: #6c757d;
}

.breadcrumb-item.active {
  font-weight: bold;
}
</style>
