<template>
  <div class="wait">
    <div class="content_list">
      <!-- <div
        class="weui-cells weui-cells_checkbox"
        v-for="item in list_keys"
        :key=""
      ></div> -->
      <!-- <div v-if="list_keys.length == 0" class="no_div">
        暂无数据
      </div> -->
      <div class="content_top" v-if="list.length == 0">
        <img src="@/assets/img/none.png" alt="" />
      </div>
      <ul v-else>
        <li v-for="(item, index) in list" :key="index" style="margin-top: 20px">
          <!-- <div class="weui-cells__title">{{ item.Title }}</div> -->
          <div class="weui-cells weui-cells_checkbox">
            <!-- <label class="weui-cell weui-check__label left" :for="item.Code">
              <div class="weui-cell__hd">
                <input
                  type="checkbox"
                  class="weui-check"
                  v-model="checkModel"
                  :value="item.Code"
                  :id="item.Code"
                />
                <i class="weui-icon-checked"></i>
              </div>
            </label> -->
            <div class="weui-cell cursor" @click.stop="gourl(item)">
              <div class="weui-cell__bd">
                <div v-for="(item, index) in item.FormFieldInfos" :key="item">
                  <p class="flow-subtitle" v-if="index < 3">
                    <span
                      v-if="
                        item.opt_label != '' &&
                        item.opt_label != 'image' &&
                        item.opt_label != 'file'
                      "
                    >
                      {{ item.field_label }}:{{ item.opt_label.split("__")[1] }}
                    </span>
                    <span
                      v-else-if="
                        item.opt_label == 'image' || item.opt_label == 'file'
                      "
                    >
                      <!-- {{ item.vaule }} -->
                      {{ item.field_label }}:
                      <span v-if="item.value != null">
                        <span v-if="item.value.length > 1"
                          >{{ item.value[0].name }}...</span
                        >
                        <span v-else-if="item.value.length == 1">{{
                          item.value[0].name
                        }}</span>
                        <span v-else>-</span>
                      </span>

                      <span v-else>-</span>
                    </span>
                    <span v-else>
                      {{ item.field_label }}:{{ item.value }}
                    </span>
                  </p>

                  <!-- <span v-if="index == 0">
                    {{ items.field_label }}：{{ items.value }}
                  </span>
                  <span v-else>
                    <span v-if="items.is_counted" class="count_style">
                      {{ items.field_label }}：{{ items.value }}</span
                    >
                  </span> -->
                </div>
              </div>
              <div class="weui-cell__hd">
                <p class="state_p state_info">
                  <GetTreeNameM
                    :openid="item.CreateUserId"
                    :isdepart="false"
                  ></GetTreeNameM>
                </p>
              </div>
            </div>
            <div
              class="weui-cell padding_left_0"
              @click.stop="gourl(item)"
              style="text-align: right"
            >
              <div class="weui-cell__bd"></div>
              <div class="weui-cell__hd">
                <p
                  class="state_p state_warning"
                  v-if="item.AssignState == 1 || item.AssignState == 2"
                >
                  已分配
                </p>
                <!-- <p class="state_p state_success" v-if="item.AssignState == 2">
                  分配完成
                </p> -->
              </div>
              <div class="weui-cell__hd">
                <p class="state_p state_success" v-if="item.State == 5">
                  不需要审核
                </p>

                <p class="state_p state_danger" v-if="item.State == 2">
                  已驳回
                </p>
                <p class="state_p state_success" v-if="item.State == 3">
                  已通过
                </p>
                <p class="state_p state_warning" v-if="item.State == 4">
                  {{ auditFirst(item.AuditStates)[0] }}
                  <GetTreeNameM :openid="item"></GetTreeNameM>
                  <span v-if="auditFirst(item.AuditStates).length > 1"
                    >等{{ auditFirst(item.AuditStates).length }}人</span
                  >

                  审核中
                </p>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
        </li>
      </ul>
    </div>
    <!-- <div class="footer_list" v-if="list.length > 0">
      <div class="left">
        <cube-checkbox v-model="checked" @input="checkAll()">
          全选
        </cube-checkbox>
      </div>
      <div class="right footer_btn">
        <cube-button :outline="true" :inline="true" @click="denysClick()"
          >拒绝</cube-button
        >
      </div>
    </div> -->
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
  <script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import GetTreeNameM from './components/getTreeNameM'
import { getUser, setUser } from '@/utils/auth_user';
import { afterEncrypt, beforeEncrypt } from '@/utils/encryption';

export default {
  name: 'wait',
  components: { GetTreeNameM },
  data () {
    return {
      height: '',
      checkList: [],
      list: {},
      list_keys: [],
      checked: false, //是否全选
      checkModel: [],//双向数据绑定的数组，我是用的id
      list_len: 0,
      is_agentid: false,
    }
  },
  methods: {
    auditFirst (item) {
      let useridlist = []
      for (let i in item) {
        if (item[i].node_state == 1) {
          useridlist = item[i].userids
          break;
        }
      }
      return useridlist
    },
    denysClick () {
      let $this = this
      if (this.checkModel.length == 0) {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '请选择！',
          icon: 'cubeic-alert'
        }).show()
        return false;
      }
      this.dialog = this.$createDialog({
        type: 'prompt',
        title: '退回理由',
        prompt: {
          value: '',
          placeholder: '请输入'
        },
        onConfirm: (e, promptValue) => {
          // if (promptValue.trim() == '') {
          //   const toast = this.$createToast({
          //     txt: '理由不可为空！',
          //     type: 'warn',
          //     time: 1000,
          //   })
          //   toast.show()
          //   return false
          // }
          let payload = {
            main_codes: JSON.stringify(this.checkModel),
            corpid: this.$store.state.corpid,
            userid: this.$store.state.userid,
            // content: promptValue.trim()
          }
          if (promptValue != null && promptValue.trim() != '') {
            payload['content'] = promptValue.trim()
          }
          console.log(payload)
          let createvalue = $this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = $this.$apilist['denymaindatas'] + '?signature=' + keyvalue;
          // return false;
          $this.$server.post(posturl, createvalue['fd']).then((data) => {
            console.log(data)
            // this.list = data.data
            // this.list_keys = Object.keys(data.data)
            const toast = this.$createToast({
              txt: '退回成功！',
              type: 'correct',
              time: 1000
            })
            toast.show()
            this.alltoauditelist()

          }).catch(err => {
            console.log(err)
          })
        }
      }).show()

    },
    applysClick () {
      if (this.checkModel.length == 0) {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '请选择！',
          icon: 'cubeic-alert'
        }).show()
        return false;
      }
      let $this = this
      this.$createDialog({
        type: 'confirm',
        icon: 'cubeic-alert',
        title: '提示',
        content: '是否批量通过？',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false,
          href: 'javascript:;'
        },
        cancelBtn: {
          text: '取消',
          active: false,
          disabled: false,
          href: 'javascript:;'
        },
        onConfirm: () => {


          let payload = {
            main_codes: JSON.stringify(this.checkModel),
            corpid: this.$store.state.corpid,
            userid: this.$store.state.userid
          }
          console.log(payload)
          let createvalue = $this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = $this.$apilist['approvemaindatas'] + '?signature=' + keyvalue;
          // return false;
          $this.$server.post(posturl, createvalue['fd']).then((data) => {
            console.log(data)
            // this.list = data.data
            // this.list_keys = Object.keys(data.data)
            const toast = this.$createToast({
              txt: '通过成功！',
              type: 'correct',
              time: 1000
            })
            toast.show()
            this.alltoauditelist()

          }).catch(err => {
            console.log(err)
          })
        }
      }).show()


    },
    gourl (item) {
      console.log(item)
      setUser('list_code', beforeEncrypt(item.Code))
      setUser('form_code', beforeEncrypt(item.FormCode))
      // setUser('mission_state_one', beforeEncrypt(this.mission_state.toString()))

      this.$router.push({ name: 'look_audit_no', query: { k: Date.now(), list_code: beforeEncrypt(item.Code) } })



    },
    changeCheckbox () {
      console.log(this.checkModel)
      this.is_show = true
      for (let i in this.checkModel) {
        console.log(i)
        console.log(this.checkModel[i])
        if (this.checkModel[i] != 0 && this.checkModel[i] != 2) {
          this.is_show = false
          break;
        }
      }
      console.log(this.is_show)

    },
    checkAll () {
      console.log(this.checked)
      console.log(this.list)
      if (!this.checked) {
        this.checkModel = [];
      } else {
        this.list.forEach((item) => {
          if (this.checkModel.indexOf(item.Code) == -1) {
            this.checkModel.push(item.Code)
          }
        })
      }
      // this.changeCheckbox()
      console.log(this.checkModel)
    },
    // checkAll () {
    //   console.log(this.checked)
    //   let list_len = 0
    //   if (!this.checked) {
    //     this.checkModel = [];
    //   } else {
    //     // this.list.forEach((item) => {
    //     //   if (this.checkModel.indexOf(item.id) == -1) {
    //     //     this.checkModel.push(item.id)
    //     //   }
    //     // })
    //     for (let i in this.list_keys) {
    //       list_len += this.list[this.list_keys[i]].datas.length
    //       this.list[this.list_keys[i]].datas.forEach((item) => {
    //         if (this.checkModel.indexOf(item.Code) == -1) {
    //           this.checkModel.push(item.Code)
    //         }
    //       })
    //       // for (let j in this.list[this.list_keys[i]]) {
    //       //   if (this.checkModel.indexOf(item.id) == -1) {
    //       //     this.checkModel.push(item.id)
    //       //   }
    //       // }
    //     }
    //     this.list_len = list_len
    //   }
    //   console.log(this.checkModel)
    // },
    selectClick () {
      console.log(this.checked)
    },
    getalltoautidmaindata () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['getalltoautidmaindata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        if (data.data != null) {
          this.list = data.data
          this.list_keys = Object.keys(data.data)
        } else {
          this.list = {}
          this.list_keys = []
        }


      }).catch(err => {
        console.log(err)
      })
    },
    alltoauditelist () {
      let $this = this
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allhaveauditedlist'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        // this.tasklist = data.data
        // this.task_type_list = JSON.parse(JSON.stringify(Object.keys(data.data)))
        // console.log(Object.keys(data.data))
        if (data.data != null) {
          this.list = data.data
          this.list_keys = Object.keys(data.data)
        } else {
          this.list = {}
          this.list_keys = []
        }

      }).catch(err => {
        console.log(err)
      })
    },


  },
  mounted () {
    // let height = window.innerHeight - 39 + 'px'
    // this.height = height

    this.getAgentId()
    this.alltoauditelist()
  },
  watch: {
    checkModel () {
      if (this.checkModel.length == this.list.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    }

  }
}
</script>
<style lang="less">
.wait {
  .count_style {
    font-size: 13px;
    color: @color_g;
  }
  // height: 100%;
  .content_list {
    padding-bottom: 50px;
  }
  .content_list {
    margin-bottom: 50px;
    .content_top {
      text-align: center;
    }
  }
  .no_div {
    text-align: center;
    margin-top: 20px;
  }
  .footer_list {
    border-top: @border;
    z-index: 50;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: @white;
    .footer_btn {
      line-height: 50px;
      margin-right: 15px;
      button:first-of-type {
        margin-right: 15px;
      }
    }
  }
  .weui-cells_checkbox .weui-icon-checked:before {
    font-size: 20px;
  }
  .padding_left_0 {
    padding-left: 0px;
  }
  .cube-btn-inline {
    padding: 12px 20px;
    font-size: 16px;
  }
  .state_p {
    font-size: 14px;
    // border: @border;
    padding: 2px 5px;
    border-radius: 10px;
  }
  .state_p.state_success {
    // border: 1px solid #67c23a;
    color: #67c23a;
  }
  .state_p.state_warning {
    // border: 1px solid #e6a23c;
    color: #e6a23c;
  }
  .state_p.state_danger {
    // border: 1px solid #f56c6c;
    color: #f56c6c;
  }
  .state_p.state_info {
    // border: 1px solid #909399;
    color: @color_g;
  }
}
</style>