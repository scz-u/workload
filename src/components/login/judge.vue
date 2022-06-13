<template>
  <div class="judge">
    <!-- {{ data }} -->
    <div class="login_judge" v-if="is_login">
      <div class="logo">
        <img src="@/assets/img/logo-color.png" alt="" />
      </div>
      <div class="user">
        <el-form
          ref="ruleFormP"
          :model="ruleFormP"
          :rules="rulesP"
          @submit.native.prevent
        >
          <el-form-item prop="mobile">
            <el-input
              placeholder="手机号"
              v-model.trim="ruleFormP.mobile"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input
              placeholder="密码"
              type="password"
              v-model.trim="ruleFormP.pwd"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width: 320px"
              @click="submitClick('ruleFormP')"
              >登录</el-button
            >
            <!-- <cube-button :primary="true">Primary Button</cube-button> -->
          </el-form-item>
        </el-form>
      </div>

      <Validation
        :is_add="is_add"
        @back="BackV"
        @successback="SuccessBack"
      ></Validation>
    </div>
    <el-dialog
      :append-to-body="true"
      title="公司列表"
      :visible.sync="is_corp"
      width="90%"
      class="login_dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <div
          class="corplist"
          v-for="item in corplist"
          :key="item"
          @click="gourl(item)"
        >
          <p class="name_corp_p">
            {{ item.CorpName }}
          </p>
          <i class="right el-icon-arrow-right"></i>
          <div class="clearfix"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import { setUser, getUser, removeUser } from '@/utils/auth';
import { beforeEncrypt, afterEncrypt } from '@/utils/encryption';
import Validation from './validation.vue'
export default {
  components: { Validation },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        this.is_mobile = false
        return callback(new Error('手机号不能为空'));
      } else {
        // const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        console.log(reg.test(value));

        if (reg.test(value)) {
          this.is_mobile = true
          callback()
        } else {
          this.is_mobile = false
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    return {
      is_add: false,
      corplist: [],
      is_corp: false,
      data: '1',
      openid: '',
      is_login: false,
      ruleFormP: { mobile: '', pwd: '' },
      rulesP: {

        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    getAgentId1 (num) {
      let $this = this
      let url = window.location.href
      let corpid = this.$store.state.corpid
      this.corpid = corpid
      let payload = {
        url: url,
        corpid: corpid,
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getjssdksign'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        wx.config({
          beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.data.Corpid, // 必填，企业微信的corpID
          timestamp: data.signdata.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.signdata.noncestr, // 必填，生成签名的随机串
          signature: data.signdata.sign,// 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: ['selectExternalContact', 'shareToExternalContact', 'agentConfig'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });
        wx.checkJsApi({
          jsApiList: ['agentConfig'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function (res) {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            // alert(JSON.stringify(res))
            // alert('1')
            wx.ready(function () {
              wx.agentConfig({
                corpid: data.data.Corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
                agentid: data.data.Agentid, // 必填，企业微信的应用id （e.g. 1000247）
                timestamp: data.agensindata.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.agensindata.noncestr, // 必填，生成签名的随机串
                signature: data.agensindata.sign,// 必填，签名，见附录1
                jsApiList: ['selectExternalContact', 'shareToExternalContact'], //必填
                success: function (res) {
                  // 回调
                  // console.log('sdfsdf')
                  // console.log(this.$el)
                  // WWOpenData.bind(document.querySelector('ww-open-data'))
                  // alert('success')
                  // $this.openid = 8
                  // alert($this.openid)
                  // alert('2')
                  if (num == 1) {
                    let url = "/index_audit"
                    window.location.replace(url);
                  } else {
                    let url = "/fill/index_mobile"
                    window.location.replace(url);
                  }

                },
                fail: function (res) {
                  console.log(res)
                  $this.checkauditmission()
                  $this.getAllType()
                  if (res.errMsg.indexOf('function not exist') > -1) {
                    alert('版本过低请升级')
                  }
                }
              });
            });
          }
        });

      })
    },
    getCodeP () {

      let code = this.$route.query['code']
      let corpid = this.$route.query['corpid']

      let _this = this
      let userid = this.$store.getters.userid ? this.$store.getters.userid : afterEncrypt(getUser('userid'))
      let corpid1 = this.$store.getters.corpid ? this.$store.getters.corpid : afterEncrypt(getUser('corpid'))

      let appid = ''
      if (corpid == undefined) {
        appid = 'wx293802e62ebb9d67'
        // appid = "ww5b2c93da21371621"
      } else {
        appid = corpid

        if (corpid1 != corpid) {
          removeUser('userid')
          userid = getUser('userid')
        }
      }

      if (!userid) {

        if (code == undefined) {


          let redirect_uri = this.$store.state.url + 'judge'
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
              // this.getAgentId1(2)
              let url = "/fill/index_mobile"
              window.location.replace(url);


            }).catch(err => {
              console.log(err)
            })
          })
        }
      } else {
        // _this.getAgentId1(2)
        let url = "/fill/index_mobile"
        window.location.replace(url);
      }
      return false;
    },
    getCodeM () {
      // alert('000000000000000000000')
      let code = this.$route.query['code']
      let corpid = this.$route.query['corpid']

      let _this = this
      let userid = this.$store.getters.userid ? this.$store.state.userid : afterEncrypt(getUser('userid'))
      let corpid1 = this.$store.getters.corpid ? this.$store.state.corpid : afterEncrypt(getUser('corpid'))
      // console.log(userid)
      // console.log(this.$store.state.userid)
      // userid = 'lyt'
      // return false
      let appid = ''
      // alert('1')
      if (corpid == undefined) {
        appid = 'wx293802e62ebb9d67'
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


          let redirect_uri = this.$store.state.url + 'judge'
          let appid1 = 'wxd73c535d606f1824'
          let auth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid1 + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'

          window.location.replace(auth_url);
          return false;
        } else {

          let payload = {

            auth_code: code,
            apptype: 'notify'
          }

          let createvalue = this.$createObj(payload);
          let posturl = this.$apilist['getopenid'];
          // alert('ssd')
          console.log(payload)
          this.$server.post(posturl, createvalue['fd']).then(data => {
            // alert(JSON.stringify(data.openid))
            // alert(JSO)
            console.log(data)
            _this.data = data
            _this.openidtouserid(data.data.openid)
            // alert(JSON.stringify(data))
            // console.log(data)
            // _this.showToastTime0(1)
            // alert(JSON.stringify(data))


            // _this.$store.dispatch('login_mobile', data).then(() => {
            //   this.is_mes = true
            //   // this.mescrollInit()
            //   // _this.getAgentId1(1)
            //   let url = "/index_audit"
            //   window.location.replace(url);


            // }).catch(err => {
            //   console.log(err)
            // })
          })
        }
      } else {
        // _this.getAgentId1(1)
        let url = "/index_audit"
        window.location.replace(url);
      }
      return false;
    },
    openidtouserid (val) {
      this.openid = val
      let payload = {

        openid: val
      }

      let createvalue = this.$createObj(payload);
      let posturl = this.$apilist['openidtouserid'];
      // alert('ssd')
      console.log(payload)
      this.$server.post(posturl, createvalue['fd']).then(data => {
        // alert('2222')
        this.data = data
        if (data.data.state == -1) {
          //   let url = "/index_audit"
          //   window.location.replace(url);
          this.is_login = true
        } else {
          // alert(JSON.stringify(data.data.corps.length))
          if (data.data.corps.length == 1) {
            // this.getP(data.data.corps[0].Corpid, data.data.corps[0].UserId)
            this.$store.dispatch('login_other', { permission: data.data.corps[0].IsAdmin == true ? 1 : 0, username: data.data.corps[0].Name, userid: data.data.corps[0].UserId, corpname: data.data.corps[0].CorpName, corpid: data.data.corps[0].Corpid }).then(() => {
              //  this.is_mes = true
              // this.mescrollInit()
              // _this.getAgentId1(1)
              // $this.checkisauditor()
              let url = "/index_audit"
              window.location.replace(url);



            }).catch(err => {
              console.log(err)
            })
          } else {


            this.corplist = data.data.corps
            this.is_corp = true

            // this.is_login = false

          }
        }
        // alert(JSON.stringify(data.data))
        // alert(JSO)

        // alert(JSON.stringify(data))
        // console.log(data)
        // _this.showToastTime0(1)
        // alert(JSON.stringify(data))


        // _this.$store.dispatch('login_mobile', data).then(() => {
        //   this.is_mes = true
        //   // this.mescrollInit()
        //   // _this.getAgentId1(1)
        //   let url = "/index_audit"
        //   window.location.replace(url);


        // }).catch(err => {
        //   console.log(err)
        // })
      })
    },
    submitClick (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          // this.pwdSubmit()
          this.is_add = true
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    BackV (val) {
      this.is_add = val
    },
    SuccessBack () {
      this.pwdSubmit()
    },
    pwdSubmit () {
      let $this = this
      let payload = {
        passwd: this.ruleFormP.pwd,
        mobile: this.ruleFormP.mobile,
        openid: this.openid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['signin'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // alert(JSON.stringify(data))
        this.data = data
        // return false
        if (data.data.state == -1) {
          // this.$alert('密码错误！', '提示', {
          //   confirmButtonText: '确定',

          // });
          this.$createDialog({
            type: 'alert',
            title: '提示',
            content: '密码错误！',
            icon: 'cubeic-alert'
          }).show()
          return false
        } else {
          if (data.data.corps.length == 1) {
            // this.getP(data.data.corps[0].Corpid, data.data.corps[0].UserId)
            this.$store.dispatch('login_other', { permission: data.data.corps[0].IsAdmin == true ? 1 : 0, username: data.data.corps[0].Name, userid: data.data.corps[0].UserId, corpname: data.data.corps[0].CorpName, corpid: data.data.corps[0].Corpid }).then(() => {
              //  this.is_mes = true
              // this.mescrollInit()
              // _this.getAgentId1(1)
              // $this.checkisauditor()
              let url = "/index_audit"
              window.location.replace(url);



            }).catch(err => {
              console.log(err)
            })
          } else {

            this.corplist = data.data.corps
            this.is_corp = true
            // this.is_login = false

          }
        }


      }).catch(err => {
        console.log(err)
      })
    },
    gourl (item) {
      let $this = this
      // if (item.IsPasswdSetting) {
      this.$store.dispatch('login_other', { permission: item.IsAdmin == true ? 1 : 0, username: item.Name, userid: item.UserId, corpname: item.CorpName, corpid: item.Corpid }).then(() => {
        //  this.is_mes = true
        // this.mescrollInit()
        // _this.getAgentId1(1)
        let url = "/index_audit"
        window.location.replace(url);



      }).catch(err => {
        console.log(err)
      })
      // }
      // else {
      //   this.pwdDetial = item
      //   this.is_corp = false
      //   this.is_pwd = true
      // }



    },
  },

  created () {
    // this.getAgentId()
    let corpid = this.$route.query.corpid
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      // alert('手机端')
      // this.$router.push({ name: 'index_audit_mobile', query: { corpid: corpid } })
      this.getCodeM()
    } else {
      // alert('PC端')
      // this.$router.push({ name: 'index_fill_mobile', query: { k: Date.now(), corpid: corpid } })
      this.getCodeP()
    }
  }
}
</script>
<style lang="less">
.judge {
  .login_judge {
    text-align: center;
    .logo {
      margin-top: 50px;
      margin-bottom: 20px;
      text-align: center;
      img {
        width: 15rem;
      }
    }
    .user {
      width: 320px;
      margin: auto;
    }
  }
}
</style>