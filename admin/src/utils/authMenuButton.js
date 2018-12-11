/**
 *
 * @author zhaokaiyuan
 * @create 2018-01-11 14:32
 **/

const RouterStr = window.sessionStorage.getItem('x-auth-router')
let Router = JSON.parse(RouterStr)

function searchPath(route, path) {
  let t = null
  if (route.path === path) {
    return route
  } else {
    for (const e of route.children) {
      t = searchPath(e, path)
      if (t) {
        break
      }
    }
  }
  return t
}

export function authMenuButton(path) {
  Router = Router || JSON.parse(window.sessionStorage.getItem('x-auth-router'))
  Router.forEach(e => {
    const router = searchPath(e, path)
    router && router.children && router.children.forEach(e => {
      const button = document.querySelectorAll('button[code=\'' + e.meta.code + '\']')
      button && (button.forEach(b => { b.style.display = 'inline' }))
    })
  })
}
