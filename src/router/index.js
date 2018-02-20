import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Final from '@/components/Final'
import Rules from '@/components/Rules'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/final',
      name: 'Final',
      component: Final
    },
    {
      path: '/rules',
      name: 'Rules',
      component: Rules
    }
  ]
})
