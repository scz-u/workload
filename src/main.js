import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/less/style.less'
import '@/assets/less/index.less'
import ElementUI from 'element-ui';
import '../theme/index.css'
import { server } from '@/api/index.js'
import { apilist } from '@/utils/apilist.js'
import { createObj } from '@/utils/encryption.js'
import { getAgentId } from '@/utils/encryption.js'
import VueDataTables from 'vue-data-tables'
import '@/assets/icons'
import './assets/less/weui-for-work.css'
import func from '@/utils/preload.js'
import ydc from '@/utils/common.js'
import nodeWrap from '@/components/task/components/approval/nodeWrap'
Vue.use(nodeWrap)
Vue.component('nodeWrap', nodeWrap); //初始化组件
import addNode from '@/components/task/components/approval/addNode'
Vue.use(addNode)
Vue.component('addNode', addNode); //初始化组件
import nodeWrapM from '@/components/task/components/approval/nodeWrapM'
Vue.use(nodeWrapM)
Vue.component('nodeWrapM', nodeWrapM); //初始化组件
import addNodeM from '@/components/task/components/approval/addNodeM'
Vue.use(addNodeM)
Vue.component('addNodeM', addNodeM); //初始化组件
import addNodeN from '@/components/task/components/approval/addNodeN'
Vue.use(addNodeN)
Vue.component('addNodeN', addNodeN); //初始化组件
Vue.prototype.$func = func;
Vue.prototype.$ydc = ydc;

import Print from 'vue-print-nb'
Vue.use(Print);

Vue.config.productionTip = false
Vue.use(VueDataTables)
Vue.use(ElementUI);
Vue.prototype.$server = server
Vue.prototype.$apilist = apilist
Vue.prototype.$createObj = createObj
Vue.prototype.getAgentId = getAgentId

import { getUser } from '@/utils/auth_user';
import { afterEncrypt } from '@/utils/encryption';

let whiteList = ['/login', '/admin/login', '/register', '/test', '/attention', '/admin/other_login/aKZehxFHTgBWAlZnwv7WkccTaNab2Rzf', '/index_fill_mobile', '/judge',]
let adminList = ['IndexAdmin', 'loginAdmin', 'lookTemplate', 'newTemplate', 'editorTemplate',]
const whiteList_mobile = ['judge', 'index_fill_mobile', 'index_audit_mobile', 'list_audit', 'detail_audit', 'sumlist', 'detail_assign', 'detail_assign_single', 'detail_summary', 'fill_add', 'look_audit', 'look_audit_no', 'index_approval', 'wait', 'already', 'log']

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  console.log(to.name)
  console.log(to)
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // next()
  // console.log()
  // console.log(to.matched)
  const token = store.getters.userid ? store.getters.userid : afterEncrypt(getUser('userid'))
  const tokenAdmin = store.getters.useridAdmin ? store.getters.useridAdmin : afterEncrypt(getUser('useridAdmin'))
  // const token = store.state.userid ? store.state.userid : afterEncrypt(getUser('userid'))
  // console.log(store.state.userid)
  // console.log(store.getters.userid ? store.getters.userid : afterEncrypt(getUser('userid')))
  // console.log(store.getters.user ? store.getters.user : afterEncrypt(getUser('user')))
  // console.log(store.state.user)
  // console.log(store.state.corpid)
  // alert(token)
  let string = getnavigator()
  console.log(string)
  if (to.name == 'attention') {
    console.log('sdfsdfsdf')

    next()
  } else if (whiteList_mobile.indexOf(to.name) !== -1) {
    if (token) {
      // alert(to.path)
      // alert(next.path)
      next()
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        console.log('sdfsdfss')
        next()
      } else {
        if (whiteList_mobile.indexOf(to.name) !== -1) {
          next({ name: 'judge' })
        }
      }
    }

  }
  else if ((string == 'Chrome' || string == 'FF') && to.name != 'attention') {
    if (adminList.indexOf(to.name) !== -1) {
      console.log('------------------------')
      console.log(store.getters.permission ? store.getters.permission : afterEncrypt(getUser('permission')))
      if (tokenAdmin) {
        next()
      } else {
        if (to.name == 'loginAdmin') {
          next()
        } else {
          next({ name: 'loginAdmin' })
        }

      }
      return false
    }
    if (token) {
      // alert(to.path)
      // alert(next.path)
      next()
    } else {
      console.log('sdfsd')

      if (whiteList.indexOf(to.path) !== -1) {
        console.log('sdfsdfss')
        next()
      } else {
        next({ name: 'login' })

      }
    }
  } else {
    next({ name: 'attention' })
  }

  // next()
})


function getnavigator () {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  console.log(userAgent)
  var isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) {
    return "Opera"
  } //判断是否Opera浏览器
  if (userAgent.indexOf("Firefox") > -1) {
    return "FF";
  } //判断是否Firefox浏览器
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
    return "IE";
  } //判断是否IE浏览器

}
function isTrue () {
  let string = this.getnavigator()

  if (string == 'Chrome') {
    this.$router.push({ name: 'login' })
  }
}

new Vue({
  router,
  store,
  components: {
    nodeWrap,
    addNode,
    nodeWrapM,
    addNodeM,
  },
  render: h => h(App)
}).$mount('#app')
