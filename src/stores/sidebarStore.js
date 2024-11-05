import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {

    const isSidebarActive = ref(localStorage.getItem('isSidebarActive') === 'true');

    function toggleSidebar() {
        isSidebarActive.value = !isSidebarActive.value;
        localStorage.setItem('isSidebarActive', isSidebarActive.value);
    }

    function setSidebar(payload) {
        isSidebarActive.value = payload;
        localStorage.setItem('isSidebarActive', payload);
    }

    return {
        isSidebarActive,
        toggleSidebar,
        setSidebar,
    };
});