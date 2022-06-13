import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/qiniu',
    name: 'qiniu',
    component: r => require(['../components/Header/qiniu.vue'], r),
  },
  {
    path: '/test',
    name: 'test',
    component: r => require(['../components/login/test.vue'], r),
  },
  {
    path: '/test1',
    name: 'test1',
    component: r => require(['../components/public/charts.vue'], r),
  },
  {
    path: '/login',
    name: 'login',
    component: r => require(['../components/login/index1.vue'], r),
  }, {
    path: '/admin/other_login/aKZehxFHTgBWAlZnwv7WkccTaNab2Rzf',
    name: 'other_login',
    component: r => require(['../components/login/other_login.vue'], r),
  }, {
    path: '/attention',
    name: 'attention',
    component: r => require(['../components/login/attention.vue'], r),
  }, {
    path: '/register',
    name: 'register',
    component: r => require(['../components/login/register.vue'], r),
  },
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: '/admin/login',
    name: 'loginAdmin',
    component: r => require(['../components/admin/login.vue'], r),
  },
  {
    path: '/newtemplate',
    name: 'newTemplate',
    component: r => require(['../components/admin/templateNew.vue'], r),
  },
  {
    path: '/editortemplate',
    name: 'editorTemplate',
    component: r => require(['../components/admin/templateEditor.vue'], r),
  },
  {
    path: '/looktemplate',
    name: 'lookTemplate',
    component: r => require(['../components/admin/templateLook.vue'], r),
  },
  {
    path: '/admin',
    name: 'admin',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/Header/headerAdmin.vue'),
    children: [{
      path: 'index',
      name: 'IndexAdmin',
      component: r => require(['../components/admin/index.vue'], r),
    },]
  },
  // {
  //   path: '/otherpage',
  //   name: 'otherpage',
  //   // component: resolve => require(['../components/header/indexHead.vue'], resolve),
  //   component: () => import(/* webpackChunkName: "header" */ '../components/Header/header.vue'),
  //   // children: [{
  //   //   path: 'index',
  //   //   name: 'IndexAddress',
  //   //   component: r => require(['../components/address/index.vue'], r),
  //   // },
  //   // ]
  // },
  {
    path: '/address',
    name: 'address',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/Header/index.vue'),
    children: [{
      path: 'index',
      name: 'IndexAddress',
      component: r => require(['../components/address/index.vue'], r),
    }, {
      path: 'importlist',
      name: 'ImportListAddress',
      component: r => require(['../components/address/components/importlist.vue'], r),
    }, {
      path: 'permission',
      name: 'PermissionAddress',
      component: r => require(['../components/address/components/permissions.vue'], r),
    }, {
      path: 'person',
      name: 'personAddress',
      component: r => require(['../components/Header/person.vue'], r),
    }, {
      path: 'password_change',
      name: 'pwdAddress',
      component: r => require(['../components/Header/pwd.vue'], r),
    }, {
      path: 'dependencies',
      name: 'dependenciesAddress',
      component: r => require(['../components/address/charts.vue'], r),
    },
      //  {
      //   path: 'detail',
      //   name: 'detail_fill',
      //   component: r => require(['../components/fillMy/signleTypeDetail.vue'], r),
      // }, {
      //   path: 'index_mobile',
      //   name: 'index_fill_mobile',
      //   component: r => require(['../components/fillMy/index_mobile.vue'], r),
      // },
    ]
  },
  {
    path: '/newform',
    name: 'NewForm',
    component: r => require(['../components/forms/newform.vue'], r),
  },
  {
    path: '/lookform',
    name: 'lookForm',
    component: r => require(['../components/forms/lookform.vue'], r),
  },
  {
    path: '/editorform',
    name: 'editorForm',
    component: r => require(['../components/forms/editorForm.vue'], r),
  }, {
    path: '/copyform',
    name: 'copyForm',
    component: r => require(['../components/forms/copyForm.vue'], r),
  },
  {
    path: '/forms',
    name: 'forms',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/Header/index.vue'),
    children: [{
      path: 'list',
      name: 'List',
      component: r => require(['../components/forms/formList.vue'], r),
    },
    {
      path: 'authorizelist',
      name: 'authorizeList',
      component: r => require(['../components/forms/authorizeFormList.vue'], r),
    },
    ]
  },
  {
    path: '/formt',
    name: 'formt',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/Header/index.vue'),
    children: [{
      path: 'list',
      name: 'ListT',
      component: r => require(['../components/formt/formList.vue'], r),
    },
      // {
      //   path: 'authorizelist',
      //   name: 'authorizeListT',
      //   component: r => require(['../components/formt/authorizeFormList.vue'], r),
      // },
    ]
  },
  {
    path: '/audit',
    name: 'audit',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/Header/index.vue'),
    children: [{
      path: 'search',
      name: 'searchAudit',
      component: r => require(['../components/audit/search.vue'], r),
    }, {
      path: 'auditlist',
      name: 'ListAudit',
      component: r => require(['../components/audit/index.vue'], r),
    }, {
      path: 'approvedlist',
      name: 'approvedAudit',
      component: r => require(['../components/audit/approved.vue'], r),
    }, {
      path: 'tasklist',
      name: 'taskAudit',
      component: r => require(['../components/audit/tasklist.vue'], r),
    }, {
      path: 'gathertask',
      name: 'gatherAudit',
      component: r => require(['../components/audit/gatherlist.vue'], r),
    }, {
      path: 'filllist',
      name: 'filllistAudit',
      component: r => require(['../components/audit/filllist.vue'], r),
    },]
  },
  {
    path: '/newtask',
    name: 'NewTask',
    component: r => require(['../components/task/newtask.vue'], r),
  }, {
    path: '/editortask',
    name: 'EditorTask',
    component: r => require(['../components/task/newtask.vue'], r),
  }, {
    path: '/copytask',
    name: 'copyTask',
    component: r => require(['../components/task/copytask.vue'], r),
  },
  {
    path: '/task',
    name: 'task',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/Header/index.vue'),
    children: [{
      path: 'tasklist',
      name: 'ListTask',
      component: r => require(['../components/task/index.vue'], r),
    }, {
      path: 'closelist',
      name: 'closeTask',
      component: r => require(['../components/task/closelist.vue'], r),
    },
    {
      path: 'authorizelist',
      name: 'authorizeListTask',
      component: r => require(['../components/task/authorizeTaskList.vue'], r),
    }, {
      path: 'formtask',
      name: 'FormTask',
      component: r => require(['../components/task/formtask.vue'], r),
    }, {
      path: 'gathertask/:other',
      name: 'gatherTask',
      component: r => require(['../components/task/gatherlist.vue'], r),
    }, {
      path: 'gathertaskC',
      name: 'gatherTaskC',
      component: r => require(['../components/task/gatherlistClose.vue'], r),
    },
    {
      path: 'filllist/:other',
      name: 'filllistTask',
      component: r => require(['../components/task/filllist.vue'], r),
    }, {
      path: 'import/:other',
      name: 'importTask',
      component: r => require(['../components/task/components/importlist.vue'], r),
    },
    ]
  }, {
    path: '/fill',
    name: 'fill',
    // component: resolve => require(['../components/header/indexHead.vue'], resolve),
    component: () => import(/* webpackChunkName: "header" */ '../components/Header/index.vue'),
    children: [{
      path: 'listfill',
      name: 'ListFill',
      component: r => require(['../components/fill/index.vue'], r),
    }, {
      path: 'publicform',
      name: 'publicFormFill',
      component: r => require(['../components/fill/publicForm.vue'], r),
    }, {
      path: 'publictask',
      name: 'publicTaskFill',
      component: r => require(['../components/fill/publicTask.vue'], r),
    }, {
      path: 'publiclist',
      name: 'publicListFill',
      component: r => require(['../components/fill/publicList.vue'], r),
    }, {
      path: 'endfill',
      name: 'endFill',
      component: r => require(['../components/fill/endlist.vue'], r),
    },
    {
      path: 'formlist',
      name: 'formFill',
      component: r => require(['../components/fill/formlist.vue'], r),
    }, {
      path: 'filllist',
      name: 'filllistFill',
      component: r => require(['../components/fill/formdetail.vue'], r),
    }, {
      path: 'endformlist',
      name: 'endformFill',
      component: r => require(['../components/fill/endformlist.vue'], r),
    }, {
      path: 'endfilllist',
      name: 'endfilllistFill',
      component: r => require(['../components/fill/endformdetail.vue'], r),
    }, {
      path: 'sumfill',
      name: 'sumFill',
      component: r => require(['../components/fill/sum.vue'], r),
    }, {
      path: 'endsumfill',
      name: 'endsumFill',
      component: r => require(['../components/fill/sumEnd.vue'], r),
    },
    ]
  },
  //mobile
  {
    path: '/index_audit',
    name: 'index_audit_mobile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/index.vue'),
    meta: {
      title: '首页',
      keepAlive: true //此组件需要被缓存
    }
  },
  {
    path: '/list_audit',
    name: 'list_audit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/list.vue'),
    meta: {
      title: '表单',
      otherlive: true
    }
  },
  {
    path: '/detail_audit',
    name: 'detail_audit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/form_detail.vue'),
    meta: {
      title: '数据',
      otherlive: true
    }
  },
  {
    path: '/sumlist',
    name: 'sumlist',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/sumlist.vue'),
    meta: {
      title: '汇总'
    }
  },
  {
    path: '/detail_assign',
    name: 'detail_assign',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/detail_assign.vue'),
    meta: {
      title: '分配详情'
    }
  },
  {
    path: '/detail_assign_single',
    name: 'detail_assign_single',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/detail_assign_single.vue'),
    meta: {
      title: '分配详情'
    }
  },
  {
    path: '/fill_add',
    name: 'fill_add',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/fill_add.vue'),
    meta: {
      title: '填报'
    }
  },
  {
    path: '/look_audit',
    name: 'look_audit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/components/look_detail.vue'),
    meta: {
      title: '详情'
    }
  },
  {
    path: '/look_audit_no',
    name: 'look_audit_no',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/components/look_detail_no.vue'),
    meta: {
      title: '详情'
    }
  },
  {
    path: '/approval',
    name: 'index_approval',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/approvalA/index.vue'),
    children: [{
      path: 'wait',
      name: 'wait',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../components/mobile/approvalA/wait.vue'),
      meta: {
        title: '待审批'
      }
    }, {
      path: 'already',
      name: 'already',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../components/mobile/approvalA/already.vue'),
      meta: {
        title: '已审批'
      }
    }],

  },
  {
    path: '/look_approval',
    name: 'look_approval',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/approvalA/components/look_detail.vue'),
    meta: {
      title: '详情'
    }
  },
  {
    path: '/log',
    name: 'log',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/mobile/auditU/components/log.vue'),
    meta: {
      title: '日志'
    }
  },
  {
    path: '/judge',
    name: 'judge',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "header" */ '../components/login/judge.vue'),
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
