<template>
    <div :class="['sidebar', { 'is-collapsed': !isSidebarActive }]">
        <!-- Collapse Button -->
        <div class="collapse-button" @click="toggleSidebar">
            <svg class="icon" viewBox="0 0 24 24">
                <path :d="isSidebarActive ? mdiIcons.chevronLeft : mdiIcons.chevronRight"></path>
            </svg>
        </div>

        <div class="nav-scrollable-container">
            <div class="nav-container mt-4 gap-2">
                <template v-for="(item, key) in menuItems" :key="key">
                    <div v-if="item.type === 'title'" class="nav-title" v-show="isSidebarActive">
                        {{ item.name }}
                    </div>
                    <div v-else-if="item.items" class="nav-group">
                        <div class="nav-link nav-group-toggle" @click="toggleCollapse(key)">
                            <svg class="icon me-4" viewBox="0 0 24 24"
                                :fill="isActiveRoute(item) ? 'white' : 'grey'">
                                <path :d="item.icon"></path>
                            </svg>
                            <span class="text-white" v-show="isSidebarActive">{{ item.name }}</span>
                            <svg class="icon ms-auto" viewBox="0 0 24 24" fill="grey" v-show="isSidebarActive">
                                <path :d="isExpanded[key] ? mdiIcons.chevronUp : mdiIcons.chevronDown"></path>
                            </svg>
                        </div>

                        <div v-show="isExpanded[key] && isSidebarActive" class="nav-group-items">
                            <div v-for="subItem in item.items" :key="subItem.name" class="nav-item">
                                <router-link :to="subItem.to" class="nav-link d-flex align-items-center">
                                    <svg class="icon me-4" viewBox="0 0 24 24"
                                        :fill="isActiveRoute(subItem) ? 'white' : 'grey'">
                                        <path :d="subItem.icon"></path>
                                    </svg>
                                    <span class="text-subItem" v-show="isSidebarActive">{{ subItem.name }}</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div v-else class="nav-item">
                        <router-link :to="item.to" class="nav-link d-flex align-items-center">
                            <svg class="icon me-4" viewBox="0 0 24 24"
                                :fill="isActiveRoute(item) ? 'white' : 'grey'">
                                <path :d="item.icon"></path>
                            </svg>
                            <span class="text-white" v-show="isSidebarActive">{{ item.name }}</span>
                        </router-link>
                    </div>
                </template>
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
        
        const toggleSidebar = () => {
            sidebarStore.toggleSidebar();
        };

        const toggleCollapse = (key) => {
            isExpanded.value[key] = !isExpanded.value[key];
        };

        const isActiveRoute = (item) => {
            const currentPath = route.path;
            return item.items
                ? item.items.some(subItem => currentPath.startsWith(subItem.to))
                : currentPath === item.to;
        };

        return {
            isSidebarActive,
            menuItems,
            mdiIcons,
            isExpanded,
            toggleSidebar,
            toggleCollapse,
            isActiveRoute,
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
    transition: width 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
    overflow: hidden;
    position: fixed;
    height: 100vh;
    z-index: 1000;
}

.sidebar.is-collapsed {
    width: 64px;
}

.collapse-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    cursor: pointer;
    transition: all 0.3s;
}

.nav-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.nav-link {
    color: #fff !important;
    justify-content: flex-start;
    width: 100%;
    padding: 0.5rem 1rem;
    transition: background-color 0.3s ease, padding-left 0.3s ease;
    cursor: pointer;
}

.nav-link:hover {
    background-color: #2e2e3e;
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
    padding: 0.5rem 1rem;
    cursor: pointer;
}

.text-white {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
}

.icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}
</style>
