<template>
  <div class="person member_colRight">
    <div class="member_colRight_table">
      <el-form
        label-position="right"
        label-width="80px"
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        @submit.native.prevent
      >
        <el-form-item label="工号：">
          <el-input
            v-model="ruleForm.userid"
            placeholder="成员唯一标识"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="passwd">
          <el-input
            v-model="ruleForm.passwd"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="updatepersonaldata()"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'person',
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        this.is_mobile = false
        return callback(new Error('请输入新密码'));
      } else if (value.length < 6) {
        return callback(new Error('长度在 6 个字符及以上'));
      }
      else {
        const reg = /[\u4E00-\u9FA5]/g
        console.log(reg.test(value));
        if (reg.test(value)) {

          callback()
        } else {
          return callback(new Error('请输入数字，字母，特殊字符'));
        }
      }
    };
    return {
      loading: false,
      member: {},
      ruleForm: {
        userid: '',
        passwd: '',
      },
      rules: {
        passwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '长度在 6 个字符及以上', trigger: 'blur' },
          // { validator: checkPhone, trigger: 'blur' }
        ],

      }
    }
  },
  methods: {
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
    updatepersonaldata () {

      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let payload = {
            userid: this.$store.state.userid,
            corpid: this.$store.state.corpid,
            passwd: this.ruleForm.passwd,
          }
          let createvalue = this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = this.$apilist['updatepersonaldata'] + '?signature=' + keyvalue;
          this.$server.post(posturl, createvalue['fd']).then(data => {
            console.log(data)
            // alert('dddd')

            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.ruleForm.passwd = ''


          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    }
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
  .member_colRight_table {
    width: 430px;
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