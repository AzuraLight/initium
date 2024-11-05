import mdiIcons from '@/assets/icons/mdi.js';
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
    state: () => ({
        menuItems: [
            {
                name: '대시보드',
                icon: mdiIcons.home,
                items: [
                    {
                        name: '샘플',
                        to: '/home',
                    },
                ]
            },
        ],
    }),
    actions: {
        addDefaultChildIcon(items, defaultIcon) {
            items.forEach(item => {
                if (item.items) {
                    this.addDefaultChildIcon(item.items, defaultIcon);
                } else {
                    item.icon = item.icon || defaultIcon;
                }
            });
        },
    },
    getters: {
        flattenedMenu() {
            const flattenMenuItems = (items, parentPath = '', parentName = '', map = {}) => {
                items.forEach(item => {
                    const fullPath = parentPath + (item.to || '');
                    const fullName = parentName ? `${parentName} / ${item.name}` : item.name;
                    map[fullPath] = fullName;
                    if (item.items) {
                        flattenMenuItems(item.items, fullPath, fullName, map);
                    }
                });
                return map;
            };
            return flattenMenuItems(this.menuItems);
        },
    },
});
