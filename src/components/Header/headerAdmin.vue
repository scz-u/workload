<template>
  <div class="header">
    <div>
      <div class="top">
        <div class="top_header">
          <!-- <div>
            <div>
              <img width="30px" src="@/assets/img/logo_shen.png" alt="" />
            </div>
            <div>
              <span class="font_18" style="font-weight: bold">
                深度工作量
              </span>
            </div>
            <div v-if="is_depart">
              <router-link
                :to="{ name: 'List', query: { k: Date.now() } }"
                :class="{
                  active_a:
                    this.$route.name == 'List' ||
                    this.$route.name == 'authorizeList',
                }"
              >
                表单</router-link
              >
            </div>
          </div> -->
          <div>
            <ul class="ul_header_logo left">
              <li>
                <div class="icon_logo"></div>
              </li>
              <!-- <li>
                <span class="font_18"> 深度工作量 </span>
              </li> -->
            </ul>
            <ul class="ul_header left">
              <!-- <li v-if="is_depart">
                <router-link
                  :to="{ name: 'ListT', query: { k: Date.now() } }"
                  :class="{
                    active_a:
                      this.$route.name == 'ListT' ||
                      this.$route.name == 'authorizeListT',
                  }"
                >
                  模板市场</router-link
                >
              </li> -->
              <!-- <li><a href="#">帮助</a></li> -->
            </ul>
          </div>

          <div class="name_top right">
            <!-- <span class="name_span_header">{{ corpname }}</span>
            | -->
            <span class="name_span_header cursor" @click="goP()">{{
              username
            }}</span>
            |
            <span @click="logout()" class="name_span_header cursor">退出</span>
            <GetTreeNameM :openid="userid" :is_depart="false"></GetTreeNameM>

            <!-- <span class="logout" @click="logout">退出</span> -->
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="flex middle_div">
        <div class="right_content">
          <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
          </el-radio-group> -->
          <!-- <router-view /> -->
          <router-view class="router-view" :key="key"></router-view>
          <!-- <router-view class="router-view" :key="$route.fullPath"></router-view> -->
          <!-- <div class="footer_header" style="background: transparent">
            <div class="inside">
              <a href="#">Copyright@</a>
              <i class="fa fa-copyright"></i>
              <a href="#">2019-2020</a>
              <a href="#">大连小偲科技有限公司 All Rights Reserved </a>
              <a href="#">| 联系方式：13898487935</a>
              <a href="https://beian.miit.gov.cn/">| 辽ICP备16015346号-4</a>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
  </div>
</template>
<script>
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
import { getUser } from '@/utils/auth_user';
export default {
  data () {
    return {
      username: this.$store.state.username,
      corpname: this.$store.state.corpname,
      permission: this.$store.getters.userid,
      check: this.$store.state.check,
      isCollapse: false,
      key: '',
      otherformlist: [],
      taskid: '',
      is_depart: false
    };
  },
  computed: {
    key () {
      // this.one.query = { k: 123 }
      console.log('--------------')
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()

    },
    transform () {
      return this.$route.path
    }
  },
  methods: {
    goP () {
      this.$router.push({ name: 'personAddress', query: { k: Date.now() } })
    },
    beforeEncryptT (code) {
      return beforeEncrypt(code)
    },
    collapseClick () {

      this.isCollapse = !this.isCollapse
      let left_menu = this.$refs['left_menu']
      console.log(this.$refs)
      setTimeout(function () {
        console.log(left_menu.offsetHeight)
      }, 100)

    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    },
    gettaskfullinfo () {
      let code = this.$route.query.id
      this.taskid = code
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        task_code: afterEncrypt(code)
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['gettaskfullinfo'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)

        this.otherformlist = data.data.form_info

      }).catch(err => {
        console.log(err)
      })

    },
    logout () {
      this.$store.dispatch('logout').then(() => {

        this.$router.push('/admin/login')

      }).catch(err => {
        console.log('error')
        console.log(err)
      })
    },
    profession () {

      let pro = JSON.parse(this.$store.getters.user ? this.$store.getters.user : afterEncrypt(getUser('user'))).permission
      console.log(pro)
      console.log(afterEncrypt(getUser('check')))
      console.log(this.$store.state.check)
      if (pro == 1) {//管理员
        this.is_depart = true
      } else if (pro == 0) {//用户
        this.is_depart = false
      }
    }
  },
  mounted () {
    this.profession()
  },
  watch: {
    '$route' (to, from) { //监听路由是否变化
      // console.log(999)
      console.log(this.$store.state.permission)
      console.log(this.$store.getters.permission)
      console.log(to)
      if (to.name == 'FormTask') {
        this.gettaskfullinfo()
      }
      if (to.name == "About1") { //跳转到哪个页面
        this.navnum = 1
      } else if (to.name == 'About2') {
        this.navnum = 2
      } else if (to.name == 'About3') {
        this.navnum = 3
      }
    },
  }
}
</script>
<style lang="less">
.nav-icon {
  font-size: @font_18 !important;
}
.other {
  background: @content_title_color;
  display: inline;
  position: absolute;
  top: 150px;
  right: -20px;
  width: 20px;
  height: 30px;
  line-height: 30px;
  // left: 0;
}
.name_span_header {
  // cursor: pointer;
}
.name_span_header:hover {
  // font-weight: bold;
  // color: @color;
}
.el-menu {
  border-right: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.flex {
  display: flex;
}
.middle_div {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 62px;
  min-width: 1140px;
}

.footer_header,
.footer_header a {
  color: #9e9e9e;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}
.top {
  z-index: 1500;
  background: @color;
  color: @white;
  position: fixed;
  top: 0;
  width: 100%;
  height: 62px;
  line-height: 62px;

  box-shadow: rgba(39, 54, 78, 0.12) 1px 0px 6px 0px;
  min-width: 1000px;
  .top_header {
    min-width: 1060px;
    margin: auto;
    margin-left: 20px;
  }
  .ul_header_logo {
    display: flex;
    justify-items: center;
    align-items: center;
    height: 100%;
    .icon_logo {
      margin-top: 13px;
      width: 195px;
      height: 35px;
      background: url("../../assets/img/logo_new.png") no-repeat;
      background-size: contain;
      margin-right: 10px;
    }
  }
  .ul_header {
    // width: 70%;
    // margin-left: 76px;
    display: flex;
    font-size: 16px;
    // margin-left: 30px;
    li {
      padding: 0 10px;
      a {
        color: @white;
      }
    }
    a:hover {
      font-weight: bold;
    }
    // li:hover {
    //   // font-weight: bold;
    //   cursor: pointer;
    //   a :hover {
    //     font-weight: bold;
    //   }
    // }
    li:after {
      content: "";
      height: 18px;
      width: 1px;
      background: @white;
      display: inline-block;
      vertical-align: middle;
      margin-left: 15px;
    }
    li:last-of-type:after {
      content: none;
    }
  }
  .name_top {
    margin-right: 20px;
    font-size: @font_16;
  }
}
.left_menu {
  position: relative;
  top: 0;
  bottom: 0;
  background: @white;
  min-height: 845px;
  // left: 20px;
  // margin-top: 100px;
  // margin-left: 20px;
}
.right_content {
  // position: relative;
  // margin-left: 30px;
  // margin-top: 20px;
  // margin-right: 20px;
  width: 100%;
  min-width: 1200px;
  // min-height: 600px;
  // overflow: auto;
  // background: @white;
  // padding: 10px;
}
.active_a {
  // color: @color;
  font-weight: bold;
}
</style>