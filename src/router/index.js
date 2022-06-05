import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue';
import ProjectView from '../views/ProjectView.vue';

const router = createRouter({
    mode: 'hash',
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/create',
            name: 'create',
            component: ProjectView
        },
        {
            path: '/edit/:id',
            name: 'edit',
            component: ProjectView
        }
    ]
});

export default router;