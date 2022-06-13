<template>
  <div class="look_detail">
    <div v-if="!is_add && !is_editor && !is_depart_m">
      <div class="weui-cells__title">
        <span>详情</span>

        <div class="right log_div">
          <p class="log_p cursor" @click="golog()">日志>></p>
        </div>
        <div
          class="right cursor"
          @click="editorClick()"
          style="color:#2f7dcd;margin-right:10px;"
        >
          <i class="cubeic-edit"></i>编辑
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="weui-cells">
        <div
          class="weui-cell "
          v-for="item in detail.FormFieldInfos"
          :key="item"
          v-show="!item.is_counted"
        >
          <div class="weui-cell__bd">
            {{ item.field_label }}
          </div>
          <div class="weui-cell__ft">
            <span v-if="item.opt_label != ''">
              {{ item.opt_label.split("__")[1] }}
            </span>
            <span v-else>
              {{ item.value }}
            </span>
          </div>
        </div>
      </div>
      <div class="weui-cells__title">计算</div>
      <div class="weui-cells">
        <div
          class="weui-cell "
          v-for="item in detail.FormFieldInfos"
          :key="item"
          v-show="item.is_counted"
        >
          <div class="weui-cell__bd">
            {{ item.field_label }}
          </div>
          <div class="weui-cell__ft">
            {{ item.value }}
          </div>
        </div>
      </div>
      <div v-if="assignlist.length != 0">
        <div class="weui-cells__title">分配详情</div>
        <div class="weui-cells" v-for="item in assignlist" :key="item">
          <div v-if="!item.is_flag">
            <div class="weui-cell ">
              <div class="weui-cell__bd">
                姓名
              </div>
              <div class="weui-cell__ft">
                <GetTreeNameM :openid="item.ToUserId"></GetTreeNameM>
              </div>
            </div>
            <div class="weui-cell " v-for="items in item.ToValues" :key="items">
              <div class="weui-cell__bd">
                {{ items.field_label }}
              </div>
              <div class="weui-cell__ft">
                {{ items.value }}
              </div>
            </div>
            <div class="text_right" style="margin-top:10px;margin-bottom:10px;">
              <cube-button
                :inline="true"
                @click="delone(item)"
                style="margin-right:5px;"
                class="del-btn"
                >删除</cube-button
              >
              <cube-button
                :outline="true"
                :inline="true"
                @click="editorone(item)"
                >修改</cube-button
              >
            </div>
          </div>
          <div v-else>
            <div class="cube-form cube-form_standard">
              <div class="cube-form-group-content">
                <div
                  class="cube-form-item border-bottom-1px cube-form-item_required"
                >
                  <div class="cube-form-label">
                    <span>姓名</span>
                  </div>
                  <div class="cube-validator cube-form-field">
                    <div class="cube-validator-content">
                      <div class="border_div" @click="departSelect()">
                        <GetTreeNameM :openid="item.ToUserId"></GetTreeNameM>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="cube-form-item border-bottom-1px cube-form-item_required"
                  v-for="items in item.ToValues"
                  :key="items"
                >
                  <div class="cube-form-label">
                    <span>{{ items.field_label }}</span>
                  </div>
                  <div class="cube-validator cube-form-field">
                    <div class="cube-validator-content">
                      <cube-input
                        v-model="items.value"
                        :placeholder="'请输入数字'"
                      ></cube-input>
                    </div>
                  </div>
                </div>
                <div
                  class="text_right"
                  style="margin-top:10px;margin-bottom:10px;"
                >
                  <cube-button
                    :outline="true"
                    :inline="true"
                    @click="editorclose(item)"
                    style="margin-right:5px;"
                    >取 消</cube-button
                  >
                  <cube-button
                    :primary="true"
                    :inline="true"
                    @click="addone(item)"
                    >确 认</cube-button
                  >
                  <!-- <cube-button
                  :primary="true"
                  :inline="true"
                  @click="editoroneClick()"
                  >确认1</cube-button
                > -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="detail.AuditStates != null">
        <div class="weui-cells__title">审核情况</div>
        <div class=" weui-cells">
          <div class="weui-cell audit_div">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in detail.AuditStates"
                :key="index"
                :color="activity.node_state == 0 ? '#0bbd87' : '#D6D6D6'"
              >
                <div>
                  <div class="left">
                    <p class="audit_title">审批人</p>
                    <p class="audit_num">
                      {{ activity.userids.length }}人
                      <span>{{
                        activity.node_state == 0 ? "(已审批)" : "(待审批)"
                      }}</span>
                    </p>
                  </div>
                  <div class="right">
                    <span v-for="(item, index) in activity.userids" :key="item">
                      <GetTreeNameM :openid="item"></GetTreeNameM>
                      <span v-if="index < activity.userids.length - 1">/</span>
                    </span>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>

      <div class="footer_look text__right" v-if="is_assign">
        <!-- <cube-button :outline="true" :inline="true" @click="gorul()"
        >返回</cube-button
      > -->
        <cube-button :inline="true" :primary="true" @click="assignClick()"
          >分 配</cube-button
        >
        <!-- <cube-button :primary="true" :inline="true" @click="editorClick()"
          >编辑</cube-button
        > -->
      </div>
    </div>
    <AssignList
      :is_add="is_add"
      :detail="detail"
      @back="assignBack"
    ></AssignList>
    <EditorDetail
      :is_add="is_editor"
      :detail="detail"
      @back="editorBack"
      @editorSub="editorSub"
    ></EditorDetail>
    <DepartMAlert
      :is_add="is_depart_m"
      :departlist="editordetail.useridlist"
      @back="departBackM"
      @departSub="departSubM"
    ></DepartMAlert>
  </div>
</template>
<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js"></script>
<script>
import { getUser, setUser } from '@/utils/auth_user';
import { afterEncrypt, beforeEncrypt } from '@/utils/encryption';
import AssignList from './assignlist'
import EditorDetail from './editor_detail'
import DepartMAlert from './departMAlert'
import GetTreeNameM from './getTreeNameM'
export default {
  name: 'look_detail',
  components: { AssignList, EditorDetail, DepartMAlert, GetTreeNameM },
  data () {
    return {
      is_depart_m: false,
      staging: {},
      rule_code: '',
      code: '',
      is_assign: false,
      detail: {},
      is_add: false,
      is_editor: false,
      assignlist: [],
      editordetail: {},
      mission_state: '',
    }
  },
  methods: {
    golog () {
      setUser('code', beforeEncrypt(this.code))
      this.$router.push({ name: 'log' })
    },
    delone (item) {
      let $this = this
      console.log(item)
      this.$createDialog({
        type: 'confirm',
        icon: 'cubeic-alert',
        title: '提示',
        content: '是否删除该分配值？',
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
            data_code: this.code,
            as_id: item.Id,
            corpid: this.$store.state.corpid,
            userid: $this.$store.state.userid
          }
          let createvalue = $this.$createObj(payload);
          var keyvalue = createvalue['keyvalue'];
          let posturl = $this.$apilist['deloneassigndata'] + '?signature=' + keyvalue;
          // return false;
          $this.$server.post(posturl, createvalue['fd']).then((data) => {
            console.log(data)
            const toast = this.$createToast({
              txt: '删除成功！',
              time: 1000,
              type: 'correct'
            })
            this.allassigndata()

            // $this.$router.go(-1)
            // $this.$emit('editorSub')
            // $this.close()

          }).catch(err => {
            console.log(err)
          })
        },

      }).show()
    },
    addone (items) {
      console.log(items)
      let item = JSON.parse(JSON.stringify(items))

      if (item.ToUserId == '') {

        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '未选择人员！',
          icon: 'cubeic-alert'
        }).show()

        return false;
      }
      for (let i in item.ToValues) {
        if (item.ToValues[i].value == '') {
          this.$createDialog({
            type: 'alert',
            title: '提示',
            content: item.ToValues[i].filed_name + '不能为空',
            icon: 'cubeic-alert'
          }).show()
          return false;
        }
        if (/(^[\-0-9][0-9]*(.[0-9]+)?)$/.test(item.ToValues[i].value)) {
          item.ToValues[i].value = parseFloat(item.ToValues[i].value)
        } else {
          this.$createDialog({
            type: 'alert',
            title: '提示',
            content: item.ToValues[i].filed_name + '请填写数字',
            icon: 'cubeic-alert'
          }).show()
          return false;
        }
      }
      item.is_flag = false
      this.editoneassigndata(item)


      // this.assignlist.push(this.staging)
      // this.is_stag = false
      // this.is_stag_editor = false
      // this.staging = {}

    },
    editoneassigndata (item) {
      let $this = this
      let payload = {
        data_code: this.code,
        to_userid: item.ToUserId,
        userid: this.$store.state.userid,
        to_value: JSON.stringify(item.ToValues),
        as_id: item.Id,
        corpid: this.$store.state.corpid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['editoneassigndata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        const toast = this.$createToast({
          txt: '修改成功！',
          time: 1000,
          type: 'correct'
        })
        toast.show()
        this.is_stag = false
        this.is_stag_editor = false
        this.staging = {}
        this.allassigndata()

        // $this.$router.go(-1)
        // $this.$emit('editorSub')
        // $this.close()

      }).catch(err => {
        console.log(err)
      })
    },
    departSelect () {
      this.is_depart_m = !this.is_depart_m
    },
    departBackM (val) {
      this.is_depart_m = val
    },
    departSubM (val) {
      this.departlist_m = val.list

      this.editordetail.ToValues[0]['useridlist'] = val.list
      this.editordetail['useridlist'] = val.list
      console.log(this.staging)
      console.log(this.departlist_m)
      for (let i in val.list) {
        this.editordetail.ToUserId = (val.list[i].id)

      }
    },
    editorclose (item) {
      console.log(item)
      item.is_flag = false
      console.log(item)
      this.allassigndata()
    },
    editorone (item) {
      this.editordetail = item
      this.editordetail['useridlist'] = item.ToValues[0].useridlist
      item.is_flag = true

    },


    editorClick () {
      this.is_editor = !this.is_editor
    },
    editorSub () {
      this.maindatadetailbydatacode()
    },
    editorBack (val) {
      this.is_editor = val
    },
    assignClick () {
      this.is_add = !this.is_add
    },
    assignBack (val) {
      this.allassigndata()
      this.is_add = val
    },

    enableassign () {
      this.rule_code = afterEncrypt(getUser('rule_code'))
      let $this = this
      let payload = {
        rule_code: this.rule_code,
        userid: $this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['enableassign'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.is_assign = data.data

      }).catch(err => {
        console.log(err)
      })
    },
    maindatadetailbydatacode () {
      let code = afterEncrypt(getUser('list_code'))
      this.code = code
      let $this = this
      let payload = {
        main_code: this.code,
        corpid: this.$store.state.corpid,
        userid: $this.$store.state.userid
      }
      console.log(payload)
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['detailbycode'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)
        this.detail = data.data
        this.is_assign = data.data.EnableAssign

      }).catch(err => {
        console.log(err)
      })

    },
    allassigndata () {
      let $this = this
      let code = afterEncrypt(getUser('list_code'))
      let payload = {
        corpid: this.$store.state.corpid,
        userid: this.$store.state.userid,
        data_code: code
      }

      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['allassigndata'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {

        console.log(data)
        this.assignlist = data.data

        for (let i in data.data) {
          data.data[i]['is_flag'] = false
        }


      }).catch(err => {
        console.log(err)
      })
    },
    leftvalue () {
      let $this = this
      let payload = {
        data_code: this.code,
        corpid: this.$store.state.corpid,
        userid: $this.$store.state.userid
      }
      let createvalue = $this.$createObj(payload);
      var keyvalue = createvalue['keyvalue'];
      let posturl = $this.$apilist['leftvalue'] + '?signature=' + keyvalue;
      // return false;
      $this.$server.post(posturl, createvalue['fd']).then((data) => {
        console.log(data)


      }).catch(err => {
        console.log(err)
      })
    },

  },
  mounted () {
    this.getAgentId()
    // this.enableassign()
    this.maindatadetailbydatacode()
    this.allassigndata()
  }
}
</script>
<style lang="less">
.look_detail {
  .cube-btn-inline {
    font-size: 14px;
  }
  .del-btn {
    background: #f56c6c;
  }
  .log_p {
    // margin-top: 20px;
    // margin-bottom: 20px;
    color: @color_t;
    // margin-right: 10px;
    font-size: 16px;
    text-decoration: underline;
  }
  .border_div {
    display: inline-block;
    border: @border;
    padding: 2px 15px;
    border-radius: 5px;
  }
  .text_right {
    border-top: @border;
    padding-top: 10px;
    padding-right: 10px;
    text-align: right;
  }
  .log_div {
    // padding-bottom: 60px;
  }
  .footer_look {
    z-index: 50;
    -webkit-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    // text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: @white;
    line-height: 50px;
    margin-right: 15px;
    .cube-btn-inline {
      padding: 12px 20px;
      font-size: 16px;
      margin-right: 15px;
    }
    // button:last-of-type {
    //   margin-right: 0px;
    // }
  }
}
</style>