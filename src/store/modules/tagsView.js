const state = {
  visitedNumber:1, //可显示View数量
  allViews:[],//View总数
  visitedViews: [], //可显示View列表
  hiddenViews:[], //隐藏View列表
  cachedViews: [],
  resetViews:function(){
    // console.log("allViews---------",state.allViews)
    state.visitedViews = state.allViews.slice(0,state.visitedNumber)
    if(state.visitedNumber < state.allViews.length){
      state.hiddenViews = state.allViews.slice(state.visitedViews.length - state.allViews.length)
    }else{
      state.hiddenViews=[]
    }
    // console.log("hiddenViews---------",state.hiddenViews)
  }
}

const mutations = {
  SET_VISITED_NUMBER: (state, number) => {
    state.visitedNumber = number
  },
  RESET_VIEWS_LIST:(state,index) => {

      // console.log("RESET_VIEWS_LIST-----",index)
      if(index >= state.visitedNumber){
        const item = state.allViews[index]
        state.allViews.splice((index),1,)
        state.allViews.splice((state.visitedNumber -1),0,item)
        state.resetViews()
      }else{
        state.resetViews()
      }
  },
  ADD_VISITED_VIEW: (state, view) => {
    if (state.allViews.some(v => v.path === view.path)){
      let index = 0
      state.allViews.forEach((v,i) => {
        if( v.path === view.path ){ 
          index= i;        // 赋值
        } 
      })
      // console.log('tag存在，仅变化位置...',index)
      if(index >= state.visitedNumber){
        const item = state.allViews[index]
        state.allViews.splice((index),1,)
        state.allViews.splice((state.visitedNumber -1),0,item)
        state.resetViews()
      }
    }else{
      state.allViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      )
      // 重新组装allViews
      if(state.visitedNumber < state.allViews.length){
        state.allViews.splice((state.visitedNumber-1),0,state.allViews[state.allViews.length-1])
        state.allViews.pop()
      }
      // console.log("allViews---------",state.allViews)
      // console.log('visitedNumber-----',state.visitedNumber)
      // console.log('allViews-----',state.allViews.length)
      
      state.resetViews()
    }
   
   
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.allViews.entries()) {
      if (v.path === view.path) {
        state.allViews.splice(i, 1)
        break
      }
    }
    state.resetViews()
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.allViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
    state.resetViews()
  }
}

const actions = {
  setVisitedNumber({ commit },number){
    commit('SET_VISITED_NUMBER', number)
  },
  resetViewsList({ commit },index){
    commit('RESET_VIEWS_LIST',index)
  },
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },

  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.allViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.allViews])
    })
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.allViews])
    })
  },
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
