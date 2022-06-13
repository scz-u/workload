<template>
  <div class="addmember">
    <div class="member_colRight_head">
      <span class="member_right_title">添加成员</span>
    </div>
    <div class="js_has_member">
      <div class="operation_member">
        <el-button
          size="small"
          type="primary"
          icon="iconfont icon-baocun"
          @click="addmember"
          round
          >保存</el-button
        >
        <el-button size="small" @click="back" icon="iconfont icon-back" round
          >取消</el-button
        >
      </div>
      <div class="member_colRight_table">
        <div class="register_item">
          <span>工号：</span>
          <el-input
            v-model="userid"
            placeholder="成员唯一标识"
            @blur.prevent="checkUser()"
          ></el-input>
          <p class="check_mobile_p" v-if="check_user">工号重复！</p>
        </div>
        <div class="register_item">
          <span>用户名：</span>
          <el-input v-model="username" placeholder="请输入用户名"></el-input>
        </div>
        <div class="register_item">
          <span>手机号：</span>
          <el-input
            v-model="mobile"
            placeholder="请输入手机号"
            @blur.prevent="checkMobile()"
          ></el-input>
          <p class="check_mobile_p" v-if="check_mobile1">
            手机号码格式不正确！
          </p>
          <p class="check_mobile_p" v-if="check_mobile2">手机号码重复！</p>
        </div>
        <!-- <div class="register_item">
          <span>密码：</span>
          <el-input
            v-model="pwd"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </div> -->
        <div class="register_item">
          <div class="item_div">部门：</div>
          <div class="editor_right" style="display: table-cell">
            <div class="ww_groupSelBtn">
              <div
                class="ww_groupSelBtn_item"
                v-for="item in selectdepart"
                :key="item.id"
              >
                <span class="ww_img"></span>
                <span class="ww_groupSelBtn_item_text">{{
                  item.Department
                }}</span>
                <i class="el-icon-close img_icon" @click="deldepart(item)"></i>
              </div>
            </div>
            <div
              class="ww_groupSelBtn ww_groupSelBtn_add"
              @click="addDepartClick"
            >
              修改
            </div>
          </div>
        </div>
      </div>
    </div>
    <depart-alert
      :is_add="is_add"
      :departlist="selectdepart"
      :title="'请选择部门'"
      @departSub="selectDepart"
      @back="addPEvent"
    ></depart-alert>
  </div>
</template>

<script>
import DepartAlert from './departAlert'
export default {
  name: 'addmember',
  props: {
    selectFile: Object,
    add_show: Boolean,
  },
  components: { DepartAlert },
  data () {
    return {
      is_add: false,
      userid: '',
      check_user: false,
      mobile: '',
      check_mobile1: false,
      check_mobile2: false,
      username: '',
      pwd: '',
      my_add_show: this.add_show,
      selectdepart: [{ id: this.selectFile.data.id, Department: this.selectFile.data.Department, depart_id: this.selectFile.data.depart_id }]
    }
  },
  methods: {
    checkUser () {
      let payload = {
        corpid: this.$store.state.corpid,

        userid: this.userid.trim(),

      }
      console.log(payload)
      // return false;
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['checkuserid'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        this.check_user = data.data
        // _this.departlist = data.data
        // if (data.data != null) {
        //   _this.userlist = data.data
        // }
        // _this.back()
        return data.data
      }).catch(err => {
        console.log(err)
      })
    },
    checkMobile () {
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (!reg.test(this.mobile)) {
        this.check_mobile1 = true
        return false;
      } else {
        this.check_mobile1 = false
      }
      let payload = {
        corpid: this.$store.state.corpid,

        userid: this.userid.trim(),

      }
      console.log(payload)
      // return false;
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['checkuserid'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        this.check_mobile2 = data.data
        // _this.departlist = data.data
        // if (data.data != null) {
        //   _this.userlist = data.data
        // }
        // _this.back()
        return data.data
      }).catch(err => {
        console.log(err)
      })
    },
    addmember () {
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (!reg.test(this.mobile)) {
        this.check_mobile1 = true
        return false;
      }
      console.log('sdfsdf')
      let check_user = this.checkUser()
      let check_mobile = this.checkMobile()
      if (check_user == true || check_mobile == true) {
        return false;
      }

      if (this.selectdepart.length == 0) {
        this.$alert('请选择部门！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      if (this.userid.trim() == '') {
        this.$alert('请填写工号！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      // let reg = /^[0-9A-Za-z]{6,12}$/;
      console.log(this.userid)
      if (this.userid.trim().length < 6) {
        this.$alert('工号长度必须大于6位！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }


      if (this.username.trim() == '') {
        this.$alert('请填写用户名！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }

      // if (this.pwd.trim() == '') {
      //   this.$alert('请填写密码！', '提示', {
      //     confirmButtonText: '确定',

      //   });
      //   return false;
      // }
      // let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
      // console.log(this.userid)
      // if (!reg.test(this.pwd.trim()) || this.pwd.trim().length < 6 || this.pwd.trim().length > 12) {
      //   this.$alert('密码必须为6-12位的数字和字母的组合！', '提示', {
      //     confirmButtonText: '确定',

      //   });
      //   return false;
      // }
      let departlist = []
      for (let i in this.selectdepart) {
        departlist.push(parseInt(this.selectdepart[i].depart_id))
      }
      console.log(departlist)
      let payload = {
        corpid: this.$store.state.corpid,
        departids: JSON.stringify(departlist),
        userid: this.userid.trim(),
        username: this.username.trim(),
        mobile: this.mobile.trim()
      }
      console.log(payload)
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['addoneuser'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(data => {
        console.log(data)
        // _this.departlist = data.data
        // if (data.data != null) {
        //   _this.userlist = data.data
        // }
        _this.back()
      }).catch(err => {
        console.log(err)
      })
    },
    deldepart (item) {
      let index = this.selectdepart.indexOf(item)
      if (index > -1) {
        this.$delete(this.selectdepart, index)
      }
    },
    selectDepart (val) {
      console.log(val)
      this.selectdepart = val
    },
    addPEvent (val) {
      console.log(val)
      console.log('--------------------')
      this.is_add = val
    },
    addDepartClick () {
      this.is_add = !this.is_add
    },
    back () {
      console.log('sdfsdf')
      console.log(this.my_add_show)
      this.my_add_show = !this.my_add_show
      console.log(this.my_add_show)
    }
  },
  watch: {
    add_show (val) {
      console.log('123123123')
      this.my_add_show = val

    },
    my_add_show (val) {

      this.$emit('backadd', val)
    }
  }
}
</script>

<style scoped>
.register_item {
  font-size: 14px;
  /* width: 362px; */
  margin: 20px 20px;
}
.register_item > span {
  width: 80px;
  display: inline-block;
  text-align: right;
}
.check_mobile_p {
  display: inline-block;
  color: red;
  margin-left: 5px;
}
.item_div {
  display: table-cell;
  padding-top: 5px;
  vertical-align: top;
  width: 80px;
  text-align: right;
}
.addmember .el-input {
  width: 250px;
}
.editor_righth {
  position: relative;
  display: table-cell;
  vertical-align: bottom;
  padding-left: 8px;
}
.ww_groupSelBtn {
  display: inline-block;
  vertical-align: top;
  min-height: 22px;
  font-size: 13px;
}
.ww_groupSelBtn_item {
  float: left;
  max-width: 231px;
  line-height: 1.5;
  margin: 3px 10px 3px 0;
  padding: 3px 11px 3px 7px;
  background-color: #fff;
  border: 1px solid #e4e6e9;
  border-radius: 2px;
}
.ww_img {
  display: inline-block;
  background: url(../../../assets/img/icon_folder_blue.png);
  width: 14px;
  height: 12px;
  margin: 2px 5px 0 0;
}
.ww_groupSelBtn_item_text {
  /* float: left; */
  max-width: 174px;
  padding-right: 11px;
  overflow: hidden;
  line-height: 18px;
  cursor: default;
}
.img_icon {
  cursor: pointer;
}
.ww_groupSelBtn_add {
  cursor: pointer;
  margin-top: 7px;
  color: #0c4c7f;
}
</style>
