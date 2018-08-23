import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Invite from './views/Invite.vue'
import Earning from './views/Earning.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/invite',
      name: 'invite',
      component: Invite
    },
    {
      path: '/earning',
      name: 'earning',
      component: Earning
    }
  ]
})
