<template>
  <div class="index1_login">
    <div class="top_login">
      <!-- <img src="@/assets/img/bg-r.png" alt="" /> -->
    </div>
    <div class="middle_login">
      <div class="img_middle text_center">
        <img
          src="@/assets/img/logo-color.png"
          class="item_img_middle"
          width="190px"
          alt=""
        />
      </div>
      <div class="form-login">
        <div class="input-box" id="geetest-wrap">
          <div class="type_tab">
            <span :class="{ active_tab: is_tab }" @click="tabClick(1)"
              >密码登录</span
            >
            <span :class="{ active_tab: !is_tab }" @click="tabClick(2)"
              >短信登录</span
            >
          </div>
          <div v-show="is_tab">
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
            </el-form>
          </div>
          <div v-show="!is_tab">
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleForm"
            >
              <el-form-item prop="mobile">
                <el-input
                  placeholder="手机号"
                  v-model.trim="ruleForm.mobile"
                ></el-input>
              </el-form-item>
              <el-form-item prop="verify_code">
                <div class="flex_verify">
                  <el-input
                    class="left"
                    placeholder="验证码"
                    v-model.trim="ruleForm.verify_code"
                  ></el-input>
                  <span>
                    <el-button v-show="is_count" @click="getCode()"
                      >获取验证码</el-button
                    >
                    <el-button disabled v-show="!is_count"
                      >{{ count }}秒再获取验证码</el-button
                    >
                  </span>
                </div>
              </el-form-item>
            </el-form>
          </div>

          <div class="btn-box">
            <!-- @click="getlogin()" -->
            <el-button
              type="primary"
              v-if="is_tab"
              class="btn_login"
              @click="submitForm1('ruleFormP')"
              >登录</el-button
            >
            <el-button
              type="primary"
              v-else
              class="btn_login"
              @click="submitForm('ruleForm')"
              >登录</el-button
            >
            <el-button class="btn_login" @click="goRegister()">注册</el-button>
          </div>
          <div class="footer_login">
            <span> Copyright © 2021 Deep Workload All rights reserved </span
            ><br /><br />
            <span
              ><a
                href="https://beian.miit.gov.cn/#/Integrated/index"
                target="_blank"
                >辽ICP备20010949号-1</a
              >
            </span>
          </div>
        </div>
      </div>
    </div>
    <Validation
      :is_add="is_add"
      @back="BackV"
      @successback="SuccessBack"
    ></Validation>
    <!-- <Validation1
      :is_add="is_add1"
      @back="BackV1"
      @successback="SuccessBack1"
    ></Validation1> -->
    <el-dialog
      :append-to-body="true"
      title="公司列表"
      :visible.sync="is_corp"
      width="600px"
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
    <el-dialog
      :append-to-body="true"
      title="设置密码"
      :visible.sync="is_pwd"
      width="600px"
      class="pwd_dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div>
        <div class="pwd_div">
          <el-form
            :model="pwdForm"
            ref="pwdForm"
            :rules="pwdrule"
            @submit.native.prevent
          >
            <el-form-item prop="passwd">
              <el-input
                v-model="pwdForm.passwd"
                type="password"
                placeholder="请输入密码"
                @keyup.enter.native="settingClick()"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="settingClick()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Validation from './validation.vue'
import Validation1 from './validation.vue'
export default {
  name: 'login',
  components: { Validation, Validation1 },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        this.is_mobile = false
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
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
      is_flag: '',
      pwdDetial: {},
      setting_pwd: '',
      is_pwd: false,
      count: 0,
      is_add: false,
      is_add1: false,
      corplist: [],
      is_corp: false,
      is_tab: true,
      is_count: true,
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
      ruleForm: {
        mobile: '',
        verify_code: '',
      },
      rules: {

        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        verify_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ]
      },
      pwdForm: {
        passwd: ''
      },
      pwdrule: {
        passwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度在 6 个字符及以上', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    checkisauditor () {
      let _this = this
      let payload1 = {

        corpid: _this.$store.state.corpid,
        userid: _this.$store.state.userid
      }
      let createvalue = _this.$createObj(payload1);
      let posturl = _this.$apilist['checkisauditor'];
      // alert('1231231')
      _this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        _this.$store.dispatch('check', data.data.toString()).then(() => {
          // alert('000s')
          let url = "/fill/listfill"
          window.location.replace(url);


        }).catch(err => {
          console.log(err)
        })
      })
    },
    settingClick () {

      let $this = this
      this.$refs['pwdForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          let payload = {
            userid: this.pwdDetial.UserId,
            corpid: this.pwdDetial.Corpid,
            passwd: this.pwdForm.passwd
          }
          let createvalue = $this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = $this.$apilist['updatepersonaldata'] + '?signature=' + keyvalue;
          // return false;
          console.log(payload)
          $this.$server.post(posturl, createvalue['fd']).then((data) => {
            console.log(data)

            console.log(this.pwdDetial)

            this.$store.dispatch('login_other', { permission: this.pwdDetial.IsAdmin == true ? 1 : 0, username: this.pwdDetial.Name, userid: this.pwdDetial.UserId, corpname: this.pwdDetial.CorpName, corpid: this.pwdDetial.Corpid }).then(() => {
              $this.checkisauditor()



            }).catch(err => {
              console.log(err)
            })



          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitForm1 (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.is_flag = 'pwd'
          this.is_add = true
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid)

        if (valid) {
          let $this = this
          let payload = {
            verify_code: this.ruleForm.verify_code,
            mobile: this.ruleForm.mobile
          }
          let createvalue = $this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = $this.$apilist['loginbymobile'] + '?signature=' + keyvalue;
          // return false;
          console.log(payload)
          $this.$server.post(posturl, createvalue['fd']).then((data) => {
            console.log(data)
            // return false

            if (data.data.corps.length == 1) {
              if (data.data.corps[0].IsPasswdSetting) {
                this.$store.dispatch('login_other', { permission: data.data.corps[0].IsAdmin == true ? 1 : 0, username: data.data.corps[0].Name, userid: data.data.corps[0].UserId, corpname: data.data.corps[0].CorpName, corpid: data.data.corps[0].Corpid }).then(() => {



                  $this.checkisauditor()



                }).catch(err => {
                  console.log(err)
                })
              }
              else {
                this.pwdDetial = data.data.corps[0]
                console.log(this.pwdDetial)
                this.is_pwd = true
              }
            } else {
              this.corplist = data.data.corps
              this.is_corp = true
            }

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getCode () {
      console.log(this.$refs['ruleForm'])

      // this.$refs['ruleForm'].validateField('mobile', emailError => {
      //   console.log(emailError)
      //   if (valid) {
      //     this.is_add = true
      //   } else {
      //     console.log('error submit!!');
      //     return false;
      //   }
      // });

      this.$refs['ruleForm'].validateField('mobile', emailError => {
        console.log(emailError)
        if (!emailError) {
          this.is_flag = 'verify'
          this.is_add = true
        }
      });
    },
    tabClick (num) {
      if (num == 1) {
        this.is_tab = true
      } else {
        this.is_tab = false
      }
    },
    goRegister () {
      let r_url = this.$router.resolve({ name: 'register', query: { k: Date.now() } })
      window.open(r_url.href, '_blank');
    },
    BackV1 (val) {
      this.is_add1 = val
    },
    BackV (val) {
      this.is_add = val
    },

    verifySubmit () {
      let payload = {
        mobile: this.ruleForm.mobile
      }
      let _this = this

      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['sendsms'] + '?signature=' + keyvalue;
      console.log(payload)
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)

        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.is_count = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.is_count = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }

      })
    },
    SuccessBack () {
      if (this.is_flag == 'pwd') {
        this.pwdSubmit()
      } else {
        this.verifySubmit()
      }
    },
    gourl (item) {

      // this.$store.dispatch('login_other', { permission: item.IsAdmin == true ? 1 : 0, username: item.Name, userid: item.UserId, corpname: item.CorpName, corpid: item.Corpid }).then(() => {
      //   //  this.is_mes = true
      //   // this.mescrollInit()
      //   // _this.getAgentId1(1)
      //   if (item.IsAdmin) {
      //     let url = "/forms/list?k=" + Date.now()
      //     window.location.replace(url);
      //   } else {
      //     let url = "/fill/listfill?k=" + Date.now()
      //     window.location.replace(url);
      //   }



      // }).catch(err => {
      //   console.log(err)
      // })
      let $this = this
      if (item.IsPasswdSetting) {
        this.$store.dispatch('login_other', { permission: item.IsAdmin == true ? 1 : 0, username: item.Name, userid: item.UserId, corpname: item.CorpName, corpid: item.Corpid }).then(() => {
          //  this.is_mes = true
          // this.mescrollInit()
          // _this.getAgentId1(1)
          $this.checkisauditor()



        }).catch(err => {
          console.log(err)
        })
      }
      else {
        this.pwdDetial = item
        this.is_corp = false
        this.is_pwd = true
      }



    },
    pwdSubmit () {
      let $this = this
      let payload = {
        passwd: this.ruleFormP.pwd,
        mobile: this.ruleFormP.mobile
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['signin'] + '?signature=' + keyvalue;
      // return false;
      console.log(payload)
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // return false
        if (data.data.state == -1) {
          this.$alert('密码错误！', '提示', {
            confirmButtonText: '确定',

          });
          return false
        } else {
          if (data.data.corps.length == 1) {
            // this.getP(data.data.corps[0].Corpid, data.data.corps[0].UserId)
            this.$store.dispatch('login_other', { permission: data.data.corps[0].IsAdmin == true ? 1 : 0, username: data.data.corps[0].Name, userid: data.data.corps[0].UserId, corpname: data.data.corps[0].CorpName, corpid: data.data.corps[0].Corpid }).then(() => {
              //  this.is_mes = true
              // this.mescrollInit()
              // _this.getAgentId1(1)
              $this.checkisauditor()



            }).catch(err => {
              console.log(err)
            })
          } else {
            this.corplist = data.data.corps
            this.is_corp = true
          }
        }


      }).catch(err => {
        console.log(err)
      })
    },
    getlogin () {
      if (this.userid == '') {
        this.$alert('请填写工号！', '提示', {
          confirmButtonText: '确定',

        });
        return false
      }
      if (this.pwd == '') {
        this.$alert('请填写密码！', '提示', {
          confirmButtonText: '确定',

        });
        return false
      }
      this.is_add = true
      return false;



    },
  }
}
</script>
<style lang="less">
.login_dialog {
  .el-dialog__body {
    height: 400px;
    overflow-y: auto;
  }
  .corplist {
    display: flex;
    align-items: center;
    width: 300px;
    border: @border;
    margin: auto;
    margin-bottom: 10px;
    padding: 10px;
    font-size: @font_14;
    border-radius: 5px;
    .name_corp_p {
      width: 270px;
    }
  }
  .corplist:hover {
    cursor: pointer;
    color: @color_p;
    border: 1px solid @color_p;
  }
}
.index1_login {
  .top_login {
    width: 100%;
    height: 361px;
    background: url(../../assets/img/bg-r.png);
    background-size: cover;
  }
  .middle_login {
    width: 676px;
    height: 685px;
    background: url(../../assets/img/wb.png);
    position: fixed;
    left: 50%;
    margin-left: -338px;
    top: 150px;
    .item_img_middle {
      margin-top: 103px;
    }
  }
  .middle_login {
    // position: relative;
    .form-login {
      width: 390px;
      margin: auto;
      margin-top: 51px;
    }
    .flex_verify {
      display: flex;
      .el-input {
        width: 280px;
        margin-right: 20px;
      }
    }
    .btn_login {
      width: 100%;
      margin-bottom: 10px;
    }
    .btn_login:last-of-type {
      margin-left: 0;
    }
    .type_tab {
      cursor: pointer;
      display: -webkit-box;
      display: -webkit-flex;
      display: -moz-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: start-end;
      -webkit-justify-content: start-end;
      -moz-box-pack: start-end;
      -ms-flex-pack: start-end;
      justify-content: start-end;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      margin-bottom: 12px;
      span {
        font-size: 14px;
        color: #555;
        letter-spacing: 0;
        margin-right: 20px;
      }
      .active_tab {
        color: @color_p;
      }
    }
    .footer_login {
      margin-top: 112px;
      font-size: 12px;
      font-weight: 400;
      text-align: center;
    }
  }
}
</style>