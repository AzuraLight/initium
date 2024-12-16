<template>
    <div :class="['sidebar', { 'is-collapsed': !isSidebarActive }]">
        <div v-if="isSidebarActive" class="collapse-container">
            <!-- Logo Box -->
            <div class="logo-box">
                <router-link :to="alternativeLogo.link" class="d-flex align-items-center alt-logo">
                    <img :src="alternativeLogo.image" v-if="!logoLoadError && logoLoaded" alt="Logo" height="35"
                        @error="handleLogoError" @load="handleLogoLoad" />
                    <span v-else class="text-white logo-text">{{ alternativeLogo.text }}</span>
                </router-link>
            </div>

            <div class="logo-line"></div>

            <!-- Navigation Menu -->
            <div class="nav-scrollable-container">
                <div class="nav-container mt-4">
                    <template v-for="(item, key) in menuItems" :key="key">
                        <div v-if="item.type === 'title'" class="nav-title">
                            {{ item.name }}
                        </div>
                        <div v-else-if="item.items" class="nav-group">
                            <div class="nav-link nav-group-toggle" @click="toggleCollapse(key)">
                                <svg :width="24" :height="24" viewBox="0 0 24 24" class="me-4"
                                    :fill="isActiveRoute(item) ? 'white' : 'grey'">
                                    <path :d="item.icon"></path>
                                </svg>
                                <span class="text-white">{{ item.name }}</span>
                                <svg :width="24" :height="24" viewBox="0 0 24 24" class="ms-auto" fill="grey">
                                    <path :d="isExpanded[key] ? mdiIcons.chevronUp : mdiIcons.chevronDown"></path>
                                </svg>
                            </div>
                            <div v-show="isExpanded[key]" class="nav-group-items">
                                <div v-for="subItem in item.items" :key="subItem.name" class="nav-item">
                                    <router-link :to="subItem.to" class="nav-link d-flex align-items-center">
                                        <svg :width="24" :height="24" viewBox="0 0 24 24" class="me-4"
                                            :fill="isActiveRoute(subItem) ? 'white' : 'grey'">
                                            <path :d="subItem.icon"></path>
                                        </svg>
                                        <span class="text-subItem">{{ subItem.name }}</span>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div v-else class="nav-item">
                            <router-link :to="item.to" class="nav-link d-flex align-items-center">
                                <svg :width="24" :height="24" viewBox="0 0 24 24" class="me-4"
                                    :fill="isActiveRoute(item) ? 'white' : 'grey'">
                                    <path :d="item.icon"></path>
                                </svg>
                                <span class="text-white">{{ item.name }}</span>
                            </router-link>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mdiIcons from '@/assets/icons/mdi.js';
import { useMenuStore } from '@/stores/menuStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'TheSidebar',
    setup() {
        const sidebarStore = useSidebarStore();
        const menuStore = useMenuStore();
        const route = useRoute();

        const isSidebarActive = computed(() => sidebarStore.isSidebarActive);
        const menuItems = computed(() => menuStore.menuItems);
        const isExpanded = ref({});
        const logoLoadError = ref(false);
        const logoLoaded = ref(false);

        const alternativeLogo = computed(() => ({
            image: '',
            text: 'Initium Project',
            link: '/',
        }));

        const toggleCollapse = (key) => {
            isExpanded.value[key] = !isExpanded.value[key];
        };

        const isActiveRoute = (item) => {
            const currentPath = route.path;
            return item.items
                ? item.items.some(subItem => currentPath.startsWith(subItem.to))
                : currentPath === item.to;
        };

        const handleLogoError = () => {
            logoLoadError.value = true;
        };

        const handleLogoLoad = () => {
            logoLoaded.value = true;
        };

        return {
            isSidebarActive,
            menuItems,
            mdiIcons,
            isExpanded,
            toggleCollapse,
            isActiveRoute,
            alternativeLogo,
            logoLoadError,
            logoLoaded,
            handleLogoError,
            handleLogoLoad,
        };
    },
};
</script>

<style scoped>
.sidebar {
    background-color: #232630;
    width: 240px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: width 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
    overflow: hidden;
    position: fixed;
    height: 100vh;
    z-index: 1000;
}

.sidebar.is-collapsed {
    width: 0;
    opacity: 0;
    visibility: hidden;
}

.collapse-container {
    width: 100%;
    overflow: hidden;
}

.nav-scrollable-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100vh - 120px);
}

.nav-scrollable-container::-webkit-scrollbar {
    width: 8px;
}

.nav-scrollable-container::-webkit-scrollbar-track {
    background: #232630;
}

.nav-scrollable-container::-webkit-scrollbar-thumb {
    background-color: #3d4658;
    border-radius: 4px;
}

.nav-scrollable-container::-webkit-scrollbar-button {
    display: none;
}

.nav-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.nav-link {
    color: #fff !important;
    justify-content: flex-start;
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    transition: background-color 0.3s ease, padding-left 0.3s ease;
    cursor: pointer;
    white-space: nowrap;
}

.nav-link:hover {
    background-color: #2e2e3e;
}

.nav-link:hover svg {
    fill: white;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
    background-color: #2a303D;
    color: #fff !important;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.nav-link.router-link-active svg,
.nav-link.router-link-exact-active svg {
    fill: white;
}

.sidebar.is-collapsed .nav-container {
    opacity: 0;
    transform: translateX(-240px);
}

.logo-box {
    height: 56px;
    padding: 7% 0%;
    display: flex;
    justify-content: center;
    text-align: center;
}

.alt-logo {
    text-decoration: none;
    font-size: large;
    font-weight: bold;
    color: #fff;
}

.logo-line {
    height: 1px;
    background-color: #3d4658;
    margin-top: 0px;
}

.nav-title {
    color: #cfd8dc;
    font-size: 0.75rem;
    font-weight: 700;
    margin: 1.25rem 1rem 0.75rem;
    text-transform: uppercase;
}

.nav-group {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.nav-group-toggle {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
    cursor: pointer;
}

.nav-group-items {
    margin-top: 2%;
    padding-left: 0px;
}

.nav-item {
    width: 100%;
}

.text-subItem {
    margin-left: 24px;
}

.logo-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
}

@media (max-width: 768px) {
    .sidebar {
        width: 0;
        opacity: 0;
        visibility: hidden;
    }
}
</style>
