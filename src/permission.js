import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { constantRoutes,asyncRoutes,commonRouters } from "./router/index";

//权限路由  动态路由
function hasPermission(permissions, route) {
  if (route.meta && route.meta.url) {
    // console.log("权限==>{}", permissions);
    return permissions.some(permission => {
      // console.log(route.meta.url, permission.url);
      if (route.meta.url == permission.url) {
        route.id = permission.id;
        return true;
      } else if (permission.children && permission.children.length > 0) {
        return hasPermission(permission.children, route);
      }
      return false;
    });
  } else {
    return true
  }
}

//动态路由  权限路由
export function filterAsyncRoutes(routes, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    // console.log(tmp)
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/401', '/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo

      // TODO 页面权限判断

      // const hasRoles = store.getters.roles && store.getters.roles.length > 0
      const hasGetUserInfo = store.getters.name
      console.log("store.getters.name",store.getters)
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // TODO 从服务端获取用户权限列表
          await store.dispatch('user/getInfo')
          let permissions=store.getters.permissions;
          console.log("权限列表==>", permissions);
          let accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions);
          console.log("accessedRoutes==>", accessedRoutes)
          let allRouter=constantRoutes.concat(accessedRoutes)
          console.log("allRouter", allRouter);

          await store.dispatch('permission/setRoutes', accessedRoutes);

          // let roles = ['admin'];
          // const tempss = await store.dispatch('permission/generateRoutes', roles)
          // console.log("temps==>", tempss);

          router.options.routes = allRouter;
          router.addRoutes(accessedRoutes);
          next({ ...to, replace: true })


          // const { roles } = await store.dispatch('user/getInfo')

          // // generate accessible routes map based on roles
          // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // // dynamically add accessible routes
          // router.addRoutes(accessRoutes)

          // // hack method to ensure that addRoutes is complete
          // // set the replace: true, so the navigation will not leave a history record
          // next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})


router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
