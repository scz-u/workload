// import Vue from 'vue'
import Vuex from 'vuex'
import { setUser, getUser, removeUser } from '@/utils/auth_user';
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';

// Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    weburl: 'http://localhost:19698/',
    appid: '',
    url: '',
    imgurl: '',
    agentid: '',
    formItemList: [],
    strlist: {},
    permission: afterEncrypt(getUser('permission')),
    corpid: afterEncrypt(getUser('corpid')),
    corpname: afterEncrypt(getUser('corpname')),
    userid: afterEncrypt(getUser('userid')),
    useridAdmin: afterEncrypt(getUser('useridAdmin')),
    username: afterEncrypt(getUser('username')),
    user: afterEncrypt(getUser('user')),
    check: afterEncrypt(getUser('check')),
    active_nav: afterEncrypt(getUser('active_nav')) ? afterEncrypt(getUser('active_nav')) : '1',
  },
  getters: {
    active_nav: state => state.active_nav,
  },
  mutations: {
    stringComponents (state, list) {
      state.formItemList = list
    },
    stringList (state, list) {
      state.strlist = list
    },
    SER_USERID: (state, userid) => {
      state.userid = userid;
      // window.sessionStorage.setItem('token', token)
    },
    SER_CORPID: (state, corpid) => {
      state.corpid = corpid;
      // window.sessionStorage.setItem('token', token)
    },
    SER_CORPNAME: (state, corpname) => {
      state.corpname = corpname;
      // window.sessionStorage.setItem('token', token)
    },
    SER_USER: (state, user) => {
      state.user = user;
      // window.sessionStorage.setItem('token', token)
    },
    SER_TOKEN: (state, token) => {
      state.token = token;
      // window.sessionStorage.setItem('token', token)
    },
    SER_USERNAME: (state, username) => {
      state.username = username;
      // window.sessionStorage.setItem('name', name)
    },
    SER_PERMISSION: (state, permission) => {
      state.permission = permission;
      // window.sessionStorage.setItem('name', name)
    }, SER_CHECK: (state, check) => {
      state.check = check;
      // window.sessionStorage.setItem('name', name)
    },
    active_nav: (state, active_nav) => {
      // 创建一个新的对象，将info,state.personInfo对象复制到新对象中
      // let data = Object.assign({}, state.active_nav, active_nav);

      state.active_nav = active_nav
    }
  },
  actions: {
    toggleSideBar ({ commit }, data) {
      console.log(data)
      console.log(typeof data)
      setUser('active_nav', beforeEncrypt(data))
      commit('active_nav', data)
      // resolve(data)
    },
    check ({ commit }, data) {
      // alert(JSON.stringify(data))
      return new Promise((resolve) => {
        commit('SER_CHECK', (data))
        setUser('check', beforeEncrypt((data)))
        resolve(data)

      })

    },
    login_mobile ({ commit }, data) {

      return new Promise((resolve) => {

        commit('SER_USERNAME', (data.UserId))
        setUser('username', beforeEncrypt((data.UserId)))
        commit('SER_USERID', data.UserId)
        setUser('userid', beforeEncrypt(data.UserId))
        commit('SER_CORPID', data.CorpId)
        setUser('corpid', beforeEncrypt(data.CorpId))
        resolve(data)

      })

    },
    login_admin ({ commit }, data) {

      return new Promise((resolve) => {

        commit('SER_USERNAME', (data.username))
        setUser('username', beforeEncrypt((data.username)))
        commit('SER_USERIDADMIN', data.userid)
        setUser('useridAdmin', beforeEncrypt(data.userid))
        commit('SER_USER', data.userid)
        setUser('user', beforeEncrypt(JSON.stringify(data)))
        commit('SER_PERMISSION', 'admin')
        setUser('permission', beforeEncrypt('admin'))
        resolve(data)

      })

    },
    login_other ({ commit }, data) {

      return new Promise((resolve) => {
        commit('SER_USERNAME', (data.username))
        setUser('username', beforeEncrypt((data.username)))
        commit('SER_USERID', data.userid)
        setUser('userid', beforeEncrypt(data.userid))
        commit('SER_USER', data.userid)
        setUser('user', beforeEncrypt(JSON.stringify(data)))
        commit('SER_PERMISSION', data.permission)
        setUser('permission', beforeEncrypt(data.permission))
        commit('SER_CORPID', data.corpid)
        setUser('corpid', beforeEncrypt(data.corpid))
        commit('SER_CORPNAME', data.corpname)
        setUser('corpname', beforeEncrypt(data.corpname))
        resolve(data)

      })

    },
    name_other ({ commit }, data) {

      return new Promise((resolve) => {
        commit('SER_USERNAME', (data.username))
        setUser('username', beforeEncrypt((data.username)))
        resolve(data)

      })

    },
    login ({ commit }, data) {

      return new Promise((resolve) => {

        commit('SER_USERNAME', (data.user_info.name))
        setUser('username', beforeEncrypt((data.user_info.name)))
        commit('SER_USERID', data.user_info.userid)
        setUser('userid', beforeEncrypt(data.user_info.userid))
        commit('SER_CORPID', data.corp_info.corpid)
        setUser('corpid', beforeEncrypt(data.corp_info.corpid))

        resolve(data)

      })

    },
    login_mobile ({ commit }, data) {

      return new Promise((resolve) => {

        commit('SER_USERNAME', (data.UserId))
        setUser('username', beforeEncrypt((data.UserId)))
        commit('SER_USERID', data.UserId)
        setUser('userid', beforeEncrypt(data.UserId))
        commit('SER_CORPID', data.CorpId)
        setUser('corpid', beforeEncrypt(data.CorpId))

        resolve(data)

      })

    },
    logout ({ commit }) {

      return new Promise((resolve) => {
        removeUser('userid')
        commit('SER_USERID', '')
        removeUser('username')
        commit('SER_USERNAME', '')
        removeUser('corpid')
        commit('SER_CORPID', '')
        removeUser('user')
        commit('SER_USER', '')
        resolve()
      })

    }
  },
  modules: {
  }
})
