import {createRouter, createWebHistory} from 'vue-router'
import routerList from "@/router/list"

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes: routerList,
})
export default router
