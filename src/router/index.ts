import { createWebHistory, createWebHashHistory, createRouter } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: "login",
        component: () => import("@/views/login/index.vue"),
    },
    {
        path: '/mainpage',
        name: "mainpage",
        component: () => import("@/views/mainpage/index.vue"),
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;