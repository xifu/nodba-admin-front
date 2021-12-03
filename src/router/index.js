import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect/index'],resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login/index'],resolve),
    hidden: true
  },
 
  {
    path: '/404',
    component: (resolve) => require(['@/views/error-page/404'],resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error-page/401'],resolve),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/dashboard/index'],resolve),
        name: 'Dashboard',
        meta: {title: '首页', icon: 'icon-menu-home', affix: true}
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: (resolve) => require(['@/views/user/index'],resolve),
        meta: { 
          title: '用户管理', 
          icon: 'user',
        }
      },
    ]
  },

  {
    path: '/database',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Database',
        component: (resolve) => require(['@/views/database/index'],resolve),
        meta: { 
          title: '数据库', 
          icon: 'user',
        }
      },
    ]
  },
  {
    path: '/authorization',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Authorization',
        component: (resolve) => require(['@/views/authorization/index'],resolve),
        meta: { 
          title: '权限管理', 
          icon: 'user',
        }
      },
    ]
  },
  {
    path: '/workflow',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'process',
        component: (resolve) => require(['@/views/workflow/index'],resolve),
        meta: { 
          title: '流程配置', 
          icon: 'user',
        }
      },
    ]
  },

]

export const asyncRoutes = [
 
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
