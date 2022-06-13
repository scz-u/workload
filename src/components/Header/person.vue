<template>
  <div class="person member_colRight">
    <div class="member_colRight_table">
      <el-form
        label-position="right"
        label-width="80px"
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        class="person_form"
        @submit.native.prevent
      >
        <el-form-item label="工号：">
          <el-input
            v-model="ruleForm.userid"
            placeholder="成员唯一标识"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入用户名"
            :disabled="is_name"
          ></el-input>
          <el-button
            type="text"
            v-if="is_name"
            @click="editorName()"
            class="margin_l_5"
            >修改</el-button
          >
          <el-button
            type="text"
            v-else
            @click="editorSName()"
            class="margin_l_5"
            >确定</el-button
          >
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input
            v-model="ruleForm.mobile"
            placeholder="请输入手机号"
            :disabled="is_mobile"
          ></el-input>
          <el-button
            type="text"
            v-if="is_mobile"
            @click="editorMobile()"
            class="margin_l_5"
            >修改</el-button
          >
          <el-button
            type="text"
            v-else
            @click="editorSMobile()"
            class="margin_l_5"
            >确定</el-button
          >
        </el-form-item>
        <el-form-item
          prop="verify_code"
          v-if="is_mobile == false"
          label="验证码："
        >
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
        <!-- <el-form-item>
          <el-button type="primary" size="small" @click="updatepersonaldata()"
            >确定</el-button
          >
        </el-form-item> -->
      </el-form>
    </div>
    <Validation
      :is_add="is_add"
      @back="BackV"
      @successback="SuccessBack"
    ></Validation>
  </div>
</template>
<script>
import Validation from '../login/validation'
export default {
  name: 'person',
  components: { Validation },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        // this.is_mobile = false
        return callback(new Error('手机号不能为空'));
      } else {
        // const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        console.log(reg.test(value));
        if (reg.test(value)) {
          // this.is_mobile = true
          callback()
        } else {
          // this.is_mobile = false
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    return {
      is_name: true,
      is_mobile: true,
      is_add: false,
      is_count: true,
      count: 0,
      loading: false,
      member: {},
      ruleForm: {
        userid: '',
        mobile: '',
        name: '',
        verify_code: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        verify_code: [
          { required: true, message: '验证码不可为空', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    editorMobile () {
      this.is_mobile = false
    },
    editorSMobile () {
      this.$refs['ruleForm'].validateField('mobile', emailError => {
        console.log(emailError)
        console.log(this.is_mobile)
        if (!emailError) {
          this.$refs['ruleForm'].validateField('verify_code', emailError1 => {
            console.log(emailError1)
            if (!emailError1) {
              // this.is_add = true
              console.log('-----')
              this.checkmobileyzm()
            } else {
              console.log('sdfsdf')
              console.log(this.is_mobile)
            }

          });
        }

      });
    },
    checkmobileyzm () {
      let payload = {
        userid: this.$store.state.userid,
        corpid: this.$store.state.corpid,
        mobile: this.ruleForm.mobile,
        verify_code: this.ruleForm.verify_code
      }
      let _this = this

      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['checkmobileyzm'] + '?signature=' + keyvalue;
      console.log(payload)
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        let payload1 = {
          userid: this.$store.state.userid,
          corpid: this.$store.state.corpid,
          mobile: this.ruleForm.mobile,
        }
        this.updatepersonaldata(payload1)

      })
    },
    getCode () {

      this.$refs['ruleForm'].validateField('mobile', emailError => {
        console.log(emailError)
        if (!emailError) {
          this.is_add = true
        }

      });
    },
    BackV (val) {
      this.is_add = val
    },
    SuccessBack () {
      console.log(this.is_mobile)
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
    editorName () {
      this.is_name = false
    },
    editorSName () {
      let payload = {
        userid: this.$store.state.userid,
        corpid: this.$store.state.corpid,
        name: this.ruleForm.name
      }
      this.$refs['ruleForm'].validateField('mobile', emailError => {
        console.log(emailError)
        if (!emailError) {
          this.updatepersonaldata(payload)
        }

      });

    },
    usergetdata () {
      this.loading = true
      console.log('------------------------------------')
      let payload = {
        userid: this.$store.state.userid,
        corpid: this.$store.state.corpid,
      }
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['oneuserdetail'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        // alert('dddd')
        this.member = data.data
        this.ruleForm = {
          userid: data.data.u,
          mobile: data.data.m,
          name: data.data.n,
        }
        this.loading = false



      })
    },
    updatepersonaldata (payload) {

      // this.$refs['ruleForm'].validate((valid) => {
      //   if (valid) {
      // let payload = {
      //   userid: this.$store.state.userid,
      //   corpid: this.$store.state.corpid,
      //   name: this.ruleForm.name,
      //   mobile: this.ruleForm.mobile
      // }
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['updatepersonaldata'] + '?signature=' + keyvalue;
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        // alert('dddd')

        this.$store.dispatch('name_other', { username: this.ruleForm.name, }).then(() => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          let url = "/address/person?k=" + Date.now()
          // window.location.replace(url);
          setTimeout(function () {
            window.location.replace(url);
          }, 500)



        }).catch(err => {
          console.log(err)
        })



      })
    }
    // else {
    //   console.log('error submit!!');
    //   return false;
    // }
    // });

    // }
  },
  mounted () {
    this.usergetdata()
  }
}
</script>
<style lang="less">
.person {
  background: #fff;
  display: table;
  table-layout: fixed;
  width: 100%;
  .person_form {
    .el-input {
      max-width: 350px;
    }
  }
  .flex_verify {
    display: flex;
    width: 350px;
    .el-input {
      // width: 190px;
      margin-right: 10px;
    }
  }
  .assign_icon {
    font-size: 18px;
    margin-left: 5px;
    cursor: pointer;
  }
  .member_colRight_table {
    width: 480px;
    margin: auto;
    margin-top: 50px;
  }
  .register_item {
    font-size: 14px;
    /* width: 362px; */
    margin: 20px 20px;
    > span {
      width: 80px;
      display: inline-block;
      text-align: right;
    }
    .el-input {
      width: 250px;
    }
  }
  .register_item .nameval {
    width: 80px;
    display: inline-block;
    text-align: right;
  }
}
</style>