import Vue from 'vue'
import Router from 'vue-router'
import register from '../views/register'
import login from '../views/login'
import main from '../views/main_page'
import user_info from '../views/user_info'
import recommendation from '../views/recommendation'
import messages from '../views/messages'
import team_page from '../views/team_page'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path:'/login',
      name:'login',
      component: login,
    },
    {
      path: '/',
      name:'main_page',
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
          path:'/team_page',
          name:"team_page",
          component: team_page
      },
      {
          path:'/recommendation',
          name:"recommendation",
          component: recommendation
      },
      {
          path:'/messages',
          name:"messages",
          component: messages
      },

  ]
})
