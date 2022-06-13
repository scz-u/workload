<template>
  <div class="header">
    <div>
      <!-- <div class="top">
        <div class="top_header">
          <div>
            <ul class="ul_header_logo left">
              <li>
                <div class="icon_logo"></div>
              </li>
            </ul>
            <ul class="ul_header left">
              <li>
                <router-link
                  :to="{ name: 'ListFill', query: { k: Date.now() } }"
                  :class="{
                    active_a:
                      this.$route.name == 'ListFill' ||
                      this.$route.name == 'ListAudit' ||
                      this.$route.name == 'approvedAudit' ||
                      this.$route.name == 'formFill' ||
                      this.$route.name == 'endformFill' ||
                      this.$route.name == 'filllistFill' ||
                      this.$route.name == 'endfilllistFill' ||
                      this.$route.name == 'endFill' ||
                      this.$route.name == 'sumFill' ||
                      this.$route.name == 'endsumFill' ||
                      this.$route.name == 'taskAudit' ||
                      this.$route.name == 'gatherAudit' ||
                      this.$route.name == 'filllistAudit',
                  }"
                  >工作台</router-link
                >
              </li>
              <li>
                <router-link
                  :to="{ name: 'publicTaskFill', query: { k: Date.now() } }"
                  :class="{
                    active_a:
                      this.$route.name == 'publicFormFill' ||
                      this.$route.name == 'publicListFill' ||
                      this.$route.name == 'publicTaskFill',
                  }"
                  >公示区</router-link
                >
              </li>
              <li v-if="is_depart">
                <router-link
                  :to="{ name: 'List', query: { k: Date.now() } }"
                  :class="{
                    active_a:
                      this.$route.name == 'List' ||
                      this.$route.name == 'authorizeList' ||
                      this.$route.name == 'ListT' ||
                      this.$route.name == 'authorizeListT',
                  }"
                >
                  表单模板</router-link
                >
              </li>
              <li v-if="is_depart">
                <router-link
                  :to="{ name: 'ListTask', query: { k: Date.now() } }"
                  :class="{
                    active_a:
                      this.$route.name == 'ListTask' ||
                      this.$route.name == 'authorizeListTask' ||
                      this.$route.name == 'closeTask' ||
                      this.$route.name == 'gatherTask' ||
                      this.$route.name == 'filllistTask' ||
                      this.$route.name == 'gatherTaskC',
                  }"
                  >任务管理</router-link
                >
              </li>

              <li v-if="is_depart">
                <router-link
                  :to="{ name: 'IndexAddress', query: { k: Date.now() } }"
                  href="#"
                  :class="{
                    active_a:
                      this.$route.name == 'IndexAddress' ||
                      this.$route.name == 'index_audit' ||
                      this.$route.name == 'typelist' ||
                      this.$route.name == 'index_permission' ||
                      this.$route.name == 'add_audit' ||
                      this.$route.name == 'dependenciesAddress',
                  }"
                >
                  组织管理
                </router-link>
              </li>
            </ul>
          </div>

          <div class="name_top right">
            <span class="name_span_header">{{ corpname }}</span>
            |
            <span class="name_span_header cursor" @click="goP()">{{
              username
            }}</span>
            |
            <span @click="logout()" class="name_span_header cursor">退出</span>
          </div>
          <div class="clearfix"></div>
        </div>
      </div> -->
      <div class="flex middle_div">
        <div
          class="left_menu"
          v-if="
            this.$route.name != 'ImportListAddress' &&
            this.$route.name != 'FormTask' &&
            this.$route.name != 'importTask'
          "
        >
          <div
            class="text_center"
            ref="logo_top"
            style="margin-bottom: 25px; margin-top: 20px"
          >
            <img src="@/assets/img/logo-white.png" height="30px" alt="" />
          </div>
          <div ref="left_menu">
            <el-menu
              :default-active="$route.path"
              router
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              :collapse="isCollapse"
              :default-openeds="['1', '2']"
              :background-color="'#192D50'"
              :text-color="'#ffffff'"
            >
              <span
                v-show="
                  this.$route.name == 'List' ||
                  this.$route.name == 'authorizeList' ||
                  this.$route.name == 'ListT' ||
                  this.$route.name == 'authorizeListT'
                "
                v-if="is_depart"
              >
                <el-menu-item index="/forms/list">
                  <i class="iconfont icon-3-1 nav-icon"></i>
                  <span slot="title">表单列表</span>
                </el-menu-item>
                <el-menu-item index="/forms/authorizelist">
                  <i class="iconfont icon-3-2 nav-icon"></i>
                  <span slot="title">被授权表单</span>
                </el-menu-item>
                <el-menu-item index="/formt/list">
                  <i class="iconfont icon-3-3 nav-icon"></i>
                  <span slot="title">模板市场</span>
                </el-menu-item>
              </span>
              <!-- <span v-show="this.$route.name == 'ListT'" v-if="is_depart">
                <el-menu-item index="/formt/list">
                  <i class="iconfont icon-form nav-icon"></i>
                  <span slot="title">表单列表</span>
                </el-menu-item>
              </span> -->
              <span
                v-show="
                  this.$route.name == 'publicFormFill' ||
                  this.$route.name == 'publicListFill' ||
                  this.$route.name == 'publicTaskFill'
                "
              >
                <el-menu-item index="/fill/publictask">
                  <i class="iconfont icon-2 nav-icon"></i>
                  <span slot="title">公示数据</span></el-menu-item
                >
              </span>
              <el-submenu
                index="1"
                v-show="
                  this.$route.name == 'ListAudit' ||
                  this.$route.name == 'approvedAudit' ||
                  this.$route.name == 'ListFill' ||
                  this.$route.name == 'formFill' ||
                  this.$route.name == 'filllistFill' ||
                  this.$route.name == 'endformFill' ||
                  this.$route.name == 'endfilllistFill' ||
                  this.$route.name == 'endFill' ||
                  this.$route.name == 'sumFill' ||
                  this.$route.name == 'endsumFill' ||
                  this.$route.name == 'taskAudit' ||
                  this.$route.name == 'gatherAudit' ||
                  this.$route.name == 'filllistAudit'
                "
              >
                <template slot="title">
                  <i class="iconfont icon-fill icon-1-1 nav-icon"></i>
                  <span slot="title">我的待办</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/fill/listfill">待完成任务</el-menu-item>
                  <el-menu-item index="/fill/endfill">已结束任务</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu
                index="2"
                v-if="check == 'true'"
                v-show="
                  this.$route.name == 'ListAudit' ||
                  this.$route.name == 'approvedAudit' ||
                  this.$route.name == 'ListFill' ||
                  this.$route.name == 'formFill' ||
                  this.$route.name == 'filllistFill' ||
                  this.$route.name == 'endformFill' ||
                  this.$route.name == 'endfilllistFill' ||
                  this.$route.name == 'endFill' ||
                  this.$route.name == 'sumFill' ||
                  this.$route.name == 'endsumFill' ||
                  this.$route.name == 'taskAudit' ||
                  this.$route.name == 'gatherAudit' ||
                  this.$route.name == 'filllistAudit'
                "
              >
                <template slot="title">
                  <i class="iconfont icon-audit icon-1-2 nav-icon"></i>
                  <span slot="title">数据审核</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/audit/auditlist"
                    >待审核数据</el-menu-item
                  >
                  <el-menu-item index="/audit/approvedlist"
                    >已审核数据</el-menu-item
                  >
                  <el-menu-item index="/audit/tasklist"
                    >审核任务列表</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
              <!-- </div> -->
              <span
                v-show="
                  this.$route.name == 'ListTask' ||
                  this.$route.name == 'authorizeListTask' ||
                  this.$route.name == 'closeTask' ||
                  this.$route.name == 'gatherTask' ||
                  this.$route.name == 'filllistTask' ||
                  this.$route.name == 'gatherTaskC' ||
                  this.$route.name == 'searchAudit'
                "
                v-if="is_depart"
              >
                <el-menu-item index="/task/tasklist">
                  <i class="iconfont icon-4-1 nav-icon"></i>
                  <span slot="title">我的任务</span>
                </el-menu-item>
                <el-menu-item index="/task/authorizelist">
                  <i class="iconfont icon-4-2 nav-icon"></i>
                  <span slot="title">被授权任务</span> </el-menu-item
                ><el-menu-item index="/task/closelist">
                  <i
                    class="iconfont icon-4-3 font_18"
                    style="font-size: 18px !important"
                  ></i>
                  <span slot="title">已完成任务</span>
                </el-menu-item>
                <el-menu-item index="/audit/search"
                  ><i
                    class="el-icon-search font_18"
                    style="font-size: 18px !important"
                  ></i>
                  <span slot="title">模糊搜索</span></el-menu-item
                >
              </span>
              <div
                v-show="
                  this.$route.name == 'personAddress' ||
                  this.$route.name == 'pwdAddress'
                "
              >
                <el-menu-item index="/address/person">
                  <i class="iconfont icon-task nav-icon"></i>
                  <span slot="title">个人信息</span>
                </el-menu-item>
                <el-menu-item index="/address/password_change">
                  <i class="iconfont icon-authorization nav-icon"></i>
                  <span slot="title">密码修改</span>
                </el-menu-item>
              </div>
              <div
                v-show="
                  this.$route.name == 'IndexAddress' ||
                  this.$route.name == 'PermissionAddress' ||
                  this.$route.name == 'dependenciesAddress'
                "
                v-if="is_depart"
              >
                <el-menu-item index="/address/index">
                  <i class="iconfont icon-5-1 nav-icon"></i>
                  <span slot="title">通讯录</span>
                </el-menu-item>
                <el-menu-item index="/address/permission">
                  <i class="iconfont icon-5-2 nav-icon"></i>
                  <span slot="title">管理员</span>
                </el-menu-item>
                <el-menu-item index="/address/dependencies">
                  <i class="iconfont icon-5-31 nav-icon"></i>
                  <span slot="title">关系图</span>
                </el-menu-item>
              </div>
            </el-menu>
          </div>

          <!-- <div class="other cursor" @click="collapseClick()">
            <i class="el-icon-arrow-right" v-if="isCollapse"></i>
            <i class="el-icon-arrow-left" v-else></i>
          </div> -->
        </div>
        <div
          class="right_content"
          :style="{ 'margin-left': right_left + 'px' }"
        >
          <div class="right_title flex">
            <i
              class="el-icon-s-unfold icon_title cursor"
              ref="icon_title"
              @click="collapseClick()"
              v-if="isCollapse"
            ></i>
            <i
              class="el-icon-s-fold icon_title cursor"
              ref="icon_title"
              @click="collapseClick()"
              v-else
            ></i>
            <el-menu
              :default-active="active_nav"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item index="1">工作台</el-menu-item>
              <el-menu-item index="2">公示区</el-menu-item>
              <el-menu-item index="3" v-if="is_depart">表单模板</el-menu-item>
              <el-menu-item index="4" v-if="is_depart">任务管理</el-menu-item>
              <el-menu-item index="5" v-if="is_depart"
                >组织管理{{ corpid }}</el-menu-item
              >
            </el-menu>

            <div class="clearfix"></div>
          </div>
          <div class="name_top right">
            <el-dropdown>
              <span class="el-dropdown-link">
                <span class="icon_username cursor">
                  {{ charToLetter() }}
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <p @click="goP()" class="width_130 p_over">
                    <i class="iconfont icon-user"></i> {{ username }}
                  </p></el-dropdown-item
                >
                <el-dropdown-item>
                  <p class="width_130 p_over" :title="corpname">
                    <i class="iconfont icon-category1"></i>
                    {{ corpname }}
                  </p></el-dropdown-item
                >
                <el-dropdown-item>
                  <p @click="logout()">
                    <i class="iconfont icon-logout"></i> 退出
                  </p></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <span class="name_span_header">{{ corpname }}</span>
              | 
              <span class="name_span_header cursor" @click="goP()"
                >{{ username }}{{ charToLetter() }}</span
              >
              |
              <span @click="logout()" class="name_span_header cursor"
                >退出</span
              > -->
          </div>
          <router-view
            class="router-view right_content_middle"
            :key="key"
          ></router-view>
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
import { mapGetters } from 'vuex'
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
import { getUser } from '@/utils/auth_user';
import pinyin from 'js-pinyin'
export default {
  data () {
    return {
      activeIndex: '',
      activeIndex2: '1',
      username: this.$store.state.username,
      corpname: this.$store.state.corpname,
      corpid: this.$store.state.corpid,
      permission: this.$store.getters.userid,
      check: this.$store.state.check,
      isCollapse: false,
      key: '',
      otherformlist: [],
      taskid: '',
      is_depart: false,
      right_left: 200
    };
  },
  computed: {
    ...mapGetters([
      'active_nav'
    ]),
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
    charToLetter () {
      console.log(this.username)
      let char = ''
      pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
      char = pinyin.getCamelChars(this.username)
      if (char.length <= 1) {
        return char
      } else {
        return char.slice(0, 1)
      }

    },
    handleSelect (key, keypath) {
      console.log(key)
      console.log(keypath)
      if (key == '1') {
        this.$router.push({ name: 'ListFill', query: { k: Date.now() } })
      }
      else if (key == '2') {
        this.$router.push({ name: 'publicTaskFill', query: { k: Date.now() } })
      } else if (key == '3') {
        this.$router.push({ name: 'List', query: { k: Date.now() } })
      } else if (key == "4") {
        this.$router.push({ name: 'ListTask', query: { k: Date.now() } })
      } else if (key == '5') {
        this.$router.push({ name: 'IndexAddress', query: { k: Date.now() } })
      }
    },
    goP () {
      this.$router.push({ name: 'personAddress', query: { k: Date.now() } })
    },
    beforeEncryptT (code) {
      return beforeEncrypt(code)
    },
    collapseClick () {

      this.isCollapse = !this.isCollapse
      this.right_left = this.isCollapse == false ? 200 : 64

      console.log(this.$refs.logo_top)
      this.$refs.logo_top.style.display = this.isCollapse == false ? 'block' : 'none'
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

        this.$router.push('/login')

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
  created () {
    console.log(beforeEncrypt(getUser("active_nav")))
    console.log('000000')
    this.profession()
    console.log(this.$route.path)
    let stringlist = " /fill/listfill /fill/endfill /fill/formlist /fill/filllist /fill/endformlist /fill/endfilllist /fill/sumfill /fill/endsumfill /audit/auditlist /audit/approvedlist /audit/tasklist /audit/gathertask /audit/filllist"
    let str_two_list = '/fill/publicform /fill/publictask /fill/publiclist'
    let str_three_list = '/forms/list /forms/authorizelist'
    let str_four_list = "/task/tasklist"
    let str_five_list = "/address/index /address/permission /address/dependencies"

    console.log(str_four_list.indexOf(this.$route.path))
    if (stringlist.indexOf(this.$route.path) > -1) {
      this.activeIndex = '1'
      this.$store.dispatch('toggleSideBar', '1')
    } else if (str_two_list.indexOf(this.$route.path) > -1) {
      this.activeIndex = "2"
      this.$store.dispatch('toggleSideBar', '2')
    } else if (str_three_list.indexOf(this.$route.path) > -1) {
      console.log('99999999999999999999999')
      this.activeIndex = "3"
      this.$store.dispatch('toggleSideBar', '3')
    } else if (str_four_list.indexOf(this.$route.path) > -1) {
      this.activeIndex = "4"
      this.$store.dispatch('toggleSideBar', '4')
    } else if (str_five_list.indexOf(this.$route.path) > -1) {
      this.activeIndex = "5"
      this.$store.dispatch('toggleSideBar', '5')
    } else {
      this.activeIndex = "0"
      this.$store.dispatch('toggleSideBar', '0')
    }
    console.log(this.activeIndex)
  },
  watch: {
    $route (to, from) { //监听路由是否变化
      // console.log(999)
      console.log(this.$store.state.permission)
      console.log(this.$store.getters.permission)
      console.log(to)
      let stringlist = " /fill/listfill /fill/endfill /fill/formlist /fill/filllist /fill/endformlist /fill/endfilllist /fill/sumfill /fill/endsumfill /audit/auditlist /audit/approvedlist /audit/tasklist /audit/gathertask /audit/filllist"
      let str_two_list = '/fill/publicform /fill/publictask /fill/publiclist'
      let str_three_list = '/forms/list /forms/authorizelist'
      let str_four_list = "/task/tasklist"
      if (stringlist.indexOf(to.path) > -1) {
        this.activeIndex = '1'
        this.$store.dispatch('toggleSideBar', '1')
      } else if (str_two_list.indexOf(to.path) > -1) {
        this.activeIndex = "2"
        this.$store.dispatch('toggleSideBar', '2')
      } else if (str_three_list.indexOf(to.path) > -1) {
        this.activeIndex = "3"
      } else if (str_four_list.indexOf(to.path) > -1) {
        this.activeIndex = "4"
      }
      // if (to.name == 'FormTask') {
      //   this.gettaskfullinfo()
      // }
      // if (to.name == "About1") { //跳转到哪个页面
      //   this.navnum = 1
      // } else if (to.name == 'About2') {
      //   this.navnum = 2
      // } else if (to.name == 'About3') {
      //   this.navnum = 3
      // }
    },
  }
}
</script>
<style lang="less">
.icon_username {
  display: inline-block;
  background: @color_p;
  padding: 10px;
  color: @white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  // margin: auto;
}
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
  font-size: 14px;
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
  // margin-top: 62px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
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
}
.name_top {
  // margin-right: 20px;
  // font-size: @font_16;
  position: absolute;
  top: 10px;
  right: 20px;
}
.left_menu {
  // position: relative;
  // top: 0;
  // bottom: 0;
  // background: @white;
  // min-height: 845px;
  // left: 20px;
  // margin-top: 100px;
  // margin-left: 20px;

  transition: width 0.28s;
  // width: 200px ;
  background: #172b4d;
  background: url(../../assets/img/bg_left.png) no-repeat left;
  // background-size: 100%;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0px;
  bottom: 0;
  left: 0;
  z-index: 1001;
  .el-submenu__title:hover,
  .el-submenu__title:focus {
    outline: none;
    background-color: rgb(18, 34, 62) !important;
  }
  .el-submenu__title.is-disabled {
    opacity: 0.25;
    cursor: not-allowed;
    background: none !important;
  }
  .el-submenu__title:hover {
    background-color: rgb(18, 34, 62) !important;
  }
  .el-menu-item:hover,
  .el-menu-item:focus {
    outline: none;
    background-color: rgb(18, 34, 62) !important;
  }
  .el-menu-item.is-active {
    color: #5e81f4;
    color: #fff;
    background: rgba(94, 129, 244, 0.2) !important;
  }
}
.right_content {
  // position: relative;
  padding-bottom: 20px;
  min-width: 1000px;
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: 200px;
  // position: relative;
  width: 100%;
  .right_title {
    align-items: center; /*垂直居中*/
    padding-left: 20px;
    background: @white;
    margin-bottom: 20px;
    .icon_title {
      font-size: 20px;
      color: @color_otehr;
      margin-right: 20px;
    }
  }
}
.right_content_middle {
  margin-left: 20px;
  margin-right: 20px;
  height: calc(100% - 140px);
  min-height: 800px;
  .card_height_zong {
    height: calc(100% - 100px);
  }
  .el-card {
    height: 100%;
  }
}
.right_content_middle1 {
  // position: relative;
  margin-left: 30px;
  margin-top: 20px;
  margin-right: 20px;
  // width: 100%
  min-width: 1000px;
  // min-height: 600px;
  // overflow: auto;
  // background: @white;
  // padding: 10px;
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: 220px;
  position: relative;
  width: 100%;
}
.active_a {
  // color: @color;
  font-weight: bold;
}
</style>