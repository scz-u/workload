<template>
  <div class="index_auditU">
    <!-- <div class="top_auditU">
      <div class="approvalA" v-if="is_show">
        <div class="bule"></div>
        <div class="transparent"></div>
        <router-link class="thing" :to="{ name: 'wait' }">
          <div class="left">
            <p class="thing_p">审批事项</p>
          </div>
          <div class="right right_thing">
            <i class="cubeic-arrow"></i>
          </div>
        </router-link>
      </div>
      <div class="list_top" @click="showPicker" v-if="typelist.length > 0">
        <p>{{ selectval.Content }}<i class="cubeic-select"></i></p>
      </div>
    </div> -->

    <!-- <a href="https://open.work.weixin.qq.com/wwopen/openData/debug">状态</a
    >{{ corpid }} -->
    <div style="background: #fff; padding-top: 2rem; padding-bottom: 1rem">
      <div class="flow-task-panel">
        <router-link class="task-item" :to="{ name: 'wait' }">
          <div class="task-icon">
            <i class="iconfont icon-audit1"></i>
          </div>
          <div class="task-text">待审核</div>
        </router-link>
        <router-link class="task-item" :to="{ name: 'already' }">
          <div class="task-icon">
            <i class="iconfont icon-approval1"></i>
          </div>
          <div class="task-text">已审核</div>
        </router-link>
        <!-- <div class="task-item">
          <div class="task-icon">
            <i class="el-icon-search"></i>
          </div>
          <div class="task-text">待审核</div>
        </div> -->
      </div>
    </div>

    <div class="auditlist_index">
      <!-- <div class="list_top" @click="showPicker" v-if="typelist.length > 0">
        <p>{{ selectval.Content }}<i class="cubeic-select"></i></p>
      </div> -->
      <div
        class="content_mobile"
        v-for="item in Object.keys(tasklist).reverse()"
        :key="item.Code"
      >
        <div class="content_title_mobile">
          <p class="before display_inline_block"></p>
          <p class="before_font display_inline_block">
            <span v-if="isStr(tasklist[item]) == 1">
              {{ tasklist[item][0].TypeContent }}</span
            >
            <span v-else>{{ tasklist[item] }}</span>
          </p>
        </div>
        <div class="content_middle_mobile" v-if="isStr(tasklist[item]) == 1">
          <div
            class="content_middle_list_mobile"
            v-for="items in tasklist[item]"
            :key="items"
            @click="gourl(items)"
          >
            <div class="item_list_img_mobile">
              <img class="icon_left" :src="weburl + items.Icons.icon" alt="" />

              <div class="clearfix"></div>
            </div>
            <div class="title_item_mobile" :title="items.Title">
              {{ items.Title }}
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
  <script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import MescrollVue from 'mescroll.js/mescroll.vue'
import { setUser, getUser, removeUser } from '@/utils/auth';
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
import GetTreeName from './components/getTreeName'
export default {
  name: 'index_audit',
  components: { MescrollVue },
  data () {
    return {
      weburl: this.$store.state.weburl,
      height_list: 0,
      is_mes: false,
      userid: '',
      corpid: '',
      openid: '',
      is_show: false,
      selectval: { Id: 0, Content: '全部' },
      typelist: '',
      tasklist: '',
      articleList: [],
    }
  },
  methods: {
    gourl (item) {
      setUser('task_code', beforeEncrypt(item.Code))
      setUser('task_state', beforeEncrypt(item.State.toString()))
      // setUser('enable_audit', beforeEncrypt(item.EnableAudit.toString()))
      setUser('enable_audit', beforeEncrypt('true'))
      console.log(item.State)
      this.$router.push({ name: 'list_audit', query: { k: Date.now(), task_code: beforeEncrypt(item.Code), task_state: item.State } })
    },
    getSelectType () {
      console.log('---------------------------------------')
      // console.log(val)
      this.mescrollUp.page.num = 1
      this.upCallback(this.mescrollUp.page, this.mescroll)
    },
    depList (val) {
      let list = []
      console.log(val)
      for (let i in val) {
        list.push(val[i].Department)
      }
      console.log(list)
      return '填报范围：' + list.join(',')
    },
    isStr (item) {
      if (typeof item != 'string') {
        return 1
      } else {
        return '123'
      }
    },
    getalltaskbyuserid () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getreporttask'] + '?signature=' + keyvalue;
      // return false;
      this.loading = true
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.loading = false
        if (data.data != null) {
          this.tasklist = data.data
          this.task_type_list = JSON.parse(JSON.stringify(Object.keys(data.data)))
          console.log(Object.keys(data.data))
        } else {
          this.tasklist = {}
          this.task_type_list = []
        }


      }).catch(err => {
        console.log(err)
      })
    },

    getTime (nS) {
      var date = new Date(parseInt(nS));
      var year = date.getFullYear();
      var mon = date.getMonth() + 1;
      var day = date.getDate();
      // var hours = date.getHours();
      // var minu = date.getMinutes();
      // var sec = date.getSeconds();
      mon = mon < 10 ? ('0' + mon) : mon;
      day = day < 10 ? ('0' + day) : day;

      return year + '/' + mon + '/' + day;
    },
    checkauditmission () {

      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,

      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['checkisauditor'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        // $this.code = data.data
        console.log(data)
        this.is_show = data.data
        if (this.is_show) {
          this.height_list = 160
        } else {
          this.height_list = 0
        }

      }).catch(err => {
        console.log(err)
      })
    },
    getAllType () {

      let $this = this
      let _this = this
      let payload = {
        // typedesc: '任务类型',
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['mobiletasktype'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // this.typelist = data.data
        if (data.data.length > 0) {
          _this.typelist = [{ Id: 0, Content: '全部' }]
          _this.typelist = _this.typelist.concat(data.data)
        } else {
          _this.typelist = []
        }

      }).catch(err => {
        console.log(err)
      })
    },

    getCode () {
      // alert('000000000000000000000')
      let code = this.$route.query['code']
      let corpid = this.$route.query['corpid']

      let _this = this
      let userid = this.$store.getters.userid ? this.$store.state.userid : afterEncrypt(getUser('userid'))
      let corpid1 = this.$store.getters.corpid ? this.$store.state.corpid : afterEncrypt(getUser('corpid'))
      console.log(userid)
      console.log(this.$store.state.userid)
      userid = 'lyt'
      // return false
      let appid = ''
      // alert('1')
      if (corpid == undefined) {
        appid = 'ww0c481bb483b34ff2'
        // appid = "ww5b2c93da21371621"
      } else {
        // alert('2')
        appid = corpid

        if (corpid1 != corpid) {
          removeUser('userid')
          userid = getUser('userid')
        }
      }
      // alert('3')
      // alert(corpid)
      if (!userid) {

        if (code == undefined) {


          let redirect_uri = this.$store.state.url + 'index_audit'
          let auth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'

          window.location.replace(auth_url);
          return false;
        } else {

          let payload = {

            auth_code: code,
            apptype: 'notify'
          }

          let createvalue = this.$createObj(payload);
          let posturl = this.$apilist['getloginuserid'];
          // alert('ssd')
          this.$server.post(posturl, createvalue['fd']).then(data => {
            // alert(JSO)
            // alert(JSON.stringify(data))
            // console.log(data)
            // _this.showToastTime0(1)
            // alert(JSON.stringify(data))
            _this.$store.dispatch('login_mobile', data).then(() => {
              this.is_mes = true
              // this.mescrollInit()
              this.getAgentId()
              this.checkauditmission()
              this.getAllType()


            }).catch(err => {
              console.log(err)
            })
          })
        }
      } else {
        this.is_mes = true
        this.getAgentId()
        this.checkauditmission()
        this.getAllType()
      }
      return false;
    },
    getallbytype () {
      let $this = this
      let payload = {
        typedesc: '任务类型',
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getallbytype'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.typelist = data.data



      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted () {
    // this.getAgentId()
    this.checkauditmission()
    // this.getAllType()
    this.getalltaskbyuserid()
    this.getallbytype()
    // this.getAgentId()
    // let userid = this.$route.query
    // alert(userid)
    // this.userid = userid
    // alert('sdfsdf')
    // this.getCode()
    // let token = this.$store.getters.userid ? this.$store.getters.userid : afterEncrypt(getUser('userid'))
    // if (token) {
    //   this.getAgentId()
    //   this.checkauditmission()
    //   this.getAllType()
    // } else {
    //   this.getCode()
    // }


  },
  //   beforeRouteEnter (to, from, next) {
  //     next(vm => {
  //       vm.$refs.mescroll.beforeRouteEnter()
  //     })
  //   },
  //   //修改列表页的meta值，false时再次进入页面会重新请求数据。
  //   beforeRouteLeave (to, from, next) {
  //     // alert(position)
  //     // alert('sdfsdf')
  //     this.$refs.mescroll.beforeRouteLeave()
  //     // from.meta.keepAlive = false;
  //     next();
  //   }
}
</script>
<style lang='less' scoped>
@import "../../../assets/less/weui-for-work.css";
.index_auditU {
  .task-icon {
    font-size: 26px;
    position: relative;
    width: 1.45rem;
    color: @color_p;
  }
  .flow-task-panel {
    // position: absolute;

    // right: 0;
    // left: 0;
    display: flex;
    justify-content: space-around;
    // height: 4.1rem;
    margin: 0 0.6rem;
    // margin-top: 2rem;
    background: #fff;
    border: 1px solid #e9e9e9;
    border-radius: 0.4rem;
    box-shadow: 0 0.15rem 0.75rem -1px rgba(0, 0, 0, 0.08);
    .task-item {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.6rem 0;
    }
    .task-text {
      color: #1f2d3d;
      font-size: 0.8rem;
      line-height: 1.6;
    }
  }
  .content_mobile {
    margin-bottom: 0.4rem;
    padding: 0.6rem 0.6rem 0;
    background-color: #fff;
    .content_title_mobile {
      justify-content: space-between;
      // display: flex;
      align-items: center;
      height: 1.7rem;
      font-size: 1rem;
      span {
        color: #1f2d3d;
        font-weight: 700;
        font-size: 1rem;
      }
    }
    .content_middle_mobile {
      width: 100%;
      margin: 0.5rem 0 0;
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.3rem;
      margin-left: 4%;
      background: #fff;
    }
    .content_middle_list_mobile {
      margin: 0 0 0.45rem;
      padding: 0;
      position: relative;
      width: 25%;
    }
    .item_list_img_mobile {
      position: relative;
      width: 2.8rem;
      height: 2.8rem;
      margin: 0 auto;
      font-size: 1.5rem;
      line-height: 2.8rem;
      text-align: center;
      border-radius: 0.75rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 15%;
      }
    }
    .title_item_mobile {
      height: 1.8rem;
      margin: 0.3rem 0;
      padding: 0 0.6rem;
      font-size: 0.8rem;
      line-height: 0.9rem;
      text-align: center;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .top_auditU {
    position: fixed;
    top: 0;
    width: 100%;
  }
  .approvalA {
    .bule {
      height: 80px;
      background: #4378be;
    }
    .transparent {
      height: 80px;
    }
    .thing {
      position: absolute;
      top: 50px;
      background: @white;
      width: 90%;
      left: 5%;
      height: 80px;
      border-radius: 10px;
      -webkit-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
      -moz-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
      .thing_p {
        line-height: 80px;
        margin-left: 20px;
        font-size: 20px;
        font-weight: bold;
      }
      .right_thing {
        line-height: 80px;
        margin-right: 20px;
      }
    }
  }
  .list_top {
    text-align: right;
    margin-right: 20px;
    height: 40px;
    line-height: 40px;
    // position: fixed;
    // width: 100%;
    i {
      color: #c8c8cc;
    }
  }
  .auditlist_index {
    // background: @white;
    // -webkit-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    // -moz-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    // box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    // position: fixed;
    // width: 100%;
    .list_top {
      text-align: right;
      margin-right: 20px;
      height: 40px;
      line-height: 40px;
      // position: fixed;
      // width: 100%;
      i {
        color: #c8c8cc;
      }
    }
    .list_content {
      border-top: @border;
      border-bottom: @border;
      background: @white;
      padding: 20px;
      color: #333;
      margin-bottom: 10px;
    }
    .content_title {
      font-size: 20px;
      font-weight: bold;
    }
    .content_state_div:first-of-type {
      margin-top: 10px;
    }
    .content_state_div {
      height: 20px;
      display: flex;
      margin-left: -2px;
      color: #727272;
      img {
        height: 14px;
      }
      .content_state {
        font-size: 14px;
        line-height: 14px;
      }
    }
    .mescroll-empty {
      border-top: @border;
      padding-bottom: 20px;
    }

    .mescroll {
      position: fixed;

      padding-bottom: 1rem;

      // top: 200px;
      top: 0;
      bottom: 10px;

      height: auto;
    }
    .mescroll_top_20 {
      top: 40px;
      .mescroll {
        top: 40px;
      }
    }
    .mescroll_top_200 {
      top: 200px;
      .mescroll {
        top: 200px;
      }
    }
  }
}
</style>