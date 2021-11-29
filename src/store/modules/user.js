import { login, logout, currentUser } from '@/api/system/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import {menusConventToTree} from '@/utils/permission'

// const state = {
//   token: getToken(),
//   name: '',
//   avatar: '',
//   introduction: '',
//   roles: [],
//   permissions: []
// }

const getDefaultState = () => {
  return {
    token: getToken(),
    avatar: '',
    introduction: '',
    name: '',
    id: '',
    roles: [],
    permissions: [],
  }
}

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER_ID: (state, id) => {
    state.id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        console.log("login res==>"+ JSON.stringify(data));
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
        currentUser().then(res => {
          console.log("用户信息==>", res.data);
          const { data } = res;
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          console.log('data',data)

          const userInfo = data.records[0]
          console.log('user',userInfo)
          //获取路由
          // let permissionsTemp = data.userMenus;
          // let permissions = menusConventToTree(permissionsTemp);
          // console.log("permissions==>", permissions);
          // commit('SET_PERMISSIONS', permissions);
          commit('SET_NAME', userInfo.nickname)
          commit('SET_USER_ID', userInfo.id)
          commit('SET_ROLES', userInfo.roles.split(','))
          // // commit('SET_AVATAR', avatar)
          // localStorage.setItem('userInfo', JSON.stringify(data));
          resolve(data);



          // let data = {
          //   roles: ['admin'],
          //   name: response.data.realname,
          //   avatar: '',
          //   introduction: 'zs introduction'
          // }
          // const { roles, name, avatar, introduction } = data
          commit('SET_ROLES', roles)
          // commit('SET_NAME', response.data.realname)
          // commit('SET_AVATAR', avatar)
          // commit('SET_INTRODUCTION', introduction)
          // resolve(data)
        }).catch(error => {
          reject(error)
        })



      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }

      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        // commit('SET_TOKEN', '')
        // commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        commit('SET_NAME', '');
        commit('SET_PERMISSIONS', []);

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_NAME', '');
      commit('SET_PERMISSIONS', []);
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
