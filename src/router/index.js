import Vue from 'vue'
import Router from 'vue-router'
import register from '../views/register'
import login from '../views/login'
import main from '../views/main_page'
import user_info from '../views/user_info'
import recommendation from '../views/recommendation'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/login',
      name:'login',
      component: login,
    },
    {
      path: '/',
      name:'main',
      component: main
    },
    {
      path:'/register',
      name:"register",
      component: register
    },
      {
          path:'/user_info',
          name:"user_info",
          component: user_info
      },
      {
          path:'/recommendation',
          name:"recommendation",
          component: recommendation
      },

  ]
})
