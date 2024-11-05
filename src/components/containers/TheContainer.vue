<template>
    <div :class="['container-fluid', 'p-0', { 'sidebar-collapsed': !isSidebarActive }]">
        <div class="d-flex">
            <TheSidebar />
            <div class="content-wrapper d-flex flex-column flex-grow-1 min-vh-100">
                <TheHeader />
                <main class="content-container d-flex justify-content-center flex-grow-1 mt-0">
                    <div class="content">
                        <router-view></router-view>
                    </div>
                </main>
                <TheFooter />
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useSidebarStore } from '@/stores/sidebarStore';
import TheHeader from '@/components/containers/TheHeader';
import TheSidebar from '@/components/containers/TheSidebar';
import TheFooter from '@/components/containers/TheFooter'

export default {
    name: 'TheContainer',
    components: {
        TheHeader,
        TheSidebar,
        TheFooter
    },
    setup() {
        const sidebarStore = useSidebarStore();
        const isSidebarActive = computed(() => sidebarStore.isSidebarActive);
        return {
            isSidebarActive,
        }
    }
}
</script>

<style scoped>
.container-fluid {
    flex-direction: row;
    padding: 0;
    height: 100%;
}

.d-flex {
    display: flex;
    height: 100%;
}

.flex-grow-1 {
    flex-grow: 1;
}

.min-vh-100 {
    min-height: 100vh;
}

.content-wrapper {
    transition: margin-left 0.3s ease;
    margin-left: 240px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.container-fluid.sidebar-collapsed .content-wrapper {
    margin-left: 0;
}

.content-container {
    height: 100%;
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    overflow: auto;
}

.content {
    width: 80vw;
    max-width: 1600px;
    padding-top: 5px;
}

.content-container::-webkit-scrollbar {
    width: 8px;
}

.content-container::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}

.content-container::-webkit-scrollbar-track {
    background: transparent;
}

@media (max-width: 768px) {
    .content-wrapper {
        margin-left: 0;
    }
}
</style>