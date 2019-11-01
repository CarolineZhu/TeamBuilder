import Vue from 'vue'
import Router from 'vue-router'
import register from '../views/register'
import login from '../views/login'
import main from '../views/main_page'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/login',
      name:'login',
      component: login,
    },
    {
      path: '/main',
      name:'main',
      component: main
    },
    {
      path:'/register',
      name:"register",
      component: register
    }
  ]
})
