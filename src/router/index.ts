import { createRouter, createWebHistory, useRouter } from 'vue-router'
import Home from '/src/views/Home.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/games',
        component: () => import('../views/games/index.vue')
    },
    {
        path: '/games/tictactoe',
        component: () => import('../views/games/tictactoe/index.vue')
    },
    {
        path: '/games/tictactoe/:id',
        component: () => import('../views/games/tictactoe/_id.vue')
    },
    
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})


export default router
