<template>
  <div class="editormember" v-show="my_add_show">
    <div class="member_colRight_head">
      <span class="member_right_title">编辑成员信息</span>
    </div>
    <div class="js_has_member">
      <div class="operation_member">
        <el-row>
          <el-col :span="18">
            <el-button
              size="small"
              @click="addmember()"
              type="primary"
              icon="iconfont icon-baocun"
              round
              >保存</el-button
            >
            <el-button
              size="small"
              @click="back()"
              icon="iconfont icon-back"
              round
              >取消</el-button
            >
          </el-col>
        </el-row>
      </div>

      <div class="member_colRight_table">
        <div class="register_item">
          <span>工号：</span>
          <el-input
            v-model="userid"
            placeholder="成员唯一标识"
            disabled
          ></el-input>
        </div>
        <div class="register_item">
          <span>用户名：</span>
          <el-input v-model="username" placeholder="请输入用户名"></el-input>
        </div>
        <div class="register_item">
          <span>手机号：</span>
          <el-input v-model="mobile" placeholder="请输入手机号"></el-input>
        </div>
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
      @departSub="departSub"
      @back="addPEvent"
    ></depart-alert>
  </div>
</template>

<script>
import DepartAlert from './departAlert'
export default {
  name: 'editormember',
  props: {
    selectFile: Object,
    editor_show: Boolean,
    userdetail: Object,
    random: Number
  },
  components: { DepartAlert },
  data () {
    return {
      is_add: false,
      userid: this.userdetail.u,
      username: this.userdetail.n,
      mobile: this.userdetail.m,
      pwd: this.userdetail.Passwd,
      my_add_show: false,
      selectdepart: [],

    }
  },
  methods: {
    addmember () {
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
      if (this.username.trim() == '') {
        this.$alert('请填写用户名！', '提示', {
          confirmButtonText: '确定',

        });
        return false;
      }
      console.log(this.pwd)
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (!reg.test(this.mobile)) {
        this.$alert('手机号格式正确！', '提示', {
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
      let payload = {
        corpid: this.$store.state.corpid,
        departids: JSON.stringify(departlist),
        userid: this.userid.trim(),
        username: this.username.trim(),
        mobile: this.mobile.trim()
      }
      console.log(payload)
      // return false;
      let createvalue = this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = this.$apilist['edituser'] + '?signature=' + keyvalue;
      let _this = this
      this.$server.post(posturl, createvalue['fd']).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
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
    departSub (val) {
      console.log(val)
      this.selectdepart = val
    },
    addPEvent (val) {
      console.log(val)
      this.is_add = val
    },
    addDepartClick () {
      console.log('sdfsdf')
      this.is_add = !this.is_add
    },
    back () {
      this.my_add_show = !this.my_add_show
    }
  },
  watch: {

    userdetail (val) {
      console.log(val)

    },
    editor_show (val) {
      console.log('123123123')
      this.my_add_show = val
      console.log(this.userdetail)
      this.userid = this.userdetail.u
      this.username = this.userdetail.n
      this.mobile = this.userdetail.m
      let departlist = []
      for (let i in this.userdetail.de) {
        departlist.push({ id: this.userdetail.de[i], depart_id: this.userdetail.de[i], Department: this.userdetail.des[this.userdetail.de[i]] })
      }
      this.selectdepart = departlist

    },
    my_add_show (val) {
      console.log('dsdfsdfsdfsdf')
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
.item_div {
  display: table-cell;
  padding-top: 5px;
  vertical-align: top;
  width: 80px;
  text-align: right;
}
.editormember .el-input {
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
