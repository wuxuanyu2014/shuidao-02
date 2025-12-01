/*
 * @Author: huangl
 * @Date: 2022-09-13 20:10:31
 * @LastEditors: huangl
 * @LastEditTime: 2022-09-14 21:52:29
 * @Description: file content
 * @FilePath: \money-datav\vue-dataV\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'index',
    component: () => import('../views/testIndex.vue')
  },{
    path: '/monitor',
    name: 'Mnitor',
    component: () => import('../views/monitor.vue')
  },{
    path: '/commodity',
    name: 'Commodity',
    component: () => import('../views/commodity.vue')
  },{
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/orders.vue')
  },{
    path: '/activitys',
    name: 'Activitys',
    component: () => import('../views/activitys.vue')
  },{
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin.vue')
  },{
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin-dashboard.vue')
  }]
const router = new VueRouter({
  routes
})

export default router