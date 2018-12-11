import { constantRouterMap } from '@/router'
import { generateRoutes } from '@/api/login'
import Layout from '../../views/layout/Layout'

const _import = require('../../router/_import_' + process.env.NODE_ENV)

function buildRoute(routes, route, index) {
  if (route.meta.functionType === 2) {
    routes.splice(index, 1)
  }
  if (route.component && route.meta.functionType === 1) {
    route.component = _import(route.component)
  } else {
    route.component = Layout
  }
  let len = route.children.length
  while (len--) {
    buildRoute(route.children, route.children[len], len)
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        generateRoutes().then(resp => {
          const data = resp.data
          window.sessionStorage.setItem('x-auth-router', JSON.stringify(data.data))
          const routeM = data.data
          let len = routeM.length
          while (len--) {
            buildRoute(routeM, routeM[len], len)
          }
          commit('SET_ROUTERS', routeM)
          resolve()
        })
      })
    }
  }
}

export default permission
