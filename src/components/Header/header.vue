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
                      this.$route.name == 'add_audit',
                  }"
                >
                  组织管理
                </router-link>
              </li>
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
            <span class="name_span_header">{{ corpname }}</span>
            |
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
      <div class="flex flex_middle">
        <div class="left_flex">123</div>
        <div class="right_flex">456</div>
      </div>
    </div>
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

}
</script>
<style lang="less">
// .flex_middle {
//   background: red;
//   margin-top: 70px;
//   // height: calc(100vh - 70px);
//   .left_flex {
//     background: yellow;
//     // -webkit-flex: 1;
//     // flex: 1;
//   }
//   .right_flex {
//     background: @color;
//     min-height: 900px;
//     // -webkit-flex: 1;
//     // flex: 1;
//   }
// }

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
  margin-left: 30px;
  // margin-top: 20px;
  margin-right: 20px;
  width: 100%;
  min-width: 1000px;
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